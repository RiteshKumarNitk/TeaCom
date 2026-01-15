-- 1. Create a helper function to check admin status safely
-- This function uses "SECURITY DEFINER" to bypass RLS during the check, breaking recursion.
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop old recursive policies
DROP POLICY IF EXISTS "Users can read own role" ON admin_roles;
DROP POLICY IF EXISTS "Super Admins can read all roles" ON admin_roles;
DROP POLICY IF EXISTS "Super Admins can manage all roles" ON admin_roles;

-- 3. Create fresh, non-recursive policies
CREATE POLICY "Users can read own role"
ON admin_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Super Admins can manage all roles"
ON admin_roles FOR ALL
USING (is_super_admin());

-- 4. Fix for admin_accounts table (Decoupled Auth)
-- Since we manage sessions ourselves via JWT, we need to allow the server actions to interact with this table.
-- Code-level guards (requireAdmin) already protect these actions.
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view accounts" ON admin_accounts;
DROP POLICY IF EXISTS "Admin management policy" ON admin_accounts;

CREATE POLICY "Admin management policy" 
ON admin_accounts FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);
