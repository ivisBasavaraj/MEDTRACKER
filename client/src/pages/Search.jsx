import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import "../components/searchsidebar.css";
import axios from "axios";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "./search.css";
import Card from "react-bootstrap/Card";
import { IoIosNavigate } from "react-icons/io";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";
import { AiFillUpCircle } from "react-icons/ai";
import Sidenav from "../components/Sidenav";
import Footer from "../components/Footer";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState("");
  const [results, setResults] = useState(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1000);
  const [distanceValue, setDistanceValue] = useState(500);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => console.log("Geolocation Error:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert("Location is required to search nearby doctors.");
      return;
    }

    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${distanceValue}, ${latitude}, ${longitude});
        node["amenity"="clinic"](around:${distanceValue}, ${latitude}, ${longitude});
        node["healthcare"="doctor"](around:${distanceValue}, ${latitude}, ${longitude});
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url);
      const data = response.data.elements;

      if (data.length === 0) {
        setResults([]);
      } else {
        const formattedResults = data.map((item) => ({
          doctorName: item.tags.name || "Unknown",
          clinicOrHospitalName: item.tags.amenity || "Unknown",
          city: item.tags["addr:city"] || "Unknown",
          district: item.tags["addr:district"] || "Unknown",
          state: item.tags["addr:state"] || "Unknown",
          fees: item.tags.fee || "Not Available",
          phoneNumber: item.tags.phone || "Not Available",
          speciality: item.tags.speciality || "General",
          lat: item.lat,
          lon: item.lon,
        }));
        setResults(formattedResults);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <>
      <Navbar buttons="true" LogButton="true" />
      <div className="page-container">
        <Sidenav />
        <div style={{ width: "100%" }}>
          <div className="sidebar">
            <h4>Search Doctors Nearby</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <label htmlFor="distanceSlider">
                  Distance (in meters): {distanceValue}
                </label>
                <Form.Control
                  type="range"
                  name="distanceSlider"
                  min={min}
                  max={max}
                  value={distanceValue}
                  onChange={(e) => setDistanceValue(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="distance-slider">
                <label>Category:</label>
                <DropdownButton
                  title={`${filters ? filters : "All"}`}
                  onSelect={(e) => setFilters(e)}
                >
                  <Dropdown.Item style={{ fontSize: "15px" }} eventKey="">
                    All
                  </Dropdown.Item>
                  <Dropdown.Item style={{ fontSize: "15px" }} eventKey="Cardiologist">
                    Cardiologist
                  </Dropdown.Item>
                  <Dropdown.Item style={{ fontSize: "15px" }} eventKey="Rheumatologist">
                    Rheumatologist
                  </Dropdown.Item>
                  <Dropdown.Item style={{ fontSize: "15px" }} eventKey="Pediatrician">
                    Pediatrician
                  </Dropdown.Item>
                  <Dropdown.Item style={{ fontSize: "15px" }} eventKey="General Physician">
                    General Physician
                  </Dropdown.Item>
                </DropdownButton>
              </Form.Group>

              <Button type="submit">Search</Button>
            </Form>

            <div className="d-flex flex-column search-container">
              {results ? (
                results.length > 0 ? (
                  results.map((elem, id) => (
                    <Card key={id}>
                      <Card.Body className="d-flex">
                        <div>
                          <img
                            src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
                            alt="doctor"
                            id="doctor-image"
                            width={100}
                          />
                        </div>
                        <div className="mx-5">
                          <Card.Title>{elem.doctorName}</Card.Title>
                          <Card.Title>Clinic: {elem.clinicOrHospitalName}</Card.Title>
                          <Card.Text>Address: {elem.city}, {elem.district}, {elem.state}</Card.Text>
                          <Card.Text>Fees: {elem.fees}</Card.Text>
                          <Card.Text>Phone: {elem.phoneNumber}</Card.Text>
                          <Card.Text>Speciality: {elem.speciality}</Card.Text>
                          <Button
                            variant="success"
                            href={`https://www.google.com/maps/search/?api=1&query=${elem.lat},${elem.lon}`}
                            target="_blank"
                          >
                            <IoIosNavigate style={{ margin: "5px" }} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p style={{ fontSize: "25px" }}>No Doctors Found!</p>
                )
              ) : (
                <p style={{ fontSize: "25px" }}>
                  Set search parameters to search <AiFillUpCircle />
                </p>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Search;
