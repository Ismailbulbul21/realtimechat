import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dryujwitnkjeevekwkjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeXVqd2l0bmtqZWV2ZWt3a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDE3NzYsImV4cCI6MjA1OTc3Nzc3Nn0.Rk7P7pnVM5cYX9UayXPHD6vAk-8_xfxJ9l5RoHO7GSs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 