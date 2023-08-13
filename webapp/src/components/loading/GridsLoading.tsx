export default function GridsLoading() {
  return (
    <>
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {Array(8)
          .fill(0)
          .map((_, index) => {
            return (
              <div
                key={`Grids Loading ${index}`}
                className="aspect-square w-full animate-pulse bg-slate-100"
              ></div>
            )
          })}
      </div>
    </>
  )
}
