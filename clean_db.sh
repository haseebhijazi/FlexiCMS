#!/bin/bash

source .env

export MYSQL_PWD="$DB_PASSWORD"

user="$DB_USER"
db="flexicms"

tables=$(mysql -u $user -Nse 'SHOW TABLES' $db)

for table in $tables; do
    echo "Dropping $table from $db..."
    mysql -u $user -e "DROP TABLE $table" $db
done

echo "All tables dropped from $db."