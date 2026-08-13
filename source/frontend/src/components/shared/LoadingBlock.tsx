export function LoadingBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-stack" aria-label="در حال بارگذاری">
      {Array.from({ length: rows }).map((_, index) => <span className="skeleton" key={index} />)}
    </div>
  );
}
