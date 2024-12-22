import React from 'react';
import { CardProps } from '../../interfaces/cardsInterface';

const Card: React.FC<
	CardProps & {
		onCardClick: (id: number) => void;
		isLiked: boolean;
		onLike: () => void;
		showDeleteButton: boolean;
	}
> = ({ id, title, description, imageUrl, onDeleteCard, onCardClick, isLiked, onLike, showDeleteButton }) => {

	// Prevent navigation if the delete or like button is clicked
	const handleCardClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('card__btn') || target.classList.contains('card__delete-btn')) {
			return;
		}
		onCardClick(id);
	};

	return (
		<li className="cards__item">
			<div className="card" onClick={handleCardClick}>
				<div className="card__image-wrapper">
					<img className="card__image" src={imageUrl} alt={title} />
					{showDeleteButton && (
						<button
							className="card__delete-btn"
							onClick={() => onDeleteCard(id)}
						>
							&#10005;
						</button>
					)}
				</div>
				<div className="card__content">
					<div className="card__title">{title}</div>
					<p className="card__text">{description}</p>
					<button
						className={`btn btn--block card__btn ${isLiked ? 'liked' : ''}`}
						onClick={onLike}
					>
						{isLiked ? 'Liked' : 'Like'}
					</button>
				</div>
			</div>
		</li>
	);
};

export default Card;
