import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import "./searchsidebar.css";
import axios from "axios";

const Sidebar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState("");
    const [results, setResults] = useState(null);
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(1000);
    const [value, setValue] = useState(5000); // Default search radius in meters
    const [userLocation, setUserLocation] = useState(null);

    // Get user's location using the Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userLocation) {
            alert("Please allow location access to search for nearby medical facilities.");
            return;
        }

        const { latitude, longitude } = userLocation;

        // Overpass API query to fetch hospitals and clinics
        const overpassQuery = `
            [out:json][timeout:25];
            (
              node["amenity"="hospital"](around:${value}, ${latitude}, ${longitude});
              node["amenity"="clinic"](around:${value}, ${latitude}, ${longitude});
            );
            out body;
            >;
            out skel qt;
        `;

        try {
            const response = await axios.get(
                `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
            );
            setResults(response.data.elements); // Store the results
        } catch (err) {
            console.error("Error fetching data from Overpass API:", err);
        }
    };

    return (
        <>
            <div className="sidebar">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            name="searchQuery"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <label htmlFor="distanceSlider">Distance (in meters): {value}</label>
                        <Form.Control
                            type="range"
                            name="distanceSlider"
                            min={min}
                            max={max}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <label>Category:</label>
                        <select
                            name="category"
                            value={filters}
                            onChange={(e) => setFilters(e.target.value)}
                        >
                            <option value="hospital">Hospital</option>
                            <option value="clinic">Clinic</option>
                        </select>
                    </Form.Group>

                    <Button type="submit">Submit</Button>
                </Form>
            </div>
            <div>
                {results && results.length > 0 ? (
                    results.map((elem, index) => (
                        <ul key={index}>
                            <li style={{ marginLeft: "50vw" }}>{elem.tags.name || "Unnamed Facility"}</li>
                            <li style={{ marginLeft: "50vw" }}>{elem.tags.amenity}</li>
                            <li style={{ marginLeft: "50vw" }}>Lat: {elem.lat}, Lon: {elem.lon}</li>
                        </ul>
                    ))
                ) : (
                    <p style={{ marginLeft: "50vw" }}>No results found.</p>
                )}
            </div>
        </>
    );
};

export default Sidebar;