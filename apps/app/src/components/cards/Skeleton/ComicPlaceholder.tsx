import { Skeleton } from '@nl/ui/base/skeleton'
import useComicDimension from '@/hooks/useComicDimension'

const ComicPlaceholder = () => {
  const { width, height } = useComicDimension()
  return <Skeleton className="rounded-[var(--radius-default)]" style={{ width, height }} />
}

export default ComicPlaceholder
