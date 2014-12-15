#!/bin/bash

if [ -z "$1" ] ; then
  echo "Enter a database name"
  exit 1
fi

psql $1 -f ../../db/tables/users.sql
psql $1 -f ../../db/tables/notes.sql
psql $1 -f ../../db/tables/photos.sql
psql $1 -f ../../db/tables/tags.sql
psql $1 -f ../../db/tables/notes_tags.sql

psql $1 -f ../../db/functions/add_note.sql
psql $1 -f ../../db/functions/nuke_note.sql
psql $1 -f ../../db/functions/show_note.sql
psql $1 -f ../../db/functions/query_notes.sql
