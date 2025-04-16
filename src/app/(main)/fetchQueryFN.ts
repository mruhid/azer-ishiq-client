import { logout } from "../(auth)/action";

export const fetchData = async ({
  url,
  session,
}: {
  url: string;
  session: string;
}) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    if (data?.Message == "Your account is blocked.") {
      console.log("here")
      logout();
    }
    throw Error(data?.Message || "Failed to fetch data");
  }

  return data;
};

export const fetchQueryFN = (url: string, session: string) => {
  return async () => {
    return await fetchData({ url, session });
  };
};
