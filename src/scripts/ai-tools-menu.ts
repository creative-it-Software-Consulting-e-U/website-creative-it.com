(() => {
  const toggle = document.getElementById('ai-tools-toggle')!;
  const icon = document.getElementById('ai-tools-icon')!;
  const closeIcon = document.getElementById('ai-tools-close-icon')!;
  const pulse = document.getElementById('ai-tools-pulse')!;
  const chatBtn = document.getElementById('chat-toggle')!;
  const remixBtn = document.getElementById('remix-toggle')!;
  const translateBtn = document.getElementById('translate-toggle')!;
  const labelChat = document.getElementById('ai-label-chat')!;
  const labelRemix = document.getElementById('ai-label-remix')!;
  const labelTranslate = document.getElementById('ai-label-translate')!;

  let isMenuOpen = false;

  // Vertical stack geometry
  const CENTER_X = 6;    // (56 - 44) / 2 — center sub-buttons on main
  const LABEL_GAP = 52;  // 44 button + 8 gap
  const BASE_Y = 68;     // 56 main + 12 gap
  const STEP_Y = 56;     // 44 sub + 12 gap

  const items = [
    { btn: chatBtn, label: labelChat },
    { btn: remixBtn, label: labelRemix },
    { btn: translateBtn, label: labelTranslate },
  ];

  const toolNames = ['chat', 'remix', 'translate'];

  // Remove pulse entirely after 8s (display:none stops the animation
  // AND removes the element from the compositing tree)
  setTimeout(() => { pulse.style.display = 'none'; }, 8000);

  function hideAllLabels() {
    for (const { label } of items) {
      label.style.transform = '';
      label.classList.add('opacity-0', 'pointer-events-none');
      label.classList.remove('opacity-100');
    }
  }

  function hideBtn(btn: HTMLElement) {
    btn.style.transform = '';
    btn.classList.add('opacity-0', 'pointer-events-none');
    btn.classList.remove('opacity-100');
  }

  function openMenu() {
    isMenuOpen = true;
    icon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    pulse.style.display = 'none';
    toggle.classList.add('rotate-90');

    items.forEach(({ btn, label }, i) => {
      const y = BASE_Y + i * STEP_Y;
      setTimeout(() => {
        btn.style.transform = `translate(${CENTER_X}px, ${-y}px)`;
        btn.classList.remove('opacity-0', 'pointer-events-none');
        btn.classList.add('opacity-100');
      }, i * 60);
      setTimeout(() => {
        label.style.transform = `translate(${CENTER_X + LABEL_GAP}px, ${-y}px)`;
        label.classList.remove('opacity-0', 'pointer-events-none');
        label.classList.add('opacity-100');
      }, i * 60 + 40);
    });
  }

  function closeMenu() {
    isMenuOpen = false;
    icon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    toggle.classList.remove('rotate-90');

    [...items].reverse().forEach(({ btn, label }, i) => {
      setTimeout(() => {
        label.style.transform = '';
        label.classList.add('opacity-0', 'pointer-events-none');
        label.classList.remove('opacity-100');
      }, i * 30);
      setTimeout(() => {
        hideBtn(btn);
      }, i * 30 + 30);
    });
  }

  function handleToggle() {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }

  // Primary: click handler (works on desktop + mobile with touch-action: manipulation)
  toggle.addEventListener('click', handleToggle);

  // iOS Safari fallback for all AI tool buttons (compositor hit-test bug
  // with fixed-position elements moved via CSS transform)
  document.addEventListener('touchend', (e) => {
    const touch = (e as TouchEvent).changedTouches[0];
    if (!touch) return;

    // Check main toggle
    if (!(e.target === toggle || toggle.contains(e.target as Node))) {
      const rect = toggle.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        e.preventDefault();
        handleToggle();
        return;
      }
    }

    // Check sub-buttons (menu open OR single active button visible)
    for (const { btn } of items) {
      if (btn.classList.contains('pointer-events-none')) continue;
      const rect = btn.getBoundingClientRect();
      if (rect.width === 0) continue;
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        if (e.target === btn || btn.contains(e.target as Node)) return;
        e.preventDefault();
        btn.click();
        return;
      }
    }
  }, { passive: false });

  // When a sub-button is clicked: collapse menu, close other open panels
  function collapseMenuFor(clickedIndex: number) {
    document.dispatchEvent(new CustomEvent('ai-tool-activated', {
      detail: { tool: toolNames[clickedIndex] }
    }));

    hideAllLabels();

    // Hide other sub-buttons
    items.forEach(({ btn }, i) => {
      if (i !== clickedIndex) hideBtn(btn);
    });

    // Collapse main toggle
    if (isMenuOpen) {
      isMenuOpen = false;
      icon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      toggle.classList.remove('rotate-90');
    }
  }

  // When a panel closes (via its close button), hide its sub-button
  document.addEventListener('ai-panel-closed', (e) => {
    const tool = (e as CustomEvent).detail?.tool;
    const i = toolNames.indexOf(tool);
    if (i >= 0) hideBtn(items[i].btn);
  });

  chatBtn.addEventListener('click', () => collapseMenuFor(0));
  remixBtn.addEventListener('click', () => collapseMenuFor(1));
  translateBtn.addEventListener('click', () => collapseMenuFor(2));
})();
