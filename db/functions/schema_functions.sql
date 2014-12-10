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

CREATE OR REPLACE FUNCTION nuke_note (uid integer, nid integer)
RETURNS integer AS $$
DECLARE

BEGIN
  nid := (SELECT n.id FROM notes n WHERE n.id = nid AND n.user_id = uid);
  DELETE FROM notes_tags nt WHERE nt.note_id = nid;
  DELETE FROM photos p WHERE p.note_id = nid;
  DELETE FROM notes n WHERE n.id = nid;

  RETURN nid;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION query_notes (uid integer, lmt integer, ofst integer, tag varchar)
RETURNS TABLE (note_id integer, title varchar, body text, updated_at timestamp, tags varchar[]) AS $$
DECLARE

BEGIN
  RETURN query
    SELECT n.id, n.title, n.body, n.updated_at, array_agg(t.name)
    FROM notes_tags nt
    INNER JOIN notes n ON n.id = nt.note_id
    INNER JOIN tags t ON t.id = nt.tag_id
    WHERE n.user_id = uid AND t.name LIKE tag
    GROUP BY n.id
    ORDER BY updated_at DESC
    OFFSET ofst
    LIMIT lmt;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION show_note (uid integer, nid integer)
RETURNS TABLE (note_id integer, title varchar, body text, updated_at timestamp, tags varchar[], urls varchar[]) AS $$
DECLARE

BEGIN
  RETURN QUERY
    SELECT n.id, n.title, n.body, n.updated_at, array_agg(DISTINCT t.name), array_agg(DISTINCT p.url)
    FROM notes n
    LEFT OUTER JOIN photos p ON n.id = p.note_id
    INNER JOIN notes_tags nt ON n.id = nt.note_id
    INNER JOIN tags t ON t.id = nt.tag_id
    INNER JOIN users u ON u.id = n.user_id
    WHERE n.id = nid AND u.id = uid
    GROUP BY n.id;

END;
$$ LANGUAGE plpgsql;
