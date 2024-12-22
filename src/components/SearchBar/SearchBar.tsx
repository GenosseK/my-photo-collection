import React from 'react';

interface SearchBarProps {
	query: string;
	setQuery: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => {
	return (
		<div className="search-bar">
			<input
				type="text"
				className="search-bar__input"
				placeholder="Explore Pixabay by writing your tags..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
		</div>
	);
};

export default SearchBar;
