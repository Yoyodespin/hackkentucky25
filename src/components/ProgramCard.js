import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaStar, FaCheck, FaChevronDown, FaChevronUp, FaBriefcase } from 'react-icons/fa';

const SchoolCard = ({ school }) => (
  <div className="school-card">
    <div className="school-header">
      <div className="school-info">
        <h4>{school.name}</h4>
        <p className="location">{school.city}, {school.state}</p>
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
  </div>
);

const ProgramCard = ({ program }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(program);

  useEffect(() => {
    if (currentProgram.title !== program.title) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setCurrentProgram(program);
        setIsExiting(false);
      }, 500); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [program, currentProgram.title]);

  return (
    <div className={`linkedin-card program-card ${isExiting ? 'exit' : ''}`}>
      <div className="card-header">
        <div className="program-info">
          <h3>{currentProgram.title}</h3>
          <div className="program-meta">
            <span><FaClock /> {currentProgram.duration}</span>
            <span><FaDollarSign /> Average Tuition: {currentProgram.tuition}</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="description">{currentProgram.description}</p>
        
        <div className="key-info">
          <div className="info-tag">
            <FaBriefcase className="icon" />
            <span>{currentProgram.careers.length} Career Paths</span>
          </div>
          <div className="info-tag">
            <FaMapMarkerAlt className="icon" />
            <span>{currentProgram.schools.length} Schools Available</span>
          </div>
        </div>

        <div className="program-details">
          <div className="section">
            <h3>Available School</h3>
            <div className="schools-grid">
              {currentProgram.schools.map((school, index) => (
                <SchoolCard key={index} school={school} />
              ))}
            </div>
          </div>

          {showDetails && (
            <>
              <div className="section">
                <h4>Career Opportunities</h4>
                <div className="career-list">
                  {currentProgram.careers.map((career, index) => (
                    <div key={index} className="career-item">
                      <FaBriefcase className="icon" />
                      <div className="career-info">
                        <span className="career-title">{career.title}</span>
                        <span className="career-salary">
                          <FaDollarSign className="icon" />
                          {career.salary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h4>Available Certifications</h4>
                <div className="cert-list">
                  {currentProgram.certifications.map((cert, index) => (
                    <div key={index} className="cert-item">
                      <FaCheck className="icon" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card-footer">
        <button 
          className="details-button"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <span>Show Less</span>
              <FaChevronUp className="icon" />
            </>
          ) : (
            <>
              <span>Show More</span>
              <FaChevronDown className="icon" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
