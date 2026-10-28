const { env } = require('../../config/env');
const { ApiError } = require('../../utils/ApiError');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const MODEL = 'openai/gpt-oss-120b';

async function generate({
  prompt,
  systemPrompt,
  maxTokens = 8000,
  temperature = 0.2,
  jsonMode = true,
}) {
  if (!env.GROQ_API_KEY) {
    throw new ApiError(
      503,
      'Groq API key not configured. Set GROQ_API_KEY in .env',
      'PROVIDER_NOT_CONFIGURED'
    );
  }

  const body = {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content:
          systemPrompt ||
          'You are a helpful assistant. Respond with valid JSON only when asked.',
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: maxTokens,
    temperature,
    ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
  };

  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError(
      502,
      `Groq request failed: ${err.message}`,
      'PROVIDER_NETWORK_ERROR'
    );
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let code = 'PROVIDER_ERROR';
    let statusCode = 502;

    if (response.status === 401) {
      code = 'PROVIDER_AUTH_ERROR';
      statusCode = 503;
    } else if (response.status === 429) {
      code = 'PROVIDER_RATE_LIMIT';
      statusCode = 429;
    } else if (response.status >= 400 && response.status < 500) {
      statusCode = 400;
    }

    throw new ApiError(
      statusCode,
      `Groq error (${response.status}): ${errorBody.slice(0, 300)}`,
      code
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  if (!text) {
    throw new ApiError(502, 'Groq returned empty response', 'PROVIDER_EMPTY');
  }

  return {
    text,
    model: MODEL,
    usage: data.usage || {},
  };
}

module.exports = { groqText: { generate } };