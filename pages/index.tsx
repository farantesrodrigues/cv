import Head from 'next/head';
import CustomChatBot from '../components/ChatBot';
import Avatar from '../components/Avatar';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-800 p-4">
      <Head>
        <title>My CV Bot</title>
        <meta
          name="description"
          content="Interactive CV explained by a chatbot"
        />
      </Head>

      {/* Avatar Component */}
      <Avatar
        imageUrl="/my-avatar.webp"
        name="Francisco Arantes"
        size={100}
        className="mb-4 self-center"
      />

      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-200 self-center">
        This is not a cv.
      </h1>

      {/* ChatBot Component with a fixed height */}
      <div className="flex-1 w-full max-w-xl self-center h-3/5">
        <CustomChatBot />
      </div>
    </div>
  );
}
