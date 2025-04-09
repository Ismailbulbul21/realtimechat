import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkGuestUser = async () => {
      try {
        // Check for existing user in localStorage
        let storedUser = localStorage.getItem('guestUser');
        let userData;
        
        if (storedUser) {
          // Use existing user
          userData = JSON.parse(storedUser);
          console.log("Using existing user from localStorage:", userData);
        } else {
          // Create new user with a valid UUID
          const guestId = uuidv4();
          const guestName = `Guest-${guestId.substring(0, 4)}`;
          
          userData = {
            id: guestId,
            username: guestName,
            isGuest: true
          };
          
          console.log("Created new user:", userData);
          
          // Store in localStorage
          localStorage.setItem('guestUser', JSON.stringify(userData));
        }

        // Check if profile exists in database
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.id)
          .single();
          
        if (!existingProfile) {
          console.log("Profile doesn't exist, creating one...");
          // Create profile in database
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userData.id,
              username: userData.username,
              created_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            // If there's an error creating the profile, let's create a new user
            if (profileError.code === '23505') { // Unique violation
              console.log("Unique violation detected, creating new user");
              const newGuestId = uuidv4();
              const newGuestName = `Guest-${newGuestId.substring(0, 4)}`;
              
              userData = {
                id: newGuestId,
                username: newGuestName,
                isGuest: true
              };
              
              localStorage.setItem('guestUser', JSON.stringify(userData));
              
              // Try to create profile again
              const { error: newProfileError } = await supabase
                .from('profiles')
                .insert({
                  id: userData.id,
                  username: userData.username,
                  created_at: new Date().toISOString()
                });
                
              if (newProfileError) {
                console.error('Still error creating profile:', newProfileError);
              }
            }
          }
        } else {
          console.log("Profile exists:", existingProfile);
        }
        
        setUser(userData);
      } catch (err) {
        console.error('Error in guest user setup:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkGuestUser();
  }, []);

  const value = {
    user,
    loading,
    // Add function to change username if needed
    updateUsername: async (newUsername) => {
      if (!user) return;
      
      try {
        // Update in database
        const { error } = await supabase
          .from('profiles')
          .update({ username: newUsername })
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update local state and storage
        const updatedUser = { ...user, username: newUsername };
        setUser(updatedUser);
        localStorage.setItem('guestUser', JSON.stringify(updatedUser));
        
        return { success: true };
      } catch (err) {
        console.error('Failed to update username:', err);
        return { success: false, error: err.message };
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}