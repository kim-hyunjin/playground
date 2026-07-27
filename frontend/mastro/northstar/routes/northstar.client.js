const dialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-site-search]");
const searchResults = document.querySelector("[data-search-results]");
let storyIndex = [];

const loadStories = async () => {
  if (storyIndex.length) return storyIndex;
  const response = await fetch("/api/stories.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  storyIndex = data.stories;
  return storyIndex;
};

const renderSearchResults = (query) => {
  const normalized = query.trim().toLocaleLowerCase("ko");
  searchResults.replaceChildren();

  if (!normalized) {
    const hint = document.createElement("p");
    hint.textContent = "검색어를 입력하면 6개의 정적 페이지를 즉시 찾아봅니다.";
    searchResults.append(hint);
    return;
  }

  const matches = storyIndex.filter((story) =>
    [story.title, story.eyebrow, story.description, story.season]
      .join(" ")
      .toLocaleLowerCase("ko")
      .includes(normalized),
  );

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.textContent = `"${query}"에 맞는 기록이 없습니다.`;
    searchResults.append(empty);
    return;
  }

  matches.forEach((story) => {
    const link = document.createElement("a");
    const eyebrow = document.createElement("span");
    const title = document.createElement("strong");
    const arrow = document.createElement("b");
    link.href = `/stories/${story.slug}/`;
    eyebrow.textContent = story.eyebrow;
    title.textContent = story.title;
    arrow.textContent = "↗";
    link.append(eyebrow, title, arrow);
    searchResults.append(link);
  });
};

const openSearch = async () => {
  if (!dialog) return;
  dialog.showModal();
  searchInput?.focus();
  try {
    await loadStories();
    renderSearchResults(searchInput?.value || "");
  } catch {
    searchResults.textContent = "검색 인덱스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
};

document.querySelectorAll("[data-open-search]").forEach((button) => {
  button.addEventListener("click", openSearch);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
});

searchInput?.addEventListener("input", (event) => {
  renderSearchResults(event.currentTarget.value);
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const filterButtons = document.querySelectorAll("[data-filter]");
const storyCards = document.querySelectorAll("[data-story-card]");
const visibleCount = document.querySelector("[data-visible-count]");
const emptyState = document.querySelector("[data-empty-state]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let count = 0;

    filterButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    storyCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) count += 1;
    });

    if (visibleCount) visibleCount.textContent = String(count).padStart(2, "0");
    if (emptyState) emptyState.hidden = count > 0;
  });
});

const observatory = document.querySelector("[data-observatory]");
if (observatory && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  observatory.addEventListener("pointermove", (event) => {
    const bounds = observatory.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    observatory.style.setProperty("--pointer-x", x.toFixed(3));
    observatory.style.setProperty("--pointer-y", y.toFixed(3));
  });

  observatory.addEventListener("pointerleave", () => {
    observatory.style.setProperty("--pointer-x", 0);
    observatory.style.setProperty("--pointer-y", 0);
  });
}

const clock = document.querySelector("[data-local-time]");
const updateClock = () => {
  if (!clock) return;
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date());
  clock.textContent = `SEO ${time}`;
};
updateClock();
if (clock) setInterval(updateClock, 1000);

const menuToggle = document.querySelector("[data-menu-toggle]");
menuToggle?.addEventListener("click", () => {
  const expanded = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute("aria-label", expanded ? "메뉴 닫기" : "메뉴 열기");
});

const fetchButton = document.querySelector("[data-fetch-api]");
const apiOutput = document.querySelector("[data-api-output]");
fetchButton?.addEventListener("click", async () => {
  fetchButton.disabled = true;
  fetchButton.textContent = "Requesting…";
  try {
    const response = await fetch("/api/stories.json");
    const data = await response.json();
    apiOutput.textContent = JSON.stringify(
      {
        status: response.status,
        contentType: response.headers.get("content-type"),
        count: data.meta.count,
        firstSignal: data.stories[0].slug,
      },
      null,
      2,
    );
  } catch (error) {
    apiOutput.textContent = JSON.stringify({ status: "error", message: error.message }, null, 2);
  } finally {
    fetchButton.disabled = false;
    fetchButton.textContent = "Fetch again";
  }
});
