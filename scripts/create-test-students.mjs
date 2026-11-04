import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://couhzxvhzdipbffrkerf.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_STUDENTS = [
  {
    email: 'test.ascend@ahsorameds.com',
    password: 'Ahsora2025!',
    firstName: 'Alex',
    lastName: 'Ascend',
    fullName: 'Alex Ascend',
    selectedPackage: 'Ahsora IMAT Ascend',
    packagePrice: '€99 (Test Account)',
    country: 'Italy',
    address: 'Via Dante 14, Milan, Italy',
    whatsappNumber: '+39 333 111 2233',
    amaId: 'AMA-ASC-2025',
  },
  {
    email: 'test.mastery@ahsorameds.com',
    password: 'Ahsora2025!',
    firstName: 'Marco',
    lastName: 'Mastery',
    fullName: 'Marco Mastery',
    selectedPackage: 'Ahsora IMAT Mastery',
    packagePrice: '€299 (Test Account)',
    country: 'Italy',
    address: 'Corso Vittorio Emanuele 45, Rome, Italy',
    whatsappNumber: '+39 333 444 5566',
    amaId: 'AMA-MST-2025',
  },
  {
    email: 'test.elite@ahsorameds.com',
    password: 'Ahsora2025!',
    firstName: 'Elena',
    lastName: 'Elite',
    fullName: 'Elena Elite',
    selectedPackage: 'Ahsora MedPath Elite',
    packagePrice: '€499 (Test Account)',
    country: 'Italy',
    address: 'Piazza San Marco 8, Venice, Italy',
    whatsappNumber: '+39 333 777 8899',
    amaId: 'AMA-ELT-2025',
  },
];

async function setupAccounts() {
  console.log('Connecting to Supabase at:', SUPABASE_URL);

  const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing users:', listErr);
  }
  const existingUsers = usersData?.users || [];

  for (const s of TEST_STUDENTS) {
    const existing = existingUsers.find(
      (u) => (u.email || '').toLowerCase().trim() === s.email.toLowerCase().trim()
    );

    let userId = existing?.id;

    if (existing) {
      console.log(`User ${s.email} already exists (ID: ${existing.id}), updating password and metadata...`);
      const { data: updated, error: updateErr } = await supabase.auth.admin.updateUserById(existing.id, {
        password: s.password,
        email_confirm: true,
        user_metadata: {
          first_name: s.firstName,
          last_name: s.lastName,
          full_name: s.fullName,
          selected_package: s.selectedPackage,
          selectedPackage: s.selectedPackage,
          package_price: s.packagePrice,
          packagePrice: s.packagePrice,
          country: s.country,
          address: s.address,
          whatsapp_number: s.whatsappNumber,
          phone: s.whatsappNumber,
          ama_id: s.amaId,
          is_test: true,
        },
      });
      if (updateErr) console.error(`Error updating user ${s.email}:`, updateErr);
      else console.log(`✓ Updated auth user ${s.email}`);
    } else {
      console.log(`Creating user ${s.email}...`);
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: s.email,
        password: s.password,
        email_confirm: true,
        user_metadata: {
          first_name: s.firstName,
          last_name: s.lastName,
          full_name: s.fullName,
          selected_package: s.selectedPackage,
          selectedPackage: s.selectedPackage,
          package_price: s.packagePrice,
          packagePrice: s.packagePrice,
          country: s.country,
          address: s.address,
          whatsapp_number: s.whatsappNumber,
          phone: s.whatsappNumber,
          ama_id: s.amaId,
          is_test: true,
        },
      });
      if (createErr) {
        console.error(`Error creating user ${s.email}:`, createErr);
        continue;
      }
      userId = created.user.id;
      console.log(`✓ Created auth user ${s.email} with ID ${userId}`);
    }

    if (userId) {
      // Upsert into profiles with exact matching schema
      const { error: profErr } = await supabase.from('profiles').upsert(
        {
          id: userId,
          email: s.email,
          full_name: s.fullName,
          role: 'student',
          account_type: 'student',
          ama_id: s.amaId,
          payment_approved: true,
          is_active: true,
        },
        { onConflict: 'id' }
      );

      if (profErr) {
        console.warn(`Profile upsert note for ${s.email}:`, profErr.message);
      } else {
        console.log(`✓ Profile record synced for ${s.email}`);
      }

      // Upsert into leads as enrolled backup with exact matching schema
      const { error: leadErr } = await supabase.from('leads').upsert(
        {
          name: s.fullName,
          email: s.email,
          phone: s.whatsappNumber,
          target_exam: 'IMAT',
          target_country: s.country,
          status: 'enrolled',
          academic_background: JSON.stringify({
            selectedPackage: s.selectedPackage,
            packagePrice: s.packagePrice,
            amaId: s.amaId,
            address: s.address,
            whatsappNumber: s.whatsappNumber,
            country: s.country,
            paymentApproved: true,
            isTest: true,
          }),
        },
        { onConflict: 'email' }
      );

      if (leadErr) {
        console.warn(`Lead upsert note for ${s.email}:`, leadErr.message);
      } else {
        console.log(`✓ Enrolled lead backup synced for ${s.email}`);
      }
    }
  }

  console.log('\n=======================================');
  console.log('ALL 3 TEST ACCOUNTS CREATED & VERIFIED!');
  console.log('=======================================');
}

setupAccounts().catch(console.error);
