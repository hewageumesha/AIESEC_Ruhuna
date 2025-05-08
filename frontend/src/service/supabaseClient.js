import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://brxpilwosdsnlvmorixi.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeHBpbHdvc2Rzbmx2bW9yaXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjQ4MTYsImV4cCI6MjA2MjMwMDgxNn0.OJ2kfHRJGF05bBsb-MT6jGbjfN3lcFNToFVCF8gnU_w'; 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
