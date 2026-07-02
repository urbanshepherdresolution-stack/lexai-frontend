import pdf from 'pdf-parse';

export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    let documentContent = "No document content could be extracted.";

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.type === 'application/pdf') {
        try {
          const data = await pdf(buffer);
          documentContent = data.text.trim();
        } catch (e) {
          documentContent = "Error: This PDF is either encrypted or a scanned image that cannot be parsed as text.";
        }
      } else {
        documentContent = await file.text();
      }
    }

    // If the document content is empty after parsing, give the AI a hint
    const finalPrompt = documentContent.length < 10 
      ? `User asked: ${query}. (Note: The uploaded document seems empty or unreadable).`
      : `Document Content: ${documentContent.substring(0, 8000)}... \n\n User Question: ${query}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: finalPrompt }]
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
