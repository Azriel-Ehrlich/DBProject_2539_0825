/*--------------------------------------------------------------
  Procedure: update_hourly_rate
  Purpose   : Update an employee's hourly pay-rate with basic
              validation and feedback.
  Tables    : employees(employeeid, hourlyrate, …)
----------------------------------------------------------------*/
CREATE OR REPLACE PROCEDURE update_hourly_rate(
    p_empid    INT,
    p_new_rate NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_new_rate <= 0 THEN
        RAISE EXCEPTION 'Hourly rate must be positive (got %)', p_new_rate;
    END IF;

    UPDATE employees
    SET    hourlyrate = p_new_rate
    WHERE  employeeid = p_empid;

    IF NOT FOUND THEN
        RAISE NOTICE 'No employee with id % found – nothing updated', p_empid;
    END IF;
END;
$$;
