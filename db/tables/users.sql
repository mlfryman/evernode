CREATE TABLE users(
  id serial PRIMARY KEY,
  username varchar(255) NOT NULL UNIQUE,
  password char(60) NOT NULL,
  avatar varchar(200) NOT NULL,
  token char(96) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
