CREATE OR REPLACE FUNCTION create_note (user_id integer, title varchar, body text, tags varchar)
RETURNS integer AS $$

DECLARE
  nid integer;
  tid integer;
  names varchar[];
  tagname varchar;

BEGIN
  -- insert the note
  INSERT INTO notes (title, body, user_id) VALUES (title, body, user_id) RETURNING id INTO nid;
  -- turn string into array
  SELECT string_to_array(tags, ',') INTO names;
  -- raise notice functions as console.log or print
  RAISE NOTICE 'nid: %', nid;
  RAISE NOTICE 'names: %', names;
  -- create temporary table
  -- TEMP tables are automatically dropped at the end of a session
  -- ON COMMIT DROP drops the TEMP table at the end of the current transaction block
  CREATE TEMP TABLE tagger ON COMMIT DROP AS SELECT nid, t.id AS tid, t.name AS tname FROM tags t WHERE t.name = any(names);

  -- LOOP over all the tags
  FOREACH tagname IN array names
  LOOP
    tid := (SELECT t.tid FROM tagger t WHERE t.tname = tagname);
    RAISE NOTICE 'tid: %', tid;

    -- if the tag does not exist, then insert it into the tags table, & then tagger table
    IF tid is null THEN
      INSERT INTO tags (name) VALUES (tagname) RETURNING id INTO tid;
      INSERT INTO tagger VALUES (nid, tid, tagname);
    END IF;
  END LOOP;

  -- insert the TEMP table into the join table
  INSERT INTO notes_tags SELECT t.nid, t.tid FROM tagger t;
  -- return the note id
  RETURN nid;

END;
$$ LANGUAGE plpgsql;
