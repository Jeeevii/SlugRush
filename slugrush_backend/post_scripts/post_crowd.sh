#!/bin/bash

outfile="crowd_response.json"

# Send the POST request and save the response to a file
curl -X POST \
  http://127.0.0.1:8000/post/crowd/ \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
  "message": "Hello World!"
}' > $outfile

echo "✅ Response saved to $outfile"
