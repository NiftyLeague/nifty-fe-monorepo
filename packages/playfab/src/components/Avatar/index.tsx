import { Show, createSignal, type JSX } from 'solid-js'
import { toast } from 'solid-sonner'

import { Button } from '@nl/ui/base/button'
import { Input } from '@nl/ui/base/input'
import NativeImage from '@nl/ui/custom/native-image'
import { Icon } from '@nl/ui/base/icon'

export default function Avatar(props: {
  uid: string
  url?: string
  size: number
  onUpload: (url: string) => void
}) {
  let fileInputEl: HTMLInputElement | undefined
  const [uploading, setUploading] = createSignal(false)

  const uploadAvatar: JSX.EventHandler<HTMLInputElement, Event> = async (event) => {
    try {
      setUploading(true)

      const files = event.currentTarget.files
      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = files[0]
      const fileExt = file?.name?.split('.').pop()
      const fileName = `${props.uid}.${fileExt}`
      const filePath = `${fileName}`

      // TODO: handle upload image to S3

      props.onUpload(filePath)
    } catch (error) {
      toast.error('Error updating avatar.')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleButtonClick = () => {
    if (fileInputEl && !uploading()) {
      fileInputEl.click()
    }
  }

  return (
    <div class="w-full grid justify-items-center gap-2">
      <Show
        when={props.url}
        fallback={
          <div
            class="bg-background border rounded-full"
            style={{ height: `${props.size}px`, width: `${props.size}px` }}
          />
        }
      >
        {(url) => (
          <NativeImage
            src={url()}
            alt="Avatar"
            class="rounded-full"
            height={props.size}
            width={props.size}
            style={{ width: `${props.size}px`, height: `${props.size}px` }}
          />
        )}
      </Show>
      <div style={{ width: `${props.size}px` }}>
        <Button disabled={uploading()} class="w-full" onClick={handleButtonClick}>
          <Show
            when={uploading()}
            fallback={
              <>
                <Icon name="upload" /> Upload
              </>
            }
          >
            <>
              <Icon name="loader" className="animate-spin" /> Uploading
            </>
          </Show>
        </Button>
        <Input
          ref={(el: HTMLInputElement) => (fileInputEl = el)}
          style={{ visibility: 'hidden', position: 'absolute' }}
          type="file"
          id="upload-hidden-input"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading()}
        />
      </div>
    </div>
  )
}
