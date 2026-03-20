/* ── Shared Utilities ─────────────────────────────── */

const API = {
  food:   '/api/food',
  claims: '/api/claims'
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function expiringSoon(dateStr) {
  const diff = new Date(dateStr) - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}

function expired(dateStr) {
  return new Date(dateStr) < Date.now();
}

function showAlert(containerId, msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warn: '⚠️' };
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${icons[type]} ${msg}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

async function apiFetch(url, options = {}) {
  const res  = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function spinner() {
  return `<div class="loading"><div class="spinner"></div><p>Loading…</p></div>`;
}

function empty(icon, title, msg, action = '') {
  return `<div class="empty"><span class="ei">${icon}</span><h3>${title}</h3><p>${msg}</p>${action}</div>`;
}
