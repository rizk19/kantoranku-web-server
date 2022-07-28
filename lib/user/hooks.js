import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useCurrentUser() {
  return useSWR('/api/user', fetcher);
}

export function useUser(id) {
  return useSWR(`/api/users/${id}`, fetcher);
}

export function useEmployeePages({ limit = 10, page } = {}) {
  const { data, error, ...props } = useSWR(
    `api/users/?page=${page}&limit=${limit}`,
    fetcher
  );

  const isLoadingInitialData = !data && !error;
  return {
    data2: data,
    error,
    isLoadingInitialData,
    ...props,
  };
}
// export function usePostPages({ limit = 10 } = {}) {
//   const { data, error, size, ...props } = useSWRInfinite(
//     (index, previousPageData) => {
//       // reached the end
//       if (previousPageData && previousPageData.posts.length === 0) return null;

//       const searchParams = new URLSearchParams();
//       searchParams.set('limit', limit);

//       // if (companyId) searchParams.set('cp', companyId);

//       if (index !== 0) {
//         // using oldest posts createdAt date as cursor
//         // We want to fetch posts which has a date that is
//         // before (hence the .getTime()) the last post's createdAt
//         const before = new Date(
//           new Date(
//             previousPageData.posts[previousPageData.posts.length - 1].createdAt
//           ).getTime()
//         );

//         searchParams.set('before', before.toJSON());
//       }

//       return `/api/posts?${searchParams.toString()}`;
//     },
//     fetcher,
//     {
//       refreshInterval: 10000,
//       revalidateAll: false,
//     }
//   );

//   const isLoadingInitialData = !data && !error;
//   const isLoadingMore =
//     isLoadingInitialData ||
//     (size > 0 && data && typeof data[size - 1] === 'undefined');
//   const isEmpty = data?.[0]?.length === 0;
//   const isReachingEnd =
//     isEmpty || (data && data[data.length - 1]?.posts?.length < limit);

//   return {
//     data,
//     error,
//     size,
//     isLoadingMore,
//     isReachingEnd,
//     ...props,
//   };
// }
