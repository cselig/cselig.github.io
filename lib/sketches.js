import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const fg = require('fast-glob');

const sketchesDirectory = path.join(process.cwd(), 'sketches')
const markdownDirectory = path.join(sketchesDirectory, 'markdown')
const codeDirectory = path.join(sketchesDirectory, 'code')

export function getAllSketchIds() {
  const fileNames = fs.readdirSync(markdownDirectory)
  return fileNames.map(fname => ({
    params: {
      id: fname.replace(/\.md$/, '')
    }
  }))
}

export async function getSketchData(id) {
  const markdownPath = path.join(markdownDirectory, `${id}.md`)
  const markdownContents = fs.readFileSync(markdownPath, 'utf8')

  const codeFiles = fg.sync([path.join(codeDirectory, `${id}.*`)]);
  if (codeFiles.length != 1) {
    throw `Issue finding file for ${codeFilename}`
  }
  const codePath = codeFiles[0]
  const fileParts = codePath.split('/')
  const codeFilename = fileParts[fileParts.length - 1]
  const code = fs.readFileSync(codePath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(markdownContents)
  let frontmatter = matterResult.data
  const frontmatterDefaults = {
    hasReactComponent: false,
    pinned: false,
  }
  frontmatter = {...frontmatterDefaults, ...frontmatter}

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    code,
    codeFilename,
    ...frontmatter
  }
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
