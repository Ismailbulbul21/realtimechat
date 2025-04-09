import React from 'react';
import { useAuth } from '../AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isCurrentUser = user && message.user_id === user.id;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`py-2 px-4 rounded-lg max-w-xs md:max-w-md lg:max-w-lg break-words ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {!isCurrentUser && (
          <div className="font-bold text-sm text-gray-600 mb-1">
            {message.username || 'Unknown User'}
          </div>
        )}
        <div>{message.content}</div>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 