'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Inbox, Loader, Mail } from 'lucide-react'

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

export interface ForgotPasswordFormProps {
  setAuthView: React.Dispatch<React.SetStateAction<ViewType>>
  handleResetPassword: (values: z.infer<typeof formSchema>) => Promise<void>
}

const formSchema = z.object({ email: z.email() })

export function ForgotPasswordForm({ setAuthView, handleResetPassword }: ForgotPasswordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleResetPassword(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>
                    <Mail absoluteStrokeWidth size={20} strokeWidth={1.5} aria-hidden="true" />
                  </InputGroupText>
                </InputGroupAddon>
                <FormControl>
                  <InputGroupInput {...field} type="email" autoComplete="on" />
                </FormControl>
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
              <Inbox absoluteStrokeWidth size={20} strokeWidth={1.5} />
              Email Me
            </>
          )}
        </Button>
        <div className="text-center text-sm">
          {'Go back to '}
          <a
            onClick={() => setAuthView(VIEWS.LOGIN)}
            className="underline underline-offset-4 cursor-pointer"
          >
            Login
          </a>
        </div>
      </form>
    </Form>
  )
}
