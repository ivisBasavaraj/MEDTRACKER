import Sidenav from "../components/Sidenav";
import "./dashboard.css";
import TabList from "../components/TabList";
import TabStock from "../components/TabStock";
import Prescription from "../components/Prescription";
import Charts from "../components/Charts";
import Calendar from "../components/Calendar";
import Streaks from "../components/Streaks";
import Tips from "../components/Tips";
import { useState, useEffect } from "react";
import AllCharts from '../components/Charts';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuthContext } from "../hooks/useAuthContext";
import { Toast } from "react-bootstrap";
import { AiFillPlusCircle } from "react-icons/ai";
import LoadingCircle from "../components/SkeletonLoaders/LoadingCircle";
import { FaUserCircle, FaPills, FaChartLine, FaCalendarAlt, FaAward } from "react-icons/fa";

const Dashboard = () => {
	const { user } = useAuthContext();
	const [userDetails, setUserDetails] = useState(null);
	const [appointments, setAppointments] = useState(null);
	const [readingType, setReadingType] = useState("Blood Sugar");
	const [fetchedChartData, setFetchedChartData] = useState(null);
	const [fetchedMedicinesData, setFetchedMedicinesData] = useState(null);
	const [fetchedReportsData, setFetchedReportsData] = useState(null);
	const [showTaken, setShowTaken] = useState(false);
	const [tabletName, setTabletName] = useState(null);
	const [showAlreadyAddedToast, setShowAlreadyAddedToast] = useState(false);
	const [showStreakAddedToast, setShowStreakAddedToast] = useState(false);

	useEffect(() => {
		handleFetch();
	}, []);

	const handleFetch = async () => {
		const axios = require("axios");
		const configCharts = {
			method: "post",
			url: "https://medpal-backend.onrender.com/api/labcounts/type",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
			data: { testName: readingType },
		};

		const configMedicines = {
			method: "get",
			url: "https://medpal-backend.onrender.com/api/medicines",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		};

		const configReports = {
			method: "get",
			url: "https://medpal-backend.onrender.com/api/reportsStore",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		};

		const configUser = {
			method: "get",
			url: `https://medpal-backend.onrender.com/api/user/${user.user_id}`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		};

		const configAppointments = {
			method: "get",
			url: `https://medpal-backend.onrender.com/api/appointments/`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		};

		try {
			const [chartsRes, userRes, medicinesRes, reportsRes, appointmentsRes] = await Promise.all([
				axios.request(configCharts),
				axios.request(configUser),
				axios.request(configMedicines),
				axios.request(configReports),
				axios.request(configAppointments),
			]);

			setFetchedChartData(chartsRes.data);
			setUserDetails(userRes.data);
			setFetchedMedicinesData(medicinesRes.data);
			setFetchedReportsData(reportsRes.data);
			setAppointments(appointmentsRes.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleAddLogs = async (medName) => {
		const axios = require("axios");
		const content = `Medicine ${medName} taken at ${new Date()}`;
		await axios.post(
			"https://medpal-backend.onrender.com/api/logs",
			{ content },
			{ headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } }
		);
	};

	return (
		<>
			<Navbar buttons='true' LogButton='false' />
			<div id="content">
				<Sidenav />
				<Toast
					onClose={() => setShowTaken(false)}
					bg="success"
					show={showTaken}
					position='middle-center'
					delay={2000}
					autohide
					style={{ position: "fixed", zIndex: "10", right: "2rem", top: "10%" }}
				>
					<Toast.Header>
						<strong className="me-auto text-success">Tablet Taken!</strong>
					</Toast.Header>
					<Toast.Body className="text-white">{tabletName}</Toast.Body>
				</Toast>

				<Toast
					onClose={() => setShowStreakAddedToast(false)}
					bg="success"
					show={showStreakAddedToast}
					position='middle-center'
					delay={2000}
					autohide
					style={{ position: "fixed", zIndex: "10", right: "2rem", top: "10%" }}
				>
					<Toast.Header>
						<strong className="me-auto text-success">Streak Updated!</strong>
					</Toast.Header>
					<Toast.Body className="text-white">Streak has been incremented</Toast.Body>
				</Toast>

				<Toast
					onClose={() => setShowAlreadyAddedToast(false)}
					bg="danger"
					show={showAlreadyAddedToast}
					delay={2000}
					autohide
					style={{ position: "fixed", zIndex: "10", right: "2rem", top: "10%" }}
				>
					<Toast.Header>
						<strong className="me-auto text-danger">Streak already incremented!</strong>
					</Toast.Header>
					<Toast.Body className="text-white">Streak has already been incremented for today</Toast.Body>
				</Toast>

				<div id="user-details">
					{!userDetails ? (
						<div className="d-flex justify-content-center align-items-center" style={{ minWidth: "100%" }}>
							<LoadingCircle />
						</div>
					) : (
						<div className="profile-card">
							<div className="profile-header">
								<FaUserCircle className="profile-icon" />
								<div className="profile-info">
									<h2>{userDetails?.name}</h2>
									<p>{userDetails?.email}</p>
								</div>
							</div>
							<div className="profile-details">
								<p><strong>Age:</strong> {userDetails?.age}</p>
								<p><strong>Gender:</strong> {userDetails?.gender[0]?.toUpperCase() + userDetails?.gender.slice(1)}</p>
								<p><strong>Height:</strong> {userDetails?.height} cm</p>
								<p><strong>Weight:</strong> {userDetails?.weight} kg</p>
							</div>
							<div className="badge-container">
								<FaAward className="badge-icon" />
								<p>Gold Member</p>
							</div>
						</div>
					)}
				</div>

				<div id="dash-components" className="dashboard-grid-container">
					<div className="dashboard-card">
						<h3><FaPills /> Medication List</h3>
						<TabList fetchedMedicineData={fetchedMedicinesData} handleFetch={handleFetch} showTaken={showTaken} setShowTaken={setShowTaken} setTabletName={setTabletName} handleAddLogs={handleAddLogs} />
					</div>

					<div className="dashboard-card">
						<h3><FaPills /> Medication Stock</h3>
						<TabStock fetchedMedicineData={fetchedMedicinesData} handleFetch={handleFetch} showTaken={showTaken} setShowTaken={setShowTaken} setTabletName={setTabletName} handleAddLogs={handleAddLogs} />
					</div>

					<div className="dashboard-card">
						<h3>Prescriptions</h3>
						<Prescription fetchedReportsData={fetchedReportsData} />
					</div>

					<div className="dashboard-card">
						<h3><FaChartLine /> Charts</h3>
						{!fetchedChartData ? <LoadingCircle /> : <AllCharts chartData={fetchedChartData} chartType={readingType} width={450} height={230} />}
					</div>

					<div className="dashboard-card">
						<h3><FaCalendarAlt /> Appointments</h3>
						{!appointments ? <LoadingCircle /> : <Calendar appointments={appointments} />}
					</div>

					<div className="dashboard-card">
						<h3>Streaks</h3>
						<Streaks setShowAlreadyAddedToast={setShowAlreadyAddedToast} setShowStreakAddedToast={setShowStreakAddedToast} />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Dashboard;