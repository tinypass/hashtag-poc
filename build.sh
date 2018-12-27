#!/usr/bin/env bash
./node_modules/.bin/babel modal.js --sourceType=script --presets=@babel/preset-env -d lib && uglifyjs --compress --mangle -o ./lib/modal.min.js  -- ./lib/modal.js
