import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import BaseLayout from "../components/base_layout"
import CodeBlockFromFile from "../components/code_block_from_file"
import MarkdownCodeBlock from "../components/markdown_code_block"

import "../css/posts.scss"

const components = {
  pre: props => <div {...props} />,
  code: MarkdownCodeBlock,
  CodeBlockFromFile,
}

export default function Post({ data }) {
  const post = data.mdx
  return (
    <BaseLayout draft={post.frontmatter.draft}>
      <div id={post.fields.slug} className="post-body">
        <div className="title-container">
          <h1 className="title">{post.frontmatter.title}</h1>
        </div>
        <MDXProvider components={components}>
          <MDXRenderer>{post.body}</MDXRenderer>
        </MDXProvider>
      </div>
    </BaseLayout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
        draft
      }
      fields {
        slug
      }
    }
  }
`