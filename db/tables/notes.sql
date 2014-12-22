CREATE TABLE notes(
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  body text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  user_id integer NOT NULL REFERENCES users(id)
);
