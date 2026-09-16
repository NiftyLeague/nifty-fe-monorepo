import { Show, type JSX } from 'solid-js'
import type { Comic } from '@/types/marketplace'
import ImageCard from '@/components/cards/ImageCard'

interface ComicDetailProps {
  data: Comic | null
}

const ComicDetail = (props: ComicDetailProps): JSX.Element => {
  return (
    <Show
      when={props.data}
      fallback={<div class="min-w-86.25 h-93.75 rounded-sm border border-(--card-border)" />}
    >
      {(data) => (
        <div class="relative mx-auto min-w-86.25 h-87.5 overflow-hidden rounded-sm">
          <ImageCard
            image={data().image}
            thumbnail={data().thumbnail}
            title={data().title}
            ratio={1}
          />
        </div>
      )}
    </Show>
  )
}

export default ComicDetail
