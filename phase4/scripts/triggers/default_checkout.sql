/*--------------------------------------------------------------
  Trigger  : trg_default_checkout  (BEFORE INSERT ON attendance)
  Function : default_checkout()
  Purpose  : If checkout is NULL, set it to checkin + 1 hour.
----------------------------------------------------------------*/
-- Trigger function
CREATE OR REPLACE FUNCTION default_checkout()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.checkout IS NULL THEN
        NEW.checkout := NEW.checkin + INTERVAL '1 hour';
    END IF;
    RETURN NEW;
END;
$$;

-- Trigger definition
DROP TRIGGER IF EXISTS trg_default_checkout ON attendance;
CREATE TRIGGER trg_default_checkout
BEFORE INSERT ON attendance
FOR EACH ROW
EXECUTE FUNCTION default_checkout();
