import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"

import favicon from "../images/favicon.ico"
import backArrow from "../images/handwriting/back_arrow.svg"

import "../css/base_layout.scss"

const BaseLayout = ({ children, home, draft }) => {
  return (
    <div id="page-container">
      <Helmet>
        <title>cselig</title>
        <link rel="icon" href={favicon} />
      </Helmet>
      {!home &&
        <Link to={draft ? "/drafts" : "/"}>
          <img className="back-button" src={backArrow} alt="back" />
        </Link>
      }
      <>{ children }</>
    </div>
  )
}

export default BaseLayout
