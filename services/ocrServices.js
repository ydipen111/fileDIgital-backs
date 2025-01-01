

export const analyzeImage = async () => {

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.2-11b-vision-preview',

      // message
      message: [{
        role: "user",
        content: [
          { type: "image", image: base64Image },
          { type: "text", text: "Analyze thise image" }
        ]
      }]
    },//headers 
      {
        headers: {
          'authorization': `Bearer ${config.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
    return response.data;

  } catch (error) {
    console.error("Error in analyzeImage:", error);
    return res.status(500).json({ message: "Internal Server Error" });

  }

}