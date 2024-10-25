import Head from 'next/head';
import { getCognitoLoginUrl } from '../../utils/authHelpers';

export default function SignIn() {
  const handleLogin = () => {
    const loginUrl = getCognitoLoginUrl();
    if (loginUrl) {
      window.location.href = loginUrl;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 p-4 justify-center items-center">
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Sign in to access the private space." />
      </Head>

      <h1 className="text-4xl font-bold mb-4 text-center text-gray-200">Sign In</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Sign In
      </button>
    </div>
  );
}
