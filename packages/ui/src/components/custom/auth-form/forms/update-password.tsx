'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { KeyRound, Loader, Save } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@nl/ui/base/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
} from '@nl/ui/base/input-group'

export interface UpdatePasswordFormProps {
  handleUpdatePassword: (values: z.infer<typeof formSchema>) => Promise<void>
}

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

export function UpdatePasswordForm({ handleUpdatePassword }: UpdatePasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { old_password: '', new_password: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleUpdatePassword(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
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
                    {...field}
                    type={showOldPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                  />
                </FormControl>
                {field.value ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupPasswordToggle
                      visible={showOldPassword}
                      onVisibleChange={setShowOldPassword}
                      disabled={form.formState.isSubmitting}
                    />
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
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
                    {...field}
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                  />
                </FormControl>
                {field.value ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupPasswordToggle
                      visible={showNewPassword}
                      onVisibleChange={setShowNewPassword}
                      disabled={form.formState.isSubmitting}
                    />
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader absoluteStrokeWidth className="animate-spin" size={20} strokeWidth={1.5} />
          ) : (
            <>
              <Save absoluteStrokeWidth size={20} strokeWidth={1.5} />
              Update Password
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
