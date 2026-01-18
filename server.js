import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ حط مفتاح الـ API تبعك هون بين علامتي التنصيص
const API_KEY = "";

app.post("/generate", async (req, res) => {
  try {
    const response = await fetch("https://api.ltx.video/v1/text-to-video", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: req.body.prompt,
        model: "ltx-2-pro",
        duration: 5,
        resolution: "720x1280"
      })
    });

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "video/mp4");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating video");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
