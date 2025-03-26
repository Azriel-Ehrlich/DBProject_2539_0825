-- Insert data into the memberships table
INSERT INTO memberships (type, price, duration, isActive) VALUES
('Basic', 50.00, 30, TRUE),
('Premium', 100.00, 90, TRUE),
('Annual', 300.00, 365, TRUE);

-- Insert data into the members table
INSERT INTO members (name, birth_date, email, phone, membershipType, join_date) VALUES
('John Doe', '1990-05-15', 'john.doe@example.com', '123-456-7890', 1, '2024-01-10'),
('Jane Smith', '1985-08-22', 'jane.smith@example.com', '987-654-3210', 2, '2024-02-05'),
('Michael Johnson', '1993-11-30', 'michael.johnson@example.com', '555-123-4567', 3, '2024-03-01');

-- Insert data into the instructors table
INSERT INTO instructors (name, expertise, phone, hourlyRate, schedule) VALUES
('Alice Brown', 'Yoga', '123-456-7890', 40.00, 'Mon-Wed-Fri: 9:00-11:00'),
('Bob Green', 'Pilates', '987-654-3210', 45.00, 'Tue-Thu: 14:00-16:00'),
('Charlie Black', 'Zumba', '555-123-4567', 35.00, 'Mon-Wed-Fri: 17:00-19:00');

-- Insert data into the classes table
INSERT INTO classes (className, classTime, instructorID) VALUES
('Morning Yoga', '09:00:00', 1),
('Pilates Core', '14:00:00', 2),
('Evening Zumba', '17:00:00', 3);

-- Insert data into the attendance table
INSERT INTO attendance (memberID, date, checkin, checkout) VALUES
(1, '2024-03-10', '09:05:00', '10:00:00'),
(2, '2024-03-11', '14:10:00', '15:00:00'),
(3, '2024-03-12', '17:00:00', '18:00:00');

-- Insert data into the payments table
INSERT INTO payments (memberID, amount, paymentDate) VALUES
(1, 50.00, '2024-02-10'),
(2, 100.00, '2024-02-15'),
(3, 300.00, '2024-03-01');

-- Insert data into the class_membership table
INSERT INTO class_membership (memberID, classID) VALUES
(1, 1),
(2, 2),
(3, 3);