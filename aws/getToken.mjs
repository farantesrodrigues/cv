function parseCookies(cookieArray) {
    const cookieObject = {};
  
    cookieArray.forEach(cookie => {
      // Split each cookie string into key and value
      const [key, value] = cookie.split('=');
      // Trim any whitespace and add to the cookie object
      if (key && value) {
        cookieObject[key.trim()] = value.trim();
      }
    });
  
    return cookieObject;
  }
  
  export const handler = async (event) => {
    console.log("cookies", event.cookies);
    
    const { idToken, accessToken, refreshToken } = parseCookies(event.cookies || []);
    
    console.log(idToken, accessToken, refreshToken);
  
    if (!idToken || !accessToken || !refreshToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Not authenticated' }),
      };
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({ idToken, accessToken, refreshToken }),
    };
  };
  