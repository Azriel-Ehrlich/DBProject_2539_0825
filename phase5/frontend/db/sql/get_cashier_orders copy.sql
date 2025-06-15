/*--------------------------------------------------------------
  Function: get_cashier_orders
  Purpose : Return all orders handled by a specific cashier
            as a scrollable REFCURSOR.
  Tables  : orders(orderid, customerid, orderdate, cashierid, …)
----------------------------------------------------------------*/
CREATE OR REPLACE FUNCTION get_cashier_orders(
    p_cashierid INT
) RETURNS REFCURSOR
LANGUAGE plpgsql
AS $$
DECLARE
    cur_orders REFCURSOR;
BEGIN
    OPEN cur_orders FOR
        SELECT *
        FROM orders
        WHERE cashierid = p_cashierid
        ORDER BY orderdate;
    RETURN cur_orders;
END;
$$;
