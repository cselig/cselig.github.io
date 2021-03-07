import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function CodeBlock({ children: { props } }) {
  const { children, className } = props

  const language = className.split("-")[1]

  return (
    <SyntaxHighlighter language={language} style={xonokai}>
      {children}
    </SyntaxHighlighter>
  )
}
