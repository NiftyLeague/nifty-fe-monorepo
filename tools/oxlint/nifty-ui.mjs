/*
 * Local oxlint JS plugin for the NiftyLeague design system.
 *
 * `nifty-ui/require-kobalte` bans hand-rolled interactive ARIA patterns.
 * Interactive composite-widget roles must come from @kobalte/core primitives
 * (exposed as @nl/ui/base/*), which own focus management, keyboard
 * interaction, and ARIA state instead of leaving them to each call site.
 *
 * Only literal `role` attributes are inspected; Kobalte components never
 * need manual roles, so any hit means a primitive was bypassed.
 */

const INTERACTIVE_ROLES = new Set([
  'combobox',
  'dialog',
  'alertdialog',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'slider',
  'tablist',
  'tooltip',
  'tree',
  'treegrid',
])

const message = {
  handRolled:
    "Hand-rolled '{{role}}' pattern is not allowed. Use the @kobalte/core primitive via @nl/ui/base/*, or add one to packages/ui, instead of wiring interactive ARIA manually. See packages/ui/README.md.",
}

function literalRole(node, sourceCode) {
  const name = node.name
  if (!name || (name.type === 'JSXIdentifier' ? name.name !== 'role' : true)) return null
  const value = node.value
  if (!value) return null
  if (value.type === 'JSXExpressionContainer' || value.type === 'ExpressionContainer') return null
  if (typeof value.value === 'string') return value.value
  const text = sourceCode?.getText?.(value)
  return typeof text === 'string' ? text.replaceAll('"', '') : null
}

export default {
  meta: {
    name: 'nifty-ui',
  },
  rules: {
    'require-kobalte': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require Kobalte primitives instead of hand-rolled interactive ARIA patterns.',
        },
        schema: [],
        messages: message,
      },
      create(context) {
        return {
          JSXAttribute(node) {
            const role = literalRole(node, context.sourceCode)
            if (!role || !INTERACTIVE_ROLES.has(role)) return
            context.report({ node, messageId: 'handRolled', data: { role } })
          },
        }
      },
    },
  },
}
