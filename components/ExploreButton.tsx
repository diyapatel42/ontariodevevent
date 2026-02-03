'use client'
import Link from 'next/link';
import ArrowDown from '@/components/icons/ArrowDown';

const ExploreButton = () => {
  return (
      <Link href="/#events" >
        <button className='text-black bg-green-100 flex flex-row justify-center mt-5 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-200 transition-colors duration-300 group items-center gap-2'>
            Explore Events
            <ArrowDown />

        </button>


      </Link>
  )
}
export default ExploreButton
