-- Analytics Functions for Admin Dashboard

-- 1. Revenue Stats (Last N Days)
DROP FUNCTION IF EXISTS get_revenue_stats(int);

CREATE OR REPLACE FUNCTION get_revenue_stats(days_lookback int DEFAULT 30)
RETURNS TABLE (
    date_label text,
    revenue numeric,
    orders bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date_label,
        SUM(total_amount) as revenue,
        COUNT(id) as orders
    FROM orders
    WHERE created_at >= NOW() - (days_lookback || ' days')::interval
    AND status != 'cancelled' -- Exclude cancelled orders
    GROUP BY 1
    ORDER BY 1 ASC;
END;
$$;

-- 2. Top Products
DROP FUNCTION IF EXISTS get_top_products(int);

CREATE OR REPLACE FUNCTION get_top_products(limit_count int DEFAULT 5)
RETURNS TABLE (
    product_name text,
    total_sold bigint,
    revenue numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(p.name, 'Unknown Product') as product_name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.price_amount * oi.quantity) as revenue
    FROM order_items oi
    LEFT JOIN orders o ON oi.order_id = o.id
    LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
    LEFT JOIN products p ON pv.product_id = p.id
        OR oi.product_id = p.id -- Fallback if variant link missing but product link exists
    WHERE o.status != 'cancelled'
    GROUP BY 1
    ORDER BY 2 DESC
    LIMIT limit_count;
END;
$$;

-- Grant access to authenticated users (RLS will handle actual data, but for RPC we might need explicit grant if stricter settings)
GRANT EXECUTE ON FUNCTION get_revenue_stats(int) TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_stats(int) TO service_role;

GRANT EXECUTE ON FUNCTION get_top_products(int) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_products(int) TO service_role;
