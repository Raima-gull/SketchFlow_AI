// server/routes/aiCode.js
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/code/generate', async (req, res) => {
  try {
    const { prompt, projectId } = req.body;

    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ message: 'Prompt too short.' });
    }

    // ===== SYSTEM PROMPT — strict language rules =====
    const systemPrompt = `
You are an expert code generator. You generate code in ANY programming language.

CRITICAL RULES — FOLLOW STRICTLY:

1. LANGUAGE DETECTION:
   - Read the prompt carefully and detect the EXACT language requested.
   - "Python" = Python (.py file, runs in terminal) — NOT HTML, NOT Brython, NOT PyScript.
   - "JavaScript" = .js file — NOT HTML with embedded JS (unless user explicitly asks for webpage).
   - "HTML" = .html file with plain HTML/CSS/JS.
   - "React" = .jsx component.
   - If user says "Python calculator" → give a PURE Python script using input() and print().
   - If user says "HTML calculator" → give HTML file with JS.

2. PURE LANGUAGE OUTPUT:
   - If user asks for Python, output ONLY Python code (.py).
   - Do NOT wrap Python in HTML.
   - Do NOT use Brython, PyScript, or any browser-Python library UNLESS the user explicitly says "run Python in browser".
   - Same rule for every language — give code that runs natively in that language's runtime.

3. ACTION DETECTION:
   - "generate" → fresh code
   - "fix" → fix bugs
   - "explain" → line-by-line explanation
   - "refactor" → clean up
   - "convert" → translate languages

4. CODE QUALITY:
   - Include ALL imports, styles, boilerplate.
   - COMPLETE working code — no "..." truncation.
   - Add comments for clarity.
   - Handle edge cases (division by zero, invalid input, etc.).

5. RETURN FORMAT — JSON ONLY, no markdown fences:
{
  "language": "<detected language: python | javascript | html | css | react | node | sql | java | cpp | etc.>",
  "action": "<generate | fix | explain | refactor | convert>",
  "code": "<complete working code>"
}

EXAMPLES:

User: "Python mein calculator banao"
→ { "language": "python", "action": "generate", "code": "def add(a,b): return a+b\\n..." }

User: "HTML mein calculator banao"
→ { "language": "html", "action": "generate", "code": "<!DOCTYPE html>..." }

User: "React mein calculator banao"
→ { "language": "react", "action": "generate", "code": "import { useState } from 'react';..." }
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { language: 'text', action: 'generate', code: raw };
    }

    // Safety check: agar Python manga tha lekin HTML/Brython mila
    if (parsed.language === 'python' && /<html|<!DOCTYPE|brython|pyscript/i.test(parsed.code)) {
      console.warn('⚠️ LLM returned HTML for Python request — retrying with stricter instruction');
      // Retry ek baar
      const retry = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
          {
            role: 'user',
            content: 'IMPORTANT: Return ONLY pure Python code (.py). Do NOT use HTML, Brython, or PyScript. Use input() and print() for terminal interaction.',
          },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });
      try {
        parsed = JSON.parse(retry.choices[0].message.content);
      } catch {
        /* keep original */
      }
    }

    res.json({
      success: true,
      data: parsed,
    });
  } catch (err) {
    console.error('Code generation error:', err);
    res.status(500).json({ message: err.message || 'Generation failed.' });
  }
});

export default router;