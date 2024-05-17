#!/bin/bash

source .env

export MYSQL_PWD="$DB_PASSWORD"

user="$DB_USER"
db="flexicms"

echo "Creating $db Database (if not existing)..."
mysql -u $user -e "CREATE DATABASE IF NOT EXISTS $db"
echo "Creating $db successfully!"

tables=$(mysql -u $user -Nse 'SHOW TABLES' $db)

for table in $tables; do
    echo "Dropping $table from $db..."
    mysql -u $user -e "DROP TABLE $table" $db
done

echo "Pre-cleaning: All tables dropped from $db."