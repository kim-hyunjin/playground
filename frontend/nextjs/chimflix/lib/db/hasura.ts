import { Stats } from '@/types/hasura';
import { YoutubeSnippet } from '@/types/youtube';

async function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: any,
  token: string
) {
  const result = await fetch(String(process.env.HASURA_URL), {
    method: 'POST',
    headers: {
      'x-hasura-admin-secret': String(process.env.HASURA_SECRET),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
  query Users {
    users {
      email
      issuer
    }
  }

  query UserByIssuer($issuer: String!) {
    users(where: {
      issuer: {
        _eq: $issuer
      }
    }) {
      email
      issuer
    }
  }

  mutation InsertUser($email: String!, $issuer: String!) {
    insert_users(objects: {email: $email, issuer: $issuer}) {
      affected_rows
    }
  }

  query StatsByIssuer($issuer: String!, $videoId: String!) {
    stats(where: {
      userId: {
        _eq: $issuer
      },
      videoId: {
        _eq: $videoId
      }
    }) {
      id
      userId
      videoId
      favourited
      watched
      saved
      playedTime
    }
  }

  mutation InsertStats($userId: String!, $videoId: String!) {
    insert_stats_one(object: {
      userId: $userId
      videoId: $videoId
    }) {
      id
      userId
      videoId
      favourited
      watched
      saved
    }
  }

  mutation UpdateFavs($userId: String!, $videoId: String!, $favourited: Int) {
    update_stats(
      _set: {favourited: $favourited}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        id
        userId
        videoId
        favourited
        watched
        saved
        playedTime
      }
    }
  }

  mutation UpdateSaved($userId: String!, $videoId: String!, $saved: Boolean!) {
    update_stats(
      _set: {saved: $saved}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        id
        userId
        videoId
        favourited
        watched
        saved
        playedTime
      }
    }
  }

  mutation UpdateTimeAndWatched($userId: String!, $videoId: String!, $watched: Boolean!, $playedTime: Int!) {
    update_stats(
      _set: {watched: $watched, playedTime: $playedTime}, 
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}
      }) {
      returning {
        id
        userId
        videoId
        favourited
        watched
        saved
        playedTime
      }
    }
  }

  query WatchedVideos($userId: String!, $offset: Int!) {
    stats(order_by: {id: desc}, limit: 25, offset: $offset, where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId}
    }) {
      videoId
    }
    stats_aggregate(where: {
      watched: {_eq: true}, 
      userId: {_eq: $userId}
    }) {
      aggregate {
        count
      }
    }
  }

  query SavedVideos($userId: String!, $offset: Int!) {
    stats(order_by: {id: desc}, limit: 25, offset: $offset, where: {
      userId: {_eq: $userId}, 
      saved: {_eq: true}
    }) {
      videoId
    }
    stats_aggregate(where: {
      userId: {_eq: $userId}, 
      saved: {_eq: true}
    }) {
      aggregate {
        count
      }
    }
  }

  query WatchingVideos($userId: String!, $offset: Int!) {
    stats(where: {userId: {_eq: $userId}, playedTime: {_gt: 0}, watched: {_eq: false}}, limit: 25, offset: $offset) {
      videoId
    }
    stats_aggregate(where: {userId: {_eq: $userId}, playedTime: {_gt: 0}, watched: {_eq: false}}) {
      aggregate {
        count
      }
    }
  }
`;

export async function isNewUser(token: string, issuer: string) {
  const res = await fetchGraphQL(
    operationsDoc,
    'UserByIssuer',
    {
      issuer,
    },
    token
  );

  return res?.data?.users?.length === 0;
}

export async function createNewUser(token: string, metadata: { email: string; issuer: string }) {
  await fetchGraphQL(operationsDoc, 'InsertUser', metadata, token);
}

export async function findVideoStatsByUser(
  token: string,
  issuer: string,
  videoId: string
): Promise<Stats | undefined> {
  const res = await fetchGraphQL(operationsDoc, 'StatsByIssuer', { issuer, videoId }, token);
  if (res?.data?.stats?.length) {
    return res?.data?.stats[0];
  }
  return undefined;
}

export async function insertStats(token: string, issuer: string, videoId: string): Promise<Stats> {
  const created = await fetchGraphQL(
    operationsDoc,
    'InsertStats',
    {
      userId: issuer,
      videoId,
    },
    token
  );

  return created.data.insert_stats_one;
}

export async function updateFavStats(
  token: string,
  metadata: {
    userId: string;
    videoId: string;
    favourited: number | null;
  }
): Promise<Stats> {
  // console.log({ token, metadata });
  const res = await fetchGraphQL(operationsDoc, 'UpdateFavs', metadata, token);
  return res.data.update_stats.returning[0];
}

export async function updateSavedStats(
  token: string,
  metadata: {
    userId: string;
    videoId: string;
    saved: boolean;
  }
): Promise<Stats> {
  // console.log({ token, metadata });
  const res = await fetchGraphQL(operationsDoc, 'UpdateSaved', metadata, token);
  return res.data.update_stats.returning[0];
}

export async function updateTimeAndWatchedStats(
  token: string,
  metadata: {
    userId: string;
    videoId: string;
    playedTime: number;
    watched: boolean;
  }
): Promise<Stats> {
  // console.log({ token, metadata });
  const res = await fetchGraphQL(operationsDoc, 'UpdateTimeAndWatched', metadata, token);
  return res.data.update_stats.returning[0];
}

export async function getWatchedVideos(
  token: string,
  issuer: string,
  offset: number = 0
): Promise<{ watched: YoutubeSnippet[]; total: number } | undefined> {
  const res = await fetchGraphQL(
    operationsDoc,
    'WatchedVideos',
    {
      userId: issuer,
      offset,
    },
    token
  );
  if (res?.data?.stats_aggregate) {
    const watched = res.data.stats.map((s: any) => ({
      id: s.videoId,
      imgUrl: `https://i.ytimg.com/vi/${s.videoId}/maxresdefault.jpg`,
    }));
    const total = res.data.stats_aggregate.aggregate.count;

    return {
      watched,
      total,
    };
  }
  return undefined;
}

export async function getSavedVideos(
  token: string,
  issuer: string,
  offset: number = 0
): Promise<
  | {
      saved: { id: string; imgUrl: string }[];
      total: number;
    }
  | undefined
> {
  const res = await fetchGraphQL(
    operationsDoc,
    'SavedVideos',
    {
      userId: issuer,
      offset,
    },
    token
  );

  if (res?.data?.stats_aggregate) {
    const saved = res.data.stats.map((video: any) => ({
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }));
    const total = res.data.stats_aggregate.aggregate.count;
    return {
      saved,
      total,
    };
  }

  return undefined;
}

export async function getWatchingNowVideos(
  token: string,
  issuer: string,
  offset: number = 0
): Promise<
  | {
      watching: { id: string; imgUrl: string }[];
      total: number;
    }
  | undefined
> {
  const res = await fetchGraphQL(
    operationsDoc,
    'WatchingVideos',
    {
      userId: issuer,
      offset,
    },
    token
  );

  if (res?.data?.stats_aggregate) {
    const watching = res.data.stats.map((video: any) => ({
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    }));
    const total = res.data.stats_aggregate.aggregate.count;
    return {
      watching,
      total,
    };
  }

  return undefined;
}
