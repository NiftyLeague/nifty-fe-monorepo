import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useComicDimension from '@/hooks/useComicDimension'

const ComicPlaceholder = () => {
  const { width, height } = useComicDimension()
  return <DeferredSkeleton className="rounded-[var(--radius-default)]" style={{ width, height }} />
}

export default ComicPlaceholder
