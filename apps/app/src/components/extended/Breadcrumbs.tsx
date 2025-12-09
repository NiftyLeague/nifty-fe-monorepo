'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// material-ui
import { useTheme, gridSpacing } from '@nl/theme';
import { Box, Card, Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project imports
import { BASE_PATH } from '@/config';
import { Icon, type IconName } from '@nl/ui/base/icon';
import type { NavItemType, NavItemTypeObject } from '@/types';

const linkSX = {
  display: 'flex',
  color: 'var(--color-background)',
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
  separator?: IconName;
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
  };

  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();

  const getCollapse = useCallback(
    (menu: NavItemType) => {
      const recurse = (m: NavItemType, parentMenu: NavItemType) => {
        if (m.children) {
          m.children.forEach(collapse => {
            if (collapse.type === 'collapse') {
              recurse(collapse, collapse);
            } else if (collapse.type === 'item') {
              if (document.location.pathname === BASE_PATH + collapse.url) {
                setMain(parentMenu);
                setItem(collapse);
              }
            }
          });
        }
      };
      recurse(menu, menu);
    },
    [setMain, setItem],
  );

  useEffect(() => {
    navigation?.items?.forEach((menu: NavItemType) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu as { children: NavItemType[]; type?: string });
      }
    });
  }, [navigation, getCollapse]);

  // item separator
  const separatorIcon = <Icon name={separator || 'tally-1'} size="sm" />;

  let mainContent;
  let itemContent;
  let breadcrumbContent: React.ReactElement = <Typography />;

  // collapse item
  if (main && main.type === 'collapse') {
    mainContent = (
      <Typography component={Link} href="#" variant="subtitle1" sx={linkSX}>
        {icons && <Icon name={main.icon ?? 'list-tree'} style={iconStyle} />}
        {main.title}
      </Typography>
    );
  }

  // items
  if (item && item.type === 'item') {
    itemContent = (
      <Typography
        variant="subtitle1"
        sx={{
          display: 'flex',
          textDecoration: 'none',
          alignContent: 'center',
          alignItems: 'center',
          color: 'var(--color-muted-foreground)',
        }}
      >
        {icons && <Icon name={item.icon ?? 'list-tree'} style={iconStyle} />}
        {item.title}
      </Typography>
    );

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <Card
          sx={{
            marginBottom: card === false ? 0 : theme.spacing(gridSpacing),
            border: card === false ? 'none' : 'var(--border-default)',
            background: card === false ? 'transparent' : 'var(--color-background)',
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
                  sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                  aria-label="breadcrumb"
                  maxItems={maxItems || 8}
                  separator={separatorIcon}
                >
                  <Typography component={Link} href="/" sx={{ ...linkSX, color: 'inherit' }} variant="subtitle1">
                    {icons && <Icon name="house" color="blue" fill="dim" style={iconStyle} />}
                    {icon && <Icon name="house" color="blue" style={{ ...iconStyle, marginRight: 0 }} />}
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
            <Divider sx={{ borderColor: 'var(--color-purple)', mb: gridSpacing, opacity: '0.6' }} />
          )}
        </Card>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
