export async function onRequestPost(context) {
  // Use the OpenAI key you just saved in Settings
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    
    // OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "gpt-4o", // or your preferred model
        messages: [{ role: "user", content: query }]
      })
    });

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    return new Response(JSON.stringify({ 
      status: "success", 
      message: aiResponse 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: "OpenAI call failed" }), {
      status: 500
    });
  }
}
