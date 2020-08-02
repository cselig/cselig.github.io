import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import BaseLayout from "../components/base_layout"
import SocialLinks from "../components/social_links"

import "../css/main.scss"

const firebase = require("firebase");
// TODO there's a cleaner way to do this with react hooks
firebase.initializeApp({
  apiKey: "AIzaSyB-OnQLJ56YxYJcpHWS_NEHKObIJpIN1UQ",
  authDomain: "blog-c1783.firebaseapp.com",
  projectId: "blog-c1783",
})
var db = firebase.firestore();

const BlogSection = ({ posts }) => {
  posts = posts.filter(({ node }) => !node.frontmatter.draft)
  return (
    <div className="section" id="blog">
      <h2 className="section-header">Blog</h2>
      <hr/>
      <div className="posts-container">
        {posts.map(({ node }) => (
          <div className="post" key={node.id}>
            <div className="title-container">
              <Link to={`/blog/${node.fields.slug}`} className="title-link">
                <h3>{node.frontmatter.title}</h3>
              </Link>
              <p className="date">{node.frontmatter.date}</p>
            </div>
            <p className="excerpt">{node.frontmatter.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProjectsSection = ({ projects }) => {
  return (
    <div className="section" id="projects">
      <h2 className="section-header">Projects</h2>
      <hr/>
      <div className="posts-container">
        {projects.map(node => (
          <div className="post" key={node.id}>
            <div className="title-container">
              <a href={node.github_link} className="title-link" target="_blank" rel="noopener noreferrer">
                <h3>{node.title}</h3>
              </a>
              <div className="tech-badges">
                {node.technologies.map(tech => <p className="tech-badge" key={tech}>{tech}</p>)}
              </div>
            </div>
            <p className="excerpt">{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResumeSection = () => {
  return (
    <div id="resume">
      <h3>My resume:</h3>
      <div className="row">
        <p className="emoji">🎓</p>
        <p>I have a B.S. in <b>Chemical Engineering</b> from the <a href="https://www.cheme.washington.edu/" target="_blank">University of Washington</a></p>
      </div>
      <div className="row">
        <span className="emoji">🧪</span>
        <p>I worked as a <b>Data Scientist</b> at <a href="https://cascadedatalabs.com/" target="_blank">Cascade Data Labs</a></p>
      </div>
      <div className="row">
        <span className="emoji">💻</span>
        <p>Currently I work as a <b>Software Engineer</b> at <a href="https://www.cisco.com/c/en/us/solutions/collaboration/cognitive-collaboration-solutions.html" target="_blank">Cisco Webex Intelligence</a></p>
      </div>
    </div>
  )
}

const RightNowSection = () => {
  const [book, setBook] = useState({})
  const [album, setAlbum] = useState({})
  const [recipe, setRecipe] = useState({})

  useEffect(() => {
    db.collection("books").orderBy("date", "desc").limit(1).get().then((q) => {
      q.forEach((doc) => {
          setBook(doc.data())
      })
    })
    db.collection("music").orderBy("date", "desc").limit(1).get().then((q) => {
      q.forEach((doc) => {
          setAlbum(doc.data())
      })
    })
    db.collection("recipes").orderBy("date", "desc").limit(1).get().then((q) => {
      q.forEach((doc) => {
          setRecipe(doc.data())
      })
    })
  }, [])

  return (
    <div id="right-now">
      <h3>Right now I'm...</h3>
      <div className="row">
        <p className="emoji">📚</p>
        <p>Reading {book.link ? <a href={book.link} target="_blank">{book.title} - {book.author}</a> : ""}</p>
      </div>
      <div className="row">
        <p className="emoji">🎵</p>
        <p>Listening to {album.link ? <a href={album.link}>{album.title} - {album.artist}</a> : ""}</p>
      </div>
      <div className="row">
        <p className="emoji">🍳</p>
        <p>{recipe.type} {recipe.link ? <a href={recipe.link} target="_blank">{recipe.title}</a> : ""}</p>
      </div>
    </div>
  )
}

const IndexPage = ({ data }) => {
  let posts = [].concat(data.allMdx.edges)
                .concat(data.allMarkdownRemark.edges)
  posts.sort((p1, p2) => (
    Date.parse(p2.node.frontmatter.date) - Date.parse(p1.node.frontmatter.date)
  ))
  return (
    <BaseLayout>
      <div id="index">
        <div className="greeting">
          <h1 className="title">Christian Selig</h1>
          <p className="about">Hi! I'm a software engineer based in the Bay Area.</p>
        </div>
        <ResumeSection />
        <RightNowSection />
        <BlogSection posts={posts}/>
        <ProjectsSection projects={data.allProjectsYaml.nodes}/>
        <SocialLinks size="64"/>
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
            date(formatString: "DD MMMM, YYYY")
            title
            excerpt
            draft
          }
        }
      }
    }
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            excerpt
            draft
          }
        }
      }
    }
    allProjectsYaml {
      nodes {
        id
        title
        github_link
        technologies
        description
      }
    }
  }
`