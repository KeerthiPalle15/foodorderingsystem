// Setup script to create all database users with password "12345678"
// Run: node scripts/setup-users.js
// Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  console.log('Get these from Supabase Dashboard → Settings → API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PASSWORD = '12345678';

const users = [
  { email: 'admin@foodiehub.com', name: 'Admin User', role: 'admin', id: 'a0000000-0000-0000-0000-000000000001' },
  { email: 'driver@foodiehub.com', name: 'Delivery Driver', role: 'driver', id: 'a0000000-0000-0000-0000-000000000002' },
  { email: 'john.doe@example.com', name: 'John Doe', role: 'customer', id: 'a0000000-0000-0000-0000-000000000003' },
  { email: 'jane.smith@example.com', name: 'Jane Smith', role: 'customer', id: 'a0000000-0000-0000-0000-000000000004' },
  { email: 'mike.wilson@example.com', name: 'Mike Wilson', role: 'customer', id: 'a0000000-0000-0000-0000-000000000005' },
  { email: 'sarah.johnson@example.com', name: 'Sarah Johnson', role: 'customer', id: 'a0000000-0000-0000-0000-000000000006' },
];

async function setupAllUsers() {
  console.log('🚀 Starting user setup...\n');

  for (const user of users) {
    try {
      console.log(`Processing: ${user.email} (${user.role})`);

      // Check if user already exists in auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === user.email);

      let userId;

      if (existingUser) {
        console.log(`  ✓ User already exists`);
        userId = existingUser.id;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: PASSWORD,
          email_confirm: true,
          user_metadata: {
            full_name: user.name
          }
        });

        if (createError) {
          console.error(`  ✗ Error creating user: ${createError.message}`);
          continue;
        }

        userId = newUser.user.id;
        console.log(`  ✓ User created with auth ID: ${userId}`);
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: user.email,
          full_name: user.name,
          role: user.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error(`  ✗ Error updating profile: ${profileError.message}`);
        continue;
      }

      console.log(`  ✓ Profile updated with ${user.role} role\n`);

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}\n`);
    }
  }

  console.log('========================================');
  console.log('✅ All users setup complete!');
  console.log('========================================');
  console.log(`\n📧 All users have password: ${PASSWORD}`);
  console.log('\nUsers created:');
  users.forEach(u => console.log(`  - ${u.email} (${u.role})`));
  console.log('\n💡 Admin users will be redirected to /admin dashboard');
  console.log('💡 Regular users will see the regular store\n');
}

setupAllUsers().catch(console.error);
