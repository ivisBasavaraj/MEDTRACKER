import Navbar from "../components/Navbar";
import "../App.css";
import "./about.css";
import Footer from "../components/Footer";
import { Fade } from "react-awesome-reveal";
import { AiFillGithub } from "react-icons/ai";

const About = () => {
	return (
		<>
			<Navbar buttons={true} />
			<div id="about-container" style={{ minHeight: "80vh" }}>
				<div id="about-left-container">
					<Fade
						delay={10}
						direction="top"
						style={{ color: "black" }}
						triggerOnce
					>
						<h2>About Us</h2>
					</Fade>

					<p id="about-text">
						IVIS LABS PVT LTD is a technology-driven company dedicated to
						innovation in software development, automation, and AI solutions.
						We specialize in building scalable and efficient digital products
						that empower businesses and individuals. Our team of experienced
						developers, engineers, and designers work collaboratively to
						deliver high-quality solutions that meet industry standards.
					</p>
				</div>

				<div className="founder-section" style={{ textAlign: "center", marginTop: "20px" }}>
					<Fade delay={100} triggerOnce>
						<img
							src="https://example.com/vinay-kumar.jpg"
							alt="Vinay Kumar"
							style={{ width: "150px", borderRadius: "50%" }}
						/>
						<p style={{ fontSize: "18px", fontWeight: "bold" }}>Vinay Kumar</p>
						<p>Founder & CEO</p>
					</Fade>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default About;
