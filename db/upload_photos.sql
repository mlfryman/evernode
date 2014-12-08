CREATE OR REPLACE FUNCTION upload_photos(url_string varchar, nid integer)
RETURNS integer AS $$

DECLARE
  result integer;
  urls varchar[];
  p_url varchar;

BEGIN
  SELECT string_to_array(url_string, ',') INTO urls;
  RAISE NOTICE 'PSQL UPLOAD_PHOTOS - urls: %', urls;
  FOREACH p_url IN ARRAY urls
  LOOP
    INSERT INTO photos (url, note_id) VALUES (p_url, nid) RETURNING id INTO result;
  END LOOP;

  RETURN result;

END;
$$ LANGUAGE plpgsql;
