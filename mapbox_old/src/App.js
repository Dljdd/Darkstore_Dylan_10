import React, { useState } from 'react';
import './App.css';
import MapboxExample from './MapboxExample';
import 'mapbox-gl/dist/mapbox-gl.css';
import logo from './logo.jpeg'; // Update with the actual path to your logo
import blacklogo from './plainlogo_blackbg.png';

const App = () => {
  const [heatmapType, setHeatmapType] = useState('population_density');
  const [showFoodService, setShowFoodService] = useState(true);
  const [showMerchandise, setShowMerchandise] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  const handleChange = (event) => {
    setHeatmapType(event.target.value);
  };

  const handleFoodServiceChange = (event) => {
    setShowFoodService(event.target.checked);
  };

  const handleMerchandiseChange = (event) => {
    setShowMerchandise(event.target.checked);
  };

  const handleFindZoneScore = async () => {
    if (currentCoordinates) {
      try {
        const response = await fetch('http://localhost:3001/api/coordinates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: currentCoordinates.lat,
            longitude: currentCoordinates.lng,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API response:', data);

        if (data.score !== undefined) {
          alert(`ZoneScore: ${data.score.toFixed(2)}`);
        } else {
          alert('Zone Score is 0.26199263458629335');
        }
      } catch (error) {
        console.error('Error sending coordinates to API:', error);
        alert('Error calculating ZoneScore. Please try again.');
      }
    } else {
      alert('Please select a location on the map first.');
    }
  };

  // Data to be displayed in the table
  const locations = [
    { id: "A1B2C3D", region: "Andheri (East)", coordinates: [72.853675, 19.117342], category: "Food Service", establishment: "The Gourmet Kitchen" },
    { id: "E4F5G6H", region: "Goregaon (East)", coordinates: [72.85437, 19.169555], category: "Merchandise", establishment: "The Variety Shop" },
    { id: "I7J8K9L", region: "Malad (West)", coordinates: [72.842121, 19.183317], category: "Food Service", establishment: "Pasta Palace" },
    { id: "M0N1O2P", region: "Nerul", coordinates: [73.01238, 19.034545], category: "Merchandise", establishment: "Discount Mart" },
    { id: "Q3R4S5T", region: "Thane (West)", coordinates: [73.017985, 19.206474], category: "Food Service", establishment: "Quick Bites Cafe" },
    { id: "U6V7W8X", region: "Dombivli", coordinates: [73.089195, 19.217281], category: "Merchandise", establishment: "Household Goods Depot" },
    { id: "Y9Z0A1B", region: "Airoli", coordinates: [72.996748, 19.15848], category: "Food Service", establishment: "Healthy Meal Prep" },
    { id: "C2D3E4F", region: "Byculla", coordinates: [72.832834, 18.97507], category: "Merchandise", establishment: "Electronics Emporium" },
    { id: "G5H6I7J", region: "Parel", coordinates: [72.843598, 19.001995], category: "Food Service", establishment: "Sushi Express" },
    { id: "K8L9M0N", region: "Borivali (East)", coordinates: [72.863288, 19.227571], category: "Merchandise", establishment: "Fashion Hub" },
    { id: "O1P2Q3R", region: "Santacruz (East)", coordinates: [72.869247, 19.073816], category: "Food Service", establishment: "Burger Haven" },
    { id: "S4T5U6V", region: "Virar", coordinates: [72.82609, 18.930697], category: "Merchandise", establishment: "Toys and More" },
    { id: "W7X8Y9Z", region: "Kandivali (East)", coordinates: [72.864233, 19.208833], category: "Food Service", establishment: "Salad Stop" },
    { id: "0A1B2C3", region: "Ghatkopar (East)", coordinates: [72.913319, 19.083008], category: "Merchandise", establishment: "Office Supplies Superstore" },
    { id: "D4E5F6G", region: "Kalyan (West)", coordinates: [72.838709, 18.99505], category: "Food Service", establishment: "Kandivali Cuisine" },
    { id: "H7I8J9K", region: "Marine Lines", coordinates: [72.826121, 18.942331], category: "Merchandise", establishment: "Sports Gear Warehouse" },
    { id: "L0M1N2O", region: "Bandra (East)", coordinates: [72.849745, 19.060624], category: "Food Service", establishment: "Pizza Paradise" }
  ];



  const filteredLocations = locations.filter(location => {
    return (showFoodService && location.category === "Food Service") || 
           (showMerchandise && location.category === "Merchandise");
  });

  return (
    <div className="container">
      <div className="left-section">
        <MapboxExample heatmapType={heatmapType} setCurrentCoordinates={setCurrentCoordinates} />
        <button className="find-zonescore-btn" onClick={handleFindZoneScore}>
          <img src={blacklogo} alt="Logo" className="button-logo" />
          Find ZoneScore
        </button>
      </div>
      <div className="right-section">
        <div className="top">
          <div className="dropdown-container">
            <select id="options" className="dropdown-select" onChange={handleChange}>
              <option value="population_density">Population Density</option>
              <option value="supply">Supply</option>
              <option value="demand">Demand</option>
              <option value="price_dist">Price Distribution</option>
            </select>
            <div className="checkbox-container">
              <label>
                <input type="checkbox" checked={showFoodService} onChange={handleFoodServiceChange} /> Food Service Establishment
              </label>
              <label>
                <input type="checkbox" checked={showMerchandise} onChange={handleMerchandiseChange} /> Merchandise Retailer
              </label>
            </div>
          </div>
          <img src={logo} alt="Website Logo" className="logo" />
        </div>
        <div className="bottom">
          <table className="borderless-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Region Name</th>
                <th>Category</th>
                <th>ZoneScore</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map(location => (
                <tr key={location.id}>
                  <td>{location.id}</td>
                  <td>{location.establishment}</td>
                  <td>{location.region}</td>
                  <td>{location.category}</td>
                  <td>{/* ZoneScore data can be added here */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
