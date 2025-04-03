const domain = import.meta.env.API_URL;
const authMethod = import.meta.env.API_AUTH;

const createHeaders = (): Headers => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (authMethod === "TOKEN") {
    headers.append("Authorization", "Bearer " + import.meta.env.API_TOKEN);
  } else if (authMethod === "BASIC") {
    const basicToken = btoa(import.meta.env.API_AUTH_USER + ":" + import.meta.env.API_AUTH_PASSWORD);
    headers.append("Authorization", "Basic " + basicToken);
  }

  return headers;
};

export const apiFetch = async (url: string) => {
  const response = await fetch(`${domain}${url}`, {
    signal: AbortSignal.timeout(3000),
    mode: "cors",
    redirect: "error",
    headers: createHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
};