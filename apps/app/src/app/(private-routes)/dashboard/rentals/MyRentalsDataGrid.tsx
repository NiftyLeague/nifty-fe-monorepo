'use client';

import { Stack, Typography, Button, Dialog, DialogContent, Link, IconButton } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridCallbackDetails,
  type GridColumnVisibilityModel,
  type GridSortModel,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useMemo } from 'react';
import type { Rentals, RentalType } from '@/types/rentals';
import { transformRentals } from '@/app/(private-routes)/dashboard/_utils/transformRentals';
import usePlayerProfile from '@/hooks/usePlayerProfile';
import Countdown from 'react-countdown';
import { formatNumberToDisplayWithCommas } from '@/utils/numbers';
import useLocalStorage from '@/hooks/useLocalStorage';

import DegenDialog from '@/components/dialog/DegenDialog';
import { RentalDataGrid } from '@/types/rentalDataGrid';
import ChangeNicknameDialog from './ChangeNicknameDialog';

const RENTAL_COLUMN_VISIBILITY = 'rental-column-visibility-model';

interface Props {
  rows: Rentals[];
  loading: boolean;
  category: RentalType;
  onTerminateRental: (rentalId: string) => void;
  updateRentalName: (name: string, id: string) => void;
}

const MyRentalsDataGrid = ({
  rows,
  loading,
  category,
  onTerminateRental,
  updateRentalName,
}: Props): React.ReactNode => {
  // const [pageSize, setPageSize] = useState(10);
  const [selectedRowForEditing, setSelectedRowForEditing] = useState<RentalDataGrid>({} as RentalDataGrid);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isTerminateRentalModalOpen, setIsTerminateRentalModalOpen] = useState(false);
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false);
  const [selectedDegen, setSelectedDegen] = useState();
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false);
  const [sort, setSort] = useState<GridSortModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useLocalStorage<GridColumnVisibilityModel>(
    RENTAL_COLUMN_VISIBILITY,
    {},
  );

  const { profile } = usePlayerProfile();
  const rentals = transformRentals(rows, profile?.id || '', category);

  const filteredRows = useMemo(() => {
    switch (category) {
      case 'direct-rental':
        return rentals.filter(rental => rental.category === 'direct-rental');
      case 'owned-sponsorship':
        return rentals.filter(rental => rental.category === 'owned-sponsorship');
      case 'non-owned-sponsorship':
        return rentals.filter(rental => rental.category === 'non-owned-sponsorship');
      case 'recruited':
        return rentals.filter(rental => rental.category === 'recruited');
      case 'direct-renter':
        return rentals.filter(rental => rental.category === 'direct-renter');
      case 'terminated':
        return rentals.filter(rental => rental.action);
      case 'all':
      default:
        return rentals;
    }
  }, [rentals, category]);

  const sortedRows = useMemo(() => {
    if (!sort || !sort.length) {
      return filteredRows;
    }

    return filteredRows.sort((a, b) => {
      const { field, sort: direction } = sort[0] as GridSortModel[number];
      const aValue = a[field as keyof typeof a] as number;
      const bValue = b[field as keyof typeof b] as number;

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }

      return aValue > bValue ? -1 : 1;
    });
  }, [filteredRows, sort]);

  const handleOpenNickname = (params: GridRenderCellParams) => {
    setSelectedRowForEditing(params.row);
    setIsNicknameModalOpen(true);
  };

  const handleUpdateNickname = (name: string, rentalId: string) => {
    updateRentalName(name, rentalId);
    setIsNicknameModalOpen(false);
  };

  const handleOpenTerminateRental = (params: GridRenderCellParams) => {
    setSelectedRowForEditing(params.row);
    setIsTerminateRentalModalOpen(true);
  };

  const handleConfirmTerminateRental = () => {
    if (selectedRowForEditing) {
      onTerminateRental(selectedRowForEditing.rentalId);
      setIsTerminateRentalModalOpen(false);
    }
  };

  const handleColumnVisibilityChange = (model: GridColumnVisibilityModel, details: GridCallbackDetails) => {
    setColumnVisibilityModel(model);
  };

  const handleClickDegenId = (params: GridRenderCellParams) => {
    setSelectedDegen({ ...params?.row, id: params?.row?.degenId });
    setIsRentDialog(false);
    setIsDegenModalOpen(true);
  };

  const handleSortColumn = (model: GridSortModel) => {
    setSort(model);
  };

  const commonColumnProp = { minWidth: 100 };

  const columns: GridColDef[] = useMemo(() => {
    const results = [
      {
        field: 'action',
        headerName: 'Actions',
        width: 130,
        ...commonColumnProp,
        renderCell: (params: GridRenderCellParams) => (
          <>
            {['direct-rental', 'non-owned-sponsorship', 'owned-sponsorship'].includes(params.row.category) && (
              <Button
                onClick={() => handleOpenTerminateRental(params)}
                variant="outlined"
                color="secondary"
                disabled={params.value}
              >
                {params.value ? 'Terminated' : 'Terminate'}
              </Button>
            )}
          </>
        ),
      },
      {
        field: 'renter',
        headerName: 'Player',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
          <Stack direction="row" columnGap={1} sx={{ alignItems: 'center' }}>
            <Typography>{params.value}</Typography>
          </Stack>
        ),
      },
      {
        field: 'playerNickname',
        headerName: 'Player Nickname',
        width: 150,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Stack direction="row" columnGap={1} sx={{ alignItems: 'center' }}>
              <Typography>{params.value}</Typography>
              {params.row.isEditable && (
                <IconButton aria-label="edit" onClick={() => handleOpenNickname(params)} sx={{ display: 'none' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          );
        },
      },
      { field: 'rentalCategory', headerName: 'Category', width: 150 },
      // {
      //   field: 'player',
      //   headerName: "Who's playing?",
      //   width: 130,
      // },
      {
        field: 'degenId',
        headerName: 'Degen ID',
        renderCell: (params: GridRenderCellParams) => (
          <Link
            component="button"
            variant="body2"
            sx={{ color: 'var(--color-foreground)', textDecorationColor: 'var(--color-foreground)' }}
            onClick={() => handleClickDegenId(params)}
          >
            #{params.value}
          </Link>
        ),
      },
      { field: 'background', headerName: 'Background' },
      { field: 'tribe', headerName: 'Tribe' },
      {
        field: 'earningCap',
        headerName: 'Earning Cap',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Typography>
            {formatNumberToDisplayWithCommas(params.row.totalEarnings)} /{' '}
            {formatNumberToDisplayWithCommas(params.value)}
          </Typography>
        ),
      },
      {
        field: 'rentalRenewsIn',
        headerName: 'Rental Renews In',
        ...commonColumnProp,
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Typography sx={{ color: 'var(--color-warning)' }}>
            <Countdown date={new Date(params.value * 1000)} />
          </Typography>
        ),
      },
      { field: 'multiplier', headerName: 'Multiplier', width: 150, ...commonColumnProp },
      // {
      //   field: 'timePlayed',
      //   headerName: 'Time Played',
      //   ...commonColumnProp,
      //   width: 120,
      // },
      { field: 'matches', headerName: 'Matches' },
      { field: 'wins', headerName: 'Wins' },
      {
        field: 'winRate',
        headerName: 'Win Rate',
        ...commonColumnProp,
        renderCell: (params: GridRenderCellParams) => <span>{formatNumberToDisplayWithCommas(params.value)}%</span>,
      },
      { field: 'weeklyFee', headerName: 'Weekly Fee', ...commonColumnProp },
      {
        field: 'dailyFee',
        headerName: 'Current Daily Fee',
        width: 150,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'dailyFeesToDate',
        headerName: 'Daily Fees To Date',
        width: 150,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'costs',
        headerName: 'Rental Fee Costs',
        width: 150,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'rentalFeeEarning',
        headerName: 'Rental Fees Earned',
        width: 150,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'profits',
        headerName: 'Gross Gameplay Earnings',
        width: 180,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'netGameEarning',
        headerName: 'Net Gameplay Earnings',
        width: 200,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'netEarning',
        headerName: 'Net Earnings',
        width: 150,
        renderCell: (params: GridRenderCellParams) => formatNumberToDisplayWithCommas(params.value),
        ...commonColumnProp,
      },
      {
        field: 'roi',
        headerName: 'ROI %',
        ...commonColumnProp,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Typography
              sx={{
                color: theme => {
                  if (params.value === 0) return 'var(--color-foreground)';
                  if (params.value > 0) return 'var(--color-success)';
                  if (params.value < 0) return 'var(--color-error)';
                },
              }}
            >
              {formatNumberToDisplayWithCommas(params.value)}%
            </Typography>
          );
        },
      },
    ];

    if (category === 'direct-renter') {
      return results.filter(result => result.field !== 'action');
    } else {
      return results;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <>
      <DataGrid
        loading={loading}
        rows={sortedRows}
        columns={columns}
        checkboxSelection={false}
        disableRowSelectionOnClick={true}
        pageSizeOptions={[10, 25, 100]}
        autoPageSize
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
        onSortModelChange={handleSortColumn}
        sx={{ '& .MuiDataGrid-row:hover': { '& button': { display: 'block' } } }}
      />
      {/* Nickname Degen Dialog */}
      <Dialog open={isNicknameModalOpen} onClose={() => setIsNicknameModalOpen(false)}>
        <ChangeNicknameDialog updateNickname={handleUpdateNickname} rental={selectedRowForEditing} />
      </Dialog>
      {/* Terminate Rental Dialog */}
      <Dialog open={isTerminateRentalModalOpen} onClose={() => setIsTerminateRentalModalOpen(false)}>
        <DialogContent>
          <Typography variant="h4" align="center">
            Are you sure you want to terminate this rental?
          </Typography>
          <Stack mt={3} direction="column" gap={1} sx={{ justifyContent: 'center' }}>
            <Button onClick={handleConfirmTerminateRental} autoFocus variant="contained" fullWidth>
              Terminate Rental
            </Button>
            <Button onClick={() => setIsTerminateRentalModalOpen(false)} fullWidth>
              Cancel
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      {/* Degen Traits Dialog */}
      <DegenDialog
        open={isDegenModalOpen}
        degen={selectedDegen}
        isRent={isRentDialog}
        setIsRent={setIsRentDialog}
        onClose={() => setIsDegenModalOpen(false)}
      />
    </>
  );
};

export default MyRentalsDataGrid;
