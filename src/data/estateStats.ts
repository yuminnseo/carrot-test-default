export type EstateStats = {
  cardClicks: Record<string, number>;
  chatClicks: Record<string, number>;
  heartOnClicks: Record<string, number>;
  heartOffClicks: Record<string, number>;
  liked: Record<string, boolean>;
};

const STORAGE_KEY = "carrot-estate-stats";

const defaultStats = (): EstateStats => ({
  cardClicks: {},
  chatClicks: {},
  heartOnClicks: {},
  heartOffClicks: {},
  liked: {},
});

let memoryStats = defaultStats();

const getStorage = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  return window.localStorage;
};

export const loadEstateStats = (): EstateStats => {
  const storage = getStorage();

  if (!storage) {
    return memoryStats;
  }

  const saved = storage.getItem(STORAGE_KEY);

  if (!saved) {
    return memoryStats;
  }

  try {
    memoryStats = { ...defaultStats(), ...JSON.parse(saved) };
    return memoryStats;
  } catch {
    return memoryStats;
  }
};

const saveEstateStats = (next: EstateStats) => {
  memoryStats = next;
  const storage = getStorage();

  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  if (typeof window !== "undefined") {
    Object.defineProperty(window, "__carrotEstateStats", {
      configurable: true,
      value: next,
    });
  }

  if (typeof document !== "undefined") {
    document.documentElement.dataset.carrotEstateStats = JSON.stringify(next);
  }
};

const increment = (record: Record<string, number>, id: string) => ({
  ...record,
  [id]: (record[id] ?? 0) + 1,
});

export const recordCardClick = (id: string) => {
  const current = loadEstateStats();
  saveEstateStats({
    ...current,
    cardClicks: increment(current.cardClicks, id),
  });
};

export const recordChatClick = (id: string) => {
  const current = loadEstateStats();
  saveEstateStats({
    ...current,
    chatClicks: increment(current.chatClicks, id),
  });
};

export const recordHeartClick = (id: string, liked: boolean) => {
  const current = loadEstateStats();
  saveEstateStats({
    ...current,
    heartOnClicks: liked
      ? increment(current.heartOnClicks, id)
      : current.heartOnClicks,
    heartOffClicks: liked
      ? current.heartOffClicks
      : increment(current.heartOffClicks, id),
    liked: {
      ...current.liked,
      [id]: liked,
    },
  });
};

export const getEstateLiked = (id: string) => Boolean(loadEstateStats().liked[id]);
