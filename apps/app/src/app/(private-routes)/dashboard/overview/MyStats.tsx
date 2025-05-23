'use client';

import Link from 'next/link';
import { Button, Grid, Stack } from '@mui/material';
import SectionTitle from '@/components/sections/SectionTitle';
import { sectionSpacing } from '@nl/theme';
import { useGamerProfile } from '@/hooks/useGamerProfile';
import GamerProfileContext from '@/contexts/GamerProfileContext';
import LeftInfo from '../gamer-profile/_Stats/LeftInfo';
import type { Profile } from '@/types/account';

const MyStats = ({ profile }: { profile?: Profile }): React.ReactNode => {
  return (
    <Grid container spacing={sectionSpacing} sx={{ height: '100%' }}>
      <Grid size={{ xs: 12 }}>
        <SectionTitle
          firstSection
          variant="h3"
          actions={
            <Stack direction="row" gap={2}>
              <Button variant="outlined" component={Link} href="/dashboard/gamer-profile">
                View All Stats
              </Button>
            </Stack>
          }
        >
          My Stats
        </SectionTitle>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ height: '100%' }}>
        <Stack direction="row" spacing={5}>
          <LeftInfo data={profile?.stats?.total} />
        </Stack>
      </Grid>
    </Grid>
  );
};

const MyStatsContext = () => {
  const { profile, error, loadingProfile } = useGamerProfile();
  return !error && (profile || loadingProfile) ? (
    <GamerProfileContext.Provider
      value={{
        isLoadingProfile: loadingProfile,
        isLoadingDegens: false,
        isLoadingComics: false,
        isLoadingItems: false,
      }}
    >
      <MyStats profile={profile} />
    </GamerProfileContext.Provider>
  ) : null;
};

export default MyStatsContext;
