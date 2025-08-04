import Image from 'next/image';
import { cn } from '@nl/ui/utils';

interface Error404Props extends React.ComponentProps<'div'> {}

export function Error404({ className }: Error404Props) {
  return (
    <div
      className={cn(`flex min-h-[95vh] mt-[5vh] items-center justify-center bg-transparent text-foreground`, className)}
    >
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="relative mx-auto w-full max-w-[720px] aspect-[720/360]">
          <Image src="/img/maintenance/img-error-bg-dark.svg" alt="Background Dark" fill priority />
          <Image src="/img/maintenance/img-error-bg.svg" alt="Background Light" fill priority />
          <Image
            src="/img/maintenance/img-error-text.svg"
            alt="404 Text"
            fill
            priority
            className="animate-[custom-bounce_3s_ease-in-out_infinite]"
          />
          <Image
            src="/img/maintenance/img-error-blue.svg"
            alt="Blue Shapes"
            fill
            priority
            className="animate-[wings_15s_ease-in-out_infinite]"
          />
          <Image
            src="/img/maintenance/img-error-purple.svg"
            alt="Purple Shapes"
            fill
            priority
            className="animate-[wings_12s_ease-in-out_infinite]"
          />
        </div>
        <div className="mx-auto px-4 max-w-[550px] text-center">
          <div className="space-y-4">
            <h4>Something is wrong...</h4>
            <p className="text-base">
              The page you are looking for was moved, removed, renamed, or might have never existed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
