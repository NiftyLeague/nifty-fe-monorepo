/**
 * Used for default text if no content found for table/list
 */
const NoContent = ({ text }: { text?: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <span>{text || 'No Content'}</span>
    </div>
  );
};

export default NoContent;
