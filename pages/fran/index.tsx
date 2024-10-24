import Head from 'next/head';
import ChatBot from '../../components/ChatBot';
import Avatar from '../../components/Avatar';
import { useRequireAuth } from '@/hooks/useRequiredAuth';

export default function Fran() {
  const { isAuthenticated, loading } = useRequireAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Unauthenticated</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800 p-4">
      <Head>
        <title>My CV Bot - Private Space</title>
        <meta name="description" content="Interactive CV explained by a chatbot." />
      </Head>

      <Avatar imageUrl="/my-avatar.webp" name="Francisco Arantes" size={100} className="mb-4 self-center" />
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-200">This is not a CV.</h1>
      <div className="flex-1 w-full max-w-xl self-center h-3/5">
        <ChatBot />
      </div>
    </div>
  );
}
