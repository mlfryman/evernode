CREATE OR REPLACE FUNCTION get_note(uid integer, nid integer)
RETURNS TABLE ("noteId" integer, title varchar, body text, "updatedAt" timestamp, "tagIds" integer[], "tagNames" varchar[], photos varchar[]) AS $$

DECLARE

BEGIN
  -- create temporary table
  -- TEMP tables are automatically dropped at the end of a session
  -- ON COMMIT DROP drops the TEMP table at the end of the current transaction block
  CREATE TEMP TABLE note_data ON COMMIT DROP AS
    -- FROM the table notes n, select the note id, title, body, updatedAt, tagsIds, & tagNames
    SELECT n.id AS note_id, n.title, n.body, n.updated_at, array_agg(t.id) AS tag_ids, array_agg(t.name) AS tag_names
    FROM notes n
    -- (1) An inner join is performed on notes n & notes_tags nt.
    -- For each row in n that does not satisfy the join condition with any row in nt,
    -- a joined row is added with null values in columns of nt.
    -- Thus, the joined table always has at least one row for each row in n.
    LEFT OUTER JOIN notes_tags nt ON n.id = nt.note_id
    -- (2) An inner join is performed on tags t & notes_tags nt.
    -- For each row in t that does not satisfy the join condition with any row in nt,
    -- a joined row is added with null values in columns of nt.
    -- Thus, the joined table always has at least one row for each row in t.
    LEFT OUTER JOIN tags t ON nt.tag_id = t.id
    -- select only the notes that belong to the logged in user
    WHERE n.id = nid AND n.user_id = uid
    -- group the notes by "noteId"
    GROUP BY n.id;

  CREATE TEMP TABLE all_photos ON COMMIT DROP AS
    -- select the aggregated array of photo urls & noteId associated with the photo, from the photos table
    SELECT array_agg(p.url) AS photos, p.note_id
    FROM photos p
    -- select only the photos that belong to the specific note
    WHERE p.note_id = nid
    -- group the photos by "noteId"
    GROUP BY p.note_id;

  RETURN QUERY
    -- FROM the note_data TEMP table, select the note id, title, body, updatedAt, tagsIds, tagNames, & photos
    SELECT nd.note_id AS "noteId", nd.title, nd.body, nd.updated_at AS "updatedAt", nd.tag_ids AS "tagIds", nd.tag_names AS "tagNames", p.photos
    FROM note_data nd
    -- (1) An inner join is performed on notes n & all_photos p.
    -- For each row in n that does not satisfy the join condition with any row in p,
    -- a joined row is added with null values in columns of p.
    -- Thus, the joined table always has at least one row for each row in n.
    LEFT OUTER JOIN all_photos p ON p.note_id = nd.note_id;

END;
$$ LANGUAGE plpgsql;
