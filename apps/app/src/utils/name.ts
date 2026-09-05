const NAME_REGEX = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/
const DOUBLE_SPACE_REGEX = /^(?!.*[ ]{2})/

export const getErrorForName = (value: string): string => {
  if (!value.length) {
    return 'Please input a name.'
  }

  if (value.length > 32) {
    return 'Max character length of 32.'
  }

  if (!NAME_REGEX.test(value)) {
    return 'Please only use numbers, letters, or spaces.'
  }

  if (value.charAt(0) === ' ' || value.charAt(value.length - 1) === ' ') {
    return 'No leading or trailing spaces.'
  }

  if (!DOUBLE_SPACE_REGEX.test(value)) {
    return 'No double spaces allowed.'
  }

  return ''
}
