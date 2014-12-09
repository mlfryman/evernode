CREATE OR REPLACE FUNCTION show_note (uid integer, nid integer)
RETURNS TABLE (note_id integer, title varchar, body text, updated_at timestamp, tags varchar[], urls varchar[]) AS $$

DECLARE

BEGIN
  RETURN QUERY
    SELECT n.id, n.title, n.body, n.updated_at, array_agg(distinct t.name), array_agg(distinct p.url)
    FROM notes n
    LEFT OUTER JOIN photos p ON n.id = p.note_id
    INNER JOIN notes_tags nt ON n.id = nt.note_id
    INNER JOIN tags t ON t.id = nt.tag_id
    INNER JOIN users u ON u.id = n.user_id
    WHERE n.id = nid AND u.id = uid
    GROUP BY n.id;

END;
$$ LANGUAGE plpgsql;
