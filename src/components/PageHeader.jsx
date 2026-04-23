export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100/70 bg-white/80 px-6 py-5 backdrop-blur-xl lg:px-10">
      <div className="mx-auto flex max-w-5xl items-end justify-between gap-6">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 truncate text-[22px] font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
