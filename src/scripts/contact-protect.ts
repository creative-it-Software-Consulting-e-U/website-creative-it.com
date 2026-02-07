document.querySelectorAll<HTMLElement>('[data-ct]').forEach((el) => {
  const encoded = el.dataset.ct;
  const type = el.dataset.ctType;
  if (!encoded) return;

  const decoded = atob(encoded);

  // Set text on dedicated [data-ct-text] child, or fall back to the element itself
  const textTarget = el.querySelector('[data-ct-text]') || el;
  textTarget.textContent = decoded;

  if (el instanceof HTMLAnchorElement) {
    if (type === 'email') el.href = `mailto:${decoded}`;
    else if (type === 'phone') el.href = `tel:${decoded}`;
  }
});
