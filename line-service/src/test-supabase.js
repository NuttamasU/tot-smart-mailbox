
const supabase = require('./config/supabase');

async function testConnection() {
  console.log('Testing Supabase connection...');

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Supabase connection failed!');
    console.error(error.message);
    return;
  }

  console.log('Supabase connected successfully!');
  console.log('Retrieved rows:', data.length);
}

testConnection();
