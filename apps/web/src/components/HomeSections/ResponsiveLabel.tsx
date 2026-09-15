export default function ResponsiveLabel({ mobile, desktop }: { mobile: string; desktop: string }) {
  return (
    <>
      <span class="responsive-label-mobile">{mobile}</span>
      <span class="responsive-label-desktop">{desktop}</span>
    </>
  )
}
