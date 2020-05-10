import React from "react"
import { Link } from "gatsby"
import SocialLinks from "./social_links"

import "../css/header.scss"

const Header = () => (
  <div className="header">
    <Link to="/" className="back-button">
      <h3>back to blog</h3>
    </Link>
    <SocialLinks size="32" />
  </div>
)

export default Header