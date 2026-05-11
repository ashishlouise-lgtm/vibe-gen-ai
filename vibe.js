exports.handler = async (event) => {
  try {
    // 1. User ka mood pakdo
    const { mood } = JSON.parse(event.body);
    const apiKey = process.env.ELEVEN_LABS_KEY;

    // 2. ElevenLabs ko call karo
    const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
      method: 'POST',
      headers: { 
        'xi-api-key': apiKey, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        // Yahan text ko dynamic banaya hai taaki har baar alag sound aaye
        text: `A unique and high-quality ${mood} bollywood style background music track, sequence ID: ${Math.floor(Math.random() * 100000)}`,
        model_id: "eleven_turbo_v2_5" // Asli Sound Gen Model
      })
    });

    // 3. Agar ElevenLabs error de toh usse pakdo
    if (!response.ok) {
        const errorDetail = await response.json();
        console.error("ElevenLabs API Error:", errorDetail);
        return { 
          statusCode: response.status, 
          body: JSON.stringify({ error: errorDetail.detail?.status || "API Error" }) 
        };
    }

    // 4. Audio data ko Base64 mein badlo
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    
    return {
      statusCode: 200,
      headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify({ 
          audio: `data:audio/mpeg;base64,${base64Audio}` 
      })
    };

  } catch (error) {
    console.error("Function Error:", error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Backend crash: " + error.message }) 
    };
  }
};