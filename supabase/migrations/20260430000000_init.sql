-- Users are handled by Supabase Auth (auth.users)

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  partner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Date Ideas table
CREATE TABLE date_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Capsules table
CREATE TABLE time_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  unlock_date TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo Archives table
CREATE TABLE photo_archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  drive_link TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationship details (for the counter)
CREATE TABLE relationship_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup basic RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_details ENABLE ROW LEVEL SECURITY;

-- Allow read/write to all authenticated users for this simple couple app
CREATE POLICY "Allow all authenticated users full access to profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users full access to date_ideas" ON date_ideas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users full access to time_capsules" ON time_capsules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users full access to photo_archives" ON photo_archives FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all authenticated users full access to relationship_details" ON relationship_details FOR ALL USING (auth.role() = 'authenticated');
