create or replace function show_note (uid integer, nid integer)
returns table (note_id integer, title varchar, body text, updated_at timestamp, tags varchar[], urls varchar[]) AS $$
declare
begin

  return query
    select n.id, n.title, n.body, n.updated_at, array_agg(distinct t.name), array_agg(distinct p.url)
    from notes n
    left outer join photos p on n.id = p.note_id
    inner join notes_tags nt on n.id = nt.note_id
    inner join tags t on t.id = nt.tag_id
    inner join users u on u.id = n.user_id
    where n.id = nid and u.id = uid
    group by n.id;

end;
$$ language plpgsql;
