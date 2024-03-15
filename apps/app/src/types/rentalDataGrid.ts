export interface RentalDataGrid {
  id: string;
  rentalId: string;
  renter?: string;
  playerAddress?: string;
  playerNickname?: string;
  degenId: string;
  multiplier: number;
  winLoss?: number;
  timePlayed?: string;
  totalEarnings?: number;
  yourEarnings?: number;
  costs?: number;
  profits?: number;
  roi: number;
  rentalRenewsIn?: number;
  action?: boolean;
  earningCap: number;
  category: string;
}
