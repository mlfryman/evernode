-- You only need to CREATE the TABLES once.
-- If you change the schema, DROP the table & re-initialize it.
-- NOTE: dropping the table will delete its data!

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE notes(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  user_id INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE tags(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE notes_tags(
  note_id INTEGER NOT NULL REFERENCES notes(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id)
);

CREATE TABLE photos(
  id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  note_id INTEGER NOT NULL REFERENCES notes(id)
);


-- You only need to CREATE the FUNCTIONS once.
-- If you change the schema, just rerun the script.

CREATE OR REPLACE FUNCTION create_note (user_id integer, title varchar, body text, tags varchar)
RETURNS integer AS $$

DECLARE
  nid integer;
  tid integer;
  names varchar[];
  tagname varchar;
BEGIN
  INSERT INTO notes (title, body, user_id) VALUES (title, body, user_id) RETURNING id INTO nid;
  SELECT string_to_array(tags, ',') INTO names;
  RAISE NOTICE 'nid: %', nid;
  RAISE NOTICE 'names: %', names;
  CREATE TEMP TABLE tagger ON COMMIT DROP AS SELECT nid, t.id AS tid, t.name AS tname FROM tags t WHERE t.name = any(names);
  FOREACH tagname IN array names
  LOOP
    tid := (SELECT t.tid FROM tagger t WHERE t.tname = tagname);
    RAISE NOTICE 'tid: %', tid;
    IF tid is null THEN
      INSERT INTO tags (name) VALUES (tagname) RETURNING id INTO tid;
      INSERT INTO tagger VALUES (nid, tid, tagname);
    END IF;
  END LOOP;
  INSERT INTO notes_tags SELECT t.nid, t.tid FROM tagger t;
  RETURN nid;
END;
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION query_notes (uid integer, lmt integer, ofst integer)
RETURNS TABLE ("noteId" integer, title varchar, "updatedAt" timestamp, "tagIds" integer[], "tagNames" varchar[]) AS $$
DECLARE
BEGIN
  RETURN QUERY
    SELECT n.id AS "noteId", n.title, n.updated_at AS "updatedAt", array_agg(t.id) AS "tagIds", array_agg(t.name) AS "tagNames"
    FROM notes n
    LEFT OUTER JOIN notes_tags nt ON n.id = nt.note_id
    LEFT OUTER JOIN tags t ON nt.tag_id = t.id
    WHERE n.user_id = uid
    GROUP BY n.id
    ORDER BY n.updated_at DESC
    OFFSET ofst
    LIMIT lmt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_note(uid integer, nid integer)
RETURNS TABLE ("noteId" integer, title varchar, body text, "updatedAt" timestamp, "tagIds" integer[], "tagNames" varchar[], photos varchar[]) AS $$
DECLARE
BEGIN
  CREATE TEMP TABLE note_data ON COMMIT DROP AS
    SELECT n.id AS note_id, n.title, n.body, n.updated_at, array_agg(t.id) AS tag_ids, array_agg(t.name) AS tag_names
    FROM notes n
    LEFT OUTER JOIN notes_tags nt ON n.id = nt.note_id
    LEFT OUTER JOIN tags t ON nt.tag_id = t.id
    WHERE n.id = nid AND n.user_id = uid
    GROUP BY n.id;
  CREATE TEMP TABLE all_photos ON COMMIT DROP AS
    SELECT array_agg(p.url) AS photos, p.note_id
    FROM photos p
    WHERE p.note_id = nid
    GROUP BY p.note_id;
  RETURN QUERY
    SELECT nd.note_id AS "noteId", nd.title, nd.body, nd.updated_at AS "updatedAt", nd.tag_ids AS "tagIds", nd.tag_names AS "tagNames", p.photos
    FROM note_data nd
    LEFT OUTER JOIN all_photos p ON p.note_id = nd.note_id;
END;
$$ LANGUAGE plpgsql;
