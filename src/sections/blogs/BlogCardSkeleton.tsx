const BlogCardSkeleton = () => {
  return (
    <div className='flex gap-3 md:gap-5 lg:gap-6 flex-wrap justify-center'>
      <div
        className='
        bg-[#0f172a]
        border border-gray-700/40
        rounded-xl
        p-5
        flex flex-col justify-between
        animate-pulse min-h-[220px] min-w-[350px]'
      >
        {/* Title + Like */}
        <div className='flex justify-between items-start mb-4'>
          <div className='h-5 w-2/3 bg-gray-700 rounded' />
          <div className='h-5 w-5 bg-gray-700 rounded-full' />
        </div>

        {/* Description */}
        <div className='space-y-2 mb-5'>
          <div className='h-3 bg-gray-700 rounded w-full' />
          <div className='h-3 bg-gray-700 rounded w-5/6' />
          <div className='h-3 bg-gray-700 rounded w-4/6' />
        </div>

        {/* Read more */}
        <div className='h-4 w-24 bg-gray-700 rounded mb-4' />

        {/* Footer */}
        <div className='flex items-center justify-between'>
          <div className='h-6 w-20 bg-gray-700 rounded-full' />

          <div className='flex items-center space-x-2'>
            <div className='h-6 w-6 bg-gray-700 rounded-full' />
            <div className='h-3 w-16 bg-gray-700 rounded' />
          </div>
        </div>
      </div>
      <div
        className='
        bg-[#0f172a]
        border border-gray-700/40
        rounded-xl
        p-5
        flex flex-col justify-between
        animate-pulse min-h-[220px] min-w-[350px]'
      >
        {/* Title + Like */}
        <div className='flex justify-between items-start mb-4'>
          <div className='h-5 w-2/3 bg-gray-700 rounded' />
          <div className='h-5 w-5 bg-gray-700 rounded-full' />
        </div>

        {/* Description */}
        <div className='space-y-2 mb-5'>
          <div className='h-3 bg-gray-700 rounded w-full' />
          <div className='h-3 bg-gray-700 rounded w-5/6' />
          <div className='h-3 bg-gray-700 rounded w-4/6' />
        </div>

        {/* Read more */}
        <div className='h-4 w-24 bg-gray-700 rounded mb-4' />

        {/* Footer */}
        <div className='flex items-center justify-between'>
          <div className='h-6 w-20 bg-gray-700 rounded-full' />

          <div className='flex items-center space-x-2'>
            <div className='h-6 w-6 bg-gray-700 rounded-full' />
            <div className='h-3 w-16 bg-gray-700 rounded' />
          </div>
        </div>
      </div>
      <div
        className='
        bg-[#0f172a]
        border border-gray-700/40
        rounded-xl
        p-5
        flex flex-col justify-between
        animate-pulse min-h-[220px] min-w-[350px]'
      >
        {/* Title + Like */}
        <div className='flex justify-between items-start mb-4'>
          <div className='h-5 w-2/3 bg-gray-700 rounded' />
          <div className='h-5 w-5 bg-gray-700 rounded-full' />
        </div>

        {/* Description */}
        <div className='space-y-2 mb-5'>
          <div className='h-3 bg-gray-700 rounded w-full' />
          <div className='h-3 bg-gray-700 rounded w-5/6' />
          <div className='h-3 bg-gray-700 rounded w-4/6' />
        </div>

        {/* Read more */}
        <div className='h-4 w-24 bg-gray-700 rounded mb-4' />

        {/* Footer */}
        <div className='flex items-center justify-between'>
          <div className='h-6 w-20 bg-gray-700 rounded-full' />

          <div className='flex items-center space-x-2'>
            <div className='h-6 w-6 bg-gray-700 rounded-full' />
            <div className='h-3 w-16 bg-gray-700 rounded' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCardSkeleton
