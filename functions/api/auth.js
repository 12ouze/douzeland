// Cloudflare Pages Function — route /api/auth.
// Démarrage du flow OAuth GitHub pour Decap CMS : redirige vers la page
// d'autorisation GitHub. APIs Web standard (Response, crypto global, URL) —
// aucune dépendance, aucun flag nodejs_compat nécessaire.

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';

export async function onRequest(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('Config OAuth manquante : GITHUB_OAUTH_CLIENT_ID.', { status: 500 });
  }

  // Origine réelle de la requête → URL de callback déployée (route /api/callback).
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/callback`;

  // state anti-CSRF : posé en cookie, revérifié dans callback.
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo', // droits d'écriture sur le repo (public ou privé)
    state,
    allow_signup: 'false',
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${GITHUB_AUTHORIZE}?${params.toString()}`,
      'Set-Cookie': `decap_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
