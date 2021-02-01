import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import MarkdownCodeBlock from "../components/markdown_code_block"
import ExpandableCodeBlock from "../components/expandable_code_block"
import PostBase from "./post_base"

const components = {
  pre: props => <div {...props} />,
  code: MarkdownCodeBlock,
  ExpandableCodeBlock,
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