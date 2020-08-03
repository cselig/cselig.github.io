import React from "react"
import { Link } from "gatsby"
import Emoji from "../components/emoji"

import "../css/404.scss"

const PageNotFound = () => (
  <div id="page-not-found">
    <p>404: Page not found <Emoji symbol="😢" /></p>
    <Link to="/">
      <p className="link">home</p>
    </Link>
  </div>
)

export default PageNotFound