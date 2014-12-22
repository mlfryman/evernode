CREATE TABLE photos(
  id serial PRIMARY KEY,
  url varchar(1000) NOT NULL,
  note_id integer NOT NULL REFERENCES notes(id),
  created_at timestamp NOT NULL DEFAULT now()
);
