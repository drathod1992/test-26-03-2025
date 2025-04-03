// Import necessary modules
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Define the port number (fallback to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;

// Define the external API URL for fetching posts (fallback to an empty string if not specified)
const POSTS_API_URL = process.env.POSTS_API_URL || "";

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for handling requests from different origins
app.use(express.json()); // Allow Express to parse JSON request bodies

// Define API route to fetch posts
app.get("/api/posts", async (req, res) => {
  try {
    // Fetch posts from the external API, bypassing SSL certificate validation issues
    const response = await axios.get(POSTS_API_URL, {
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });

    // Send the retrieved posts data as a JSON response
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching posts:", error); // Log the error for debugging
    res.status(500).json({ error: "Error fetching posts" }); // Send an error response to the client
  }
});

// Start the server only if the environment is not "test" (useful for unit testing)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express app (useful for testing or modularization)
export default app;
