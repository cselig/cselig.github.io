import React from "react"

import BaseLayout from "../components/base_layout"
import Header from "../components/header"

import "../css/posts.scss"

export default function PostBase({ post, content }) {
  return (
    <BaseLayout>
      <Header />
      <div id={post.fields.slug} className="post">
        <h1>{post.frontmatter.title}</h1>
        {content}
      </div>
    </BaseLayout>
  )
}