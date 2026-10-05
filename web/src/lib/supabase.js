import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqxftmbuosckaqpmetcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeGZ0bWJ1b3Nja2FxcG1ldGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTAwMzAsImV4cCI6MjA4NzY4NjAzMH0.LV2mhCzzTO1O4CA7wrUcRr7VURiKWbNalF-Hux5Dq08';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
