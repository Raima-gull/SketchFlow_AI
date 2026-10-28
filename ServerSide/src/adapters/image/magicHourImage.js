const { env } = require('../../config/env');
const { ApiError } = require('../../utils/ApiError');

const MAGIC_HOUR_SUBMIT_URL = 'https://api.magichour.ai/v1/ai-image-generator';
const MAGIC_HOUR_STATUS_URL = 'https://api.magichour.ai/v1/image-projects';

async function submit({ prompt }) {
  if (!env.MAGIC_HOUR_API_KEY) {
    throw new ApiError(
      503,
      'Magic Hour API key not configured',
      'PROVIDER_NOT_CONFIGURED'
    );
  }

  const body = {
    image_count: 1,
    style: {
      prompt,
      tool: 'general',
    },
    aspect_ratio: '1:1',
    model: 'z-image-turbo',
    name: 'SketchFlow image',
    resolution: '640px',
  };

  let response;
  try {
    response = await fetch(MAGIC_HOUR_SUBMIT_URL, {
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
      `Magic Hour request failed: ${err.message}`,
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
    }

    throw new ApiError(
      statusCode,
      `Magic Hour error (${response.status}): ${responseText.slice(0, 200)}`,
      code
    );
  }

  return {
    jobId: data.id,
    provider: 'magic-hour',
    model: 'z-image-turbo',
  };
}

async function pollStatus(jobId) {
  if (!env.MAGIC_HOUR_API_KEY) {
    throw new ApiError(503, 'Magic Hour key missing', 'PROVIDER_NOT_CONFIGURED');
  }

  const response = await fetch(`${MAGIC_HOUR_STATUS_URL}/${jobId}`, {
    headers: {
      Authorization: `Bearer ${env.MAGIC_HOUR_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(502, 'Failed to poll Magic Hour', 'PROVIDER_ERROR');
  }

  const data = await response.json();

  return {
    status: data.status, // 'queued' | 'rendering' | 'complete' | 'error'
    downloads: data.downloads || [],
    error: data.error,
  };
}

module.exports = { magicHourImage: { submit, pollStatus } };