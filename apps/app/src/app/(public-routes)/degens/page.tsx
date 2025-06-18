'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';

import { Grid, IconButton, Pagination, Stack, Dialog, useMediaQuery } from '@mui/material';
import { useTheme } from '@nl/theme';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder';
import DegensFilter from '@/components/extended/DegensFilter';
import DEFAULT_STATIC_FILTER from '@/components/extended/DegensFilter/constants';
import {
  tranformDataByFilter,
  updateFilterValue,
  getDefaultFilterValueFromData,
} from '@/components/extended/DegensFilter/utils';
import RenameDegenDialogContent from '@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent';
import SectionTitle from '@/components/sections/SectionTitle';
import { DEGEN_BASE_API_URL } from '@/constants/url';
import useFetch from '@/hooks/useFetch';
import usePagination from '@/hooks/usePagination';
import type { DegenFilter } from '@/types/degenFilter';
import type { Degen } from '@/types/degens';
import useNetworkContext from '@/hooks/useNetworkContext';
import DegenDialog from '@/components/dialog/DegenDialog';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import DegensTopNav from '@/components/extended/DegensTopNav';
import { HYDRAS } from '@/constants/hydras';

const CollapsibleSidebarLayout = dynamic(() => import('@/app/_layout/_CollapsibleSidebarLayout'), { ssr: false });
const DegenCard = dynamic(() => import('@/components/cards/DegenCard'), { ssr: false });

// Needs to be divisible by 2, 3, or 4
const DEGENS_PER_PAGE = 12;

const AllDegensPage = (): React.ReactNode => {
  const { address } = useNetworkContext();
  const [degens, setDegens] = useState<Degen[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [filters, setFilters] = useState<DegenFilter>(DEFAULT_STATIC_FILTER);
  const [defaultValues, setDefaultValues] = useState<DegenFilter | undefined>();
  const [filteredData, setFilteredData] = useState<Degen[]>([]);
  const [selectedDegen, setSelectedDegen] = useState<Degen>();
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false);
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false);
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [layoutMode, setLayoutMode] = useState<string>('gridView');

  const { data } = useFetch<{ [id: number]: Degen }>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`);

  const originalDegens: Degen[] = useMemo(() => {
    if (!data || !Object.values(data).length) return [];

    // TODO: remove temp fix for 7th tribes
    // return Object.values(data);
    return Object.values(data).map(degen =>
      Number(degen.id) <= 9900
        ? degen
        : {
            ...degen,
            background: HYDRAS[degen.id as keyof typeof HYDRAS]?.rarity || 'Common',
            tribe: Number(degen.id) >= 9999 ? (Number(degen.id) === 9999 ? 'rugman' : 'satoshi') : 'hydra',
          },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!data]);

  const { isDegenOwner } = useNFTsBalances();

  const theme = useTheme();
  const isScreenXL = useMediaQuery(theme.breakpoints.up('xl'));
  const { jump, dataForCurrentPage, maxPage, currentPage } = usePagination<Degen>(
    filteredData,
    isScreenXL && layoutMode !== 'gridView' && !isDrawerOpen ? 18 : DEGENS_PER_PAGE,
  );

  useEffect(() => {
    if (!originalDegens?.length) return;
    setDefaultValues(getDefaultFilterValueFromData(originalDegens));
    // Filter out rent disabled degens in Feed
    setDegens(originalDegens);
    const params = Object.fromEntries(searchParams.entries());
    let newDegens = originalDegens;
    if (!isEmpty(params)) {
      if (params.searchTerm) setSearchTerm(params.searchTerm);
      const newFilterOptions = updateFilterValue(defaultValues, params);
      if (newFilterOptions) {
        setFilters(newFilterOptions);
        newDegens = tranformDataByFilter(originalDegens, newFilterOptions);
      }
    }

    setFilteredData(newDegens);

    return () => {
      setDegens([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalDegens, address]);

  const handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
    setSearchTerm(e.target.value);
  };

  const handleChangeLayoutMode = (_: React.MouseEvent<HTMLElement>, newMode: string) => {
    setLayoutMode(newMode);
  };

  const handleFilter = useCallback(
    (filter: DegenFilter) => {
      // TODO: Remove temp filter overrides if we want to enable filter functionailty
      // by prices, rentals, or wearables. Temp hardcoded to empty to avoid rentals filtering
      const newFilters = { ...filter, prices: [], rentals: [], wearable: [], sort: filters.sort };
      const result = tranformDataByFilter(degens, newFilters);
      setFilters(newFilters);
      setFilteredData(result);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [degens.length, filters.sort],
  );

  const handleSort = useCallback(
    (sort: string) => {
      const newSort = { ...filters, sort };
      setFilters(newSort);
      setFilteredData(tranformDataByFilter(degens, newSort));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [degens.length, filters],
  );

  const handleClickEditName = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRenameDegenModalOpen(true);
  }, []);

  const handleViewTraits = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRentDialog(false);
    setIsDegenModalOpen(true);
  }, []);

  // const handleRentDegen = useCallback((degen: Degen): void => {
  //   setSelectedDegen(degen);
  //   setIsRentDialog(true);
  //   setIsDegenModalOpen(true);
  // }, []);

  const isGridView = layoutMode === 'gridView';

  const renderSkeletonItem = useCallback(
    () => (
      <Grid
        key={uuidv4()}
        size={{
          xs: isGridView ? 12 : 6,
          sm: isGridView ? 6 : 4,
          md: isGridView ? 4 : 3,
          lg: isGridView ? (isDrawerOpen ? 4 : 3) : isDrawerOpen ? 3 : 2,
          xl: isGridView ? (isDrawerOpen ? 4 : 3) : isDrawerOpen ? 3 : 2,
        }}
      >
        <SkeletonDegenPlaceholder size={isGridView ? 'normal' : 'small'} />
      </Grid>
    ),
    [isDrawerOpen, isGridView],
  );

  const renderDrawer = useCallback(
    () =>
      !isEmpty(defaultValues) && (
        <DegensFilter
          onFilter={handleFilter}
          defaultFilterValues={defaultValues as DegenFilter}
          isDegenOwner={isDegenOwner}
          searchTerm={searchTerm}
        />
      ),
    [defaultValues, isDegenOwner, handleFilter, searchTerm],
  );

  const renderDegen = useCallback(
    (degen: Degen) => (
      <Grid
        key={degen.id}
        size={{
          xs: isGridView ? 12 : 6,
          sm: isGridView ? 6 : 4,
          md: isGridView ? 4 : 3,
          lg: isGridView ? (isDrawerOpen ? 4 : 3) : isDrawerOpen ? 3 : 2,
          xl: isGridView ? (isDrawerOpen ? 4 : 3) : isDrawerOpen ? 3 : 2,
        }}
      >
        <DegenCard
          degen={degen}
          size={isGridView ? 'normal' : 'small'}
          onClickEditName={() => handleClickEditName(degen)}
          onClickDetail={() => handleViewTraits(degen)}
          // onClickRent={() => handleRentDegen(degen)}
        />
      </Grid>
    ),
    [
      handleClickEditName,
      // handleRentDegen,
      handleViewTraits,
      isDrawerOpen,
      isGridView,
    ],
  );

  const renderMain = useCallback(
    () => (
      <Stack gap={1.5}>
        {/* Main Grid title */}
        <SectionTitle firstSection>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)} size="small">
              {isDrawerOpen ? <ArrowBackIosNew /> : <ArrowForwardIos />}
            </IconButton>
            {filteredData.length} Degens
          </Stack>
        </SectionTitle>
        {/* Main grid content */}
        <Grid container spacing={2} mt={-4.5}>
          {!degens?.length ? [...Array(8)].map(renderSkeletonItem) : dataForCurrentPage.map(renderDegen)}
        </Grid>
        <Pagination
          count={maxPage}
          page={currentPage}
          color="primary"
          sx={{ margin: '0 auto' }}
          onChange={(e: React.ChangeEvent<unknown>, p: number) => jump(p)}
        />
      </Stack>
    ),
    [
      isDrawerOpen,
      filteredData.length,
      degens?.length,
      renderSkeletonItem,
      dataForCurrentPage,
      renderDegen,
      maxPage,
      currentPage,
      jump,
    ],
  );

  return (
    <>
      <Stack spacing={2} sx={{ mt: 2.5 }} component="main">
        <Stack sx={{ pl: 2, pr: 3 }}>
          <DegensTopNav
            searchTerm={searchTerm || ''}
            handleChangeSearchTerm={handleChangeSearchTerm}
            handleSort={handleSort}
            layoutMode={layoutMode}
            handleChangeLayoutMode={handleChangeLayoutMode}
          />
        </Stack>
        <CollapsibleSidebarLayout
          // Filter drawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
          // Main grid
          renderMain={renderMain}
        />
      </Stack>
      <DegenDialog
        open={isDegenModalOpen}
        degen={selectedDegen}
        isRent={isRentDialog}
        setIsRent={setIsRentDialog}
        onClose={() => setIsDegenModalOpen(false)}
      />
      <Dialog open={isRenameDegenModalOpen} onClose={() => setIsRenameDegenModalOpen(false)}>
        <RenameDegenDialogContent degen={selectedDegen} onSuccess={() => setIsRenameDegenModalOpen(false)} />
      </Dialog>
    </>
  );
};

export default AllDegensPage;
