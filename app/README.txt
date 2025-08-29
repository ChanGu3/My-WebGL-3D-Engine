- package.json has a dev script to track file changes upon save to compile the typescript and css files.
- I have multiple javascript files so it needs to be run where CORS doesn't block it so it needs to be under the same hostname (local files dont work they block imports).

The 'dist' folder contains the working build with the index.html (javascript).
The 'src' folder contains the source code (typescript).

