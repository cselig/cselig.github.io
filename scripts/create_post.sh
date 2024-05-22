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
---

import RootComponent from "./$1";

<RootComponent />
EOM

cat > "./content/blog/$1/$1.jsx" <<- EOM
import React, { useState } from 'react';

import "./styles.scss";

function RootComponent() {
  return (
    <div id="$1">
      <p>$1 component here</p>
    </div>
  );
}

export default RootComponent
EOM

cat > "./content/blog/$1/styles.scss" <<- EOM
#$1 {}
EOM

echo "created new post in ./content/blog/$1"
exit 0