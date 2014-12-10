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
