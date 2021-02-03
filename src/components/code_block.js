import React from "react"
import Highlight, {defaultProps} from "prism-react-renderer"
import theme from "prism-react-renderer/themes/github"

// prism-react-renderer supports a small subset of languages that Prism does
import Prism from "prism-react-renderer/prism"
(typeof global !== 'undefined' ? global : window).Prism = Prism;
["ruby", "clojure"].forEach((lang) => require(`../../node_modules/prismjs/components/prism-${lang}`))

const CodeBlock = ({ language, code }) => {
  defaultProps.theme = theme
  return (
    <Highlight {...defaultProps} code={code} language={language}>
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
