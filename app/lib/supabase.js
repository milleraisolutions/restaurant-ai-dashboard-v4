import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gfghllmmsrvcofitexpj.supabase.co";

  const supabaseAnonKey = 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZ2hsbG1tc3J2Y29maXRleHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTM1MzAsImV4cCI6MjA4OTE2OTUzMH0.OsRaZLCxc9qoA_wJKmBWns4J4F30PwvflhOsjB0U3Vk"

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);

;