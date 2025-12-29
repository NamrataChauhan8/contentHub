// ** Next JS Imports
import FavouriteBlog from '@/sections/favourites/FavouriteBlog'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: `Favourite Blogs | Scratchpad`
}

const Page = () => <FavouriteBlog />

export default Page
