# app/routes/ai_code.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import json, os

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class GenerateRequest(BaseModel):
    prompt: str
    projectId: str | None = None

SYSTEM_PROMPT = """
You are an expert code generator that works with ANY programming language.

Your job:
1. Read the user's prompt carefully.
2. Detect the programming language the user wants:
   - html, css, javascript, typescript, python, react, node, sql, php, ruby, go, rust, java, cpp, csharp, swift, kotlin, bash, etc.
   - If user mentions framework (React, Next.js, Vue, Django, Flask), map it to the closest language.
   - If NO language mentioned, default to "javascript".
3. Detect the action: generate | fix | explain | refactor | convert.
4. Generate COMPLETE, WORKING, COPY-PASTE-READY code.
   - Include all imports, styles, boilerplate.
   - Do NOT truncate with "...".
5. Return ONLY valid JSON:

{
  "language": "<detected language>",
  "action": "<action>",
  "code": "<complete code>"
}
"""

@router.post("/code/generate")
async def generate_code(req: GenerateRequest):
    if not req.prompt or len(req.prompt.strip()) < 5:
        raise HTTPException(400, "Prompt too short.")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": req.prompt},
            ],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        try:
            parsed = json.loads(raw)
        except:
            parsed = {"language": "text", "action": "generate", "code": raw}

        return {"success": True, "data": parsed}
    except Exception as e:
        raise HTTPException(500, str(e))