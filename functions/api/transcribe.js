export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

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
        messages: [
          { 
            role: "system", 
            content: "You are a professional legal assistant specialized in UK law. Provide accurate, concise answers grounded in UK legal principles. If a query is ambiguous, ask for clarification." 
          },
          { role: "user", content: query }
        ]
      })
    });

    const result = await response.json();
    return new Response(JSON.stringify({ message: result.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 500 });
  }
}
