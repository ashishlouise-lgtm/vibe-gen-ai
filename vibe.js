exports.handler = async (event) => {
  try {
    const { mood } = JSON.parse(event.body);
    
    // Pixabay se music search karne ka free url
    // Hum mood ke saath 'music' keyword jod rahe hain taaki sahi dhun mile
    const searchUrl = `https://pixabay.com/api/videos/search/?key=44341517-5755106596e38604759628784&q=${encodeURIComponent(mood)}+music&per_page=10`;

    // Note: Maine yahan ek public key use ki hai, ye direct chalegi
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      // Mood ke hisaab se koi bhi ek random music track uthao
      const randomIndex = Math.floor(Math.random() * Math.min(data.hits.length, 5));
      const musicUrl = data.hits[randomIndex].videos.tiny.url; // Pixabay video se music extract karega

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: musicUrl })
      };
    } else {
      // Agar kuch na mile toh sadak se ek sample gaana
      return {
        statusCode: 200,
        body: JSON.stringify({ audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" })
      };
    }
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Network Error: Just try once more!" }) 
    };
  }
};
