exports.handler = async (event) => {
  try {
    const { mood } = JSON.parse(event.body);
    const hfToken = process.env.HUGGING_FACE_KEY;

    // Is baar hum server ko bolenge: "Wait karunga par gaana chahiye"
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        headers: { 
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true" // Yahi hai asli "Kim Jong" command
        },
        method: "POST",
        body: JSON.stringify({ inputs: `A high quality ${mood} bollywood style music` }),
      }
    );

    // Agar server bahut hi zyada load par hai
    if (response.status === 503 || response.status === 429) {
       throw new Error("Server load par hai, 10 second baad phir button dabao!");
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Check karo ki audio data sahi mila ya nahi
    if (arrayBuffer.byteLength < 100) throw new Error("Audio generate nahi ho paya, try again!");

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
