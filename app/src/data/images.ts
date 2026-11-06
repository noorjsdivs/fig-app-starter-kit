/**
 * Food photography via Unsplash (https://unsplash.com/?utm_source=fig_and_fennel&utm_medium=referral),
 * exactly the photo ids used in the design prototype.
 */
export const unsplash = (id: string, w = 900): string => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const UNSPLASH_CREDIT_URL = 'https://unsplash.com/?utm_source=fig_and_fennel&utm_medium=referral';

/** Journal cover choices (`COVERS`). */
export const COVERS: string[] = [
  '1579751626657-72bc17010498',
  '1553979459-d2229ba7433b',
  '1621996346565-e3dbc646d9a9',
  '1414235077428-338989a2e8c0',
  '1563379091339-03b21ab4a4f8',
  '1567171466295-4afa63d45416',
  '1504674900247-0877df9cc836',
  '1590947132387-155cc02f3212',
].map((id) => unsplash(id, 1000));

/** Auth backgrounds (`BN`). */
export const AUTH_IMAGES = {
  login: unsplash('1504674900247-0877df9cc836', 1100),
  register: unsplash('1546069901-ba9599a7e63c', 1100),
  verify: unsplash('1608039755401-742074f0548d', 1100),
  forgot: unsplash('1567620905732-2d1ec7ab7445', 1100),
} as const;

export const RESERVE_IMAGE = unsplash('1414235077428-338989a2e8c0', 1100);

/** Splash artwork. */
export const SPLASH_IMAGES = {
  hero: unsplash('1553979459-d2229ba7433b', 800),
  floats: [unsplash('1612874742237-6526221588e3', 400), unsplash('1565299624946-b28f40a0ae38', 300), unsplash('1567171466295-4afa63d45416', 300)],
} as const;
