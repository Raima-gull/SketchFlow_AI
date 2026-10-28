const { env } = require('../../config/env');
const { ApiError } = require('../../utils/ApiError');

// ✅ SAHI URL: /v1/text-to-video (Magic Hour API Reference ke mutabiq)
const SUBMIT_URL = 'https://api.magichour.ai/v1/text-to-video';
const STATUS_URL = 'https://api.magichour.ai/v1/video-projects';

async function submit({ prompt }) {
  if (!env.MAGIC_HOUR_API_KEY) {
    throw new ApiError(
      503,
      'Magic Hour API key not configured',
      'PROVIDER_NOT_CONFIGURED'
    );
  }

  // Magic Hour ke text-to-video ke liye request body
  const body = {
    style: {
      prompt,
    },
    end_seconds: 5,
    aspect_ratio: '16:9',
    resolution: '480p', // Free tier ke liye 480p
    model: 'ltx-2.5', // Free tier mein available model [citation:18]
    name: 'SketchFlow video',
  };

  let response;
  try {
    response = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.MAGIC_HOUR_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new ApiError(
      502,
      `Magic Hour video request failed: ${err.message}`,
      'PROVIDER_NETWORK_ERROR'
    );
  }

  const responseText = await response.text();
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new ApiError(
      502,
      `Magic Hour invalid response: ${responseText.slice(0, 200)}`,
      'PROVIDER_ERROR'
    );
  }

  if (!response.ok) {
    let code = 'PROVIDER_ERROR';
    let statusCode = 502;

    if (response.status === 401 || response.status === 403) {
      code = 'PROVIDER_AUTH_ERROR';
      statusCode = 503;
    } else if (response.status === 402) {
      code = 'PROVIDER_INSUFFICIENT_CREDITS';
      statusCode = 402;
    } else if (response.status === 429) {
      code = 'PROVIDER_RATE_LIMIT';
      statusCode = 429;
    } else if (response.status >= 400 && response.status < 500) {
      statusCode = 400;
    }

    throw new ApiError(
      statusCode,
      `Magic Hour video error (${response.status}): ${responseText.slice(0, 200)}`,
      code
    );
  }

  console.log('🔍 Magic Hour video response:', JSON.stringify(data, null, 2).slice(0, 300));

  return {
    jobId: data.id,
    provider: 'magic-hour',
    model: 'ltx-2.5',
  };
}

async function pollStatus(jobId) {
  if (!env.MAGIC_HOUR_API_KEY) {
    throw new ApiError(503, 'Magic Hour key missing', 'PROVIDER_NOT_CONFIGURED');
  }

  // Status check karne ke liye GET /v1/video-projects/{id} [citation:1][citation:12]
  const response = await fetch(`${STATUS_URL}/${jobId}`, {
    headers: {
      Authorization: `Bearer ${env.MAGIC_HOUR_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(502, 'Failed to poll Magic Hour video', 'PROVIDER_ERROR');
  }

  const data = await response.json();

  return {
    status: data.status,
    downloads: data.downloads || [],
    error: data.error,
  };
}

module.exports = { magicHourVideo: { submit, pollStatus } };