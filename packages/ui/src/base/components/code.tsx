export function Code({ children, className }: { children: React.ReactNode; className?: string }): React.ReactNode {
  return <code className={className}>{children}</code>;
}
