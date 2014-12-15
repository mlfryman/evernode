create table notes_tags(
  note_id integer not null references notes(id),
  tag_id integer not null references tags(id)
);
