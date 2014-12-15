INSERT INTO users (username,password,avatar,token) VALUES ('a1', 'b', 'c', 'd');
INSERT INTO users (username,password,avatar,token) VALUES ('a2', 'b', 'c', 'd');
INSERT INTO users (username,password,avatar,token) VALUES ('a3', 'b', 'c', 'd');

DELETE FROM users;

INSERT INTO users (id,username,password,avatar,token) VALUES (1,'bob','$2a$08$mrZQOHperHfwQrc1au5CIecSwA6sy1VceDQIEu7SrzKA/qcXcMsoG', 'bob.png', 'tok');
