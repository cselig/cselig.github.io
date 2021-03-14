import React from 'react'
import BaseLayout from "../components/base_layout"
import about from "../images/about.svg"

function About() {
  return (
    <BaseLayout>
      <div id="about">
        <div className="title-container">
            <img className="title" src={about} alt="About" />
          </div>
        <p>
          My name is Christian Selig and I'm a software engineer based in the Bay Area.
        </p>
        <p>
          I currently work for Cisco on <a href="https://www.cisco.com/c/dam/en/us/solutions/collaboration/people-insights-whitepaper.pdf">People Insights</a>.{' '}
          I do end-to-end feature development including front end (React, ClojureScript) and backend (Rails, Postgres) work,{' '}
          as well as more systems-oriented work in C++.
        </p>
        <p>
          Previously I worked for a data science consultancy called Cascade Data Labs doing data analysis, engineering, and modeling.
        </p>
        <p>
          I've done a little bit of open source development for a Python data quality library
          called Great Expectations - you can read about my contributions <a href="https://greatexpectations.io/blog/great-expectations-now-supports-executions-in-spark-a-blog-with-much-clapping/">here</a>.
        </p>
        <p>
          I have a Bachelors degree in Chemical Engineering from the University of Washington.
        </p>
        <p>
          Finally, I'm a very active cellist and I love playing orchestral and chamber music (and attending summer music festivals
          when I get the chance).
        </p>
      </div>
    </BaseLayout>
  )
}

export default About