'use client'

import { useState } from 'react'

interface ExpandableGameDescriptionProps {
  description?: string
}

export default function ExpandableGameDescription({ description }: ExpandableGameDescriptionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <p
        className="text-sm text-muted-foreground"
        style={{
          whiteSpace: 'pre-wrap',
          maxHeight: expanded ? 'inherit' : 42,
          overflowY: 'hidden',
        }}
      >
        {description}
      </p>
      {!expanded && (
        <button
          type="button"
          className="cursor-pointer text-left text-sm text-purple"
          onClick={() => setExpanded(true)}
        >
          more..
        </button>
      )}
    </>
  )
}
