export interface Web3Event {
  event: string;
  signature: string | null;
  address: string;
  returnValues: Record<string, string>;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  raw: Record<string, string>;
}
