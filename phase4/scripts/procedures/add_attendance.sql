/*--------------------------------------------------------------
  Procedure: add_attendance
  Purpose   : Insert a single attendance row while preventing
              duplicates for the same member & date.
  Tables    : attendance(attendanceid, memberid, date, checkin, checkout)
----------------------------------------------------------------*/
CREATE OR REPLACE PROCEDURE add_attendance(
    p_memberid INT,
    p_date     DATE,
    p_checkin  TIME,
    p_checkout TIME
)
LANGUAGE plpgsql
AS $$
DECLARE
    row_exists INT;
BEGIN
    SELECT COUNT(*)
    INTO   row_exists
    FROM   attendance
    WHERE  memberid = p_memberid
      AND  date      = p_date;

    IF row_exists > 0 THEN
        RAISE EXCEPTION
            'Attendance already recorded for member % on %',
            p_memberid, p_date;
    END IF;

    INSERT INTO attendance(attendanceid, memberid, date, checkin, checkout)
    VALUES (
        nextval('attendance_attendanceid_seq'),
        p_memberid, p_date, p_checkin, p_checkout
    );
END;
$$;
