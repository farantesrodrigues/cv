import Head from 'next/head';
import { getCognitoLoginUrl } from '@/utils/authHelpers';

export default function Home() {
  const handleSignIn = () => {
    const loginUrl = getCognitoLoginUrl();
    
    if (loginUrl) {
      window.location.href = loginUrl;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 p-4 justify-center items-center">
      <Head>
        <title>Welcome to My App</title>
        <meta name="description" content="Welcome to the interactive CV bot." />
      </Head>

      <h1 className="text-4xl font-bold mb-4 text-center text-gray-200">Welcome to My CV Bot</h1>
      <p className="text-lg mb-6 text-gray-300">An interactive CV experience powered by a chatbot.</p>

      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Sign In
      </button>
    </div>
  );
}
