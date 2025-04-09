import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Sending message with user ID:', user.id);
      
      // First verify if the profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error checking profile:', profileError);
        setError('Profile not found. Try refreshing the page.');
        return;
      }
      
      console.log('Profile found:', profile);
      
      // Now send the message
      const { error } = await supabase.from('messages').insert({
        content: message.trim(),
        user_id: user.id
      });
      
      if (error) {
        console.error('Error details:', error);
        setError(`Failed to send message: ${error.message}`);
        return;
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 px-4 py-3">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">
          {error}
        </div>
      )}
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading || !user}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading || !user}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-r-lg transition-colors duration-200 ${
            !message.trim() || isLoading || !user ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 