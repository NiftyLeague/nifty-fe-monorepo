import { splitProps, type JSX } from 'solid-js'
import { spread } from 'solid-js/web'
import { type VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@nl/ui/base/button'
import NativeImage from '@nl/ui/custom/native-image'
import {
  Dialog as DialogBase,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nl/ui/base/dialog'

interface DialogProps {
  cancelText?: string
  cancelVariant?: VariantProps<typeof buttonVariants>['variant']
  confirmText?: string
  confirmVariant?: VariantProps<typeof buttonVariants>['variant']
  children?: JSX.Element
  defaultOpen?: boolean
  description: string | JSX.Element
  hideDescription?: boolean
  hideTitle?: boolean
  onCancel?: (event: MouseEvent) => void
  onConfirm?: (event: MouseEvent) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  showCloseButton?: boolean
  title: string | JSX.Element
  triggerElement?: JSX.Element
}

export function Dialog(props: DialogProps) {
  const [local] = splitProps(props, [
    'children',
    'description',
    'hideDescription',
    'hideTitle',
    'onConfirm',
    'showCloseButton',
    'title',
    'triggerElement',
  ])
  const content = local.children

  // Kobalte has no `asChild` slot: `as` swaps in a component. `triggerElement`
  // is a rendered DOM element, so its props are applied imperatively.
  const triggerAs = (triggerProps: Record<string, unknown>) => {
    const element = local.triggerElement as HTMLElement | undefined
    if (element) spread(element, triggerProps, false, true)
    return element
  }

  return (
    <DialogBase defaultOpen={props.defaultOpen} open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger as={triggerAs} />
      <DialogContent showCloseButton={local.showCloseButton ?? true}>
        <DialogHeader>
          <DialogTitle
            class={
              local.hideTitle
                ? 'hidden'
                : 'bg-background grid grid-cols-[40px_1fr_40px] gap-4 items-center text-2xl md:text-3xl'
            }
          >
            <NativeImage
              src="/img/logos/NL/white.webp"
              alt="Company Logo"
              width={45}
              height={42}
              loading="eager"
            />
            {local.title}
          </DialogTitle>
          <DialogDescription class={local.hideDescription ? 'hidden' : ''}>
            {local.description}
          </DialogDescription>
        </DialogHeader>

        <div class="max-h-[75vh] overflow-y-auto overflow-x-hidden -m-6 p-6 mt-0 pt-0">
          <div class="grid grid-cols-1 gap-4 text-center sm:text-left">{content}</div>
        </div>

        {local.onConfirm && (
          <DialogFooter>
            <DialogClose
              as={Button}
              variant={props.cancelVariant ?? 'outline'}
              onClick={props.onCancel}
              class="cursor-pointer"
            >
              {props.cancelText ?? 'Cancel'}
            </DialogClose>
            <Button
              type="submit"
              variant={props.confirmVariant ?? 'default'}
              onClick={local.onConfirm}
              class="cursor-pointer"
            >
              {props.confirmText ?? 'Continue'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogBase>
  )
}

export default Dialog
