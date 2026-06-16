const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vqxyygxyebtencjvvxba.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeHl5Z3h5ZWJ0ZW5janZ2eGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzQyOTYsImV4cCI6MjA5Njc1MDI5Nn0.uqEXWaGb3QAg1WzZZOGny8Ds5JvpzfBQZdy232p2-AQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'projects' });
  if (error) {
    // If RPC doesn't exist, try querying a dummy record or using raw postgres if we can, 
    // or just try to insert a test record and see if it fails or succeeds.
    console.log('RPC error, trying insert-rollback method...');
    const testId = '00000000-0000-0000-0000-000000000000';
    const { error: insertErr } = await supabase.from('projects').insert([{
      id: testId,
      name: 'Test Schema',
      category: 'Design',
      image_url: 'http://test.com',
      client: 'Test Client',
      project_date: 'June 2026',
      tags: 'Test, Tags',
      mini_title: 'Test Mini Title',
      sub_description: 'Test Sub Description',
      gallery_images: 'http://test.com',
      features: 'Feature 1'
    }]);

    if (insertErr) {
      console.error('Insert test failed:', insertErr.message || insertErr);
    } else {
      console.log('Successfully inserted test record! All columns exist!');
      // Clean it up
      await supabase.from('projects').delete().eq('id', testId);
      console.log('Cleaned up test record.');
    }
  } else {
    console.log('Columns from RPC:', data);
  }
}

run();
