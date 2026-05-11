exports.handler = async (event) => {
  try {
    const { mood } = JSON.parse(event.body);
    const hfToken = process.env.HUGGING_FACE_KEY;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        headers: { 
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({ inputs: `A high quality ${mood} bollywood style background music` }),
      }
    );

    if (!response.ok) throw new Error("Hugging Face Engine Busy, Try Again!");

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio: `data:audio/mpeg;base64,${base64Audio}` })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
