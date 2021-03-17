import React from "react"
import { Link } from "gatsby"

import "../css/404.scss"

const PageNotFound = () => (
  <div id="page-not-found">
    <h1 className="four-oh-four">404</h1>
    <Link to="/">
      <p className="link">Home</p>
    </Link>
  </div>
)

export default PageNotFound