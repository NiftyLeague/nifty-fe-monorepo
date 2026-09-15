import type { FieldValues, FormErrors, PartialValues, ValidateForm } from '@modular-forms/solid'
import type { z } from 'zod'

/**
 * Zod 4-compatible `zodForm`. `@modular-forms/solid`'s built-in adapter is
 * typed against Zod 3 (`ZodType<any, any, FieldValues>`), which rejects Zod 4
 * schemas at the type level — the upstream maintainer recommends vendoring
 * this function (it's a thin `safeParseAsync` wrapper) until the package adds
 * a Zod 4 adapter. Mirrors upstream: first error per field path wins.
 */
export function zodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues>
): ValidateForm<TFieldValues> {
  return async (values: PartialValues<TFieldValues>) => {
    const result = await schema.safeParseAsync(values)
    const formErrors: Record<string, string> = {}
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        if (!formErrors[path]) {
          formErrors[path] = issue.message
        }
      }
    }
    return formErrors as FormErrors<TFieldValues>
  }
}
