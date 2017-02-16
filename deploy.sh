#!/bin/bash
set -ex

TARGET=./guuc-dist.tgz
HOST=freebsd@guuc.by

scp $TARGET $HOST:~

ssh $HOST <<-'ENDSSH'
  bash
  set -ex
  export WEB_ROOT=/usr/local/www/guuc-dist/
  tar xf guuc-dist.tgz
  # Backup
  tar czf ~guuc-dist.tgz WEB_ROOT
  # Deploy
  rm -rf $WEB_ROOT/**
  cp -r dist/* $WEB_ROOT
ENDSSH
