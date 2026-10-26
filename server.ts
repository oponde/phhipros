import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Search Endpoint
  app.post("/api/gemini/search", async (req, res) => {
    try {
      const { prompt, context, history = [] } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt is required" });

      const ai = getAiClient();
      if (!ai) {
        return res.json({
          text: `### Course Study Summary\n\nBased on your course materials:\n\n${context}\n\n**Dynamic Study Tip**: Review each lesson summary above and test your recall by writing down key definitions and worked examples from the syllabus.`
        });
      }

      // Format history for the prompt if needed, or use it to guide the interaction
      const historyContext = history.length > 0 
        ? `\n\nPrevious conversation history:\n${history.map((h: any) => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.content}`).join('\n')}`
        : '';

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          role: 'user',
          parts: [{
            text: `You are the "PHHIPROS Dynamic Academic Tutor", a highly reliable AI assistant specialized in cross-referencing course materials.
        
Your goal is to provide authoritative, grounded, and dynamic learning support based ONLY on the provided course content.

COURSE CONTEXT:
${context}
${historyContext}

STUDENT QUESTION:
${prompt}

STRICT INSTRUCTIONS FOR RELIABILITY:
1. **Source Attribution**: You MUST cite the specific lesson title(s) for every major claim or explanation you make. Use the format: [Source: Lesson Title].
2. **Contextual Grounding**: Only answer based on the provided lessons. If the student asks for something external, explain that "PHHIPROS materials for this specific course do not currently cover that, but I can help with [Related Topic from Context]."
3. **Dynamic Study Tip**: End every response with a unique "Dynamic Study Tip" that cross-references a DIFFERENT but related lesson from the context to encourage broader learning.
4. **Formatting**: Use Markdown with clear headings and bullet points. Bold key terms.
5. **Tone**: Academic, precise, and supportive.`
          }]
        }],
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Search Error:", error);
      const message = error.message?.includes("quota") 
        ? "AI service is currently busy (quota exceeded). Please try again in a few minutes."
        : error.message;
      res.status(500).json({ error: message });
    }
  });

  // AI Questionnaire Endpoint
  app.post("/api/gemini/questionnaire", async (req, res) => {
    try {
      const { context } = req.body;

      const ai = getAiClient();
      if (!ai) {
        return res.json({
          questions: [
            { question: "What are the primary learning objectives covered in the first module of this course?", answer: "Review Lesson 1 in the course syllabus for the foundational concepts and worked examples." },
            { question: "How do the theoretical concepts in this course apply to practical problem-solving?", answer: "Each lesson pairs core theory with structured exercises and real-world applications." },
            { question: "Which key definitions and formulas should be memorized before attempting past examination papers?", answer: "Focus on the core principles highlighted in the course description and lesson summaries." }
          ]
        });
      }
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          role: 'user',
          parts: [{
            text: `Generate 15 high-quality academic questions based on the following course content:
        
        ${context}
        
        Return a JSON array of objects, each with 'question' and 'answer' fields.`
          }]
        }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
              },
              required: ["question", "answer"],
            },
          },
        },
      });

      if (!response.text) return res.status(500).json({ error: "Empty response from AI" });
      res.json({ questions: JSON.parse(response.text) });
    } catch (error: any) {
      console.error("Gemini Questionnaire Error:", error);
      const message = error.message?.includes("quota") 
        ? "AI service is currently busy (quota exceeded). Please try again in a few minutes."
        : error.message;
      res.status(500).json({ error: message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
