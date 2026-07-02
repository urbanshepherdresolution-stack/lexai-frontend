export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    // Basic text extraction for files
    let documentContent = "";
    if (file && file.size > 0) {
      documentContent = await file.text();
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: `Document: ${documentContent} \n\n Question: ${query}` }]
      })
    });

    const result = await response.json();

    // Check if the response actually contains the data we need
    if (result.choices && result.choices.length > 0) {
      return new Response(JSON.stringify({ message: result.choices[0].message.content }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // If something went wrong, return the whole result so we can see what OpenAI sent back
      return new Response(JSON.stringify({ message: "OpenAI returned an unexpected format: " + JSON.stringify(result) }), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 500 });
  }
}
