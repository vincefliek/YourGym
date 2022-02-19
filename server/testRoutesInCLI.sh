#!/bin/bash

# HTTP GET main route
GET_MAIN_ROUTE=$(curl -i -X GET http://localhost:3100)

# warn if server needs to be run
if [[ -z $GET_MAIN_ROUTE ]];
then
    echo "=========================="
    echo "Server doesn't respond."
    echo "Did you run the server???"
    echo "If not, just do 'npm start'"
    echo "=========================="
fi
