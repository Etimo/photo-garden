#!/bin/bash
echo "digraph{"
grep -r channel be* | tr -d , | cut -d: -f1,3 | tr -s " " | tr -d '"'| tr -d : | \
while read -r file topic; do
  echo "\"$topic\" -> \"$file\";"
done;
grep -r "publish(" be* gateway | sed 's/:  communication.publish("/ /' | sed 's/\".*//' | \
while read -r input_file publish_topic; do
  echo "\"$input_file\" -> \"$publish_topic\";"
done;
echo "}"
