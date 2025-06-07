/*--------------------------------------------------------------
  Function: calc_weekly_hours
  Purpose : Compute total attendance hours for one member
            within the 7-day window that starts on p_week_start.
  Tables  : attendance(memberid, date, checkin, checkout)
----------------------------------------------------------------*/
CREATE OR REPLACE FUNCTION calc_weekly_hours(
    p_memberid   INT,
    p_week_start DATE
) RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    total_hours NUMERIC := 0;
    rec         RECORD;
BEGIN
    FOR rec IN
        SELECT checkin, checkout
        FROM attendance
        WHERE memberid = p_memberid
          AND date >= p_week_start
          AND date <  p_week_start + INTERVAL '7 days'
    LOOP
        -- Count only rows that have a checkout time
        IF rec.checkout IS NOT NULL THEN
            total_hours :=
                total_hours +
                EXTRACT(EPOCH FROM (rec.checkout - rec.checkin)) / 3600;
        END IF;
    END LOOP;

    RETURN total_hours;
END;
$$;
