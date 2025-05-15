import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cache } from "react";
import { cookies } from "next/headers";

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  id: number;
  userName: string;
  email: string;
  roles: string[];
  token: string;
  refreshToken: string;
};

export type User = {
  id: number;
  userName: string;
  email: string;
  roles: string[];
  refreshToken: string;
};

export async function decrypt(
  session?: string,
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch {
    return null;
  }
}

export async function encrypt(data: SessionPayload): Promise<string> {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedKey);
}

type ResetPayload = {
  t: string;
  email: string;
};
export async function encryptForReset(data: ResetPayload): Promise<string> {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedKey);
}

export async function decryptForReset(
  session?: string,
): Promise<ResetPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify<ResetPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch {
    return null;
  }
}
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: string } | { user: null; session: null }
  > => {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
      return { user: null, session: null };
    }

    try {
      const decryptSession = await decrypt(userCookie);
      if (!decryptSession) {
        return { user: null, session: null };
      }

      const { userName, email, roles, token, refreshToken, id } =
        decryptSession;
      return {
        user: { userName, email, roles, refreshToken, id },
        session: token,
      };
    } catch (error) {
      console.error("Error parsing user session:", error);
      return { user: null, session: null };
    }
  },
);

// routes with role-based access
export const routePermissions: Record<string, string[] | "all"> = {
  "/tm/add": ["admin"],
  "/substations/add": ["admin"],
  "/user-feedback": ["admin"],
  "/user-feedback/statistics": ["admin"],
  "/[userId]": ["admin"], // dynamic number route
  "/users/[id]": ["admin",],
  "/": ["operator"], // multiple roles
};
function matchDynamicRoute(route: string, pattern: string): boolean {
  const regexPattern = pattern.replace(/\[.*?\]/g, "[^/]+");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(route);
}
function getNormalizedPattern(route: string): string | null {
  const patterns = Object.keys(routePermissions);

  for (const pattern of patterns) {
    if (matchDynamicRoute(route, pattern)) {
      return pattern;
    }
  }

  return null;
}
const roleHierarchy = ["user", "tester", "operator", "admin"];

export async function hasAccessToRoute(route: string): Promise<boolean> {
  const { user } = await validateRequest();
  if (!user) return false;

  const userRoles = user.roles.map((r) => r.toLowerCase());

  // 👑 If user is admin, allow everything
  if (userRoles.includes("admin")) return true;

  const matchedPattern = getNormalizedPattern(route);
  if (!matchedPattern) return false;

  const allowedRoles = routePermissions[matchedPattern];
  if (allowedRoles === "all") return true;

  // 🧠 Get the highest role index for the user
  const highestUserRank = Math.max(
    ...userRoles.map((role) => roleHierarchy.indexOf(role)),
  );

  // 🧠 Get the minimum allowed role index for this route
  const minimumRequiredRank = Math.min(
    ...allowedRoles.map((role) => roleHierarchy.indexOf(role)),
  );

  return highestUserRank >= minimumRequiredRank;
}
