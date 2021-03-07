import fs from 'fs'
import path from 'path'

import {toc} from '../sketches/toc'

const sketchesDir = path.join(process.cwd(), 'pages', 'sketches')

export function getAllSketchIds() {
  const fileNames = fs.readdirSync(sketchesDir)
  return fileNames.map(fname => ({
    params: {
      id: fname.replace(/\.mdx$/, '')
    }
  }))
}

export async function getSketchData(id) {
  const meta = toc.filter(meta => meta.id === id)[0]
  return meta
}

export async function getAllSketchData() {
  const ids = getAllSketchIds()
  const result = await Promise.all(ids.map((x) => getSketchData(x.params.id)))
  // sort by date desc
  return result.sort((s1, s2) => {
    if (s1.date < s2.date) return 1
    else return -1
  })
}
