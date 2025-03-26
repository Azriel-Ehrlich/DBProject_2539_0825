-- Retrieve all instructors
SELECT * FROM instructors;

-- Retrieve all memberships
SELECT * FROM memberships;

-- Retrieve all members and their membership information
SELECT members.*, memberships.type AS membership_type
FROM members
JOIN memberships ON members.membershipType = memberships.membershipID;

-- Retrieve all classes and their instructor information
SELECT classes.*, instructors.name AS instructor_name
FROM classes
JOIN instructors ON classes.instructorID = instructors.instructorID;

-- Retrieve all class memberships with member and class information
SELECT class_membership.*, members.name AS member_name, classes.className AS class_name
FROM class_membership
JOIN members ON class_membership.memberID = members.memberID
JOIN classes ON class_membership.classID = classes.classID;

-- Retrieve attendance of members
SELECT attendance.*, members.name AS member_name
FROM attendance
JOIN members ON attendance.memberID = members.memberID;

-- Retrieve all payments
SELECT payments.*, members.name AS member_name
FROM payments
JOIN members ON payments.memberID = members.memberID;