export interface WalletLibrary {
  readonly active: boolean;
  readonly address: string;
  readonly balance: string;
  getBalanceOf: (address: string) => Promise<string | undefined>;
  transfer: (to: string, value: number) => void;
}
