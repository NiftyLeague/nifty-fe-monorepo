import { createForm, zodForm } from '@modular-forms/solid'
import { z } from 'zod'
import { Inbox, Loader, Mail } from 'lucide-solid'

import { Button } from '@nl/ui/base/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@nl/ui/base/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@nl/ui/base/input-group'

import { VIEWS } from '../constants'

type ViewType = (typeof VIEWS)[keyof typeof VIEWS]

const formSchema = z.object({ email: z.email() })

export interface ForgotPasswordFormProps {
  setAuthView: (view: ViewType) => void
  handleResetPassword: (values: z.infer<typeof formSchema>) => Promise<void>
}

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const [form] = createForm<z.infer<typeof formSchema>>({
    validate: zodForm(formSchema),
    initialValues: { email: '' },
  })

  // `method="post"` keeps a pre-hydration native submit (Enter before Solid attaches)
  // from falling back to GET, which would put typed fields into the URL.
  return (
    <Form of={form} onSubmit={props.handleResetPassword} method="post" class="grid gap-4">
      <FormField
        of={form}
        name="email"
        render={({ field, props: fieldProps }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <Mail absoluteStrokeWidth size={20} strokeWidth={1.5} aria-hidden="true" />
                </InputGroupText>
              </InputGroupAddon>
              <FormControl>
                <InputGroupInput
                  {...fieldProps}
                  type="email"
                  value={field.value ?? ''}
                  autocomplete="on"
                />
              </FormControl>
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" class="w-full" disabled={form.submitting}>
        {form.submitting ? (
          <Loader
            absoluteStrokeWidth
            class="animate-spin motion-reduce:animate-none"
            size={20}
            strokeWidth={1.5}
          />
        ) : (
          <>
            <Inbox absoluteStrokeWidth size={20} strokeWidth={1.5} />
            Email Me
          </>
        )}
      </Button>
      <div class="text-center text-sm">
        {'Go back to '}
        {/* A view switch, not navigation: a type="button" is keyboard focusable. */}
        <button
          type="button"
          onClick={() => props.setAuthView(VIEWS.LOGIN)}
          class="underline underline-offset-4 cursor-pointer"
        >
          Login
        </button>
      </div>
    </Form>
  )
}
