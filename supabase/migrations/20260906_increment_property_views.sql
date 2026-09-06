-- Function to increment property views atomically
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE properties
  SET views = views + 1
  WHERE id = property_id;
END;
$$;
