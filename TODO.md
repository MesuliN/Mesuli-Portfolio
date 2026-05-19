# TODO - React portfolio lazy-loading optimization

- [x] Inspect current `src/Portfolio.tsx` route/modal imports and conditional rendering.
- [ ] Implement `React.lazy()` + `Suspense` in `src/Portfolio.tsx` for:

  - [ ] `AboutPage` (lazy module)
  - [ ] `ProjectsPage` (lazy module)
- [ ] Implement lazy loading for `ContactModal` without mounting it until opened:
  - [ ] Use `React.lazy()` + `Suspense` only when `contactModalOpen === true`.
  - [ ] Ensure no fallback affects layout when modal is closed.
- [ ] Keep UI/design/animations unchanged (no layout/styling diffs besides wrappers required by Suspense).
- [ ] Add/adjust `loading="lazy"` for any safe images in `src/Portfolio.tsx` only if it won’t affect above-the-fold visuals.
- [ ] Run `npm run build` to confirm production compilation.
- [ ] Summarize all lazy-loading optimizations made and what code was deferred.

