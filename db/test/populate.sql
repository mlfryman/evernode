insert into users (username,password,avatar,token) values ('a1', 'b', 'c', 'd');
insert into users (username,password,avatar,token) values ('a2', 'b', 'c', 'd');
insert into users (username,password,avatar,token) values ('a3', 'b', 'c', 'd');

delete from users;

insert into users (id,username,password,avatar,token) values (1,'bob','$2a$08$mrZQOHperHfwQrc1au5CIecSwA6sy1VceDQIEu7SrzKA/qcXcMsoG', 'a.png', 'tok');
