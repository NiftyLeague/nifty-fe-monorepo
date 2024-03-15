'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { Button, Card, CardActions, CardContent, CardMedia, Stack, SxProps, Theme, Typography } from '@mui/material';
import ExternalIcon from '@/components/ExternalIcon';

type CardGameContentProps = {
  actions?: React.ReactNode;
  description?: string;
  externalLink?: { title: string; src: string };
  isComingSoon?: boolean;
  onPlayOnDesktopClick?: React.MouseEventHandler<HTMLButtonElement>;
  onPlayOnWebClick?: React.MouseEventHandler<HTMLButtonElement>;
  required?: string;
  showMore?: boolean;
  title?: string;
};

const CardGameContent = ({
  actions,
  description,
  externalLink,
  isComingSoon,
  onPlayOnDesktopClick,
  onPlayOnWebClick,
  required,
  showMore,
  title,
}: CardGameContentProps) => {
  const theme = useTheme();
  const [moreStatus, setMoreStatus] = useState(false);
  const handleMoreStatus = () => {
    setMoreStatus(!moreStatus);
  };

  return (
    <Stack justifyContent="space-between" flexGrow={1}>
      <CardContent
        sx={{
          padding: '24px 24px 0',
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography gutterBottom variant="h3" component="div">
            {title}
          </Typography>
          {externalLink ? (
            <Link href={externalLink.src} target="_blank" rel="noreferrer">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  minWidth: 165,
                  flex: 1,
                  justifyContent: 'space-between',
                  marginTop: -1,
                }}
              >
                {externalLink.title} <ExternalIcon />
              </Button>
            </Link>
          ) : null}
        </Stack>
        {isComingSoon && (
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              color: theme.palette.warning.main,
            }}
          >
            Coming 2023
          </Typography>
        )}
        {required && (
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              color: theme.palette.warning.main,
            }}
          >
            {required}
          </Typography>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          whiteSpace="pre-wrap"
          maxHeight={moreStatus ? 'inherit' : 42}
          sx={{ overflowY: 'hidden' }}
        >
          {description}
        </Typography>
        {showMore && !moreStatus && (
          <Typography
            variant="body2"
            color="#620edf"
            whiteSpace="pre-wrap"
            onClick={handleMoreStatus}
            sx={{ cursor: 'pointer' }}
          >
            more..
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Stack direction="row" flexWrap="wrap" columnGap={1} rowGap={2} width="100%">
          {actions || (
            <>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  minWidth: 80,
                  flex: 1,
                }}
                onClick={onPlayOnDesktopClick}
              >
                Play on Desktop
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  minWidth: 80,
                  flex: 1,
                }}
                onClick={onPlayOnWebClick}
              >
                Play on Web
              </Button>
            </>
          )}
        </Stack>
      </CardActions>
    </Stack>
  );
};

export interface GameCardProps {
  actions?: React.ReactNode;
  autoHeight?: boolean;
  contents?: React.ReactNode;
  description?: string;
  externalLink?: { title: string; src: string };
  image?: string;
  isComingSoon?: boolean;
  onlineCounter?: number;
  onPlayOnDesktopClick?: React.MouseEventHandler<HTMLButtonElement>;
  onPlayOnWebClick?: React.MouseEventHandler<HTMLButtonElement>;
  required?: string;
  showMore?: boolean;
  sx?: SxProps<Theme>;
  title?: string;
}

const GameCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<GameCardProps>>> = ({
  actions,
  autoHeight = false,
  contents,
  description,
  externalLink,
  image,
  isComingSoon,
  onlineCounter,
  onPlayOnDesktopClick,
  onPlayOnWebClick,
  required,
  showMore = false,
  sx,
  title,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: autoHeight ? 'auto' : '100%',
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.border}`,
        ...sx,
      }}
    >
      <CardMedia component="img" height="auto" image={image} alt={title} />
      {contents || (
        <CardGameContent
          actions={actions}
          description={description}
          externalLink={externalLink}
          isComingSoon={isComingSoon}
          onPlayOnDesktopClick={onPlayOnDesktopClick}
          onPlayOnWebClick={onPlayOnWebClick}
          required={required}
          showMore={showMore}
          title={title}
        />
      )}
    </Card>
  );
};

export default GameCard;
