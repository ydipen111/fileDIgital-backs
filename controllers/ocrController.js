import dotenv from "dotenv";

// Load environment variables once at the start of your application
dotenv.config();

export const ocrController = (req, res) => {
  try {
    // Destructure environment variables for cleaner access
    const { PORT, DB_URI, GROQ_API_KEY } = process.env;

    // Log the values (for debugging purposes)
    console.log(`Port: ${PORT}, Database URI: ${DB_URI}, API Key: ${GROQ_API_KEY}`);

    // Respond with a success message
    return res.status(200).json({ message: "OCR route" });

  } catch (error) {
    // Log the error for debugging
    console.error("Error in OCR Controller:", error);

    // Send an error response
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
