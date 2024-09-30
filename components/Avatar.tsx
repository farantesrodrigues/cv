import React from 'react';

interface AvatarProps {
  imageUrl?: string; // URL for the avatar image
  name?: string; // Name of the user to generate initials
  size?: number; // Size of the avatar in pixels
  className?: string; // Additional classes for customization
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 50,
  className,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <div
      className={`rounded-full bg-gray-200 flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size / 2.5,
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!imageUrl && initials && (
        <span className="text-white bg-blue-600 rounded-full w-full h-full flex items-center justify-center">
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;
