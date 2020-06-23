import React from "react"
import { graphql } from "gatsby"
import PostBase from "./post_base"

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  return (
    <PostBase
      post={post}
      content={
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      }
    />
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
}
`