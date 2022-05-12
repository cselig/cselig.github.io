import React from "react"

import "../css/resume.scss"

function Resume() {
  return (
    <div id="resume">
      <div id="header">
        <h1>Christian Selig</h1>
        <p>seligchristian@gmail.com</p>
        <p>(360) 953-0490</p>
        <p>cselig.github.io</p>
      </div>

      <div className="section">
        <h2>Experience</h2>
        <hr />

        <div className="list">
          <div className="experience">
            <div className="body">
              <h3>Manara <span className="position">Software Engineer</span>
              </h3>
              <ul>
                <li>Completed a contract to build a redesigned marketing website for a YC-backed startup</li>
                <li><b>Technologies used:</b> React, NextJS, TailwindCSS</li>
              </ul>
            </div>

            <div className="info">
              <p>Jan 2022 – Feb 2022</p>
              <p>Mountain View, CA</p>
            </div>
          </div>

          <div className="experience">
            <div className="body">
              <h3>Cisco Systems <span className="position">Software Engineer</span></h3>
              <ul>
                <li>Integrated acquired startup's "digital chief of staff" product into Webex</li>
                <li>Rewrote a large C++ data serialization system, improving maintainability and code velocity</li>
                <li>Built internal tools for managing news feeds to make moderation more efficient</li>
                <li>Responded to and debugged issues in production using application and system logs</li>
                <li><b>Technologies used:</b> Ruby, C++, ClojureScript, React, Rails, PostgreSQL, Redis, D3.js</li>
              </ul>
            </div>

            <div className="info">
              <p>Nov 2019 – Nov 2021</p>
              <p>San Jose, CA</p>
            </div>
          </div>

          <div className="experience">
            <div className="body">
              <h3>Cascade Data Labs <span className="position">Data Scientist</span></h3>
              <ul>
                <li>Worked with clients to identify, scope, and implement projects unlocking data analysis</li>
                <li>Contributed to writing libraries for data pipeline creation and monitoring</li>
                <li>Integrated data quality monitoring into a high-visibility data pipeline</li>
                <li><b>Technologies used:</b> Python, SQL, Spark, Airflow, Tableau</li>
              </ul>
            </div>
            <div className="info">
              <p>Oct 2017 – May 2019</p>
              <p>Portland, OR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Community Contributions</h2>
        <hr />

        <div className="list">
          <div className="experience">
            <div className="body">
              <h3>Manara <span className="position">Volunteer</span></h3>
              <ul>
                <li>Gave 1-3 mock technical interviews per week to trainees</li>
                <li>TA'd for a coding interview prep class</li>
              </ul>
            </div>
            <div className="info">
              <p>Nov 2021 – Present</p>
            </div>
          </div>

          <div className="experience">
            <div className="body">
              <h3>Great Expectations <span className="position">Open Source Contributor</span></h3>
              <ul>
                <li>Built a PySpark back-end to enable working with large datasets</li>
                <li>Designed and implemented a caching layer to improve performance</li>
                <li>Proactively worked with library creators to pitch these features and get approval for designs</li>
                <li>Please see this{' '}
                  <a href="https://greatexpectations.io/blog/great-expectations-now-supports-executions-in-spark-a-blog-with-much-clapping/">article</a>
                  {' '}highlighting my contributions
                </li>
              </ul>
            </div>
            <div className="info">
              <p>2019</p>
            </div>
          </div>
        </div>

      </div>

      <div className="section" id="education">
        <h2>Education</h2>
        <hr />

        <div className="list">
          <p>
            I earned a <b>B.S. in Chemical Engineering</b> from the{' '}
            <b>University of Washington</b> in 2017 with a GPA of 3.69
          </p>

          <h4>Computer Science Coursework:</h4>
          <ul>
            <li>Compilers <span className="detail">Stanford CS 143 through edX</span></li>
            <li>Data Structures and Algorithms <span className="detail">UW CSE 373</span></li>
            <li>Introduction to AI <span className="detail">UW CSE 415</span></li>
          </ul>

        </div>
      </div>

    </div>
  )
}

export default Resume
