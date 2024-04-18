import { useContext } from 'react';
import { styled } from '@nl/theme';
import Image from 'next/image';
import { ImageList, ImageListItem, ImageListItemBar, Skeleton } from '@mui/material';

import IMXContext from '@/contexts/IMXContext';

const PREFIX = 'items-grid';

const classes = {
  titleWrap: `${PREFIX}-titleWrap`,
  title: `${PREFIX}-title`,
};

const Root = styled('div')({
  [`& .${classes.titleWrap}`]: {
    padding: 0,
  },
  [`& .${classes.title}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
});

const ITEMS = [
  { id: 1, name: 'CAPE', image: '/img/items/full/1.gif' },
  { id: 2, name: 'HALO', image: '/img/items/full/2.gif' },
  { id: 3, name: 'DIAMOND', image: '/img/items/full/3.gif' },
  { id: 4, name: 'BREAD', image: '/img/items/full/4.gif' },
  { id: 5, name: 'NL PURPLE', image: '/img/items/full/5.gif' },
  { id: 6, name: 'COMPANION', image: '/img/items/full/6.gif' },
];

const containerStyles = {
  height: 'auto',
  left: 0,
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'absolute',
  right: 0,
  width: 315,
  top: 950,
} as React.CSSProperties;

const gridStyles = {
  flexGrow: 1,
  rowGap: '0 !important',
  marginBottom: 0,
};

export default function ItemsGrid({ itemCounts }: { itemCounts: number[] }) {
  const imx = useContext(IMXContext);

  return imx.loading ? (
    <Skeleton variant="rectangular" animation="wave" width={315} height={403} sx={{ ...containerStyles }} />
  ) : (
    <Root style={containerStyles}>
      <div>ITEMS I OWN</div>
      <ImageList
        gap={10}
        cols={3}
        sx={{
          ...gridStyles,
        }}
      >
        {ITEMS.map(item => (
          <ImageListItem key={item.id}>
            <Image
              src={item.image}
              alt={item.name}
              loading="lazy"
              width={98}
              height={98}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
            <ImageListItemBar
              classes={{ titleWrap: classes.titleWrap, title: classes.title }}
              title={
                <>
                  <span>{item.name}</span>
                  <span>x{itemCounts[item.id - 1]}</span>
                </>
              }
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <div style={{ textAlign: 'center' }}>
        <Image
          src="/img/items/full/7.gif"
          unoptimized
          alt="CITADEL KEY"
          loading="lazy"
          width={98}
          height={98}
          style={{ width: '31%', height: 'auto' }}
        />
        <div className={classes.title} style={{ width: '35%', margin: 'auto' }}>
          <span>CITADEL KEY</span>
          <span>x{itemCounts[6]}</span>
        </div>
      </div>
    </Root>
  );
}
