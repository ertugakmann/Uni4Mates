import { getSession } from "./auth";

export const getUser = async () => {
  const session = await getSession();

  if (!session) {
    console.log("No session found");
    return;
  }

  const id = session?.formData.id;

  const res = await fetch("/api/auth/getUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("User not found:", data.message);
    return;
  }

  return data.user;
};
