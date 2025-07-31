import { cn } from '@nl/ui/utils';

function Code({ children, className }: { children: React.ReactNode; className?: string }): React.ReactNode {
  return (
    <code
      className={cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
    >
      {children}
    </code>
  );
}

export { Code };
