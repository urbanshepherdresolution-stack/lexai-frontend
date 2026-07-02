export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    let documentContent = "No text could be extracted from this file.";

    if (file) {
      // If it's a PDF, we treat it as binary. 
      // NOTE: Without a library, we can't parse complex PDFs perfectly,
      // but we can extract simple strings if the PDF isn't encrypted.
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Simple extraction: look for readable text in the binary stream
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      documentContent = textDecoder.decode(bytes).substring(0, 5000); 
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: `Context: ${documentContent}\n\nQuestion: ${query}` }]
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
