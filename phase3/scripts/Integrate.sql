-- Step 1: Create a new shared table 'employees' for common fields of instructors and cashiers
CREATE TABLE employees (
    employeeid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    hourlyrate NUMERIC(10,2)
);

-- Step 2: Add a foreign key reference to 'employees' in both 'instructors' and 'cashier' tables
ALTER TABLE instructors ADD COLUMN employeeid INT;
ALTER TABLE cashier ADD COLUMN employeeid INT;

-- Step 3: Insert current instructor data into 'employees'
INSERT INTO employees (name, phone, hourlyrate)
SELECT name, phone, hourlyrate FROM instructors;

-- Step 4: Update instructor records with the matching employeeid from the new table
UPDATE instructors i
SET employeeid = e.employeeid
FROM employees e
WHERE i.name = e.name
  AND i.phone = e.phone
  AND i.hourlyrate = e.hourlyrate;

-- Step 5: Remove duplicated columns from 'instructors' (name, phone, hourlyrate)
ALTER TABLE instructors
DROP COLUMN name,
DROP COLUMN phone,
DROP COLUMN hourlyrate;

-- Step 6: Add foreign key constraint from 'instructors' to 'employees'
ALTER TABLE instructors
ADD CONSTRAINT fk_instructor_employee
FOREIGN KEY (employeeid) REFERENCES employees(employeeid);

-- Step 7: Add foreign key constraint from 'cashier' to 'employees'
ALTER TABLE cashier
ADD CONSTRAINT fk_cashier_employee
FOREIGN KEY (employeeid) REFERENCES employees(employeeid);

-- Step 8: Update 'classes' table to reference 'employees' instead of 'instructors'
ALTER TABLE classes ADD COLUMN employeeid INTEGER;

-- Copy the current instructorid into the new employeeid column
UPDATE classes
SET employeeid = instructorid;

-- Remove the old foreign key constraint on instructorid
ALTER TABLE classes
DROP CONSTRAINT classes_instructorid_fkey;

-- Drop the instructorid column (now redundant)
ALTER TABLE classes
DROP COLUMN instructorid;

-- Add a new foreign key constraint to reference employees instead
ALTER TABLE classes
ADD CONSTRAINT classes_employeeid_fkey
FOREIGN KEY (employeeid)
REFERENCES employees(employeeid);

-- Step 9: Update 'orders' table to reference 'employees' instead of 'cashier'

-- Drop the existing foreign key constraint
ALTER TABLE orders DROP CONSTRAINT orders_cashierid_fkey;

-- Re-assign the foreign key to point to 'employees'
ALTER TABLE orders
ADD CONSTRAINT orders_employeeid_fkey
FOREIGN KEY (cashierid)
REFERENCES employees(employeeid);

-- Step 10: Replace primary key in 'cashier' table to use employeeid

-- Drop the old primary key constraint if exists
ALTER TABLE cashier DROP CONSTRAINT IF EXISTS cashiers_pkey;

-- Drop the old cashierid column
ALTER TABLE cashier DROP COLUMN IF EXISTS cashierid;

-- Set employeeid as the new primary key
ALTER TABLE cashier
ADD CONSTRAINT cashiers_pkey PRIMARY KEY (employeeid);

-- Step 11: Drop the old primary key columns from 'instructors' and 'cashier'

-- Drop 'instructorid' from 'instructors' (now replaced by employeeid)
ALTER TABLE instructors DROP COLUMN instructorid;

-- Drop 'cashierid' from 'cashier' (now replaced by employeeid)
ALTER TABLE cashier DROP COLUMN cashierid;
