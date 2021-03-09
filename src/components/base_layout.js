import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "gatsby"

import { ArrowBack } from '@material-ui/icons'
import favicon from "../images/favicon.ico"

import "../css/base_layout.scss"

const BaseLayout = ({ children, home }) => {
  return (
    <div id="page-container">
      <Helmet>
        <title>cselig</title>
        <link rel="icon" href={favicon} />
      </Helmet>
      {!home &&
        <Link to="/">
          <ArrowBack className="back-button" />
        </Link>
      }
      <>{ children }</>
    </div>
  )
}

export default BaseLayout
