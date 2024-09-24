import Image from 'next/image';
import { Grid2 } from '@mui/material';
import Raffle from './Raffle';
import MyNFTL from './MyNFTL';

const RaffleOverview = (): JSX.Element => {
  return (
    <Grid2 container flexDirection="row" spacing={4} sx={{ maxHeight: 'cacl(100vh - 100px)' }}>
      <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
        <Grid2 container flexDirection="column" spacing={4}>
          <Grid2 size={{ xs: 12 }}>
            <Raffle />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <MyNFTL />
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
        <Grid2 container flexDirection="column" spacing={1}>
          <Grid2 size={{ xs: 12 }} textAlign="center">
            <iframe
              src="https://dune.com/embeds/2181657/3574299"
              height="150"
              width="500"
              title="Total NFTL Burnt"
              style={{ backgroundColor: 'cornsilk', maxWidth: '100%' }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }} textAlign="center">
            <Image
              src="/img/events/raffle.webp"
              alt="Nifty Raffle"
              width={854}
              height={952}
              style={{ maxWidth: 500, width: '100%', height: 'auto' }}
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default RaffleOverview;
