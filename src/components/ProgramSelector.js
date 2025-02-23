import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';

const ProgramSelector = ({ programs, selectedProgram, onProgramChange }) => {
  return (
    <div className="program-selector">
      <div className="selector-content">
        <div className="program-pills">
          {programs.map((program, index) => (
            <button
              key={index}
              className={`program-pill ${program.title === selectedProgram?.title ? 'active' : ''}`}
              onClick={() => onProgramChange(program)}
            >
              <FaGraduationCap className="program-icon" />
              <span className="program-name">{program.title}</span>
              <span className="school-count">{program.schools.length} schools</span>
            </button>
          ))}
        </div>
      </div>
      <div className="fade-overlay left"></div>
      <div className="fade-overlay right"></div>
    </div>
  );
};

export default ProgramSelector;
