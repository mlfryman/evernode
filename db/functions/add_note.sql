create or replace function add_note (user_id integer, title varchar, body text, tags varchar)
returns integer AS $$
declare

  nid integer;
  tid integer;
  names varchar[];
  tagname varchar;

begin

  -- insert the note
  insert into notes (title, body, user_id) values (title, body, user_id) returning id into nid;
  -- turn string into array
  select string_to_array(tags, ',') into names;
  raise notice 'nid: %', nid;
  raise notice 'names: %', names;
  -- create temp table
  create temp table tagger on commit drop as select nid, t.id as tid, t.name as tname from tags t where t.name = any(names);

  -- looping over all the tags
  foreach tagname in array names
  loop
    tid := (select t.tid from tagger t where t.tname = tagname);
    raise notice 'tid: %', tid;

    -- if the tag does not exist, then insert it
    IF tid is null then
      insert into tags (name) values (tagname) returning id into tid;
      insert into tagger values (nid, tid, tagname);
    end if;
  end loop;

  -- take the temp table and insert it into the join table
  insert into notes_tags select t.nid, t.tid from tagger t;
  -- return the note id
  return nid;

end;
$$ language plpgsql;
