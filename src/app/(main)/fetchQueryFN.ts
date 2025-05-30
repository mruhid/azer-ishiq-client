import { logout } from "../(auth)/action";
export const fetchData = async <T>({
  url,
  session,
}: {
  url: string;
  session: string | null;
}): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (data?.Message === "Your account is blocked.") {
        logout();
      }
      throw new Error("Something went wrong,please try latter!");
    }

    return data as T;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[fetchData error]", error);
    }
    throw error;
  }
};

export const fetchQueryFN = <T>(url: string, session: string | null) => {
  return async (): Promise<T> => {
    return await fetchData<T>({ url, session });
  };
};

// import { logout } from "../(auth)/action";

// export const fetchData = async ({
//   url,
//   session,
// }: {
//   url: string;
//   session: string;
// }) => {
//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${session}`,
//     },
//   });

//   const data = await response.json();
//   console.log(data);
//   if (!response.ok) {
//     if (data?.Message == "Your account is blocked.") {
//       logout();
//     }
//     throw Error(data?.Message || "Failed to fetch data");
//   }

//   return data;
// };

// export const fetchQueryFN = (url: string, session: string) => {
//   return async () => {
//     return await fetchData({ url, session });
//   };
// };
