import { computeBatchVisibility, matchesFilterItem } from './list-filter';

export interface ListFilterDomConfig {
  searchInputId?: string;
  searchClearId?: string;
  filterBarId?: string;
  itemSelector: string;
  noMatchesId: string;
  resetBtnId: string;
  sentinelId: string;
  batchSize?: number;
}

function setButtonActiveState(btn: HTMLButtonElement, isActive: boolean) {
  btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  const innerLine = btn.querySelector('span:first-child');

  if (isActive) {
    btn.classList.add(
      'bg-crimson',
      'text-parchment',
      'border-crimson',
      'shadow-sm'
    );
    btn.classList.remove(
      'bg-transparent',
      'text-ink',
      'hover:bg-parchmentDark'
    );
    if (innerLine) {
      innerLine.classList.add('border-parchment', 'opacity-60');
      innerLine.classList.remove(
        'border-ink',
        'opacity-30',
        'group-hover:opacity-60'
      );
    }
  } else {
    btn.classList.remove(
      'bg-crimson',
      'text-parchment',
      'border-crimson',
      'shadow-sm'
    );
    btn.classList.add('bg-transparent', 'text-ink', 'hover:bg-parchmentDark');
    if (innerLine) {
      innerLine.classList.remove('border-parchment', 'opacity-60');
      innerLine.classList.add(
        'border-ink',
        'opacity-30',
        'group-hover:opacity-60'
      );
    }
  }
}

function syncUrlState(activeTag: string, activeQuery: string) {
  const url = new URL(window.location.href);
  if (activeTag === 'all') {
    url.searchParams.delete('tag');
  } else {
    url.searchParams.set('tag', activeTag);
  }

  if (activeQuery.length === 0) {
    url.searchParams.delete('search');
  } else {
    url.searchParams.set('search', activeQuery);
  }

  window.history.replaceState({}, '', url);
}

function getItemTagsAndHaystack(item: HTMLElement): {
  itemTags: string[];
  searchHaystack: string;
} {
  const rawTags =
    item.getAttribute('data-project-tags') ||
    item.getAttribute('data-tags') ||
    '';
  const itemTags = rawTags
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const searchHaystack =
    item.getAttribute('data-search-text') || item.innerText || '';

  return { itemTags, searchHaystack };
}

function setupSentinelObserver(
  sentinel: HTMLElement | null,
  onBatchIncrement: () => void
): IntersectionObserver | null {
  if (!(sentinel && 'IntersectionObserver' in window)) {
    return null;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onBatchIncrement();
        }
      }
    },
    { rootMargin: '200px' }
  );
  observer.observe(sentinel);
  return observer;
}

function getFilterElements(config: ListFilterDomConfig) {
  const searchInput = config.searchInputId
    ? (document.getElementById(config.searchInputId) as HTMLInputElement | null)
    : null;
  const searchClearBtn = config.searchClearId
    ? (document.getElementById(config.searchClearId) as HTMLElement | null)
    : null;
  const filterBar = config.filterBarId
    ? document.getElementById(config.filterBarId)
    : null;
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(config.itemSelector)
  );
  const noMatches = document.getElementById(config.noMatchesId);
  const resetBtn = document.getElementById(config.resetBtnId);
  const sentinel = document.getElementById(config.sentinelId);

  return {
    searchInput,
    searchClearBtn,
    filterBar,
    items,
    noMatches,
    resetBtn,
    sentinel
  };
}

export function initListFilter(config: ListFilterDomConfig): () => void {
  const {
    searchInput,
    searchClearBtn,
    filterBar,
    items,
    noMatches,
    resetBtn,
    sentinel
  } = getFilterElements(config);

  if (items.length === 0) {
    return () => {
      /* no-op when list is empty */
    };
  }

  const batchSize = config.batchSize ?? 6;
  let currentLimit = batchSize;
  let activeTag = 'all';
  let activeQuery = '';
  let matchedItems: HTMLElement[] = [];

  const filterBtns = filterBar
    ? Array.from(
        filterBar.querySelectorAll<HTMLButtonElement>(
          'button[data-filter-tag], .portfolio-filter-btn'
        )
      )
    : [];

  function updateTagButtonStyles(selectedTag: string) {
    const normalizedTag = selectedTag.trim().toLowerCase();
    for (const btn of filterBtns) {
      const btnTag = btn.getAttribute('data-filter-tag')?.toLowerCase() || '';
      setButtonActiveState(btn, btnTag === normalizedTag);
    }
  }

  function renderVisibility() {
    const { visibleCount, hasMore } = computeBatchVisibility(
      matchedItems.length,
      currentLimit
    );

    for (let i = 0; i < matchedItems.length; i++) {
      matchedItems[i].style.display = i < visibleCount ? '' : 'none';
    }

    if (noMatches) {
      if (matchedItems.length === 0) {
        noMatches.classList.remove('hidden');
      } else {
        noMatches.classList.add('hidden');
      }
    }

    if (sentinel) {
      sentinel.style.display = hasMore ? '' : 'none';
    }
  }

  function applyFilter(selectedTag: string, query: string, updateUrl = true) {
    activeTag = selectedTag.trim().toLowerCase();
    activeQuery = query.trim();

    updateTagButtonStyles(activeTag);

    matchedItems = [];
    for (const item of items) {
      const { itemTags, searchHaystack } = getItemTagsAndHaystack(item);
      const isMatch = matchesFilterItem(
        searchHaystack,
        itemTags,
        activeQuery,
        activeTag
      );

      if (isMatch) {
        matchedItems.push(item);
      } else {
        item.style.display = 'none';
      }
    }

    renderVisibility();

    if (searchClearBtn) {
      if (activeQuery.length > 0) {
        searchClearBtn.classList.remove('hidden');
      } else {
        searchClearBtn.classList.add('hidden');
      }
    }

    if (updateUrl) {
      syncUrlState(activeTag, activeQuery);
    }
  }

  const observer = setupSentinelObserver(sentinel, () => {
    const { hasMore } = computeBatchVisibility(
      matchedItems.length,
      currentLimit
    );
    if (hasMore) {
      currentLimit += batchSize;
      renderVisibility();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentLimit = batchSize;
      applyFilter(activeTag, searchInput.value, true);
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentLimit = batchSize;
      applyFilter(activeTag, '', true);
      searchInput.focus();
    });
  }

  for (const btn of filterBtns) {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-filter-tag') || 'all';
      currentLimit = batchSize;
      const currentQuery = searchInput ? searchInput.value : '';
      applyFilter(tag, currentQuery, true);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      currentLimit = batchSize;
      applyFilter('all', '', true);
    });
  }

  const currentUrl = new URL(window.location.href);
  const initialTag = currentUrl.searchParams.get('tag') || 'all';
  const initialQuery = currentUrl.searchParams.get('search') || '';

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  applyFilter(initialTag, initialQuery, false);

  return () => {
    if (observer) {
      observer.disconnect();
    }
  };
}
