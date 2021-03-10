import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import CodeBlockFromFile from "../components/code_block_from_file"
import MarkdownCodeBlock from "../components/markdown_code_block"
import ExpandableCodeBlock from "../components/expandable_code_block"
import ExpandableCodeBlockMulti from "../components/expandable_code_block_multi"
import PostBase from "./post_base"

const components = {
  pre: props => <div {...props} />,
  code: MarkdownCodeBlock,
  CodeBlockFromFile,
  ExpandableCodeBlock,
  ExpandableCodeBlockMulti,
}

export default function BlogPost({ data }) {
  const post = data.mdx
  return (
    <PostBase
      post={post}
      content={
        <MDXProvider components={components}>
          <MDXRenderer>{post.body}</MDXRenderer>
        </MDXProvider>
      }
    />
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`