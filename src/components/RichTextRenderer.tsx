import React from 'react'

// Minimal rich text renderer for Lexical JSON format

// Lexical Node Types
type LexicalTextNode = {
  type: 'text'
  text: string
}
type LexicalParagraphNode = {
  type: 'paragraph'
  children?: LexicalNode[]
}
type LexicalRootNode = {
  type: 'root'
  children?: LexicalNode[]
}
type LexicalNode =
  | LexicalTextNode
  | LexicalParagraphNode
  | LexicalRootNode
  | { type: string; [key: string]: unknown }

export function RichTextRenderer({ content }: { content: unknown }) {
  if (!content || typeof content !== 'object' || !('root' in content)) return null

  function renderNode(node: LexicalNode): React.ReactNode {
    if (!node) return null
    switch (node.type) {
      case 'root':
        return Array.isArray(node.children) ? node.children.map(renderNode) : null
      case 'paragraph':
        return <p>{Array.isArray(node.children) ? node.children.map(renderNode) : null}</p>
      case 'text':
        return (node as LexicalTextNode).text
      // Add more node types as needed
      default:
        return null
    }
  }

  return <>{renderNode((content as { root: LexicalRootNode }).root)}</>
}
