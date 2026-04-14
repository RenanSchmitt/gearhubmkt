import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grlqcupnecjrkusjxzxh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdybHFjdXBuZWNqcmt1c2p4enhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTQ1MzgsImV4cCI6MjA5MTc3MDUzOH0.qo9hwgvVomV1KD6BPFaVirE18iI5YVHrvSs0Y0xLTn8'

export const supabase = createClient(supabaseUrl, supabaseKey);