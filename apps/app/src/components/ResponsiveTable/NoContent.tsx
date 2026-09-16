/**
 * Used for default text if no content found for table/list
 */
const NoContent = ({ text }: { text?: string }) => {
  return (
    <div class="flex justify-center p-5">
      <span>{text || 'No Content'}</span>
    </div>
  )
}

export default NoContent
