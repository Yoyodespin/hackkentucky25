import React, { useState } from 'react';

const Hero = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    maxDuration: '',
    maxTuition: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="hero">
      <h1>Find Your Future in Trade School</h1>
      <p>Discover hands-on programs that lead to rewarding careers</p>
      <div className="search-container">
        <div className="search-main">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs, careers, or skills..."
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
        
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="search-filters">
            <div className="filter-group">
              <label>Maximum Duration:</label>
              <select 
                name="maxDuration" 
                value={filters.maxDuration}
                onChange={handleFilterChange}
              >
                <option value="">Any Duration</option>
                <option value="6">6 months or less</option>
                <option value="12">12 months or less</option>
                <option value="18">18 months or less</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Maximum Tuition:</label>
              <select 
                name="maxTuition" 
                value={filters.maxTuition}
                onChange={handleFilterChange}
              >
                <option value="">Any Price</option>
                <option value="10000">Under $10,000</option>
                <option value="15000">Under $15,000</option>
                <option value="20000">Under $20,000</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location:</label>
              <select 
                name="location" 
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">Any Location</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
