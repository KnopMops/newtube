import { SearchIcon } from 'lucide-react'

const SearchBar = () => {
	return (
		<div className='flex w-full max-w-[600px]'>
			<div className='relative w-full'>
				<input
					type='text'
					placeholder='Поиск...'
					className='w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500'
				/>
			</div>

			<button
				type='submit'
				className='px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
			>
				<SearchIcon className='size-5 text-gray-400' />
			</button>
		</div>
	)
}

export default SearchBar
