export default function ResponsiveLabel({ mobile, desktop }: { mobile: string; desktop: string }) {
  return (
    <>
      <span className="responsive-label-mobile">{mobile}</span>
      <span className="responsive-label-desktop">{desktop}</span>
    </>
  )
}
