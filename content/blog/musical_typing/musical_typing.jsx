import React from 'react'
import loadable from "@loadable/component"

const LoadableInput = loadable(() => import('./input'))

export default function MusicalTyping() {
  return <LoadableInput />
}
