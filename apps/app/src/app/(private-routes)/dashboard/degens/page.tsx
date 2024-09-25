'use client';
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import isEmpty from 'lodash/isEmpty';
import xor from 'lodash/xor';
import { useSearchParams } from 'next/navigation';
import useFlags from '@/hooks/useFlags';
import { Grid2, IconButton, Pagination, Stack, Dialog, useMediaQuery } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@nl/theme';

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
import { DEGEN_BASE_API_URL, DEGEN_COLLECTION_URL, PROFILE_FAV_DEGENS_API } from '@/constants/url';
import { HYDRAS } from '@/constants/hydras';
import { useProfileFavDegens } from '@/hooks/useGamerProfile';
import useFetch from '@/hooks/useFetch';
import useAuth from '@/hooks/useAuth';
import usePagination from '@/hooks/usePagination';
import type { DegenFilter } from '@/types/degenFilter';
import type { Degen } from '@/types/degens';
import { v4 as uuidv4 } from 'uuid';
import EmptyState from '@/components/EmptyState';
import DegenDialog from '@/components/dialog/DegenDialog';
import useBalances from '@/hooks/useBalances';
import DegensTopNav from '@/components/extended/DegensTopNav';
import useLocalStorageContext from '@/hooks/useLocalStorageContext';

const CollapsibleSidebarLayout = dynamic(() => import('@/app/_layout/_CollapsibleSidebarLayout'), {
  ssr: false,
});
const DegenCard = dynamic(() => import('@/components/cards/DegenCard'), {
  ssr: false,
});

// Needs to be divisible by 2, 3, or 4
const DEGENS_PER_PAGE = 12;

const DashboardDegensPage = (): JSX.Element => {
  const { authToken } = useAuth();
  const { isConnected } = useAccount();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [filters, setFilters] = useState<DegenFilter>(DEFAULT_STATIC_FILTER);
  const [defaultValues, setDefaultValues] = useState<DegenFilter | undefined>(DEFAULT_STATIC_FILTER);
  const [filteredData, setFilteredData] = useState<Degen[]>([]);
  const [selectedDegen, setSelectedDegen] = useState<Degen>();
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false);
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false);
  const [isClaimDialog, setIsClaimDialog] = useState<boolean>(false);
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false);
  const [isEquipDialog, setIsEquipDialog] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [layoutMode, setLayoutMode] = useState<string>('gridView');
  const { enableEquip } = useFlags();
  const { favs: favsData } = useProfileFavDegens();
  const { favDegens, setFavDegens } = useLocalStorageContext();

  useEffect(() => {
    if (favsData && favsData !== 'null') {
      setFavDegens(favsData.split(','));
    }
  }, [favsData, setFavDegens]);

  const { loading: loadingAllRentals, data } = useFetch<Degen[]>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`);

  const { loadingDegens, characters } = useBalances();

  const loading = loadingAllRentals || loadingDegens;

  const populatedDegens: Degen[] = useMemo(() => {
    if (!characters.length || !data) return [];
    // TODO: remove temp fix for 7th tribes
    // return characters.map((character) => data[character.id]);
    return characters.map(character =>
      Number(character.id) <= 9900
        ? (data[Number(character.id)] as Degen)
        : ({
            id: character.id,
            name: character.name,
            traits_string: Object.values(character.traits).toString(),
            background: HYDRAS[character.id as keyof typeof HYDRAS].rarity,
            earning_cap: 0,
            earning_cap_daily: 0,
            is_active: false,
            last_rented_at: 0,
            multiplier: 0,
            multipliers: { background: 0 },
            owner: '',
            owner_share: 0.1,
            stats: {},
            price: 0,
            price_daily: 0,
            rental_count: 0,
            total_rented: 0,
            tribe: Number(character.id) >= 9999 ? (Number(character.id) === 9999 ? 'rugman' : 'satoshi') : 'hydra',
          } as Degen),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characters.length, !!data]);

  const theme = useTheme();
  const isScreenLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));

  const { jump, dataForCurrentPage, maxPage, currentPage } = usePagination<Degen>(
    filteredData,
    isScreenLg && layoutMode !== 'gridView' && !isDrawerOpen ? 15 : DEGENS_PER_PAGE,
  );

  useEffect(() => {
    if (!populatedDegens.length) {
      return;
    }

    setDefaultValues(getDefaultFilterValueFromData(populatedDegens));
    const params = Object.fromEntries(searchParams.entries());
    let newDegens = populatedDegens;
    if (!isEmpty(params)) {
      if (params.searchTerm) setSearchTerm(params.searchTerm);
      const newFilterOptions = updateFilterValue(defaultValues, params);
      if (newFilterOptions) {
        setFilters(newFilterOptions);
        newDegens = tranformDataByFilter(populatedDegens, newFilterOptions);
      }
    }
    setFilteredData(newDegens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populatedDegens.length]);

  const handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
    setSearchTerm(e.target.value);
  };

  const handleChangeLayoutMode = (_: React.MouseEvent<HTMLElement>, newMode: string) => {
    setLayoutMode(newMode);
  };

  const handleFilter = useCallback(
    (filter: DegenFilter) => {
      const newFilters = { ...filter, sort: filters.sort };
      const result = tranformDataByFilter(populatedDegens, newFilters);
      setFilters(newFilters);
      setFilteredData(result);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [populatedDegens.length, filters.sort],
  );

  useEffect(() => {
    jump(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData.length]);

  const handleSort = useCallback(
    (sort: string) => {
      const newSort = { ...filters, sort };
      setFilters(newSort);
      setFilteredData(tranformDataByFilter(populatedDegens, newSort));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [populatedDegens.length, filters],
  );

  const handleClickEditName = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRenameDegenModalOpen(true);
  }, []);

  const handleViewTraits = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsClaimDialog(false);
    setIsEquipDialog(false);
    setIsRentDialog(false);
    setIsDegenModalOpen(true);
  }, []);

  const handleClaimDegen = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsClaimDialog(true);
    setIsEquipDialog(false);
    setIsRentDialog(false);
    setIsDegenModalOpen(true);
  }, []);

  const handleRentDegen = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRentDialog(true);
    setIsClaimDialog(false);
    setIsEquipDialog(false);
    setIsDegenModalOpen(true);
  }, []);

  const handleEquipDegen = useCallback((degen: Degen): void => {
    setSelectedDegen(degen);
    setIsRentDialog(false);
    setIsClaimDialog(false);
    setIsEquipDialog(true);
    setIsDegenModalOpen(true);
  }, []);

  const isGridView = layoutMode === 'gridView';

  const handleClickFavorite = useCallback(
    async (degen: Degen) => {
      const newFavs = xor(
        favDegens?.filter(f => f),
        [degen.id],
      );
      await fetch(`${PROFILE_FAV_DEGENS_API}`, {
        method: 'POST',
        body: JSON.stringify({
          favorites: newFavs.toString(),
        }),
        headers: {
          authorizationToken: authToken,
        } as any,
      });
      setFavDegens(newFavs);
    },
    [authToken, favDegens, setFavDegens],
  );

  const renderSkeletonItem = useCallback(
    () => (
      <Grid2
        key={uuidv4()}
        size={{
          xs: isGridView ? 12 : 6,
          sm: isGridView ? 6 : 4,
          md: isGridView ? 4 : 3,
          lg: isGridView ? (isDrawerOpen ? 4 : 3) : isDrawerOpen ? 3 : 2.4,
          xl: isGridView ? 3 : 2,
        }}
      >
        <SkeletonDegenPlaceholder size={isGridView ? 'normal' : 'small'} />
      </Grid2>
    ),
    [isDrawerOpen, isGridView],
  );

  const renderDrawer = useCallback(
    () => (
      <DegensFilter
        onFilter={handleFilter}
        defaultFilterValues={defaultValues as DegenFilter}
        isDegenOwner={true}
        searchTerm={searchTerm}
      />
    ),
    [defaultValues, handleFilter, searchTerm],
  );

  const renderDegen = useCallback(
    (degen: Degen) => (
      <Grid2
        key={degen.id}
        size={{
          xs: isGridView ? 12 : 6,
          sm: isGridView ? 6 : 4,
          md: isGridView ? 4 : 3,
          lg: isGridView ? (isDrawerOpen ? 4 : 3) : isDrawerOpen ? 3 : 2.4,
          xl: isGridView ? 3 : 2,
        }}
      >
        <DegenCard
          degen={degen}
          degenEquipEnabled={enableEquip}
          favs={favDegens}
          isDashboardDegen
          onClickClaim={() => handleClaimDegen(degen)}
          onClickDetail={() => handleViewTraits(degen)}
          onClickEditName={() => handleClickEditName(degen)}
          onClickEquip={() => handleEquipDegen(degen)}
          onClickFavorite={() => handleClickFavorite(degen)}
          onClickRent={() => handleRentDegen(degen)}
          size={isGridView ? 'normal' : 'small'}
        />
      </Grid2>
    ),
    [
      enableEquip,
      favDegens,
      handleClaimDegen,
      handleClickEditName,
      handleClickFavorite,
      handleEquipDegen,
      handleRentDegen,
      handleViewTraits,
      isDrawerOpen,
      isGridView,
    ],
  );

  const renderMain = useCallback(
    () => (
      <Stack gap={1.5}>
        {/* Main Grid2 title */}
        <SectionTitle firstSection>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)} size="small">
              {isDrawerOpen ? <ArrowBackIosNew /> : <ArrowForwardIos />}
            </IconButton>
            {filteredData.length} Degens
          </Stack>
        </SectionTitle>
        {/* Main grid content */}
        <Grid2 container spacing={2} mt={-4.5}>
          {loading || !isConnected ? (
            [...Array(8)].map(renderSkeletonItem)
          ) : dataForCurrentPage.length ? (
            dataForCurrentPage.map(renderDegen)
          ) : !characters?.length ? (
            <Link href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="No DEGENs found. Please check your address or go purchase a degen if you have not done so already!"
                buttonText="Buy a DEGEN"
              />
            </Link>
          ) : null}
        </Grid2>
        {dataForCurrentPage.length > 0 && (
          <Pagination
            count={maxPage}
            page={currentPage}
            color="primary"
            sx={{ margin: '0 auto' }}
            onChange={(e: React.ChangeEvent<unknown>, p: number) => jump(p)}
          />
        )}
      </Stack>
    ),
    [
      characters?.length,
      currentPage,
      dataForCurrentPage,
      filteredData.length,
      isConnected,
      isDrawerOpen,
      jump,
      loading,
      maxPage,
      renderDegen,
      renderSkeletonItem,
    ],
  );

  return (
    <>
      <Stack mt={2.5} spacing={2}>
        <Stack pl={2} pr={3}>
          <DegensTopNav
            searchTerm={searchTerm || ''}
            handleChangeSearchTerm={handleChangeSearchTerm}
            handleSort={handleSort}
            layoutMode={layoutMode}
            handleChangeLayoutMode={handleChangeLayoutMode}
          />
        </Stack>
        <CollapsibleSidebarLayout
          drawerWidth={320}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
          renderMain={renderMain}
        />
      </Stack>
      <DegenDialog
        open={isDegenModalOpen}
        degen={selectedDegen}
        isClaim={isClaimDialog}
        isRent={isRentDialog}
        isEquip={isEquipDialog}
        setIsRent={setIsRentDialog}
        onClose={() => setIsDegenModalOpen(false)}
      />
      <Dialog open={isRenameDegenModalOpen} onClose={() => setIsRenameDegenModalOpen(false)}>
        <RenameDegenDialogContent degen={selectedDegen} onSuccess={() => setIsRenameDegenModalOpen(false)} />
      </Dialog>
    </>
  );
};

export default DashboardDegensPage;
