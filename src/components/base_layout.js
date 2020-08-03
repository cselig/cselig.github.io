import React from "react"
import { Helmet } from "react-helmet"
import favicon from "../images/favicon.ico"

const BaseLayout = ({ children }) => {
  return (
    <div id="page-container">
      <Helmet>
        <title>cselig</title>
        <link rel="icon" href={favicon} />
      </Helmet>
      { children }
    </div>
  )
}

export default BaseLayout
