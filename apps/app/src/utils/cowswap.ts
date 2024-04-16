import {
  OrderBookApi,
  OrderSigningUtils,
  type OrderQuoteRequest,
  type OrderQuoteResponse,
  type OrderQuoteSideKindSell,
  type SupportedChainId,
  type UnsignedOrder,
  type OrderKind,
} from '@cowprotocol/cow-sdk';
import { parseEther, formatEther, type Signer } from 'ethers';
import { getContractAddress, NFTL_CONTRACT, COWSWAP_VAULT_RELAYER_ADDRESS, WETH_ADDRESS } from '@/constants/contracts';
import { formatNumberToDisplay2 } from './numbers';
import { ERC20__factory, WETH__factory } from '@/types/typechain';

export const getCowMarketPrice = async ({
  kind,
  chainId,
  amount,
  userAddress,
}: {
  kind: OrderKind;
  chainId: number;
  amount: string;
  userAddress: string;
}): Promise<OrderQuoteResponse> => {
  const orderBookApi = new OrderBookApi({ chainId });
  const quoteResponse = await orderBookApi.getQuote({
    kind: kind as unknown as OrderQuoteSideKindSell,
    sellToken: WETH_ADDRESS[chainId as keyof typeof WETH_ADDRESS] as string,
    buyToken: getContractAddress(chainId, NFTL_CONTRACT),
    sellAmountBeforeFee: parseEther(amount).toString(),
    from: userAddress,
    receiver: userAddress,
    validTo: Math.floor(new Date().getTime() / 1000) + 3600, // Valid for 1 hr
  });
  if (!quoteResponse) throw Error('Cannot get marketplace');
  return quoteResponse;
};

export const createOrderSwapEtherToNFTL = async ({
  signer,
  chainId,
  etherVal,
  userAddress,
  handleTxnState,
}: {
  signer: Signer;
  chainId: SupportedChainId;
  etherVal: string;
  userAddress: `0x${string}`;
  handleTxnState: (state: string) => void;
}) => {
  // Wrap ETH
  handleTxnState('Sign the wrapping with your wallet');
  const wEth = WETH__factory.connect(WETH_ADDRESS[chainId as keyof typeof WETH_ADDRESS] as string);
  await wEth.connect(signer).deposit({
    value: parseEther(etherVal),
  });

  // Approve WETH to Vault Relayer
  handleTxnState('Allow CowSwap to use your WETH');
  const erc20 = ERC20__factory.connect(WETH_ADDRESS[chainId as keyof typeof WETH_ADDRESS] as string);
  const tx = await erc20.connect(signer).approve(COWSWAP_VAULT_RELAYER_ADDRESS, parseEther(etherVal));
  await tx.wait();

  const orderBookApi = new OrderBookApi({ chainId });
  const quoteRequest: OrderQuoteRequest = {
    sellToken: WETH_ADDRESS[chainId as keyof typeof WETH_ADDRESS] as string,
    buyToken: getContractAddress(chainId, NFTL_CONTRACT),
    from: userAddress,
    receiver: userAddress,
    sellAmountBeforeFee: parseEther(etherVal).toString(),
    validTo: Math.floor(new Date().getTime() / 1000) + 3600,
    kind: 'sell' as OrderQuoteSideKindSell, // Add a description here to explain why the @ts-expect-error is necessary
  };
  const { quote } = await orderBookApi.getQuote(quoteRequest);

  if (!quote) throw Error('Cannot get marketplace');

  // Sign the order
  handleTxnState(
    `Swapping ${formatNumberToDisplay2(Number(etherVal), 4)} WETH for ${formatNumberToDisplay2(
      Number(formatEther(quote.buyAmount)),
      2,
    )} NFTL`,
  );
  const signedOrder = await OrderSigningUtils.signOrder(
    quote as UnsignedOrder, // Add a description here to explain why the @ts-expect-error is necessary
    chainId,
    signer as never,
  );
  const signature = signedOrder?.signature;
  if (!signature) throw Error('No Signature');

  // Post the order
  const orderID = await orderBookApi.sendOrder({ ...quote, ...signedOrder } as any); // Add a description here to explain why the @ts-expect-error is necessary
  return orderID;
};

export const getOrderDetail = async (chainId: SupportedChainId, orderID: string) => {
  const orderBookApi = new OrderBookApi({ chainId });
  const order = await orderBookApi.getOrder(orderID);
  return order;
};
