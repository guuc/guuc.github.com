#!/bin/bash
set -e

HOST=freebsd@guuc.by

ssh $HOST <<-'ENDSSH'
  set -e
  WEB_ROOT=/usr/local/www/guuc-dist/
  tar xf ~guuc-dist.tgz
  # Deploy
  rm -rf $WEB_ROOT/**
  cp -r guuc-dist/ $WEB_ROOT
ENDSSH
