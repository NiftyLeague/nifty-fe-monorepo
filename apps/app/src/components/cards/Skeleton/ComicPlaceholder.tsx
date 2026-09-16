import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useComicDimension from '@/hooks/useComicDimension'

const ComicPlaceholder = () => {
  const { width, height } = useComicDimension()
  return (
    <DeferredSkeleton
      class="w-(--dim-w) h-(--dim-h) rounded-(--radius-default)"
      style={{ '--dim-w': `${width}px`, '--dim-h': `${height}px` }}
    />
  )
}

export default ComicPlaceholder
