import React from 'react'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CodeBlock({ language, code }) {
  return (
    <SyntaxHighlighter language={language} style={xonokai}>
      {code}
    </SyntaxHighlighter>
  )
}
