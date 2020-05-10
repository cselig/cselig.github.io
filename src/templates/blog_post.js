import React from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import BaseLayout from "../components/base_layout"
import Header from "../components/header"
import CodeBlock from "../components/code_block"
import ExpandableCodeBlock from "../components/expandable_code_block"

import "../css/posts.scss"


const components = {
  pre: props => <div {...props} />,
  code: CodeBlock,
  ExpandableCodeBlock,
}

export default function BlogPost({ data }) {
  const post = data.mdx
  return (
    <BaseLayout>
      <Header />
      <div id={post.fields.slug} className="post">
        <h1>{post.frontmatter.title}</h1>
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
      fileAbsolutePath
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`
