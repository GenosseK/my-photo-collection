export interface Image {
	id: number;
	user: string;
	tags: string;
	webformatURL: string;
	likes: number;
	downloads: number;
	views: number;
	isUserPhoto?: boolean;
	loading?: boolean;
}


export type DeletedIds = number[];

export interface CardProps {
	id: number;
	title: string;
	description: string;
	imageUrl: string;
	onDeleteCard: (id: number) => void;
}

export interface CardsProps {
	images: Image[];
	onDeleteCard: (id: number) => void;
}
