'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardActions, CardContent, CardMedia, Stack, SxProps, Theme, Typography } from '@mui/material';
import { ExternalIcon } from '@nl/ui/custom/external-icon';

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
  const [moreStatus, setMoreStatus] = useState(false);
  const handleMoreStatus = () => {
    setMoreStatus(!moreStatus);
  };

  return (
    <Stack flexGrow={1} sx={{ justifyContent: 'space-between', backgroundColor: 'var(--color-card)' }}>
      <CardContent sx={{ padding: '24px 24px 0' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h4" component="div">
            {title}
          </Typography>
          {externalLink ? (
            <Link href={externalLink.src} target="_blank" rel="noreferrer">
              <Button variant="contained" color="primary" fullWidth className="!-mt-2">
                {externalLink.title} <ExternalIcon />
              </Button>
            </Link>
          ) : null}
        </Stack>
        {isComingSoon && (
          <Typography variant="body2" gutterBottom sx={{ color: 'var(--color-warning)' }}>
            Coming 2023
          </Typography>
        )}
        {required && (
          <Typography variant="body2" gutterBottom sx={{ color: 'var(--color-warning)' }}>
            {required}
          </Typography>
        )}
        <Typography
          variant="body2"
          whiteSpace="pre-wrap"
          maxHeight={moreStatus ? 'inherit' : 42}
          sx={{ color: 'var(--color-muted-foreground)', overflowY: 'hidden' }}
        >
          {description}
        </Typography>
        {showMore && !moreStatus && (
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-purple)', cursor: 'pointer' }}
            whiteSpace="pre-wrap"
            onClick={handleMoreStatus}
          >
            more..
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Stack direction="row" flexWrap="wrap" columnGap={1} rowGap={2} width="100%">
          {actions || (
            <>
              <Button variant="contained" fullWidth sx={{ minWidth: 80, flex: 1 }} onClick={onPlayOnDesktopClick}>
                Play on Desktop
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ minWidth: 80, flex: 1 }}
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
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: autoHeight ? 'auto' : '100%',
        border: 'var(--border-default)',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
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
