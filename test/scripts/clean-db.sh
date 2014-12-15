#!/bin/bash

if [ -z "$1" ] ; then
  echo "Enter a database name"
  exit 1
fi

psql $1 -f ../../db/test/clean.sql
psql $1 -f ../../db/test/populate.sql
