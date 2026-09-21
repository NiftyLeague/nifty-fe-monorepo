import {
  createContext,
  createEffect,
  createUniqueId,
  onMount,
  Show,
  splitProps,
  useContext,
  type ComponentProps,
  type JSX,
} from 'solid-js'
import {
  Field as ModularField,
  Form as ModularForm,
  type FieldElementProps,
  type FieldPath,
  type FieldStore,
  type FieldValues,
  type FormStore,
} from '@modular-forms/solid'

import { cn } from '@nl/ui/utils'
import { Label } from '@nl/ui/base/label'

/**
 * Solid port of the shadcn form composition layer, backed by
 * @modular-forms/solid instead of react-hook-form.
 *
 * API mapping for consumers migrating from the React version:
 * - `useForm({ resolver })` → `createForm({ validate: zodForm(schema) })`
 * - `<Form {...form}><form onSubmit={form.handleSubmit(fn)}>` →
 *   `<Form of={form} onSubmit={fn}>`
 * - `<FormField control={form.control} name render={({field}) => …}>` →
 *   `<FormField of={form} name render={({field, props}) => …}>`; spread `props`
 *   onto the input and read `field.value` / `field.error` reactively.
 */
const Form = ModularForm

type FormFieldContextValue = {
  name: string
  error: () => string
}

const FormFieldContext = createContext<FormFieldContextValue>(
  null as unknown as FormFieldContextValue
)

type FormFieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = {
  of: FormStore<TFieldValues>
  name: TFieldName
  render: (args: {
    field: FieldStore<TFieldValues, TFieldName>
    props: FieldElementProps<TFieldValues, TFieldName>
  }) => JSX.Element
}

const FormField = <TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>>(
  props: FormFieldProps<TFieldValues, TFieldName>
) => {
  // Field's prop type defers on TFieldName, so bind the generics explicitly.
  const TypedField = ModularField as unknown as (fieldProps: {
    of: FormStore<TFieldValues>
    name: TFieldName
    children: (
      field: FieldStore<TFieldValues, TFieldName>,
      props: FieldElementProps<TFieldValues, TFieldName>
    ) => JSX.Element
  }) => JSX.Element
  return (
    <TypedField of={props.of} name={props.name}>
      {(field, fieldProps) => (
        <FormFieldContext.Provider value={{ name: props.name, error: () => field.error }}>
          {props.render({ field, props: fieldProps })}
        </FormFieldContext.Provider>
      )}
    </TypedField>
  )
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    get error() {
      return fieldContext.error() ? { message: fieldContext.error() } : undefined
    },
    get invalid() {
      return Boolean(fieldContext.error())
    },
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}

type FormItemContextValue = { id: string }

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

type DivProps = ComponentProps<'div'> & { className?: string }
type PProps = ComponentProps<'p'> & { className?: string }

function FormItem(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  const id = createUniqueId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        class={cn('grid gap-2', local.class, local.className)}
        {...others}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel(props: ComponentProps<'label'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  const field = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={field.invalid}
      class={cn('data-[error=true]:text-destructive', local.class, local.className)}
      for={field.formItemId}
      {...others}
    />
  )
}

/**
 * Sets the form item's id and ARIA wiring on the first element child. Solid
 * has no Slot primitive, so the attributes are applied to the child's root
 * element after mount — the DOM result is identical.
 */
function FormControl(props: { children?: JSX.Element }) {
  const field = useFormField()
  let host: HTMLSpanElement | undefined

  const apply = () => {
    const hostChild = host?.firstElementChild as HTMLElement | null
    if (!hostChild) return

    // Composite controls such as Checkbox render a role wrapper around the
    // labelable input. Wire the field attributes to that input instead of the
    // wrapper so `<label for>` remains valid after hydration.
    const target = hostChild.matches('input, select, textarea, button')
      ? hostChild
      : ((hostChild.querySelector('input, select, textarea, button') as HTMLElement | null) ??
        hostChild)

    target.id = field.formItemId
    target.setAttribute(
      'aria-describedby',
      !field.invalid
        ? `${field.formDescriptionId}`
        : `${field.formDescriptionId} ${field.formMessageId}`
    )
    target.setAttribute('aria-invalid', String(field.invalid))
  }

  // Track `field.invalid` so the wiring updates as validation state changes.
  onMount(apply)
  createEffect(apply)

  return (
    <span ref={(el) => (host = el)} data-slot="form-control" style="display: contents">
      {props.children}
    </span>
  )
}

function FormDescription(props: PProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      class={cn('text-muted-foreground text-sm', local.class, local.className)}
      {...others}
    />
  )
}

function FormMessage(props: PProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  const field = useFormField()

  return (
    <Show when={field.error?.message || local.children}>
      <p
        data-slot="form-message"
        id={field.formMessageId}
        class={cn('text-destructive text-sm', local.class, local.className)}
        {...others}
      >
        {field.error?.message ? String(field.error.message) : local.children}
      </p>
    </Show>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
