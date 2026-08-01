'use client'

import { Grid } from '@mui/material'
import MyComics from './MyComics'
import MyDegens from './MyDegens'
import MyItems from './MyItems'
import MyNFTL from './_MyNFTL'
import MyStats from './MyStats'

const DashboardOverview = (): React.ReactNode => {
  return (
    <Grid container direction="row" spacing={4} sx={{ height: 'inherit' }}>
      <Grid container sx={{ flexDirection: 'column' }} size={{ xs: 12, lg: 5.5 }} spacing={4}>
        <Grid size={{ xs: 12 }}>
          <MyNFTL />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyStats />
        </Grid>
      </Grid>
      <Grid container sx={{ flexDirection: 'column' }} size={{ xs: 12, lg: 6.5 }} spacing={4}>
        <Grid size={{ xs: 12 }}>
          <MyDegens />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyComics />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <MyItems />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DashboardOverview
