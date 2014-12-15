create table users(
    id serial primary key,
    username varchar(255) unique not null,
    password char(60) not null,
    avatar varchar(200) not null,
    token char(96) not null,
    created_at timestamp not null default now()
);
