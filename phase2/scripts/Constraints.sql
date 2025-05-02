-- 1. Ensure that the email field in the members table is unique
ALTER TABLE members
ADD CONSTRAINT unique_email UNIQUE (email);

-- 2. Add a check constraint to ensure that membership prices are always positive
ALTER TABLE memberships
ADD CONSTRAINT check_price_positive CHECK (price > 0);

-- 3. Ensure that all the members are 18+ yo
ALTER TABLE members
ADD CONSTRAINT check_member_age
CHECK (birth_date <= CURRENT_DATE - INTERVAL '18 years');