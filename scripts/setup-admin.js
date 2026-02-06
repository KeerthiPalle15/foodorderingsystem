// Complete setup script to create an admin user
// Run: node scripts/setup-admin.js <email> <password>
// Example: node scripts/setup-admin.js admin@example.com Admin123!

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  console.log('Get these from Supabase Dashboard → Settings → API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser(email, password) {
  try {
    console.log(`Creating admin user: ${email}`);

    // Step 1: Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      process.exit(1);
    }

    let user = existingUsers.users.find(u => u.email === email);

    // Step 2: Create user if doesn't exist
    if (!user) {
      console.log('User not found, creating new user...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });

      if (createError) {
        console.error('Error creating user:', createError);
        process.exit(1);
      }
      
      user = newUser.user;
      console.log('✓ User created successfully');
    } else {
      console.log('✓ User already exists');
    }

    // Step 3: Create or update profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: email,
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error updating profile:', profileError);
      process.exit(1);
    }

    console.log('✓ Profile updated with admin role');
    console.log('\n========================================');
    console.log('✓ Admin user setup complete!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('========================================\n');
    console.log('You can now log in at http://localhost:3000/login');
    console.log('After login, you will be redirected to /admin');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get email and password from command line
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node scripts/setup-admin.js <email> <password>');
  console.log('Example: node scripts/setup-admin.js admin@example.com Admin123!');
  console.log('\nNote: Password must be at least 6 characters');
  process.exit(1);
}

if (password.length < 6) {
  console.error('Error: Password must be at least 6 characters');
  process.exit(1);
}

createAdminUser(email, password);
