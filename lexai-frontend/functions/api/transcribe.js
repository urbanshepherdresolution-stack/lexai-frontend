export async function onRequestPost(context) {
  // This is the new Pages Functions syntax
  return new Response(JSON.stringify({ 
    status: "success", 
    message: "Analysis complete: Backend is communicating correctly." 
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    }
  });
}