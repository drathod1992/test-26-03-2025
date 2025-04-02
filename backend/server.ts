import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/posts", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts",
      {
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }), // Ignore SSL issues
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "Error fetching posts", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
