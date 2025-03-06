import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "react-bootstrap";
import { FiLogOut } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { GrCatalog } from "react-icons/gr";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";

const Navbar = (props) => {
	const { logout } = useLogout();
	const { user } = useAuthContext();

	const handleClick = () => {
		logout();
	};

	return (
		<>
			<div className="nav-container">
				<a href="/">
					<img src="https://dynamic.design.com/asset/logo/4b3bf50e-eaab-4f18-a2f0-d430dc89289b/logo-search-grid-2x?logoTemplateVersion=2&v=638640639628930000&text=Healthwelth&colorpalette=grayscale" className="logo" alt="website logo" />
				</a>
				<div className="heading">Cresta Health
					
				</div>
				<div className="navbar-buttons">


					<div>
						
						{props.buttons && !user && (
							<>
								<Link to={"/login"}>
									<img
										src="https://ik.imagekit.io/medpal/login.webp?updatedAt=1683913603920"
										id="login-button"
										alt="login"
									/>
								</Link>
								<Link to={"/register"}>
									<img
										src="https://ik.imagekit.io/medpal/register.webp?updatedAt=1683913606398"
										id="register-button"
										alt="register"
									/>
								</Link>
							</>
						)}
				

						{props.buttons && user && (
							<>
							
							<div className="d-flex justify-content-center align-items-center gap-2 navbar-button-container">
								{props.LogButton && <Link to='/logs'><Button variant="light"><BsLayoutTextSidebarReverse/></Button></Link>}
								<Link to={'/dashboard'} className="navbar-buttons" > <Button variant="light" className="navbar-buttons" id="to-dashboard"><span>Dashboard</span>  <MdDashboard /></Button></Link>
								<div>
								<Button variant="light" className="navbar-buttons" id="to-logout" onClick={handleClick}><span>Log out</span>  <FiLogOut /></Button>
								</div>
								</div>
							</>
						)
						}
						
					</div>
				</div>
			</div>
		</>
	);
};
export default Navbar;
