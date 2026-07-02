export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    // Create a new FormData object to send to OpenAI
    const openAiFormData = new FormData();
    openAiFormData.append('model', 'gpt-4o');
    
    // Construct the prompt
    const systemPrompt = `You are a legal assistant. Analyze the provided file and answer the user's question: ${query}`;
    openAiFormData.append('messages', JSON.stringify([
      { role: "user", content: systemPrompt }
    ]));

    // If a file is uploaded, attach it
    if (file && file.size > 0) {
      openAiFormData.append('file', file);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}` },
      body: openAiFormData
    });

    const result = await response.json();
    return new Response(JSON.stringify({ message: result.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 500 });
  }
}
