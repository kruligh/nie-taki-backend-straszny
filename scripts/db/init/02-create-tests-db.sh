#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ${DATABASE_TESTS}
    ENCODING 'utf8'
    LC_COLLATE 'en_US.utf8'
    LC_CTYPE 'en_US.utf8';
EOSQL
