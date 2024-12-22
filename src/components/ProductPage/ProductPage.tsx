import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Image } from '../../interfaces/cardsInterface';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface ProductPageProps {
	apiKey: string;
	likedImages: Image[];
}

interface PhotoDetails {
	id: number;
	user: string;
	tags: string;
	webformatURL: string;
	likes: number;
	downloads: number;
	views: number;
}

const ProductPage: React.FC<ProductPageProps> = ({ apiKey, likedImages }) => {
	const { id } = useParams<{ id: string }>();
	const [photoDetails, setPhotoDetails] = useState<PhotoDetails | null>(null);
	const navigate = useNavigate();

	// Function to fetch details for Pixabay images
	const fetchPixabayDetails = async () => {
		try {
			const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&id=${id}`);
			const data = await response.json();
			if (data.hits.length > 0) {
				setPhotoDetails(data.hits[0]);
			} else {
				console.error('No Pixabay image found for this ID.');
			}
		} catch (error) {
			console.error('Error fetching Pixabay details:', error);
		}
	};

	useEffect(() => {
		// Check if the card is a user-created card
		const userCard = likedImages.find((image) => image.id === Number(id));

		if (userCard) {
			// Set details directly for user-created cards
			setPhotoDetails(userCard);
		} else {
			// Fetch details from Pixabay for Pixabay images
			fetchPixabayDetails();
		}
	}, [id, likedImages]);


	return (
		<>
			{!photoDetails ? (
				<LoadingSpinner />
			) : (
				<div className="product-page">
					<img src={photoDetails.webformatURL} alt={photoDetails.tags} />
					<h2>Author: {photoDetails.user}</h2>
					<p>Tags: {photoDetails.tags}</p>
					<p>Likes: {photoDetails.likes}</p>
					<p>Downloads: {photoDetails.downloads}</p>
					<p>Views: {photoDetails.views}</p>
					<button className="product-page__back-button" onClick={() => navigate(-1)}>
						&larr; Back to Products
					</button>
				</div>
			)}
		</>
	);
};
export default ProductPage;
