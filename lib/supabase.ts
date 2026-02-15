
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yljxxongdnizpiahvmci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsanh4b25nZG5penBpYWh2bWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMzQ5ODEsImV4cCI6MjA4NjcxMDk4MX0.zH1wFSn2qTgeylLeg_woOM15JcxLs4lzwNwdbVHg0KI';

export const supabase = createClient(supabaseUrl, supabaseKey);
