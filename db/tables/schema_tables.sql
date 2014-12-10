CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    avatar VARCHAR(200) NOT NULL,
    token CHAR(96) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE notes(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  user_id INTEGER NOT NULL REFERENCES users(id)
);
CREATE TABLE tags(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE photos(
  id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  note_id INTEGER NOT NULL REFERENCES notes(id),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE notes_tags(
  note_id integer NOT NULL REFERENCES notes(id),
  tag_id integer NOT NULL REFERENCES tags(id)
);
