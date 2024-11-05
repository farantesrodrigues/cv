export const handler = async () => {
    // Clear the cookies
    const cookies = [
      `idToken=; HttpOnly; Secure; Path=/; Max-Age=0;`,
      `accessToken=; HttpOnly; Secure; Path=/; Max-Age=0;`,
      `refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0;`,
    ];
  
    return {
      statusCode: 200,
      cookies,
      body: JSON.stringify({ message: 'Logged out successfully' }),
    };
  };
  