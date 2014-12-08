CREATE TABLE notes_tags(
  note_id integer NOT NULL REFERENCES notes(id),
  tag_id integer NOT NULL REFERENCES tags(id)
);
