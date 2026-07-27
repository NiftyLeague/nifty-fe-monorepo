import { Stack, Typography, Box, Skeleton } from '@mui/material'

const TopInfoSkeleton = () => {
  return (
    <Stack>
      <Stack direction="row" spacing={5} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: '50%' }}>
          <Skeleton sx={{ my: '5px ' }} variant="rectangular" width="50%" height="26px" />
        </Box>
        <Box sx={{ width: '50%' }}>
          <Skeleton variant="rectangular" width="100%" height="25px" />
        </Box>
      </Stack>
      <Stack direction="row" spacing={5} sx={{ alignItems: 'center' }}>
        <Typography variant="h4" component="div" sx={{ width: '50%' }}>
          <Skeleton sx={{ my: '5px ' }} variant="rectangular" width="30%" height="26px" />
        </Typography>
        <Typography variant="h4" component="div" sx={{ width: '50%' }}>
          <Skeleton
            variant="rectangular"
            sx={{ display: 'inline-block' }}
            width="15%"
            height="19.76px"
          />
        </Typography>
      </Stack>
    </Stack>
  )
}

export default TopInfoSkeleton
