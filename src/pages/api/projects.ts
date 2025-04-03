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
  const PROJECTS_CATEGORY_ID = "1"
  const pageNumber = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("limit") || "15";
  const categoryId = url.searchParams.get("category_id") || PROJECTS_CATEGORY_ID;

  try {
    const apiUrl = new URL(`${API_URL}/articles/all`);
    apiUrl.searchParams.set("page", pageNumber.toString());
    apiUrl.searchParams.set("limit", pageSize.toString());
    apiUrl.searchParams.set("filter_status", "1");
    apiUrl.searchParams.set("sort", "created_at");
    apiUrl.searchParams.set("order", "desc");
    apiUrl.searchParams.set("category_id", categoryId);

    const response = await fetch(apiUrl.toString(), { headers });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Error fetching projects" }), { status: response.status });
    }

    const { items } = await response.json();
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}