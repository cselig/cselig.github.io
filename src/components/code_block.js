import React from 'react'
import Highlight, {defaultProps} from 'prism-react-renderer'
import theme from "prism-react-renderer/themes/github"

const CodeBlock = ({children, className}) => {
  const language = className ? className.replace(/language-/, '') : "javascript"
  defaultProps.theme = theme
  return (
    <Highlight {...defaultProps} code={children} language={language}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className}>
          {/* don't render blank last lines (which are always present in markdown code blocks) */}
          {tokens.filter((line, i) => !(i === (tokens.length - 1) && line.length === 1 && line[0].empty)).map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock