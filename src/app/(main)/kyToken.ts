import ky from "ky";
import { useSession } from "./SessionProvider";

async function getAuthHeaders() {
  const { session } = useSession();
  console.log("session:",session)
  return session ? { Authorization: `Bearer ${session}` } : {};
}

async function kyToken() {
  const headers = await getAuthHeaders();

  return ky.create({
    headers,
    parseJson: (text) =>
      JSON.parse(text, (key, value) => {
        if (key.endsWith("At")) return new Date(value);
        return value;
      }),
  });
}

export default kyToken;
