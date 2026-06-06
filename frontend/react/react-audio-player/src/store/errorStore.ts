import create from 'zustand';

export type GlobalErrorStoreType = {
  isError: boolean;
  errMsg: string;
};

const useErrorStore = create<GlobalErrorStoreType>((set, get) => ({
  isError: false,
  errMsg: 'Something is wrong...',
}));

export default useErrorStore;
