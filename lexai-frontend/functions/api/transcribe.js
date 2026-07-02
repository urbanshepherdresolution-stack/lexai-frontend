export async function onRequestPost(context) {
  try {
    const input = await context.request.json();
    return new Response(JSON.stringify({ 
      status: "success", 
      message: "Analysis complete: Backend is communicating correctly." 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: "Failed to parse JSON" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
