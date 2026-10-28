const { Generation } = require('../../models/Generation');
const { groqText } = require('../../adapters/text/groqText');
const { ApiError } = require('../../utils/ApiError');

const WEBSITE_SYSTEM_PROMPT = `You are a website structure generator. 
Return ONLY valid JSON. No markdown, no code blocks, no explanation.
The JSON must have this exact structure:
{
  "title": "string",
  "theme": { "primary": "#hex", "background": "#hex" },
  "sections": [
    {
      "id": "string",
      "type": "hero|features|pricing|testimonials|faq|contact|footer",
      "content": { ... }
    }
  ]
}`;

// ═══════════════════════════════════════════════════════════
// LANGUAGE-STRICT CODE GENERATION SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════
const CODE_SYSTEM_PROMPT = `You are an expert full-stack developer. You generate code in ANY programming language.

CORE RULES — FOLLOW STRICTLY:

1. LANGUAGE MATCHING (CRITICAL):
   - Detect the EXACT language the user requested in their prompt.
   - The word "landing page" or "website" does NOT mean HTML. It means a page in the requested language.
   - "React mein landing page" → .jsx component with React + Tailwind/inline styles
   - "HTML mein landing page" → .html file with <style> and <script>
   - "Next.js mein landing page" → app/page.jsx with React
   - "Vue mein landing page" → .vue single-file component
   - "Angular mein landing page" → Angular component (.ts + .html + .css)
   - "Python Flask mein landing page" → Flask app.py + templates/index.html
   - "Django mein landing page" → Django view + template
   - "Node.js mein landing page" → Express server + EJS/HTML
   - "JavaScript mein landing page" → .js + DOM manipulation OR plain HTML+JS if needed
   - "CSS only landing page" → pure HTML + CSS (no JS)
   - "Svelte" → .svelte file
   - "Astro" → .astro file
   - If user says NO language → default to plain HTML.

2. PURE OUTPUT:
   - Python → ONLY .py (with templates if Flask/Django)
   - React → ONLY .jsx (with imports)
   - HTML → ONLY .html
   - Do NOT wrap Python in HTML, do NOT use Brython/PyScript.
   - Give code that runs natively in that language's runtime.

3. LANDING PAGE STRUCTURE (when user asks for "landing page"):
   A good landing page MUST include:
   - Hero section with heading + subheading + CTA button
   - Features section (3-4 cards)
   - Testimonials OR pricing section
   - Footer
   - Responsive design
   - Modern styling (gradients, shadows, hover effects)
   - Color scheme: dark theme with cyan (#00E5FF) / blue (#38BDF8) accents UNLESS user specifies otherwise.

4. ACTION DETECTION:
   - "generate" → fresh code
   - "fix" → fix bugs
   - "explain" → line-by-line explanation
   - "refactor" → clean up
   - "convert" → translate languages

5. CODE QUALITY:
   - COMPLETE code — no "..." truncation
   - Include ALL imports and boilerplate
   - Add helpful comments
   - Handle edge cases
   - Keep total code under 300 lines to avoid truncation

6. JSON ESCAPING RULES (CRITICAL):
   - Your entire response is ONE JSON object.
   - The "code" field contains the actual source code as a JSON string.
   - Inside the code, use NORMAL double quotes for HTML/JSX attributes.
   - In the JSON output, those quotes must be escaped ONCE with \\" (single backslash + quote).
   - Do NOT add extra backslashes. Do NOT double-escape.
   - Example of CORRECT JSON output:
     {
       "language": "react",
       "action": "generate",
       "code": "export default function App() {\\n  return <div className=\\"box\\">Hello</div>;\\n}"
     }
   - When rendered, the code becomes:
     export default function App() {
       return <div className="box">Hello</div>;
     }

7. RETURN FORMAT — JSON ONLY, no markdown fences:
{
  "language": "<detected language>",
  "action": "<generate|fix|explain|refactor|convert>",
  "code": "<complete code>"
}

EXAMPLES:

User: "React mein landing page banao"
→ { "language": "react", "action": "generate", "code": "import React from 'react';\\n\\nexport default function LandingPage() {\\n  return <div className=\\"container\\">...</div>;\\n}" }

User: "HTML mein landing page banao"
→ { "language": "html", "action": "generate", "code": "<!DOCTYPE html>\\n<html>..." }

User: "Python Flask mein landing page banao"
→ { "language": "python", "action": "generate", "code": "from flask import Flask, render_template\\n\\napp = Flask(__name__)\\n..." }

User: "Vue mein landing page banao"
→ { "language": "vue", "action": "generate", "code": "<template>...</template>\\n<script setup>...</script>" }
`;

// ═══════════════════════════════════════════════════════════
// Helper: clean extra escaping from AI-returned code
// ═══════════════════════════════════════════════════════════
function cleanCode(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/\\"/g, '"')    // \" → "
    .replace(/\\'/g, "'")    // \' → '
    .replace(/\\\\/g, '\\')  // \\ → \
    .replace(/\\n/g, '\n')   // \n → actual newline (only if literal)
    .replace(/\\t/g, '\t');  // \t → actual tab
}

// ═══════════════════════════════════════════════════════════
// Helper: parse AI response into { language, action, code }
// ═══════════════════════════════════════════════════════════
function parseAIResponse(rawText, fallbackLanguage) {
  const trimmed = (rawText || '').trim();

  // Try direct JSON parse first
  try {
    const cleaned = trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    /* try next */
  }

  // Try extracting JSON object from text
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      /* try next */
    }
  }

  // Fallback: treat entire text as code
  return {
    language: fallbackLanguage,
    action: 'generate',
    code: trimmed
      .replace(/^```[a-z]*\n/i, '')
      .replace(/```$/i, '')
      .trim(),
  };
}

const textService = {
  // --- 1. WEBSITE JSON GENERATION ---
  async generateWebsite(userId, { prompt, projectId }) {
    const generation = await Generation.create({
      userId,
      projectId: projectId || null,
      type: 'text',
      prompt,
      provider: 'groq',
      status: 'processing',
    });

    try {
      const result = await groqText.generate({
        prompt,
        systemPrompt: WEBSITE_SYSTEM_PROMPT,
      });

      let parsed;
      try {
        const cleaned = result.text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        parsed = JSON.parse(cleaned);
      } catch {
        throw new ApiError(502, 'AI returned invalid JSON', 'INVALID_AI_RESPONSE');
      }

      generation.status = 'completed';
      await generation.save();

      return { generation, website: parsed };
    } catch (err) {
      generation.status = 'failed';
      generation.errorCode = err.code || 'ERROR';
      generation.errorMessage = err.message;
      await generation.save();
      throw err;
    }
  },

  // --- 2. CODE GENERATION (LANGUAGE-STRICT) ---
  async generateCode(userId, { prompt, language = 'auto', projectId }) {
    const generation = await Generation.create({
      userId,
      projectId: projectId || null,
      type: 'text',
      prompt,
      provider: 'groq',
      status: 'processing',
    });

    try {
      const languageInstruction =
        language && language !== 'auto'
          ? `The user wants code in **${language}**. You MUST generate code in ${language}. Do not use any other language.`
          : `Detect the programming language from the user's prompt and generate code in that language.`;

      const fullPrompt = `${languageInstruction}

User request: ${prompt}

Respond with ONE JSON object only: { "language": "...", "action": "...", "code": "..." }`;

      const result = await groqText.generate({
        prompt: fullPrompt,
        systemPrompt: CODE_SYSTEM_PROMPT,
      });

      // Parse JSON
      let parsed = parseAIResponse(result.text, language);

      // Clean extra escapes from code
      parsed.code = cleanCode(parsed.code || '');

      // Safety: if user asked for React/Python/Vue but got HTML, retry
      const htmlPattern = /<!DOCTYPE|<html|<head|<body/i;
      const isWrongLanguage =
        ['react', 'python', 'vue', 'angular', 'svelte', 'next'].includes(language) &&
        htmlPattern.test(parsed.code) &&
        !['html', 'css'].includes(language);

      if (isWrongLanguage) {
        console.warn(`⚠️ AI returned HTML for ${language} — retrying`);
        const retry = await groqText.generate({
          prompt: `Generate a landing page in ${language}. ONLY ${language} code. No HTML wrapper. User prompt: ${prompt}`,
          systemPrompt: CODE_SYSTEM_PROMPT,
        });

        const retryParsed = parseAIResponse(retry.text, language);
        retryParsed.code = cleanCode(retryParsed.code || '');
        parsed = retryParsed;
      }

      generation.status = 'completed';
      await generation.save();

      return {
        generation,
        code: parsed.code,
        language: parsed.language || language,
        action: parsed.action || 'generate',
      };
    } catch (err) {
      generation.status = 'failed';
      generation.errorCode = err.code || 'ERROR';
      generation.errorMessage = err.message;
      await generation.save();
      throw err;
    }
  },
};

module.exports = { textService };