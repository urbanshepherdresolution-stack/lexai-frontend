export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;

  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    let documentContent = "";
    if (file && file.size > 0) {
      let rawText = await file.text();
      // TRUNCATE: Limit to 10,000 characters to prevent token overflow
      if (rawText.length > 10000) {
        documentContent = rawText.substring(0, 10000) + "\n\n...[Document truncated due to length]...";
      } else {
        documentContent = rawText;
      }
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

    if (result.choices && result.choices.length > 0) {
      return new Response(JSON.stringify({ message: result.choices[0].message.content }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ message: "OpenAI returned an error: " + JSON.stringify(result.error) }), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message }), { status: 500 });
  }
}
