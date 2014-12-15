create or replace function nuke_note (uid integer, nid integer)
returns integer AS $$
declare
begin

  nid := (select n.id from notes n where n.id = nid and n.user_id = uid);
  delete from notes_tags nt where nt.note_id = nid;
  delete from photos p where p.note_id = nid;
  delete from notes n where n.id = nid;

  return nid;

end;
$$ language plpgsql;
