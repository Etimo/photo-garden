#!/bin/bash

curl -X PUT localhost:9200/photogarden -H'Content-Type: application/json' -v -d '
{
  "mappings": {
    "dynamic_date_formats": ["yyyy:MM:dd HH:mm:ss"]
  }
}
'
