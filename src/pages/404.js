import React from "react"
import { Link } from "gatsby"

import "../css/404.scss"

const PageNotFound = () => (
  <div id="page-not-found">
    <p>404: Page not found 😢</p>
    <Link to="/">
      <p className="link">home</p>
    </Link>
  </div>
)

export default PageNotFound