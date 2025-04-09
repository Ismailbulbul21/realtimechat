import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message, isCurrentUser }) => {
  // Format the timestamp to a relative time string (e.g., "5 minutes ago")
  const formattedTime = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Message content */}
        <div 
          className={`mx-2 p-3 rounded-lg ${
            isCurrentUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {/* Username and time */}
          <div className="flex items-baseline mb-1">
            <span className={`font-medium text-sm ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
              {isCurrentUser ? 'You' : 'Guest User'}
            </span>
            <span className={`ml-2 text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
              {formattedTime}
            </span>
          </div>
          
          {/* Message text */}
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 