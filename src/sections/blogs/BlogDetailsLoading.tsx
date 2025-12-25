export const BlogDetailsLoading = () => {
  return (
    <main className='bg-black'>
      {/* HEADER */}
      <section className='relative w-full h-80 overflow-hidden'>
        {/* Gradient background */}
        <div className='absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900' />

        {/* Center content */}
        <div className='absolute inset-0 flex flex-col items-center justify-center px-6 text-center animate-pulse'>
          <div className='h-9 w-80 sm:w-[420px] rounded bg-white/30 mb-4' />
          <div className='h-4 w-48 rounded bg-white/20 mb-3' />
          <div className='h-4 w-56 rounded bg-white/20' />
        </div>

        {/* Back button */}
        <div className='absolute top-6 left-6 h-9 w-24 rounded-full bg-black/40 animate-pulse' />

        {/* Category pill */}
        <div className='absolute bottom-6 left-6 h-9 w-32 rounded-full bg-black/40 animate-pulse' />
      </section>

      {/* CONTENT */}
      <section className='px-3 mt-5 animate-pulse'>
        <div className='space-y-4'>
          <div className='h-4 w-full rounded bg-slate-700' />
          <div className='h-4 w-full rounded bg-slate-700' />
          <div className='h-4 w-5/6 rounded bg-slate-700' />
          <div className='h-4 w-4/6 rounded bg-slate-700' />
        </div>
      </section>
      <section className='px-3 mt-5 animate-pulse'>
        <div className='space-y-4'>
          <div className='h-4 w-full rounded bg-slate-700' />
          <div className='h-4 w-full rounded bg-slate-700' />
          <div className='h-4 w-5/6 rounded bg-slate-700' />
          <div className='h-4 w-4/6 rounded bg-slate-700' />
        </div>
      </section>

      {/* COMMENTS */}
      <section className='mt-14 px-6 mx-auto'>
        <div className='space-y-6 animate-pulse'>
          {[1, 2].map(i => (
            <div key={i} className='flex gap-4'>
              <div className='h-10 w-10 rounded-full bg-slate-700' />
              <div className='flex-1 space-y-3'>
                <div className='h-4 w-1/4 rounded bg-slate-700' />
                <div className='h-4 w-full rounded bg-slate-700' />
                <div className='h-4 w-5/6 rounded bg-slate-700' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
