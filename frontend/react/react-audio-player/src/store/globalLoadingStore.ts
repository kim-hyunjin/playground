import create from 'zustand';

export type GlobalLoadingStoreType = {
  isLoading: boolean;
};

const useGlobalLoadingStore = create<GlobalLoadingStoreType>((set, get) => ({
  isLoading: false,
}));

export default useGlobalLoadingStore;
