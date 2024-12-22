import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
	return (
		<div className="not-found">
			<div className="not-found__content">
				<h1 className="not-found__title">404</h1>
				<p className="not-found__subtitle">The page you're looking for can't be found.</p>
				<Link to="/products" className="not-found__link">
					Go to Products
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
