import DegenTraitsDetailsDialog from '@/components/dialog/DegenDialog/DegenTraitsDetailsDialog';

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const tokenId = params.id;

  return {
    title: `NL DEGEN #${tokenId}`,
    openGraph: {
      images: [`/img/degens/nfts/${tokenId}.webp`],
    },
  };
}

export default async function DegenTraitsDetailsPage(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const tokenId = params.id;
  const query = searchParams.query;

  return <DegenTraitsDetailsDialog tokenId={tokenId} query={query} />;
}
