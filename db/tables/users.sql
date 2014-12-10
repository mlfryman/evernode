CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    avatar VARCHAR(200) NOT NULL,
    token CHAR(96) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
