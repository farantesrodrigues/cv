export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));

  // Function to parse cookies into an object
  const parseCookies = (cookieArray) => {
    const cookieObject = {};
    cookieArray.forEach(cookie => {
      const [key, value] = cookie.split('=');
      if (key && value) {
        cookieObject[key.trim()] = value.trim();
      }
    });
    return cookieObject;
  };

  // Parse cookies from the event
  const cookies = parseCookies(event.cookies || []);
  const { idToken, accessToken, refreshToken } = cookies;

  // If tokens are missing, return an authentication error
  if (!idToken || !accessToken || !refreshToken) {
    console.error('Missing tokens:', { idToken, accessToken, refreshToken });
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  // Redirect the user to the appropriate URL
  const redirectUrl = process.env.REDIRECT_URL || 'http://localhost:3000/cb';

  return {
    statusCode: 302,
    headers: {
      Location: redirectUrl,
    },
    cookies: [
      `idToken=${idToken}; HttpOnly; Secure; Path=/; SameSite=None`,
      `accessToken=${accessToken}; HttpOnly; Secure; Path=/; SameSite=None`,
      `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=None`,
    ],
    body: JSON.stringify({ message: 'Redirecting after authentication' }),
  };
};
