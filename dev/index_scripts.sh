cd ../docs/scripts
find . -type d -exec sh -c 'ls "{}" > "{}"/.index.list && mv "{}"/.index.list "{}"/index.list' \;
