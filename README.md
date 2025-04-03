

# Gym Management System

#### Azriel Ehrlich  
#### Itamar Haimov


## Table of Contents  
- [Phase 1: Design and Build the Database](#phase-1-design-and-build-the-database)  
  - [Introduction](#introduction)  
  - [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram)  
  - [DSD (Data Structure Diagram)](#dsd-data-structure-diagram)  
  - [SQL Scripts](#sql-scripts)  
  - [Data](#data)
  - [Backup](#backup)  

## Phase 1: Design and Build the Database  

### Introduction

### Gym Management Database

The **Gym Management Database** is designed to efficiently manage information related to gym members, staff, and memberships. This system ensures smooth organization and tracking of essential details such as membership plans, staff assignments, member contact information, and fitness progress.

#### Purpose of the Database
This database serves as a structured and reliable solution for gyms to:  
- **Organize memberships** by type (e.g., monthly, annual) and status (active, expired).  
- **Manage staff assignments** by linking trainers and other staff to specific tasks or clients.  
- **Maintain member details**, including contact information, membership history, and fitness goals.  
- **Store contact information**, including addresses, phone numbers, and emails for members and staff.  
- **Track fitness progress**, such as training routines, goals, and attendance records.

#### Potential Use Cases
- **Gym Administrators** can use this database to efficiently manage membership plans, assign staff to clients, and store emergency contacts.  
- **Members** can track their membership status, view assigned trainers, and update personal fitness goals.  
- **Trainers and Staff** can view their assigned clients, schedule sessions, and monitor client progress.  
- **Management** can use the system for record-keeping, scheduling, and communication with both staff and members.  

This structured database helps streamline gym operations, improving organization, member satisfaction, and communication among all parties involved.

###  ERD (Entity-Relationship Diagram)    
![ERD Diagram](phase1/resources/erd.png)  

###  DSD (Data Structure Diagram)   
![DSD Diagram](phase1/resources/dsd.png)  

###  SQL Scripts  
Provide the following SQL scripts:  
- **Create Tables Script** - The SQL script for creating the database tables is available in the repository:  

📜 **[View `create_tables.sql`](phase1/scripts/createTables.sql)**  

- **Insert Data Script** - The SQL script for insert data to the database tables is available in the repository:  

📜 **[View `insert_tables.sql`](phase1/scripts/insertTables.sql)**  
 
- **Drop Tables Script** - The SQL script for droping all tables is available in the repository:  

📜 **[View `drop_tables.sql`](phase1/scripts/dropTables.sql)**  

- **Select All Data Script**  - The SQL script for selectAll tables is available in the repository:  

📜 **[View `selectAll_tables.sql`](phase1/scripts/selectAll.sql)**  
  
###  Data  
####  First tool: using [mockaro](https://www.mockaroo.com/) to create csv file
#####  Entering data about members and classes they take
-  person id scope 1-400
- class id scope 1-750
  📜[View `class_membershipMock_data.csv`](Phase1/mockData/nannyMOCK_DATA.csv)
#####  Entering a data to instructors
-  instructor id scope 1-400

![image](phase1/resources/mockaroo_instructors.png)

📜[View `instructorMock_data.csv`](phase1/mockarooFiles/instractors_data.csv)

![image](phase1/resources/insert_instructors.png)



####  Second tool: using [generatedata](https://generatedata.com/generator). to create csv file 
#####  Entering data about members of the gym
-  Group Number  scope 1-400 
📜[View `member_dataGenerateData.csv`](phase1/generatedataFiles/member_data.csv)

![image](phase1/resources/generate_data_member.png)

![image](phase1/resources/insert_generate_data_member.png)


####  Third tool: using python to insert data to the database
#####  Creating and Entering data about classes in the gym
📜[View `classes.csv`](phase1/programming/classes.csv)

📜[View `generate_classes.py`](phase1/programming/generate_classes.py)

📜[View `insert_classes.py`](phase1/programming/insert_classes.py)

##### creating and entering data about payments
📜[View `payments.csv`](phase1/programming/payments.csv)

📜[View `generate_payments.py`](phase1/programming/generate_payments.py)

📜[View `insert_payments.py`](phase1/programming/insert_payments.py)


### Backup 
-   backups files are kept with the date and hour of the backup:  

[payments_directory](Phase1/Backup)



 