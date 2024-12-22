import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router';
import Cards from './Cards/Cards';
import Header from './Header/Header';
import ProductPage from './ProductPage/ProductPage';
import SearchBar from './SearchBar/SearchBar';
import { Image, DeletedIds } from '../interfaces/cardsInterface';
import CreateProduct from './CreateProduct/CreateProduct';
import { Navigate } from 'react-router-dom';
import NotFound from './NotFound/NotFound';

function App() {
	const [images, setImages] = useState<Image[]>([]);
	const [deletedIds, setDeletedIds] = useState<DeletedIds>(
		JSON.parse(localStorage.getItem('deletedIds') || '[]')
	);
	const [likedIds, setLikedIds] = useState<Set<number>>(() => {
		const savedLikes = JSON.parse(localStorage.getItem('likedIds') || '[]');
		return new Set<number>(savedLikes);
	});
	const [likedImages, setLikedImages] = useState<Image[]>([]);
	const [query, setQuery] = useState('');
	const [showMyPhotos, setShowMyPhotos] = useState<boolean>(() => {
		return JSON.parse(localStorage.getItem('showMyPhotos') || 'false');
	});
	const [userCreatedImages, setUserCreatedImages] = useState<Image[]>(() => {
		return JSON.parse(localStorage.getItem('userCreatedImages') || '[]');
	});

	useEffect(() => {
		localStorage.setItem('showMyPhotos', JSON.stringify(showMyPhotos)); // Persist toggle state
	}, [showMyPhotos]);

	useEffect(() => {
		localStorage.setItem('userCreatedImages', JSON.stringify(userCreatedImages)); // Persist user-created images
	}, [userCreatedImages]);

	useEffect(() => {
		localStorage.setItem('likedIds', JSON.stringify(Array.from(likedIds))); // Persist liked IDs
	}, [likedIds]);

	const apiKey = '10476652-e5a497850cb2f5f361e9fb5ce';
	const url = `https://pixabay.com/api/?key=${apiKey}&q=${query || 'nature'}&image_type=photo&orientation=horizontal`;

	// Function to fetch images from Pixabay API
	const fetchImages = async () => {
		try {
			const response = await axios.get(url);
			// Filter out deleted images
			const filteredImages = response.data.hits.filter(
				(image: Image) => !deletedIds.includes(image.id)
			);
			// Store a maximum of 12 images at a time to avoid exceeding the API request limit
			setImages(filteredImages.slice(0, 12));
		} catch (error) {
			console.error('Error fetching data from Pixabay API', error);
		}
	};

	useEffect(() => {
		fetchImages();
	}, [deletedIds, query]);

	useEffect(() => {
		const fetchLikedImages = async () => {
			try {

				// Separate Pixabay IDs from user-created IDs
				const pixabayIds = Array.from(likedIds).filter(
					(id) => !userCreatedImages.some((img) => img.id === id)
				);
				const fetchedUserImages = userCreatedImages.filter((img) =>
					likedIds.has(img.id)
				);

				// Fetch data for valid Pixabay IDs
				const pixabayResponses = await Promise.all(
					pixabayIds.map((id) =>
						axios
							.get(`https://pixabay.com/api/?key=${apiKey}&id=${id}`)
							.then((response) => {
								return response.data.hits?.[0];
							})
							.catch((err) => {
								console.warn(`Failed to fetch Pixabay image with ID: ${id}`, err);
								return null;
							})
					)
				);

				// Filter out null responses (invalid IDs)
				const fetchedPixabayImages = pixabayResponses.filter(Boolean) as Image[];

				// Combine results and update the state
				const combinedImages = [...fetchedPixabayImages, ...fetchedUserImages];

				setLikedImages(combinedImages);
			} catch (error) {
				console.error("Error fetching liked images:", error);
			}
		};

		fetchLikedImages();
	}, [likedIds, userCreatedImages]);

	// Delete an image by ID and update state
	const handleDelete = (id: number) => {
		setDeletedIds((prevDeletedIds) => {
			const updatedDeletedIds = [...prevDeletedIds, id];
			localStorage.setItem('deletedIds', JSON.stringify(updatedDeletedIds));
			return updatedDeletedIds;
		});

		setImages((prevImages) => prevImages.filter((image) => image.id !== id));
	};

	// Toggle the like state of an image by ID
	const toggleLike = (id: number) => {
		setLikedIds((prevLikedIds) => {
			const updatedLikedIds = new Set(prevLikedIds);
			if (updatedLikedIds.has(id)) {
				updatedLikedIds.delete(id); // Unlike
			} else {
				updatedLikedIds.add(id); // Like
			}
			return updatedLikedIds;
		});
	};


	const addCard = (card: Image) => {

		setUserCreatedImages((prev) => {
			const updatedImages = [...prev, card];
			localStorage.setItem('userCreatedImages', JSON.stringify(updatedImages));
			return updatedImages;
		});

		setLikedImages((prev) => [...prev, card]);
		setLikedIds((prev) => new Set(prev.add(card.id)));
	};


	return (
		<div className="page">
			<Header />
			<Routes>
				<Route path="/" element={<Navigate to="/products" replace />} />
				<Route
					path="/products"
					element={
						<>
							<SearchBar query={query} setQuery={setQuery} />
							<Cards
								images={images}
								onDeleteCard={handleDelete}
								likedIds={likedIds}
								onLikeToggle={toggleLike}
								showDeleteButton={true}
							/>
						</>
					}
				/>
				<Route
					path="/products/:id"
					element={<ProductPage apiKey={apiKey} likedImages={likedImages} />}
				/>

				<Route
					path="/collection"
					element={
						<Cards
							images={likedImages.filter((img) => !showMyPhotos || img.isUserPhoto)}
							onDeleteCard={handleDelete}
							likedIds={likedIds}
							onLikeToggle={toggleLike}
							showDeleteButton={false}
							showToggle={true}
							onToggleChange={() => setShowMyPhotos((prev) => !prev)}
							toggleChecked={showMyPhotos}
						/>
					}
				/>
				<Route path="/create-product" element={<CreateProduct addCard={addCard} />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
