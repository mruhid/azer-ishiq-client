import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cache } from "react";
import { cookies } from "next/headers";

const secretKey = "DkQ1skvWq62SeMUvGbLG7Q==DkQ1skvWq62SeMUvGbLG7Q==";
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userName: string;
  email: string;
  roles: string[];
  token: string;
  refreshToken: string;
};

export type User = {
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

      const { userName, email, roles, token, refreshToken } = decryptSession;
      return { user: { userName, email, roles, refreshToken }, session: token };
    } catch (error) {
      console.error("Error parsing user session:", error);
      return { user: null, session: null };
    }
  },
);
