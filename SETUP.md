# SchoolManager Setup Guide

## Authentication Setup

This project includes a complete authentication system with role-based access control.

### Users Created:
1. **EREG** (Administrator)
   - Email: `ereg@school.com`
   - Password: `password123` 
   - Access: Full system access (all modules)

2. **SUNDUS** (Attendance Staff)
   - Email: `sundus@school.com`
   - Password: `password123`
   - Access: Dashboard and Attendance only

### Supabase Configuration Required:

1. Create these users in Supabase Auth:
   ```sql
   -- Create EREG user (Admin)
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     recovery_sent_at,
     last_sign_in_at,
     raw_app_meta_data,
     raw_user_meta_data,
     created_at,
     updated_at,
     confirmation_token,
     email_change,
     email_change_token_new,
     recovery_token
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'ereg@school.com',
     crypt('password123', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW(),
     '{"provider":"email","providers":["email"]}',
     '{"role":"admin","full_name":"EREG"}',
     NOW(),
     NOW(),
     '',
     '',
     '',
     ''
   );

   -- Create SUNDUS user (Attendance)
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     recovery_sent_at,
     last_sign_in_at,
     raw_app_meta_data,
     raw_user_meta_data,
     created_at,
     updated_at,
     confirmation_token,
     email_change,
     email_change_token_new,
     recovery_token
   ) VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'sundus@school.com',
     crypt('password123', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW(),
     '{"provider":"email","providers":["email"]}',
     '{"role":"attendance","full_name":"SUNDUS"}',
     NOW(),
     NOW(),
     '',
     '',
     '',
     ''
   );
   ```

2. Create user profiles table (optional):
   ```sql
   CREATE TABLE user_profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('admin', 'attendance')),
     full_name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

   -- Policies
   CREATE POLICY "Users can view own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON user_profiles
     FOR UPDATE USING (auth.uid() = id);
   ```

3. Set environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Features:
- ✅ Role-based sidebar navigation
- ✅ Beautiful login page with demo credentials
- ✅ Automatic user role detection
- ✅ Protected routes based on user permissions
- ✅ Modern gradient design system
- ✅ Responsive layout with elegant animations
- ✅ Toast notifications for user feedback

### Login Credentials:
- **Admin:** ereg@school.com / password123
- **Attendance:** sundus@school.com / password123

### Design Features:
- Modern gradient-based color scheme
- Smooth animations and transitions
- Role-based UI indicators
- Beautiful glass-morphism effects
- Responsive design for all devices