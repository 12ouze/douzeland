// Netlify Function : démarrage du flow OAuth GitHub pour Decap CMS.
// Redirige l'utilisateur vers la page d'autorisation GitHub.
// ESM (le projet est "type": "module"). Aucune dépendance externe.

import { randomUUID } from 'node:crypto';

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';

export async function handler(event) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: 'Config OAuth manquante : GITHUB_OAUTH_CLIENT_ID.' };
  }

  // host réel de la requête → on reconstruit l'URL de callback déployée.
  const host = event.headers['x-forwarded-host'] || event.headers.host;
  const redirectUri = `https://${host}/.netlify/functions/callback`;

  // state anti-CSRF : posé en cookie, revérifié dans callback.
  const state = randomUUID();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo', // droits d'écriture sur le repo (public ou privé)
    state,
    allow_signup: 'false',
  });

  return {
    statusCode: 302,
    headers: {
      Location: `${GITHUB_AUTHORIZE}?${params.toString()}`,
      'Set-Cookie': `decap_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
    body: '',
  };
}
