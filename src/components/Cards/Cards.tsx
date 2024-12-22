import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardsProps } from '../../interfaces/cardsInterface';
import Card from '../Card/Card';
import './Cards.css';

const Cards: React.FC<
	CardsProps & {
		likedIds: Set<number>;
		onLikeToggle: (id: number) => void;
		showDeleteButton: boolean;
		showToggle?: boolean;
		onToggleChange?: () => void;
		toggleChecked?: boolean;
	}
> = ({ images, onDeleteCard, likedIds, onLikeToggle, showDeleteButton, showToggle, onToggleChange, toggleChecked }) => {

	const navigate = useNavigate();

	// Function to navigate to the product detail page on card click
	const handleCardClick = (id: number) => {
		navigate(`/products/${id}`);
	};

	return (
		<>
			{showToggle && (
				<div className="cards__toggle">
					<label className="toggle">
						<input
							type="checkbox"
							className="toggle__input"
							onChange={onToggleChange}
							checked={toggleChecked}
						/>
						<span className="toggle__slider"></span>
						<span className="toggle__label">My Photos only</span>
					</label>
				</div>
			)}
			<div className="cards">
				{images.length === 0 ? (
					<div className="cards__no-photos">No photos</div>
				) : (
					images.map((image) => (
						<Card
							key={image.id}
							id={image.id}
							title={image.user}
							description={image.tags}
							imageUrl={image.webformatURL}
							onDeleteCard={onDeleteCard}
							onCardClick={handleCardClick}
							isLiked={likedIds.has(image.id)}
							onLike={() => onLikeToggle(image.id)}
							showDeleteButton={showDeleteButton}
						/>
					))
				)}
			</div>
		</>
	);
};

export default Cards;
