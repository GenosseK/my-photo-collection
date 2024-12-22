import React, { useState } from 'react';
import './CreateProduct.css';
import type { Image } from '../../interfaces/cardsInterface';

interface CreateProductProps {
	addCard: (card: Image) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ addCard }) => {
	// Form field states
	const [imageUrl, setImageUrl] = useState('');
	const [author, setAuthor] = useState('');
	const [tags, setTags] = useState('');
	// Error states for validation
	const [imageError, setImageError] = useState('');
	const [authorError, setAuthorError] = useState('');
	const [tagsError, setTagsError] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Validate URL format
	const validateUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	// Handle image URL input change
	const handleImageUrlChange = (value: string) => {
		setImageUrl(value);
		if (value && !validateUrl(value)) {
			setImageError('Please enter a valid image URL.');
		} else {
			setImageError('');
		}
	};

	// Handle author name input change
	const handleAuthorChange = (value: string) => {
		setAuthor(value);
		if (value.trim() === '') {
			setAuthorError('Author name cannot be blank.');
		} else {
			setAuthorError('');
		}
	};

	// Handle tags input change
	const handleTagsChange = (value: string) => {
		setTags(value);
		setTagsError('');
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!tags.trim()) {
			setTagsError('Tags cannot be blank.');
			return;
		}

		// Format tags as a comma-separated string
		const formatTags = (inputTags: string) => {
			// Split by space or comma and trim excess spaces
			const tagsArray = inputTags
				.split(/[\s,]+/) // Split by spaces or commas
				.map((tag) => tag.trim()) // Trim each tag
				.filter((tag) => tag.length > 0); // Remove empty tags

			// Join tags with a single comma and ensure the last tag has no comma
			return tagsArray.join(', ');
		};

		const formattedTags = formatTags(tags);

		// Create a new card object
		const newCard: Image = {
			id: Math.floor(1000000000 + Math.random() * 9000000000), // Random 10-digit ID
			user: author,
			tags: formattedTags,
			webformatURL: imageUrl,
			likes: 1,
			downloads: 0,
			views: 1,
			isUserPhoto: true,
		};

		addCard(newCard);
		setImageUrl('');
		setAuthor('');
		setTags('');
		setIsSubmitted(true);
	};


	const isFormValid = !imageError && !authorError && imageUrl && author && tags;

	return (
		<div className="create-product">
			<h1>Upload Your Photo</h1>
			<form className="create-product__form" onSubmit={handleSubmit}>
				<div className="create-product__field">
					<label htmlFor="imageUrl">Image URL:</label>
					<input
						type="text"
						id="imageUrl"
						placeholder="Enter a valid image URL"
						value={imageUrl}
						onChange={(e) => handleImageUrlChange(e.target.value)}
					/>
					{imageError && <span className="error">{imageError}</span>}
				</div>

				<div className="create-product__field">
					<label htmlFor="author">Author:</label>
					<input
						type="text"
						id="author"
						placeholder="Enter the author's name"
						value={author}
						onChange={(e) => handleAuthorChange(e.target.value)}
					/>
					{authorError && <span className="error">{authorError}</span>}
				</div>

				<div className="create-product__field">
					<label htmlFor="tags">Tags:</label>
					<input
						type="text"
						id="tags"
						placeholder="Enter tags separated by spaces"
						value={tags}
						onChange={(e) => handleTagsChange(e.target.value)}
					/>
					{tagsError && <span className="error">{tagsError}</span>}
				</div>

				<button type="submit" className="create-product__submit" disabled={!isFormValid}>
					Submit
				</button>
			</form>

			{isSubmitted && <p className="success">Card created successfully!</p>}
		</div>
	);
};

export default CreateProduct;
