/*--------------------------------------------------------------
  Trigger  : trg_validate_cashier  (BEFORE INSERT ON orders)
  Function : validate_cashier()
  Purpose  : Reject an order if the referenced cashier does not
             exist in employees.
----------------------------------------------------------------*/
-- Trigger function
CREATE OR REPLACE FUNCTION validate_cashier()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM 1
    FROM   employees
    WHERE  employeeid = NEW.cashierid;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'Cashier id % does not exist in employees',
            NEW.cashierid;
    END IF;

    RETURN NEW;
END;
$$;

-- Trigger definition
DROP TRIGGER IF EXISTS trg_validate_cashier ON orders;
CREATE TRIGGER trg_validate_cashier
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION validate_cashier();
