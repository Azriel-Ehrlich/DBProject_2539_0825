-- Table to store membership types and their details
        CREATE TABLE memberships (
            membershipID SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            duration INT NOT NULL, -- duration in days
            isActive BOOLEAN NOT NULL DEFAULT TRUE
        );

        -- Table to store member details
        CREATE TABLE members (
            memberID SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            birth_date DATE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(15) UNIQUE NOT NULL,
            membershipType INT,
            join_date DATE NOT NULL,
            FOREIGN KEY (membershipType) REFERENCES memberships(membershipID) ON DELETE SET NULL
        );

        -- Table to store instructor details
        CREATE TABLE instructors (
            instructorID SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            expertise VARCHAR(255),
            phone VARCHAR(15),
            hourlyRate NUMERIC(10,2),
            schedule TEXT
        );

        -- Table to store class details
        CREATE TABLE classes (
            classID SERIAL PRIMARY KEY,
            className VARCHAR(100) NOT NULL,
            classTime TIME NOT NULL,
            instructorID INT,
            FOREIGN KEY (instructorID) REFERENCES instructors(instructorID) ON DELETE SET NULL
        );

        -- Table to store attendance records
        CREATE TABLE attendance (
            attendanceID SERIAL PRIMARY KEY,
            memberID INT NOT NULL,
            date DATE NOT NULL,
            checkin TIME NOT NULL,
            checkout TIME,
            FOREIGN KEY (memberID) REFERENCES members(memberID) ON DELETE CASCADE
        );

        -- Table to store payment records
        CREATE TABLE payments (
            paymentID SERIAL PRIMARY KEY,
            memberID INT NOT NULL,
            amount NUMERIC(10,2) NOT NULL,
            paymentDate DATE NOT NULL,
            FOREIGN KEY (memberID) REFERENCES members(memberID) ON DELETE CASCADE
        );

        -- Table to store class membership records
        CREATE TABLE class_membership (
            memberID INT NOT NULL,
            classID INT NOT NULL,
            PRIMARY KEY (memberID, classID),
            FOREIGN KEY (memberID) REFERENCES members(memberID) ON DELETE CASCADE,
            FOREIGN KEY (classID) REFERENCES classes(classID) ON DELETE CASCADE
        );