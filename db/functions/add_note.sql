CREATE OR REPLACE FUNCTION add_note (user_id integer, title varchar, body text, tags varchar)
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
  RAISE NOTICE 'nid: %', nid;
  RAISE NOTICE 'names: %', names;
  -- create temp table
  CREATE TEMP TABLE tagger on commit drop AS SELECT nid, t.id AS tid, t.name AS tname FROM tags t WHERE t.name = any(names);

  -- looping over all the tags
  FOREACH tagname in array names
  LOOP
    tid := (SELECT t.tid FROM tagger t WHERE t.tname = tagname);
    RAISE NOTICE 'tid: %', tid;

    -- if the tag does not exist, then insert it
    IF tid is NULL then
      INSERT INTO tags (name) VALUES (tagname) RETURNING id INTO tid;
      INSERT INTO tagger VALUES (nid, tid, tagname);
    END if;
  END LOOP;

  -- take the temp table and insert it into the join table
  INSERT INTO notes_tags SELECT t.nid, t.tid FROM tagger t;
  -- return the note id
  RETURN nid;

END;
$$ LANGUAGE plpgsql;
