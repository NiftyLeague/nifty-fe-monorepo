import { cn } from '@nl/ui/lib/utils';

function Code({ children, className }: { children: React.ReactNode; className?: string }): React.ReactNode {
  return (
    <code className={cn('font-mono text-sm py-0.5 px-1.5 m-0 bg-background rounded-md', className)}>{children}</code>
  );
}

export { Code };
