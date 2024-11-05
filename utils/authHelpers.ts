import axios from 'axios';
import Cookies from 'js-cookie';

const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET
const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;
const redirectUriLogout = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI_LOGOUT

export interface Tokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export const getCognitoLoginUrl = () => {
  if (!cognitoDomain || !clientId || !redirectUri) {
    console.error('Cognito configuration is missing.');
    return null;
  }

  return `https://${cognitoDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
};

export const fetchTokens = async (): Promise<Tokens | null> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_LAMBDA_DOMAIN}/get-token`, {
      withCredentials: true,
    });

    const { idToken, accessToken, refreshToken } = response.data;

    if (idToken && accessToken && refreshToken) {
      return { idToken, accessToken, refreshToken };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading tokens:', error);
    return null;
  }
};

export const handleRedirect = async (code: string): Promise<Tokens | null> => { 
  if (!cognitoDomain || !clientId || !redirectUri || !clientSecret) {
    console.error('Cognito configuration is missing.');
    return null;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId as string);
    params.append('client_secret', clientSecret as string);
    params.append('code', code);
    params.append('redirect_uri', redirectUri as string);
  
    // Make the request to exchange code for tokens
    const response = await axios.post(
      `https://${cognitoDomain}/oauth2/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  
    const { id_token, access_token, refresh_token } = response.data;

    if (id_token && access_token && refresh_token) {
      return { idToken: id_token, accessToken: access_token, refreshToken: refresh_token }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading tokens:', error);
    return null;
  }
};

export const checkTokenExpiration = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp < currentTime; // True if expired
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if there's an error
  }
};

export const logout = () => {
  Cookies.remove('idToken');
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');

  const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${redirectUriLogout}`;

  window.location.href = logoutUrl;
};
