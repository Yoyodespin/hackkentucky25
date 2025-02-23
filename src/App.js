import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgramSelector from './components/ProgramSelector';
import { useTradePrograms } from './data/programs';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaStar, FaCheck, FaBriefcase, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './App.css';

const calculateROI = (tuition, salary) => {
  // Extract the minimum salary from the range (e.g., "$45,000 - $75,000" -> 45000)
  const minSalary = parseInt(salary.split(' - ')[0].replace(/\$|,/g, ''));
  const tuitionAmount = parseInt(tuition.replace(/\$|,/g, ''));
  
  // Calculate years to pay off tuition assuming 20% of salary goes to repayment
  const yearlyPayment = minSalary * 0.2;
  const yearsToPayoff = tuitionAmount / yearlyPayment;
  
  return yearsToPayoff.toFixed(1);
};

const SchoolCard = ({ school, programTuition, selectedCareer, isExpanded, onToggle, index }) => {
  const certificationRef = useRef(null);
  const [roiState, setRoiState] = useState({
    current: null,
    previous: null,
    isChanging: false
  });
  
  const tuition = school.tuition || programTuition;
  const currentRoi = selectedCareer ? calculateROI(tuition, selectedCareer.salary) : null;

  useEffect(() => {
    // Always update when ROI changes
    if (currentRoi !== roiState.current) {
      setRoiState(prev => ({
        current: currentRoi,
        previous: prev.current,
        isChanging: true
      }));

      // Reset animation state after delay
      const timer = setTimeout(() => {
        setRoiState(prev => ({
          ...prev,
          isChanging: false
        }));
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [currentRoi, selectedCareer]);

  return (
    <div className={`school-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="school-header">
        <div className="school-info">
          <h4>{school.name}</h4>
          <p className="location">{school.city}, {school.state}</p>
          <p className="tuition">{school.tuition || programTuition}</p>
          {school.accredited && (
            <div className="accredited-badge">
              <span>Accredited Institution</span>
            </div>
          )}
        </div>
        <div className="school-rating">
          <FaStar className="star-icon" />
          <span>{school.rating}</span>
        </div>
      </div>

      <div className={`roi-info-wrapper ${selectedCareer ? 'show' : ''}`}>
        {selectedCareer && (
          <div className={`roi-info ${roiState.isChanging ? 'changing' : ''}`}>
            <div className="roi-label">
              <FaChartLine className="roi-icon" />
              <span>Return on Investment</span>
            </div>
            <div className="roi-value">
              <span>{currentRoi} years</span>
              <span className="roi-subtitle">to pay off tuition</span>
            </div>
          </div>
        )}
      </div>

      <div className="school-actions">
        <button 
          className={`cert-toggle ${isExpanded ? 'active' : ''}`}
          onClick={() => onToggle(index)}
        >
          <span>Available Certifications</span>
          <FaChevronDown className={`chevron ${isExpanded ? 'rotated' : ''}`} />
        </button>
      </div>

      <div 
        className="certifications-container"
        style={{ 
          maxHeight: isExpanded ? `${certificationRef.current?.scrollHeight}px` : '0'
        }}
        ref={certificationRef}
      >
        <div className="certifications-content">
          {school.certifications?.map((cert, index) => (
            <div key={index} className="certification-item">
              <span className="bullet">•</span>
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="school-meta">
      </div>
      <div className="school-details">
        <button className="apply-button">Request Info</button>
      </div>
    </div>
  );
};

const ProgramContent = ({ program, stateFilter, sortBy, selectedCareer, onCareerSelect, onStateFilterChange, onSortByChange, expandedSchoolId, onSchoolToggle }) => {
  const filteredSchools = program.schools
    .filter(school => !stateFilter || school.state === stateFilter)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'tuition') {
        const aTuition = parseInt(a.tuition?.replace(/[^0-9]/g, '') || program.tuition.replace(/[^0-9]/g, ''));
        const bTuition = parseInt(b.tuition?.replace(/[^0-9]/g, '') || program.tuition.replace(/[^0-9]/g, ''));
        return aTuition - bTuition;
      }
      if (sortBy === 'location') return a.state.localeCompare(b.state);
      if (sortBy === 'roi' && selectedCareer) {
        const aROI = calculateROI(a.tuition || program.tuition, selectedCareer.salary);
        const bROI = calculateROI(b.tuition || program.tuition, selectedCareer.salary);
        return aROI - bROI;
      }
      return 0;
    });

  const states = Array.from(new Set(program.schools.map(school => school.state)));

  return (
    <main className="schools-page">
      <div className="program-header">
        <div className="program-title">
          <h1>{program.title}</h1>
          <div className="program-meta">
            <span><FaClock /> {program.duration}</span>
            <span><FaDollarSign /> Average Tuition: {program.tuition}</span>
          </div>
        </div>
        <p className="program-description">{program.description}</p>
        
        <div className="quick-stats">
          <div className="stat-card">
            <h3>{program.schools.length}</h3>
            <p>Schools Available</p>
          </div>
          <div className="stat-card">
            <h3>{program.careers.length}</h3>
            <p>Career Paths</p>
          </div>
        </div>
      </div>
      <section className="program-details">
        <div className="details-section">
          <h3>Career Opportunities</h3>
          <p className="section-hint">Select a career to see ROI calculations for each school</p>
          <div className="career-list">
            {program.careers.map((career, index) => (
              <div
                key={index}
                className={`career-item ${selectedCareer?.title === career.title ? 'selected' : ''}`}
                onClick={() => onCareerSelect(career)}
              >
                <div className="career-info">
                  <div className="career-title">
                    <FaBriefcase className="icon" />
                    <span>{career.title}</span>
                  </div>
                  <div className="career-salary">
                    <FaDollarSign className="icon" />
                    <span>{career.salary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="program-schools-section">
        <div className="program-schools-header">
          <h3>Available Schools</h3>
        </div>
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="stateFilter">Filter by State:</label>
            <select
              id="stateFilter"
              value={stateFilter}
              onChange={(e) => onStateFilterChange(e.target.value)}
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <option value="">None</option>
              <option value="rating">Rating</option>
              <option value="tuition">Tuition</option>
              {selectedCareer && <option value="roi">ROI</option>}
            </select>
          </div>
        </div>
        <div className="schools-grid">
          {filteredSchools.map((school, index) => (
            <SchoolCard
              key={index}
              school={school}
              programTuition={program.tuition}
              selectedCareer={selectedCareer}
              isExpanded={expandedSchoolId === index}
              onToggle={onSchoolToggle}
              index={index}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

const ProgramPage = () => {
  const { programSlug } = useParams();
  const { tradePrograms: programs } = useTradePrograms();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [stateFilter, setStateFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [expandedSchoolId, setExpandedSchoolId] = useState(null);

  useEffect(() => {
    if (programs) {
      if (programSlug) {
        // Try to find program by exact slug match first
        let program = programs.find(p => 
          p.title.toLowerCase().replace(/\s+/g, '-') === programSlug
        );
        
        // If no exact match, try to find program by partial match
        if (!program) {
          program = programs.find(p => 
            p.title.toLowerCase().includes(programSlug.replace(/-/g, ' '))
          );
        }
        
        if (program) {
          setSelectedProgram(program);
          return;
        }
      }
      
      // Default to first program if no match or no slug
      setSelectedProgram(programs[0]);
    }
  }, [programs, programSlug]);

  const handleProgramChange = (program) => {
    const slug = program.title.toLowerCase().replace(/\s+/g, '-');
    window.history.pushState({}, '', `/${slug}`);
    setSelectedProgram(program);
    setSelectedCareer(null);
    setExpandedSchoolId(null);
  };

  if (!programs) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Header />
      <ProgramSelector
        programs={programs}
        selectedProgram={selectedProgram}
        onProgramChange={handleProgramChange}
      />
      {selectedProgram && (
        <ProgramContent
          program={selectedProgram}
          stateFilter={stateFilter}
          sortBy={sortBy}
          selectedCareer={selectedCareer}
          onCareerSelect={setSelectedCareer}
          onStateFilterChange={setStateFilter}
          onSortByChange={setSortBy}
          expandedSchoolId={expandedSchoolId}
          onSchoolToggle={setExpandedSchoolId}
        />
      )}
      <Footer />
    </>
  );
};

const App = () => {
  const { loading, error } = useTradePrograms();

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="loading">Loading programs...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error-container">
          <div className="error">Error loading programs: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProgramPage />} />
        <Route path="/:programSlug/*" element={<ProgramPage />} />
      </Routes>
    </Router>
  );
};

export default App;
