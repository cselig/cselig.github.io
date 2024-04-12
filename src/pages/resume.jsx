import React from "react"

import "../css/resume.scss"

function Resume() {
  return (
    <div id="resume">
      {/* EXPERIENCE */}
      <h2>Experience</h2>

      <h3>Google, Software Engineer</h3>
      <h4>Mountain View, CA | 2022-Present</h4>
      <ul>
        <li>Worked in the interconnect group of gChips, which designs SoC's for Pixel devices.</li>
        <li>Learned hardware concepts quickly to become an effective contributor.</li>
        <li>Built a Python placement engine for structured standard-cell placements. Used this engine
          on several modules to produce double-digit power savings as compared to standard PnR tools.
        </li>
      </ul>

      <h3>Manara, Software Engineer</h3>
      <h4>Mountain View, CA | 2022</h4>
      <ul>
        <li>Completed a contract to build a redesigned marketing website for a YC-backed startup</li>
      </ul>

      <h3>Cisco, Software Engineer</h3>
      <h4>Los Altos, CA | 2019-2021</h4>
      <ul>
        <li>Rewrote a large C++ data serialization system, improving maintainability and code velocity.</li>
        <li>Worked directly with internal users to build tools for efficient moderation of news feeds.</li>
        <li>Responded to and debugged issues in production using application and system logs.</li>
      </ul>

      <h3>Cascade Data Labs, Data Analyst</h3>
      <h4>Portland, OR | 2017-2019</h4>
      <ul>
        <li>Contributed to writing libraries for data pipeline creation and monitoring.</li>
        <li>Designed and implemented a system for data quality monitoring that was able to catch several
          major bugs before the data reached stakeholders.</li>
        <li>Was promoted to Data Scientist after 1 year.</li>
      </ul>

      {/* COMMUNITY CONTRIBUTIONS */}
      <h2>Community Contributions</h2>

      <h3>Manara, Volunteer</h3>
      <h4>2021-Present</h4>
      <p>Manara is an organization that helps train and place underemployed tech talent in the Middle East.
        I volunteer by giving mock coding interviews. I find this work very rewarding and have been
        consistently been given great feedback from my interviewees on the quality of my interviews.
      </p>

      <h3>Great Expectations, Open Source Contributor</h3>
      <h4>2019</h4>
      <p>
        Great Expectations is an OS library for data quality assertions. During my time at Cascade Data Labs
        I implemented a PySpark backend so we could integrate GE into our stack. I also completed a major
        refactor of the codebase and introduced a metrics caching layer for performance.
        Please see this <a href="https://greatexpectations.io/blog/great-expectations-now-supports-executions-in-spark-a-blog-with-much-clapping/">article</a>
        {' '}for more details.
      </p>

    </div>
  )
}

export default Resume
