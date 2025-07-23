export class EventRequest {
  type?: 'deposit' | 'withdraw' | 'transfer';
  origin?: string;
  destination?: string;
  amount?: number;
}

export interface Account {
  id: string;
  balance: number;
}
