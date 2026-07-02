export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  // Debugging check: Is the key missing entirely?
  if (!apiKey) {
    return new Response(JSON.stringify({ status: "error", message: "API key is missing in Cloudflare settings" }), { status: 500 });
  }

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: query }]
      })
    });

    const result = await response.json();
    
    // Return the actual error message from OpenAI
    if (result.error) {
        return new Response(JSON.stringify({ status: "error", message: "OpenAI: " + result.error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ status: "success", message: result.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 500 });
  }
}
