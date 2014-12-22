CREATE TABLE tags(
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now()
);
