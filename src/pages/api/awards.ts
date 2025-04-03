export async function GET() {
  try {
    const data = await import('@data/awards.json')

    const items = data.items;
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}