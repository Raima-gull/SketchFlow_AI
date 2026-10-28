const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

const localStorage = {
  async upload(file) {
    await ensureUploadDir();

    const ext = path.extname(file.originalname) || '';
    const key = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(UPLOAD_DIR, key);

    await fs.writeFile(filePath, file.buffer);

    return {
      storageKey: key,
      url: `/uploads/${key}`,
    };
  },

  async delete(storageKey) {
    const filePath = path.join(UPLOAD_DIR, storageKey);
    try {
      await fs.unlink(filePath);
    } catch {
      // File already gone — ignore
    }
  },

  getUrl(storageKey) {
    return `/uploads/${storageKey}`;
  },
};

module.exports = { localStorage };