import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import { useForm } from 'react-hook-form'
import React from 'react'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from '@nl/ui/base/form'
import { Input } from '@nl/ui/base/input'

/** Wraps children in a react-hook-form FormProvider */
function TestForm({ children }: { children: React.ReactNode }) {
  const form = useForm({ defaultValues: { name: '' } })
  return <Form {...form}>{children}</Form>
}

describe('Form components', () => {
  describe('useFormField', () => {
    it('throws when called outside FormField context', () => {
      function TestComponent() {
        useFormField()
        return null
      }

      expect(() => {
        render(
          <TestForm>
            <TestComponent />
          </TestForm>
        )
      }).toThrow('useFormField should be used within <FormField>')
    })

    it('returns field state when inside FormField and FormItem', () => {
      const state: { current: ReturnType<typeof useFormField> | null } = { current: null }

      function TestComponent() {
        state.current = useFormField()
        return null
      }

      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <TestComponent />
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const val = state.current
      expect(val).not.toBeNull()
      expect(val?.name).toBe('name')
      expect(val?.formItemId).toMatch(/-form-item$/)
      expect(val?.formDescriptionId).toMatch(/-form-item-description$/)
      expect(val?.formMessageId).toMatch(/-form-item-message$/)
    })
  })

  describe('FormItem', () => {
    it('renders a div with form-item data-slot', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const item = document.querySelector('[data-slot="form-item"]')
      expect(item).not.toBeNull()
      expect(item?.tagName).toBe('DIV')
    })

    it('applies className and spreads div props', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem className="extra-class" data-custom="value">
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const item = document.querySelector('[data-slot="form-item"]')
      expect(item?.className).toContain('extra-class')
      expect(item?.getAttribute('data-custom')).toBe('value')
    })
  })

  describe('FormLabel', () => {
    it('renders a label element linked to form control', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const label = screen.getByText('Username')
      expect(label).not.toBeNull()
      expect(label.getAttribute('data-slot')).toBe('form-label')
      expect(label.getAttribute('for')).toMatch(/-form-item$/)
    })

    it('shows data-error=true when a validation error exists on the field', () => {
      function ErrorForm({ children }: { children: React.ReactNode }) {
        const form = useForm({
          defaultValues: { email: '' },
          errors: { email: { type: 'required', message: 'Required' } },
        })
        return <Form {...form}>{children}</Form>
      }

      render(
        <ErrorForm>
          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </ErrorForm>
      )

      const label = screen.getByText('Email')
      expect(label.getAttribute('data-error')).toBe('true')
    })
  })

  describe('FormControl', () => {
    it('passes aria attributes to slotted child', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input data-testid="name-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const input = screen.getByTestId('name-input')
      expect(input.getAttribute('id')).toMatch(/-form-item$/)
      expect(input.getAttribute('aria-describedby')).toMatch(/-form-item-description/)
      expect(input.getAttribute('aria-invalid')).toBe('false')
    })
  })

  describe('FormDescription', () => {
    it('renders description text with form-description data-slot', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
                <FormDescription>Enter your username</FormDescription>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const desc = document.querySelector('[data-slot="form-description"]')
      expect(desc).not.toBeNull()
      expect(desc?.textContent).toBe('Enter your username')
      expect(desc?.getAttribute('id')).toMatch(/-form-item-description$/)
    })
  })

  describe('FormMessage', () => {
    it('renders nothing when there is no error and no children', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TestForm>
      )

      expect(document.querySelector('[data-slot="form-message"]')).toBeNull()
    })

    it('renders children text when no error is present', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
                <FormMessage>Help text</FormMessage>
              </FormItem>
            )}
          />
        </TestForm>
      )

      const msg = document.querySelector('[data-slot="form-message"]')
      expect(msg).not.toBeNull()
      expect(msg?.textContent).toBe('Help text')
      expect(msg?.getAttribute('id')).toMatch(/-form-item-message$/)
    })

    it('renders the error message string when the field has an error', () => {
      function ErrorForm({ children }: { children: React.ReactNode }) {
        const form = useForm({
          defaultValues: { email: '' },
          errors: { email: { type: 'required', message: 'Email is required' } },
        })
        return <Form {...form}>{children}</Form>
      }

      render(
        <ErrorForm>
          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ErrorForm>
      )

      const msg = document.querySelector('[data-slot="form-message"]')
      expect(msg).not.toBeNull()
      expect(msg?.textContent).toBe('Email is required')
    })
  })

  describe('full composition', () => {
    it('renders a complete form field with all subcomponents', () => {
      render(
        <TestForm>
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input data-testid="name-input" />
                </FormControl>
                <FormDescription>Enter your full name</FormDescription>
                <FormMessage>This field is required</FormMessage>
              </FormItem>
            )}
          />
        </TestForm>
      )

      expect(screen.getByText('Full Name')).not.toBeNull()
      expect(screen.getByText('Enter your full name')).not.toBeNull()
      expect(screen.getByText('This field is required')).not.toBeNull()
      expect(screen.getByTestId('name-input')).not.toBeNull()
    })
  })
})
