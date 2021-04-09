import React from "react"
import { Link, graphql } from "gatsby"

import codeSketches from "../images/code_sketches.svg"

import BaseLayout from "../components/base_layout"

import "../css/main.scss"

import ConnectedComponentsSketch from "../images/sketches/connected_components.jsx"
import CryptogramsSketch from "../images/sketches/cryptograms.jsx"
import PipesSketch from "../images/sketches/pipes.jsx"
import ChessSketch from "../images/sketches/chess.jsx"
import MusicNote from "../images/sketches/music_note.jsx"
import SkiGraphsSketch from "../images/sketches/ski_graphs.jsx"
import D3Sketch from "../images/sketches/d3.jsx"
import KeyboardSketch from "../images/sketches/keyboard.jsx"
import CursorSketch from "../images/sketches/cursor.jsx"

function sketchForSlug(slug) {
  console.log(slug)
  switch (slug) {
    case "graph-builder":
      return <ConnectedComponentsSketch />
    case "cryptograms":
      return <CryptogramsSketch />
    case "three-js":
      return <PipesSketch />
    case "one-d-chess":
      return <ChessSketch />
    case "chord-data":
      return <MusicNote />
    case "ski-graphs":
      return <SkiGraphsSketch />
    case "d3":
      return <D3Sketch />
    case "keyboard-frequencies":
      return <KeyboardSketch />
    case "fitts-law":
      return <CursorSketch />
  }
}

const BlogSection = ({ posts }) => {
  posts = posts.filter(({ node }) => !node.frontmatter.draft)

  return (
    <div className="posts-container">
      {posts.map(({ node }) => (
        <Link to={`/blog/${node.fields.slug}`} className="post" key={node.id}>
          {sketchForSlug(node.fields.slug)}
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