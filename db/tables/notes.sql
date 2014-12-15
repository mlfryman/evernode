create table notes(
  id serial primary key,
  title varchar(255) not null,
  body text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  user_id integer not null references users(id)
);
