(function(){
  const form = document.getElementById('reserveForm');
  const msg = document.getElementById('msg');
  const list = document.getElementById('list');
  const refreshBtn = document.getElementById('refresh');
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  const API = (path) => `${window.API_BASE}${path}`;

  async function fetchLatest() {
    list.innerHTML = '<li>Loading…</li>';
    try {
      const res = await fetch(API('/api/users'));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed fetch');
      list.innerHTML = '';
      (data.data || []).forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.username} — ${new Date(u.created_at).toLocaleString()}`;
        list.appendChild(li);
      });
      if (!data.data || data.data.length === 0) {
        list.innerHTML = '<li>No usernames yet.</li>';
      }
    } catch (e) {
      list.innerHTML = `<li class="error">${e.message}</li>`;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const username = document.getElementById('username').value.trim();
    if (!/^[A-Za-z0-9_-]{3,20}$/.test(username)) {
      msg.textContent = 'Use 3–20 chars: letters, numbers, _ or -';
      msg.className = 'msg error';
      return;
    }
    try {
      const res = await fetch(API('/api/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (res.status === 201) {
        msg.textContent = `Reserved: ${data.username}`;
        msg.className = 'msg ok';
        form.reset();
        fetchLatest();
      } else {
        msg.textContent = data.error || 'Error';
        msg.className = 'msg error';
      }
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'msg error';
    }
  });

  refreshBtn.addEventListener('click', fetchLatest);
  fetchLatest();
})();