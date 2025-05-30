import SearchParamsWrapper from '@/components/SearchParamsWrapper';

export default function NotFound() {
  return (
    <SearchParamsWrapper>
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </SearchParamsWrapper>
  );
}
