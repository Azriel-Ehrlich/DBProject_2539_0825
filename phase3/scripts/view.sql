-- View 1: Instructor Classes View
-- This view shows instructors and the classes they teach, including class details and their hourly rate.

CREATE OR REPLACE VIEW instructor_classes_view AS
SELECT
    e.employeeid,
    e.name AS instructor_name,
    e.phone,
    e.hourlyrate,
    c.classid,
    c.classname,
    c.classtime
FROM employees e
JOIN instructors i ON e.employeeid = i.employeeid
JOIN classes c ON e.employeeid = c.employeeid;

-- Query 1.1: List all instructors and the number of classes they teach, ordered by the number of classes descending
SELECT
    instructor_name,
    COUNT(*) AS total_classes
FROM instructor_classes_view
GROUP BY instructor_name
ORDER BY total_classes DESC;

-- Query 1.2: List all instructors and the total income they generate based on their hourly rate and number of classes
SELECT
    instructor_name,
    hourlyrate,
    COUNT(*) AS total_classes,
    ROUND(COUNT(*) * hourlyrate, 2) AS estimated_total_income
FROM instructor_classes_view
GROUP BY instructor_name, hourlyrate
ORDER BY estimated_total_income DESC;


----------------------------------------------------------------------------------

-- View 2: cashier_orders_view
-- This view displays each cashier (employee) and the orders they handled.
-- It joins the 'orders' table with the 'employees' table using the employee ID.

CREATE VIEW cashier_orders_view AS
SELECT
    e.employeeid,
    e.name AS cashier_name,
    o.orderid,
    o.orderdate
FROM orders o
JOIN employees e ON o.cashierid = e.employeeid;

-- Query 2.1: Number of orders handled per cashier
-- Returns how many orders each cashier processed.

SELECT
    cashier_name,
    COUNT(orderid) AS total_orders
FROM cashier_orders_view
GROUP BY cashier_name
ORDER BY total_orders DESC;

-- Query 2.2:Count the number of orders handled by each cashier
SELECT 
    c.cashier_name,
    COUNT(o.orderid) AS total_orders_handled
FROM 
    cashier_orders_view c
JOIN 
    orders o ON c.employeeid = o.cashierid
GROUP BY 
    c.cashier_name
	Limit 10;
