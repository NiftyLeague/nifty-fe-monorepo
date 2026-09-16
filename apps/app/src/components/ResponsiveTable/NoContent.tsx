/**
 * Used for default text if no content found for table/list
 */
const NoContent = (props: { text?: string }) => {
  return (
    <div class="flex justify-center p-5">
      <span>{props.text || 'No Content'}</span>
    </div>
  )
}

export default NoContent
