export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    let documentContent = "";

    // Tweak 1: If a file exists, extract the text (this is a simplified text-based extraction)
    if (file && file.size > 0) {
      documentContent = await file.text(); // This works for .txt and some basic text-based files
    }

    // Tweak 2: Dynamically construct the prompt
    const prompt = `
      You are a legal assistant. 
      Document content: ${documentContent}
      User Question: ${query}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
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
