// backend/validators.js
const USERNAME_RE = /^[A-Za-z0-9_-]{3,20}$/;

function validateUsername(name) {
  if (typeof name !== 'string') return { ok: false, reason: 'Username must be a string' };
  const trimmed = name.trim();
  if (!USERNAME_RE.test(trimmed)) {
    return { ok: false, reason: '3–20 chars; letters, numbers, underscore, hyphen only' };
  }
  return { ok: true, value: trimmed };
}

module.exports = { validateUsername };
