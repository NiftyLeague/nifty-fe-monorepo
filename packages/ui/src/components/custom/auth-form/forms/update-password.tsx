import { createSignal } from 'solid-js'
import { createForm } from '@modular-forms/solid'

import { zodForm } from './zod-form'
import { z } from 'zod'
import { KeyRound, Loader, Save } from 'lucide-solid'

import { Button } from '@nl/ui/base/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@nl/ui/base/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
} from '@nl/ui/base/input-group'

const formSchema = z.object({
  old_password: z.string().min(1),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be a maximum of 32 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
})

export interface UpdatePasswordFormProps {
  handleUpdatePassword: (values: z.infer<typeof formSchema>) => Promise<void>
}

export function UpdatePasswordForm(props: UpdatePasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = createSignal(false)
  const [showNewPassword, setShowNewPassword] = createSignal(false)
  const [form] = createForm<z.infer<typeof formSchema>>({
    validate: zodForm(formSchema),
    initialValues: { old_password: '', new_password: '' },
  })

  // `method="post"` keeps a pre-hydration native submit (Enter before Solid attaches)
  // from falling back to GET, which would put typed fields into the URL.
  return (
    <Form of={form} onSubmit={props.handleUpdatePassword} method="post" class="grid gap-4">
      <FormField
        of={form}
        name="old_password"
        render={({ field, props: fieldProps }) => (
          <FormItem>
            <FormLabel>Old Password</FormLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <KeyRound absoluteStrokeWidth size={20} strokeWidth={1.5} aria-hidden="true" />
                </InputGroupText>
              </InputGroupAddon>
              <FormControl>
                <InputGroupInput
                  {...fieldProps}
                  type={showOldPassword() ? 'text' : 'password'}
                  value={field.value ?? ''}
                  autocomplete="current-password"
                />
              </FormControl>
              {field.value ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupPasswordToggle
                    visible={showOldPassword()}
                    onVisibleChange={setShowOldPassword}
                    disabled={form.submitting}
                  />
                </InputGroupAddon>
              ) : null}
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        of={form}
        name="new_password"
        render={({ field, props: fieldProps }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <KeyRound absoluteStrokeWidth size={20} strokeWidth={1.5} aria-hidden="true" />
                </InputGroupText>
              </InputGroupAddon>
              <FormControl>
                <InputGroupInput
                  {...fieldProps}
                  type={showNewPassword() ? 'text' : 'password'}
                  value={field.value ?? ''}
                  autocomplete="new-password"
                />
              </FormControl>
              {field.value ? (
                <InputGroupAddon align="inline-end">
                  <InputGroupPasswordToggle
                    visible={showNewPassword()}
                    onVisibleChange={setShowNewPassword}
                    disabled={form.submitting}
                  />
                </InputGroupAddon>
              ) : null}
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
            <Save absoluteStrokeWidth size={20} strokeWidth={1.5} />
            Update Password
          </>
        )}
      </Button>
    </Form>
  )
}
