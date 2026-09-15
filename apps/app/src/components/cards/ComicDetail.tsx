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
      fallback={
        <div
          class="min-w-[345px] rounded-[5px] border border-[#363636]"
          style={{ height: '375px' }}
        />
      }
    >
      {(data) => (
        <div
          class="relative mx-auto min-w-[345px] overflow-hidden rounded-[5px]"
          style={{ height: '350px' }}
        >
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
