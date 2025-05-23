'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// material-ui
import { useTheme, gridSpacing } from '@nl/theme';
import { Box, Card, Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project imports
import { BASE_PATH } from '@/config';
import type { IconProps } from '@tabler/icons-react';

// assets
import { IconTallymark1 } from '@tabler/icons-react';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import type { NavItemType, NavItemTypeObject, OverrideIcon } from '@/types';

const linkSX = {
  display: 'flex',
  color: 'grey.900',
  textDecoration: 'none',
  alignContent: 'center',
  alignItems: 'center',
};

interface BreadCrumbSxProps extends React.CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface BreadCrumbsProps {
  card?: boolean;
  divider?: boolean;
  icon?: boolean;
  icons?: boolean;
  maxItems?: number;
  navigation?: NavItemTypeObject;
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
  card,
  divider,
  icon,
  icons,
  maxItems,
  navigation,
  rightAlign,
  separator,
  title,
  titleBottom,
  ...others
}: BreadCrumbsProps) => {
  const theme = useTheme();

  const iconStyle = {
    marginRight: theme.spacing(0.75),
    marginTop: `-${theme.spacing(0.25)}`,
    width: '16px',
    height: '16px',
    color: theme.palette.secondary.main,
  };

  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();

  useEffect(() => {
    navigation?.items?.map((menu: NavItemType) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu as { children: NavItemType[]; type?: string });
      }
      return false;
    });
  });

  // set active item state

  const getCollapse = (menu: NavItemType) => {
    if (menu?.children) {
      menu.children.filter((collapse: NavItemType) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse as { children: NavItemType[]; type?: string });
        } else if (collapse.type && collapse.type === 'item') {
          if (document.location.pathname === BASE_PATH + collapse.url) {
            setMain(menu);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  // item separator
  const SeparatorIcon = separator! as (props: IconProps) => React.ReactNode;
  const separatorIcon = separator ? (
    <SeparatorIcon stroke={1.5} size="small" />
  ) : (
    <IconTallymark1 stroke={1.5} size="small" />
  );

  let mainContent;
  let itemContent;
  let breadcrumbContent: React.ReactElement = <Typography />;
  let itemTitle: NavItemType['title'] = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (main && main.type === 'collapse') {
    CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
    mainContent = (
      <Typography component={Link} href="#" variant="subtitle1" sx={linkSX}>
        {icons && <CollapseIcon style={iconStyle} />}
        {main.title}
      </Typography>
    );
  }

  // items
  if (item && item.type === 'item') {
    itemTitle = item.title;

    ItemIcon = item.icon ? item.icon : AccountTreeTwoToneIcon;
    itemContent = (
      <Typography
        variant="subtitle1"
        sx={{
          display: 'flex',
          textDecoration: 'none',
          alignContent: 'center',
          alignItems: 'center',
          color: 'grey.500',
        }}
      >
        {icons && <ItemIcon style={iconStyle} />}
        {itemTitle}
      </Typography>
    );

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <Card
          sx={{
            marginBottom: card === false ? 0 : theme.spacing(gridSpacing),
            border: card === false ? 'none' : '1px solid',
            borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.main,
            background: card === false ? 'transparent' : theme.palette.background.default,
          }}
          {...others}
        >
          <Box sx={{ p: 2, pl: card === false ? 0 : 2 }}>
            <Grid
              container
              direction={rightAlign ? 'row' : 'column'}
              justifyContent={rightAlign ? 'space-between' : 'flex-start'}
              alignItems={rightAlign ? 'center' : 'flex-start'}
              spacing={1}
            >
              {title && !titleBottom && (
                <Grid>
                  <Typography variant="h3" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Grid>
              )}
              <Grid>
                <MuiBreadcrumbs
                  sx={{
                    '& .MuiBreadcrumbs-separator': {
                      width: 16,
                      ml: 1.25,
                      mr: 1.25,
                    },
                  }}
                  aria-label="breadcrumb"
                  maxItems={maxItems || 8}
                  separator={separatorIcon}
                >
                  <Typography component={Link} href="/" sx={{ ...linkSX, color: 'inherit' }} variant="subtitle1">
                    {icons && <HomeTwoToneIcon sx={iconStyle} />}
                    {icon && <HomeIcon sx={{ ...iconStyle, mr: 0 }} />}
                    {!icon && 'Dashboard'}
                  </Typography>
                  {mainContent}
                  {itemContent}
                </MuiBreadcrumbs>
              </Grid>
              {title && titleBottom && (
                <Grid>
                  <Typography variant="h3" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
          {card === false && divider !== false && (
            <Divider
              sx={{
                borderColor: theme.palette.primary.main,
                mb: gridSpacing,
                opacity: '0.6',
              }}
            />
          )}
        </Card>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
