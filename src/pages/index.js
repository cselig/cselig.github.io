import React from "react"
import { Link, graphql } from "gatsby"

import codeSketches from "../images/code_sketches.svg"

import BaseLayout from "../components/base_layout"

import "../css/main.scss"

const BlogSection = ({ posts }) => {
  posts = posts.filter(({ node }) => !node.frontmatter.draft)
  return (
    <div className="posts-container">
      {posts.map(({ node }) => (
        // <div className="post" key={node.id}>
          <Link to={`/blog/${node.fields.slug}`} className="post" key={node.id}>
            <p className="date">{node.frontmatter.date}</p>
            <h3 className="title">{node.frontmatter.title}</h3>
          </Link>
        // </div>
      ))}
    </div>
  )
}

const IndexPage = ({ data }) => {
  let posts = data.allMdx.edges
  posts.sort((p1, p2) => (
    Date.parse(p2.node.frontmatter.date) - Date.parse(p1.node.frontmatter.date)
  ))
  return (
    <BaseLayout home>
      <div id="index">
        <div className="title-container">
          <img className="title" src={codeSketches} alt="Code Sketches" />
        </div>

        <div className="description">
          <p>
            Hi, my name is Christian.
            You can learn more about me <Link to="/about">here</Link>.
          </p>
          <p>
            This is my collection of code sketches: bite-sized visualizations,{' '}
            puzzles, prototypes, explorations, and generally anything I find interesting.
          </p>
          <p>
            I hope you enjoy!
          </p>
        </div>
        <BlogSection posts={posts}/>
      </div>
    </BaseLayout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allMdx {
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            excerpt
            topic
            draft
          }
        }
      }
    }
  }
`