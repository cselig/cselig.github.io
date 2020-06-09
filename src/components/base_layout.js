import React from "react"
import { Helmet } from "react-helmet"

const BaseLayout = ({ children }) => {
  return (
    <div id="page-container">
      <Helmet>
        <title>cselig</title>
      </Helmet>
      { children }
    </div>
  )
}

export default BaseLayout
