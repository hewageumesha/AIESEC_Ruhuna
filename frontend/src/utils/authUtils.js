// authUtils.js
export async function isTokenExpired(token) {
  try {
    const { default: jwtDecode } = await import('jwt-decode');
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (err) {
    return true; // Token is invalid or can't decode
  }
}
