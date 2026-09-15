import { act, render, renderHook, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'
import { createForm, setError, zodForm } from '@modular-forms/solid'
import type { JSX } from 'solid-js'
import { z } from 'zod'

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

const schema = z.object({ name: z.string().min(1, 'Required') })
const errorSchema = z.object({ email: z.string().min(1, 'Email is required') })

/** Wraps children in a modular-forms Form with a `name` field */
function TestForm(props: { children: JSX.Element }) {
  const [form] = createForm<{ name: string }>({
    validate: zodForm(schema),
    initialValues: { name: '' },
  })
  return <Form of={form}>{props.children}</Form>
}

function TestComponent() {
  useFormField()
  return null
}

function FormFieldWrapper(props: {
  children: JSX.Element
  form: ReturnType<typeof createErrorForm>
}) {
  return (
    <Form of={props.form}>
      <FormField
        of={props.form}
        name="email"
        render={() => <FormItem>{props.children}</FormItem>}
      />
    </Form>
  )
}

function createErrorForm() {
  const [form] = createForm<{ email: string }>({
    validate: zodForm(errorSchema),
    initialValues: { email: '' },
  })
  return form
}

describe('Form components', () => {
  describe('useFormField', () => {
    it('throws when called outside FormField context', () => {
      expect(() => {
        render(() => (
          <TestForm>
            <TestComponent />
          </TestForm>
        ))
      }).toThrow('useFormField should be used within <FormField>')
    })

    it('returns field state when inside FormField and FormItem', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      const fieldWrapper = (props: { children: JSX.Element }) => (
        <Form of={form}>
          <FormField
            of={form}
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
                {props.children}
              </FormItem>
            )}
          />
        </Form>
      )
      const { result } = renderHook(() => useFormField(), { wrapper: fieldWrapper })

      expect(result.current).not.toBeNull()
      expect(result.current.name).toBe('name')
      expect(result.current.formItemId).toMatch(/-form-item$/)
      expect(result.current.formDescriptionId).toMatch(/-form-item-description$/)
      expect(result.current.formMessageId).toMatch(/-form-item-message$/)
    })
  })

  describe('FormItem', () => {
    it('renders a div with form-item data-slot', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      ))

      const item = document.querySelector('[data-slot="form-item"]')
      expect(item).not.toBeNull()
      expect(item?.tagName).toBe('DIV')
    })

    it('applies className and spreads div props', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
            name="name"
            render={() => (
              <FormItem className="extra-class" data-custom="value">
                <FormControl>
                  <Input />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      ))

      const item = document.querySelector('[data-slot="form-item"]')
      expect(item?.className).toContain('extra-class')
      expect(item?.getAttribute('data-custom')).toBe('value')
    })
  })

  describe('FormLabel', () => {
    it('renders a label element linked to form control', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
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
        </Form>
      ))

      const label = screen.getByText('Username')
      expect(label).not.toBeNull()
      expect(label.getAttribute('data-slot')).toBe('form-label')
      expect(label.getAttribute('for')).toMatch(/-form-item$/)
    })

    it('shows data-error=true when a validation error exists on the field', () => {
      const form = createErrorForm()
      render(() => (
        <FormFieldWrapper form={form}>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input />
          </FormControl>
        </FormFieldWrapper>
      ))
      act(() => setError(form, 'email', 'Email is required'))

      const label = screen.getByText('Email')
      expect(label.getAttribute('data-error')).toBe('true')
    })
  })

  describe('FormControl', () => {
    it('passes aria attributes to slotted child', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
            name="name"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input data-testid="name-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      ))

      const input = screen.getByTestId('name-input')
      expect(input.getAttribute('id')).toMatch(/-form-item$/)
      expect(input.getAttribute('aria-describedby')).toMatch(/-form-item-description/)
      expect(input.getAttribute('aria-invalid')).toBe('false')
    })
  })

  describe('FormDescription', () => {
    it('renders description text with form-description data-slot', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
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
        </Form>
      ))

      const desc = document.querySelector('[data-slot="form-description"]')
      expect(desc).not.toBeNull()
      expect(desc?.textContent).toBe('Enter your username')
      expect(desc?.getAttribute('id')).toMatch(/-form-item-description$/)
    })
  })

  describe('FormMessage', () => {
    it('renders nothing when there is no error and no children', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
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
        </Form>
      ))

      expect(document.querySelector('[data-slot="form-message"]')).toBeNull()
    })

    it('renders children text when no error is present', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
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
        </Form>
      ))

      const msg = document.querySelector('[data-slot="form-message"]')
      expect(msg).not.toBeNull()
      expect(msg?.textContent).toBe('Help text')
      expect(msg?.getAttribute('id')).toMatch(/-form-item-message$/)
    })

    it('renders the error message string when the field has an error', () => {
      const form = createErrorForm()
      render(() => (
        <FormFieldWrapper form={form}>
          <FormControl>
            <Input />
          </FormControl>
          <FormMessage />
        </FormFieldWrapper>
      ))
      act(() => setError(form, 'email', 'Email is required'))

      const msg = document.querySelector('[data-slot="form-message"]')
      expect(msg).not.toBeNull()
      expect(msg?.textContent).toBe('Email is required')
    })
  })

  describe('full composition', () => {
    it('renders a complete form field with all subcomponents', () => {
      const [form] = createForm<{ name: string }>({
        validate: zodForm(schema),
        initialValues: { name: '' },
      })
      render(() => (
        <Form of={form}>
          <FormField
            of={form}
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
        </Form>
      ))

      expect(screen.getByText('Full Name')).not.toBeNull()
      expect(screen.getByText('Enter your full name')).not.toBeNull()
      expect(screen.getByText('This field is required')).not.toBeNull()
      expect(screen.getByTestId('name-input')).not.toBeNull()
    })
  })
})
