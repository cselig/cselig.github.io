import React from "react"

const BaseLayout = ({ children }) => {
  return (
    <div id="page-container">
      { children }
    </div>
  )
}

export default BaseLayout
