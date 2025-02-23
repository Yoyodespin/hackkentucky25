import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRv5Ka4B6oMmGueeGN3ksHbo9xhWqKHxperMF6EfkMf_D2lth3Yr_zh5OuMz9dgpAqB7QdC-PYCE-82/pub?output=csv';

export const useTradePrograms = () => {
    const [tradePrograms, setTradePrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data from Google Sheets...');
                const response = await fetch(GOOGLE_SHEETS_URL, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'text/csv'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const text = await response.text();
                console.log('Received data:', text.substring(0, 200));
                
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: 'greedy', // Changed from true to 'greedy' to handle rows with some empty cells
                    complete: (results) => {
                        console.log('Parsed CSV data:', results.data);
                        const programs = transformCSVToPrograms(results.data);
                        console.log('Transformed programs:', programs);
                        setTradePrograms(programs);
                        setLoading(false);
                    },
                    error: (error) => {
                        console.error('Error parsing CSV:', error);
                        setError(error.message);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to fetch data: ' + error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { tradePrograms, loading, error };
};

const transformCSVToPrograms = (csvData) => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
        console.warn('No CSV data received, using fallback data');
        return fallbackPrograms;
    }

    // Create a map to store unique schools and careers for each program
    const programSchools = new Map();
    const programCareers = new Map();
    
    // First pass: Group all unique schools and careers by program
    let currentProgram = null;
    csvData.forEach(row => {
        // If we have a Program Title, update the current program
        if (row['Program Title'] && row['Program Title'].trim()) {
            currentProgram = row['Program Title'].trim();
            // Initialize maps for new program
            if (!programSchools.has(currentProgram)) {
                programSchools.set(currentProgram, new Map());
                programCareers.set(currentProgram, new Map());
            }
        }
        
        // Skip if we don't have a current program
        if (!currentProgram) return;
        
        // Handle schools
        if (row['School Name'] && row['School Location'] && row['School State']) {
            const schoolKey = `${row['School Name']}-${row['School Location']}-${row['School State']}`;
            const schoolMap = programSchools.get(currentProgram);
            
            if (!schoolMap.has(schoolKey)) {
                schoolMap.set(schoolKey, {
                    name: row['School Name'],
                    city: row['School Location'],
                    state: row['School State'],
                    rating: parseFloat(row['School Rating']) || 4.0,
                    tuition: row['School Tuition'],
                    accredited: true,
                    certifications: new Set()
                });
            }
            
            // Add certifications
            if (row['Certifications']) {
                const certs = row['Certifications'].split(',').map(c => c.trim());
                const school = schoolMap.get(schoolKey);
                certs.forEach(cert => school.certifications.add(cert));
            }
        }

        // Handle careers
        if (row['Career Title'] && row['Career Salary']) {
            const careerMap = programCareers.get(currentProgram);
            console.log(`Processing career for ${currentProgram}:`, {
                title: row['Career Title'],
                salary: row['Career Salary']
            });
            if (!careerMap.has(row['Career Title'])) {
                careerMap.set(row['Career Title'], {
                    title: row['Career Title'],
                    salary: row['Career Salary']
                });
                console.log(`Added career ${row['Career Title']} to ${currentProgram}`);
            }
        }
    });
    
    // Second pass: Create the programs with their schools and careers
    const programGroups = csvData.reduce((acc, row) => {
        const title = row['Program Title'];
        if (!title) return acc;
        
        if (!acc[title]) {
            const schoolsMap = programSchools.get(title);
            const schools = Array.from(schoolsMap.values()).map(school => ({
                ...school,
                certifications: Array.from(school.certifications)
            }));

            const careersMap = programCareers.get(title);
            const careers = Array.from(careersMap.values());
            console.log(`Program ${title} careers:`, careers);
            
            console.log(`Creating program ${title} with:`, {
                schoolCount: schools.length,
                careerCount: careers.length
            });
            
            acc[title] = {
                title: title,
                description: row['Program Description'] || 'Description coming soon',
                duration: row['Duration'] || '12 months',
                tuition: row['Average Tuition'] || '$15,000',
                location: "Multiple Locations",
                schools: schools,
                careers: careers,
                certifications: [],
                image: "https://via.placeholder.com/300"
            };
        }

        // Add program certifications
        if (row['Certifications']) {
            const certs = row['Certifications'].split(',').map(c => c.trim());
            acc[title].certifications = [...new Set([...acc[title].certifications, ...certs])];
        }

        return acc;
    }, {});

    const programs = Object.values(programGroups);
    
    // Log final program data
    programs.forEach(program => {
        console.log(`Program: ${program.title}`);
        console.log(`- Schools (${program.schools.length}):`, program.schools.map(s => s.name));
        console.log(`- Careers (${program.careers.length}):`, program.careers.map(c => c.title));
    });
    
    if (programs.length === 0) {
        console.warn('No valid programs created from CSV, using fallback data');
        return fallbackPrograms;
    }
    
    return programs;
};

// Temporary fallback data in case the fetch fails
const fallbackPrograms = [
    {
        title: "Sample Program",
        description: "This is a sample program while we load the data",
        duration: "12 months",
        tuition: "$15,000",
        location: "Multiple Locations",
        schools: [
            {
                name: "Sample School",
                city: "Sample City",
                state: "ST",
                rating: 4.5,
                accredited: true,
                certifications: ["Sample Certification"]
            }
        ],
        careers: [
            { title: "Sample Career", salary: "$45,000 - $75,000" }
        ],
        certifications: ["Sample Certification"],
        image: "https://via.placeholder.com/300"
    }
];
