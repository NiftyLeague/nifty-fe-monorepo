import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useComicDimension from '@/hooks/useComicDimension'

const ComicPlaceholder = () => {
  const dimension = useComicDimension()
  return (
    <DeferredSkeleton
      class="w-(--dim-w) h-(--dim-h) rounded-(--radius-default)"
      style={{ '--dim-w': `${dimension.width}px`, '--dim-h': `${dimension.height}px` }}
    />
  )
}

export default ComicPlaceholder
