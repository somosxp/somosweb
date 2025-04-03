const {
  API_URL,
  API_AUTH,
  API_AUTH_USER,
  API_AUTH_PASSWORD,
  API_TOKEN
} = import.meta.env;

export async function GET({ url }: { url: URL}) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (API_AUTH === "TOKEN") {
    headers.append("Authorization", `Bearer ${API_TOKEN}`);
  } else if (API_AUTH === "BASIC") {
    const basicToken = btoa(`${API_AUTH_USER}:${API_AUTH_PASSWORD}`);
    headers.append("Authorization", `Basic ${basicToken}`);
  }

  try {
    const apiUrl = new URL(`${API_URL}/article_category/all`);
    apiUrl.searchParams.set("filter_status", "1");
    apiUrl.searchParams.set("filter_parent_id", "1");
    apiUrl.searchParams.set("limit", "100");

    const response = await fetch(apiUrl.toString(), { headers });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Error fetching categories" }), { status: response.status });
    }

    const { items} = await response.json();
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}