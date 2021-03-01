import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

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

  // TODO: support other types of file
  const codeFilename = `${id}.jsx`
  const codePath = path.join(codeDirectory, codeFilename)
  const code = fs.readFileSync(codePath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(markdownContents)

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
    ...matterResult.data
  }
}
