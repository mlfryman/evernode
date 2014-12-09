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
