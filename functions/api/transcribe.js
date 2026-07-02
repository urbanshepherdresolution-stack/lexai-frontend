export async function onRequestPost(context) {
  const apiKey = context.env.OPENAI_API_KEY;
  const formData = await context.request.formData();
  const query = formData.get('query');
  const topic = formData.get('topic');

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are Counsel, an AI legal assistant specialized in the law of England and Wales. You provide general legal information, not formal legal advice. You are not regulated by the SRA and must advise users to seek a qualified solicitor regulated by the Law Society for specific or complex legal matters." },
        { role: "user", content: `Topic: ${topic}. Question: ${query}` }
      ]
    })
  });
  const result = await response.json();
  return new Response(JSON.stringify({ message: result.choices[0].message.content }), { headers: { 'Content-Type': 'application/json' }});
}
