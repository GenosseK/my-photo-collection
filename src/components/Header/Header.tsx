import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleNavigation = (path: string) => {
		navigate(path);
	};

	return (
		<header className="header">
			<nav className="nav">
				<button
					className={`nav__button ${location.pathname === '/products' ? 'nav__button--active' : ''}`}
					onClick={() => handleNavigation('/products')}
				>
					Pixabay
				</button>
				<button
					className={`nav__button ${location.pathname === '/create-product' ? 'nav__button--active' : ''}`}
					onClick={() => handleNavigation('/create-product')}
				>
					Add Photo
				</button>
				<button
					className={`nav__button ${location.pathname === '/collection' ? 'nav__button--active' : ''}`}
					onClick={() => handleNavigation('/collection')}
				>
					My Collection
				</button>
			</nav>
		</header>
	);
};

export default Header;
