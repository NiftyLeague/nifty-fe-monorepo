'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@nl/ui/base/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@nl/ui/base/form';
import { Input } from '@nl/ui/custom/input';
import { Icon } from '@nl/ui/base/icon';

export interface UpdatePasswordFormProps {
  handleUpdatePassword: (values: z.infer<typeof formSchema>) => Promise<void>;
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
});

export function UpdatePasswordForm({ handleUpdatePassword }: UpdatePasswordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { old_password: '', new_password: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleUpdatePassword(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  startIcon={<Icon name="key-round" />}
                />
              </FormControl>
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
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" startIcon={<Icon name="key-round" />} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Icon name="loader" className="animate-spin" />
          ) : (
            <>
              <Icon name="save" />
              Update Password
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default UpdatePasswordForm;
