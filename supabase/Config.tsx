import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase =
createClient(
    'https://rmyfxsjemuzuucwuilnp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteWZ4c2plbXV6dXVjd3VpbG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTg3ODcsImV4cCI6MjA2NzA3NDc4N30.KNpsDzawGDnLMLZ1yiFwQvqm0zISRDegrzQgUJ8O9b8')