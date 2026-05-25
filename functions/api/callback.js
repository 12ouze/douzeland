// Cloudflare Pages Function — route /api/callback.
// Retour du flow OAuth GitHub : échange le `code` contre un access_token,
// puis renvoie la page HTML de handshake (postMessage) attendue par Decap.
// APIs Web standard (Response, fetch global, URL) — aucune dépendance.

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export async function onRequest(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlResponse(renderPage('error', { message: 'Secrets OAuth manquants côté serveur.' }));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(request.headers.get('cookie') || '');

  if (!code) {
    return htmlResponse(renderPage('error', { message: 'Code OAuth absent.' }));
  }
  // Vérif anti-CSRF : le state doit correspondre au cookie posé par /api/auth.
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

// Page de handshake : protocole postMessage de Decap/Netlify CMS. IDENTIQUE
// à la version Netlify (contrat avec Decap — ne pas modifier un caractère).
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
  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Cookie state à usage unique : on l'efface.
      'Set-Cookie': 'decap_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
      'Cache-Control': 'no-store',
    },
  });
}
