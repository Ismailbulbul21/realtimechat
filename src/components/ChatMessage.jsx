import React from 'react';
import { useAuth } from '../AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isCurrentUser = user && message.user_id === user.id;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 w-full`}>
      <div
        className={`py-2 px-3 sm:px-4 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg break-words w-auto ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
        style={{ wordWrap: 'break-word', maxWidth: '80%' }}
      >
        {!isCurrentUser && (
          <div className="font-bold text-xs sm:text-sm text-gray-600 mb-1">
            {message.username || 'Unknown User'}
          </div>
        )}
        <div className="text-sm sm:text-base">{message.content}</div>
        <div className="text-xs mt-1 opacity-70 text-right">
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