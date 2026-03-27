
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  plan = (SELECT p.plan FROM profiles p WHERE p.id = auth.uid()) AND
  credits_remaining = (SELECT p.credits_remaining FROM profiles p WHERE p.id = auth.uid())
);
