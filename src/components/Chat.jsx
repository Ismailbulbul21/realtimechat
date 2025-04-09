import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAuth } from '../AuthContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('Fetching messages...');
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (username)
          `)
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }

        console.log('Messages fetched:', data);

        // Format messages with username from join
        const formattedMessages = data.map(message => ({
          ...message,
          username: message.profiles?.username || 'Unknown User'
        }));
        
        setMessages(formattedMessages);
        setError(null);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch messages if we have a user
    if (user) {
      fetchMessages();
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscription...');
    const channel = supabase.channel('public:messages');
    
    const subscription = channel
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, async (payload) => {
        try {
          console.log('New message received:', payload);
          // Fetch the username for the new message
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          const newMessage = {
            ...payload.new,
            username: profileData?.username || 'Unknown User'
          };
          
          console.log('Formatted new message:', newMessage);
          setMessages(prev => [...prev, newMessage]);
        } catch (error) {
          console.error('Error processing new message:', error);
        }
      })
      .subscribe();

    return () => {
      console.log('Unsubscribing from channel');
      channel.unsubscribe();
    };
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <div className="flex flex-col h-screen w-full max-w-full">
        <div className="bg-blue-500 text-white py-4 px-4 shadow-md">
          <h1 className="text-xl font-bold">Realtime Chat</h1>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-full">
      <div className="bg-blue-500 text-white py-3 px-4 shadow-md">
        <h1 className="text-xl font-bold">Realtime Chat</h1>
        <p className="text-sm opacity-80">Logged in as: {user.username || 'Guest'}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Be the first to send one!
          </div>
        ) : (
          <div className="w-full max-w-full">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
};

export default Chat; 