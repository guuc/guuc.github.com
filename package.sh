#!/bin/bash

NODE_VERSION=7.0.0
TARGET=./guuc-dist.tgz

## Set up nodejs
source $HOME/.nvm/nvm.sh
set -ex
nvm use $NODE_VERSION

## Run build
./node_modules/gulp/bin/gulp.js

## Removes build if exists
if [ -f $TARGET ]; then
  rm $TARGET
fi

## Make a bundle
tar -czf $TARGET dist/
