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
          I currently work at Google building software tools for silicon chip development.
        </p>
        <p>
          Previously I worked for Cisco on <a href="https://www.cisco.com/c/dam/en/us/solutions/collaboration/people-insights-whitepaper.pdf">People Insights</a>.{' '}
          I did end-to-end feature development including front end (React, ClojureScript, D3) and backend (Rails, Postgres, C++) work.
        </p>
        <p>
          Out of college I worked for a data science consultancy called Cascade Data Labs doing data analysis, engineering, and modeling.
          I have a Bachelors degree in Chemical Engineering from the University of Washington.
        </p>
        <p>
          I've done a little bit of open source development for a Python data quality library
          called Great Expectations – you can read about my contributions <a href="https://greatexpectations.io/blog/great-expectations-now-supports-execution-in-spark">here</a>.
        </p>
        <p>
          Finally, I'm a cellist and I love playing chamber music with my friends. I also play electric bass
          in an indie rock band called <a href="https://open.spotify.com/artist/3Uuudd2od8XP5vpOk7LDHw?si=P3-Ykr8nT_yQ0_KJsYdjLQ">The Lamps</a>!
        </p>
        <p>
          You can connect with me on: <a href="https://github.com/cselig">GitHub</a> | <a href="https://www.linkedin.com/in/c-selig/">LinkedIn</a>
        </p>
      </div>
    </BaseLayout>
  )
}

export default About