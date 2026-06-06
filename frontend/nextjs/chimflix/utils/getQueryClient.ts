import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();
const getQueryClient = () => {
  return queryClient;
};
export default getQueryClient;
