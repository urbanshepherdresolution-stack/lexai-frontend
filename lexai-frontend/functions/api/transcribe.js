export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const query = formData.get('query');
    const file = formData.get('file');

    let fileInfo = "No document provided.";
    if (file) {
      fileInfo = `Processing document: ${file.name} (${file.type}).`;
    }

    return new Response(JSON.stringify({ 
      status: "success", 
      message: `Analysis of "${query}" received. ${fileInfo}` 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: "Upload processing failed" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
