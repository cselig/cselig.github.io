#!/bin/bash

if [ "$1" == "" ]; then
  echo "Need to specify post name"
  exit 0
fi

mkdir "./content/blog/$1"

cat > "./content/blog/$1/$1.mdx" <<- EOM
---
title: $1
date: `date +%F`
excerpt:
---
EOM
