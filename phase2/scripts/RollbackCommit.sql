-- Start a transaction
BEGIN;

-- Update a member's status to 'Inactive'
-- You can change the ID according to your data
UPDATE members
SET status = 'Inactive'
WHERE memberID = 1;

-- Show the result after the update (for screenshot)
SELECT memberID, name, status
FROM members
WHERE memberID = 1;

-- Rollback the transaction
ROLLBACK;

-- Verify that the original state was restored (for screenshot)
SELECT memberID, name, status
FROM members
WHERE memberID = 1;



-- Start another transaction
BEGIN;

-- Update the same member again
UPDATE members
SET status = 'Inactive'
WHERE memberID = 1;

-- Show the updated result (for screenshot)
SELECT memberID, name, status
FROM members
WHERE memberID = 1;

-- Commit the transaction
COMMIT;

-- Verify that the change was saved (for screenshot)
SELECT memberID, name, status
FROM members
WHERE memberID = 1;
