import React from "react"
import { Link, graphql } from "gatsby"

import codeSketches from "../images/code_sketches.svg"

import BaseLayout from "../components/base_layout"

import "../css/main.scss"

import connectedComponentsSketch from "../images/sketches/connected_components.svg"
import skiGraphsSketch from "../images/sketches/ski_graphs.svg"
import chordDataSketch from "../images/sketches/chord_data.svg"
import cryptogramsSketch from "../images/sketches/cryptograms.svg"
import pipesSketch from "../images/sketches/pipes.svg"
import d3Sketch from "../images/sketches/d3.svg"

const SKETCH_MAP = {
  "graph-builder": connectedComponentsSketch,
  "ski-graphs": skiGraphsSketch,
  "cryptograms": cryptogramsSketch,
  "chord-data": chordDataSketch,
  "three-js": pipesSketch,
  "d3": d3Sketch,
}

const BlogSection = ({ posts }) => {
  posts = posts.filter(({ node }) => !node.frontmatter.draft)
  console.log(posts)
  return (
    <div className="posts-container">
      {posts.map(({ node }) => (
        <Link to={`/blog/${node.fields.slug}`} className="post" key={node.id}>
          <img className="sketch" src={SKETCH_MAP[node.fields.slug]} />
          <div className="title-container">
            <h3 className="title">{node.frontmatter.title}</h3>
            <p className="date">{node.frontmatter.date}</p>
          </div>
        </Link>
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
        <div className="site-title-container">
          <img className="site-title" src={codeSketches} alt="Code Sketches" />
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