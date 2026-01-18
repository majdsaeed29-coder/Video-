import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// حط مفتاحك هون
const API_KEY = "ltxvuM8ZNw7siIL1XZ8wQqXEVAWLTiFKh4CGIzId4O78wjsFB_iEH1py-xRad68O7n64lWueHvKp8LEjP3OrFp4a6byhoB6zCeT-wSSOqBc4ljC72GJJ9anO0FTOnxasvVqJRcNiaWifpeoDwh9OG6MAEgccXOlE4u2OediPt9CR3ub";

app.post("/generate", async (req, res) => {
  try {
    // 1) إرسال الطلب
    const start = await fetch("https://api.ltx.video/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: req.body.prompt,
        model: "ltx-2-pro",
        duration: 5
      })
    });

    const startData = await start.json();
    const jobId = startData.id;

    // 2) انتظار النتيجة (Polling)
    let videoUrl = null;

    while (!videoUrl) {
      const check = await fetch(`https://api.ltx.video/v1/jobs/${jobId}`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      });

      const checkData = await check.json();

      if (checkData.status === "completed") {
        videoUrl = checkData.result.video;
      } else if (checkData.status === "failed") {
        return res.status(500).send("Video generation failed");
      }

      await new Promise(r => setTimeout(r, 2000)); // انتظر ثانيتين
    }

    // 3) رجّع رابط الفيديو للواجهة
    res.json({ video: videoUrl });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
