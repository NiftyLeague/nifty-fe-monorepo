'use client';

import {
  Alert,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Skeleton,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplayIcon from '@mui/icons-material/Replay';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { parseEther } from 'ethers6';
import { DialogContext } from '@/components/dialog';
import useWithdrawalHistory from '@/hooks/useWithdrawalHistory';
import useContractReader from '@/hooks/useContractReader';
import type { WithdrawalHistory } from '@/types/account';
import { formatDateTime } from '@/utils/dateTime';
import useNetworkContext from '@/hooks/useNetworkContext';
import { GAME_ACCOUNT_CONTRACT } from '@/constants/contracts';
import { BALANCE_INTERVAL } from '@/constants/index';

function useBalanceManagerNonce(address: string = ''): number {
  const { writeContracts } = useNetworkContext();
  const [nonce, setNonce] = useState<bigint>(0n);
  const result = useContractReader(
    writeContracts,
    GAME_ACCOUNT_CONTRACT,
    'nonce',
    [address],
    BALANCE_INTERVAL,
    undefined,
    undefined,
    !address.length,
  ) as bigint;

  useEffect(() => {
    if (result && result !== nonce) setNonce(result);
  }, [result, nonce]);

  return Number(nonce);
}

const HistoryTable = ({
  withdrawalHistory,
  resetForm,
  nonce,
}: {
  withdrawalHistory: WithdrawalHistory[];
  resetForm: () => void;
  nonce: number;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { writeContracts, tx } = useNetworkContext();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRetryWithdraw = async (data: { amount: number; expire_at: number; signature: string }) => {
    const { amount, expire_at, signature } = data;
    const res = await tx(
      writeContracts[GAME_ACCOUNT_CONTRACT].withdraw(parseEther(`${amount}`), BigInt(nonce), expire_at, signature),
    );
    if (res) resetForm();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Nonce</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">State</TableCell>
              <TableCell align="right">Retry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawalHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row.request_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {formatDateTime(row.created_at)}
                </TableCell>
                <TableCell align="right">{row.nonce}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.state}</TableCell>
                <TableCell align="right">
                  {row.state === 'pending' ? (
                    <>
                      {row.nonce === nonce ? (
                        <IconButton aria-label="retry" onClick={() => handleRetryWithdraw(row)}>
                          <ReplayIcon />
                        </IconButton>
                      ) : (
                        <Tooltip title="Signature expired">
                          <span>
                            <IconButton disabled>
                              <ReplayIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        sx={{ marginTop: '-16px' }}
        count={withdrawalHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

const checkRefreshDisabled = (history: WithdrawalHistory[], nonce: number): { error: boolean; errorMsg?: string } => {
  const error = true;
  if (!history.length) return { error, errorMsg: 'No withdrawal history found.' };
  const pendingTxs = history.filter(tx => tx.state === 'pending');
  if (!pendingTxs.length) return { error, errorMsg: 'No pending transactions found.' };
  const now = Math.floor(Date.now() / 1000);
  const elligiblePendingTxs = pendingTxs.filter(tx => {
    const timeDiff = (tx.expire_at - now) / 60;
    return tx.nonce < nonce || timeDiff < 1;
  });
  if (!elligiblePendingTxs.length)
    return {
      error,
      errorMsg: `Can only void pending transactions with nonce less than ${nonce} unless expired.`,
    };
  return { error: false };
};

interface RefreshFormProps {
  refreshTimeout: number;
  onRefresh: () => Promise<void>;
}

const RefreshBalanceForm = ({ refreshTimeout, onRefresh }: RefreshFormProps): JSX.Element => {
  const [, setIsOpen] = useContext(DialogContext);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(refreshTimeout > 0);
  const { handleSubmit, reset } = useForm();
  const { loading: historyLoading, withdrawalHistory } = useWithdrawalHistory();
  const { address } = useNetworkContext();
  const nonce = useBalanceManagerNonce(address);
  const { error, errorMsg } = checkRefreshDisabled(withdrawalHistory, nonce);

  const resetForm = () => {
    reset();
    setLoading(false);
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<{}> = async () => {
    setLoading(true);
    setDisabled(true);
    await onRefresh();
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack alignItems="center" gap={2}>
        {historyLoading ? (
          <Skeleton variant="rectangular" width="100%" height={320} />
        ) : (
          <>
            {withdrawalHistory.length ? (
              <HistoryTable withdrawalHistory={withdrawalHistory} resetForm={resetForm} nonce={nonce} />
            ) : null}
            {error && <Alert severity="info">{errorMsg}</Alert>}
          </>
        )}
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
          fullWidth
          disabled={error || disabled}
        >
          Void pending transactions
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default RefreshBalanceForm;
