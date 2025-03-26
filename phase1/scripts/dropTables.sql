-- Drop the class_membership table first because it depends on members and classes tables
DROP TABLE IF EXISTS class_membership;

-- Drop the attendance table next because it depends on the members table
DROP TABLE IF EXISTS attendance;

-- Drop the payments table next because it depends on the members table
DROP TABLE IF EXISTS payments;

-- Drop the classes table next because it depends on the instructors table
DROP TABLE IF EXISTS classes;

-- Drop the instructors table next because it is independent after classes are dropped
DROP TABLE IF EXISTS instructors;

-- Drop the members table next because it depends on the memberships table
DROP TABLE IF EXISTS members;

-- Drop the memberships table last because it is independent after members are dropped
DROP TABLE IF EXISTS memberships;