create table tags(
  id serial primary key,
  name varchar(255) not null unique,
  created_at timestamp not null default now()
);
