// Netlify Function : retour du flow OAuth GitHub pour Decap CMS.
// Échange le `code` GitHub contre un access_token, puis renvoie la page
// HTML de handshake (postMessage) attendue par Decap.
// ESM. fetch natif (Node 18+). Aucune dépendance externe.

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export async function handler(event) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlResponse(renderPage('error', { message: 'Secrets OAuth manquants côté serveur.' }));
  }

  const { code, state } = event.queryStringParameters || {};
  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie || '');

  if (!code) {
    return htmlResponse(renderPage('error', { message: 'Code OAuth absent.' }));
  }
  // Vérif anti-CSRF : le state doit correspondre au cookie posé par /auth.
  if (!state || state !== cookies.decap_oauth_state) {
    return htmlResponse(renderPage('error', { message: 'State invalide (anti-CSRF).' }));
  }

  try {
    const res = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();
    if (data.error || !data.access_token) {
      return htmlResponse(renderPage('error', { message: data.error_description || "Échec de l'échange de token." }));
    }
    return htmlResponse(renderPage('success', { token: data.access_token, provider: 'github' }));
  } catch {
    return htmlResponse(renderPage('error', { message: "Erreur réseau lors de l'échange de token." }));
  }
}

// Page de handshake : protocole postMessage de Decap/Netlify CMS.
// 1) on annonce 'authorizing:github' à l'ouvreur (Decap),
// 2) Decap répond, 3) on lui renvoie le token (ou l'erreur).
function renderPage(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Connexion en cours… cette fenêtre va se fermer automatiquement.</p>
</body></html>`;
}

function parseCookies(header) {
  return Object.fromEntries(
    header
      .split(';')
      .map((c) => {
        const i = c.indexOf('=');
        return i < 0 ? null : [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1))];
      })
      .filter(Boolean),
  );
}

function htmlResponse(html) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Cookie state à usage unique : on l'efface.
      'Set-Cookie': 'decap_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0',
      'Cache-Control': 'no-store',
    },
    body: html,
  };
}
