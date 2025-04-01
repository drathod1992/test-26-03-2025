import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/posts", async (req, res) => {
    try {
        console.log("Fetching posts from JSONPlaceholder...");
        const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // ✅ Using built-in fetch
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Error fetching posts", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
