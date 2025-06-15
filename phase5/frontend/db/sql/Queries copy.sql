-- 1. List all members with their membership type, including price and duration
SELECT m.memberID, m.name, m.email, m.phone, ms.type AS membership_type, ms.price, ms.duration
FROM members m
LEFT JOIN memberships ms ON m.membershipType = ms.membershipID;

-- 2. Total revenue from payments per month and year
SELECT EXTRACT(YEAR FROM paymentDate) AS year, EXTRACT(MONTH FROM paymentDate) AS month, SUM(amount) AS total_income
FROM payments
GROUP BY year, month
ORDER BY year DESC, month DESC;

-- 3. Number of check-ins per member per month and year
SELECT m.memberID, m.name, EXTRACT(YEAR FROM a.date) AS year, EXTRACT(MONTH FROM a.date) AS month, COUNT(a.attendanceID) AS visits
FROM members m
JOIN attendance a ON m.memberID = a.memberID
GROUP BY m.memberID, m.name, year, month
ORDER BY year DESC, month DESC;

-- 4. List of instructors including the number of classes they conduct
SELECT i.instructorID, i.name, COUNT(c.classID) AS class_count
FROM instructors i
LEFT JOIN classes c ON i.instructorID = c.instructorID
GROUP BY i.instructorID, i.name
ORDER BY class_count DESC;

-- 5. List of classes with participant count (only if at least 3 participants)
SELECT c.classID, c.className, COUNT(cm.memberID) AS participant_count
FROM classes c
JOIN class_membership cm ON c.classID = cm.classID
GROUP BY c.classID, c.className
HAVING COUNT(cm.memberID) >= 3
ORDER BY participant_count DESC;

-- 6. Members who have not visited the gym in the last month
SELECT m.memberID, m.name, m.email, MAX(a.date) AS last_visit
FROM members m
LEFT JOIN attendance a ON m.memberID = a.memberID
GROUP BY m.memberID, m.name, m.email
HAVING MAX(a.date) < CURRENT_DATE - INTERVAL '1 month' OR MAX(a.date) IS NULL;

-- 7. Find all members with more than one payment in the same month
SELECT m.memberID, m.name, EXTRACT(YEAR FROM p.paymentDate) AS year, EXTRACT(MONTH FROM p.paymentDate) AS month, COUNT(p.paymentID) AS payment_count
FROM payments p
JOIN members m ON p.memberID = m.memberID
GROUP BY m.memberID, m.name, year, month
HAVING COUNT(p.paymentID) > 1;

-- 8. List of payments with member details and membership type, sorted by date
SELECT p.paymentID, m.name, ms.type AS membership_type, p.amount, p.paymentDate
FROM payments p
JOIN members m ON p.memberID = m.memberID
LEFT JOIN memberships ms ON m.membershipType = ms.membershipID
ORDER BY p.paymentDate DESC;


------------------- Delete Section ----------------------------------------------------

-- 1. Delete all members who have not attended the gym in the last 3 years
DELETE FROM members
WHERE memberID IN (
    SELECT m.memberID FROM members m
    LEFT JOIN attendance a ON m.memberID = a.memberID
    GROUP BY m.memberID
    HAVING MAX(a.date) < CURRENT_DATE - INTERVAL '1 year'*3 OR MAX(a.date) IS NULL
);

-- 2. Delete all payments older than 5 years
DELETE FROM payments
WHERE paymentDate < CURRENT_DATE - INTERVAL '5 years';

-- 3. Delete all classes that have no registered participants
DELETE FROM classes
WHERE classID NOT IN (SELECT DISTINCT classID FROM class_membership);

------------------- Updates Section  ----------------------------------------------------

-- 1. Update membership prices by increasing them by 10%
UPDATE memberships
SET price = price * 1.10;

-- 2. Update expired memberships to 'Inactive' status
UPDATE members
SET status = 'InActive'
WHERE memberID IN (
    SELECT m.memberID FROM members m
    JOIN memberships ms ON m.membershipType = ms.membershipID
    WHERE CURRENT_DATE > (m.join_date + ms.duration/365)
);

-- 3. Update phone numbers format to include country code '+972'
-- Add country code +972 to numbers that do not start with '+' or '('
UPDATE members
SET phone = CONCAT('+972', REGEXP_REPLACE(phone, '^0+', ''))
WHERE phone NOT LIKE '+%' AND phone NOT LIKE '(%';
