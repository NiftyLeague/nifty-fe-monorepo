export function loader() {
  throw new Error('M2 controlled failure')
}
export default function Failure() {
  return null
}
