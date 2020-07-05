import React from "react"
import { Link, graphql } from "gatsby"

import BaseLayout from "../components/base_layout"
import SocialLinks from "../components/social_links"

import "../css/main.scss"

const BlogSection = ({ posts }) => {
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