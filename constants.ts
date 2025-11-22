import { Request, InsurerStatus } from './types';

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const EB_PRODUCTS = [
    'Group Health Insurance / Group Mediclaim', 
    'Group Term Life Insurance', 
    'Group Personal Accident',
    'Employer Health Benefits Packages'
];

export const PREFERRED_INSURERS = [
    'HDFC ERGO General Insurance', 
    'ICICI Lombard General Insurance', 
    'Star Health and Allied Insurance', 
    'Tata AIG General Insurance',
    'HDFC Life Insurance Co. Ltd.'
];

export const INSURERS_WITH_VLI = [
    'HDFC ERGO General Insurance', 
    'Star Health and Allied Insurance', 
    'ICICI Lombard General Insurance'
];

export const MOCK_USERS: Record<string, any> = {
    'broker-admin': { id: 'broker-admin', name: 'Admin User', role: 'Admin', entity: 'Broker', brokerage: 'Global Brokerage Inc.', status: 'Active' },
    'broker-sales-rm': { id: 'broker-sales-rm', name: 'Ravi Kumar', role: 'Sales RM', entity: 'Broker', brokerage: 'Global Brokerage Inc.', zone: 'North', status: 'Active' },
    'broker-team-member': { id: 'broker-team-member', name: 'Priya Singh', role: 'Team Member', entity: 'Broker', brokerage: 'Global Brokerage Inc.', assignedRm: 'broker-sales-rm', status: 'Active' },
    'broker-zonal-head': { id: 'broker-zonal-head', name: 'Anjali Sharma', role: 'Zonal Head', entity: 'Broker', brokerage: 'Global Brokerage Inc.', zone: 'North', status: 'Active' },
    'broker-nsm': { id: 'broker-nsm', name: 'Vikram Mehta', role: 'NSM', entity: 'Broker', brokerage: 'Global Brokerage Inc.', status: 'Active' },
    'insurer-underwriter': { id: 'insurer-underwriter', name: 'John Doe', role: 'Underwriter', entity: 'Insurer', insurer: 'ICICI Lombard General Insurance', status: 'Active' },
    'insurer-sales-rm': { id: 'insurer-sales-rm', name: 'Jane Smith', role: 'Insurer Sales RM', entity: 'Insurer', insurer: 'HDFC ERGO General Insurance', status: 'Active' },
};

export const MOCK_INSURERS = {
    general: [
        "Bajaj Allianz General Insurance", "Cholamandalam MS General Insurance", "Go Digit General Insurance",
        "Future Generali India Insurance", "HDFC ERGO General Insurance", "ICICI Lombard General Insurance", "IFFCO Tokio General Insurance",
        "Liberty General Insurance", "National Insurance Company", "New India Assurance", "Reliance General Insurance",
        "Royal Sundaram General Insurance", "SBI General Insurance", "Shriram General Insurance", "Tata AIG General Insurance",
        "The Oriental Insurance Company", "United India Insurance Company", "Universal Sompo General Insurance", "Zurich Kotak General Insurance",
        "Navi General Insurance", "Zuno General Insurance",
    ],
    health: [
        "Aditya Birla Health Insurance", "Care Health Insurance", "Galaxy Health Insurance Co Ltd", "ManipalCigna Health Insurance",
        "Niva Bupa Health Insurance", "Star Health and Allied Insurance"
    ],
    life: [
        "Life Insurance Corporation of India (LIC)", "HDFC Life Insurance Co. Ltd.", "ICICI Prudential Life Insurance Co. Ltd.",
        "SBI Life Insurance Co. Ltd.", "Max Life Insurance Co. Ltd.", "Bajaj Allianz Life Insurance Co. Ltd.",
        "Aditya Birla Sun Life Insurance Co. Ltd.", "TATA AIA Life Insurance Co. Ltd.", "PNB MetLife India Insurance Co. Ltd.",
        "Reliance Nippon Life Insurance Company", "Shriram Life Insurance Co. Ltd.", "Bharti AXA Life Insurance Co. Ltd.",
        "Future Generali India Life Insurance Co. Ltd.", "IndiaFirst Life Insurance Co. Ltd.", "Acko Life Insurance Limited", "Go Digit Life Insurance Limited"
    ]
};

export const icons = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    quotes: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
    analytics: "M16 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-5-5zM7 7h5v2H7V7zm10 10H7v-2h10v2zm0-4H7v-2h10v2z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    eye: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    chat: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    upload: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    document: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
    reply: "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z",
    arrowRight: "M9 5l7 7-7 7"
};

export const generateMockRequests = (count: number): Request[] => {
    const clients = ['TechNova', 'GreenField', 'BlueSky', 'Alpha Corp', 'Omega Ltd', 'Zenith', 'Pioneer', 'Summit', 'Apex', 'Vertex', 'Matrix', 'Nexus', 'Flux', 'Spark', 'Core', 'Prime', 'Elite', 'Grand', 'Noble', 'Royal', 'Regal', 'Sovereign', 'Majestic', 'Imperial', 'Titan'];
    const creators = ['Ravi Kumar', 'Priya Singh', 'Amit Patel', 'Sara Ali'];
    const zones = ['North', 'South', 'East', 'West'];
    
    const allGeneralInsurers = MOCK_INSURERS.general;
    const allHealthInsurers = MOCK_INSURERS.health;
    const allLifeInsurers = MOCK_INSURERS.life;
    
    const totalWeight = allGeneralInsurers.length + allHealthInsurers.length + allLifeInsurers.length;
    let genIdx = 0;
    let healthIdx = 0;
    let lifeIdx = 0;

    return Array.from({ length: count }, (_, i) => {
        const id = `OTE-${String(i + 1).padStart(3, '0')}`;
        const clientName = `${clients[i % clients.length]} ${['Solutions', 'Industries', 'Technologies', 'Logistics', 'Holdings', 'Ventures'][i % 6]}`;
        
        // Round-robin weighted selection of category
        const mod = i % totalWeight;
        let category = 'general';
        if (mod < allGeneralInsurers.length) {
            category = 'general';
        } else if (mod < allGeneralInsurers.length + allHealthInsurers.length) {
            category = 'health';
        } else {
            category = 'life';
        }

        let selectedInsurers: string[] = [];
        let product = '';
        const batchSize = 5; 

        if (category === 'general') {
            const generalProducts = ['Fire Insurance', 'Marine Insurance', 'Commercial General Liability'];
            product = generalProducts[Math.floor(Math.random() * generalProducts.length)];
            for(let k=0; k<batchSize; k++) {
                selectedInsurers.push(allGeneralInsurers[genIdx % allGeneralInsurers.length]);
                genIdx++;
            }
        } else if (category === 'health') {
            product = 'Group Health Insurance / Group Mediclaim';
            for(let k=0; k<batchSize; k++) {
                selectedInsurers.push(allHealthInsurers[healthIdx % allHealthInsurers.length]);
                healthIdx++;
            }
        } else {
             product = 'Group Term Life Insurance';
             for(let k=0; k<batchSize; k++) {
                selectedInsurers.push(allLifeInsurers[lifeIdx % allLifeInsurers.length]);
                lifeIdx++;
            }
        }
        
        const createdTime = Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days

        const insurersData: InsurerStatus[] = selectedInsurers.map((name, idx) => {
            const statusRoll = Math.random();
            let status = 'Pending';
            let quote = null;
            let query = null;
            let reason = null;
            let submittedAt = null;

            const minTatMs = 2 * 60 * 60 * 1000; 
            const maxTatMs = 5 * 24 * 60 * 60 * 1000; 
            const randomTat = Math.floor(Math.random() * (maxTatMs - minTatMs) + minTatMs);

            if (statusRoll > 0.4) { 
                status = 'Quoted';
                quote = {
                    premium: Math.floor(Math.random() * 5000000) + 50000,
                    commission: Math.floor(Math.random() * 15) + 5,
                    quoteDocument: `quote_${id}_${idx}.pdf`
                };
                submittedAt = new Date(createdTime + randomTat).toISOString(); 
            } else if (statusRoll > 0.25) {
                status = 'Rejected';
                reason = 'Risk out of appetite';
                submittedAt = new Date(createdTime + (randomTat / 2)).toISOString(); 
            } else if (statusRoll > 0.15) {
                status = 'Query Raised';
                query = 'Please provide last 3 years claim dump.';
                submittedAt = new Date(createdTime + (randomTat / 3)).toISOString(); 
            }

            return {
                id: `ins-${id}-${idx}`,
                name,
                status,
                quote,
                query,
                reason,
                submittedAt
            };
        });

        const anyQuoted = insurersData.some(i => i.status === 'Quoted');
        const allResponded = insurersData.every(i => i.status !== 'Pending');
        let requestStatus = 'Request Sent';
        
        if (Math.random() > 0.8 && anyQuoted) requestStatus = 'Accepted';
        else if (anyQuoted) requestStatus = 'Quotes Received';
        else if (insurersData.some(i => i.status === 'Query Raised')) requestStatus = 'Query Raised';
        else if (allResponded) requestStatus = 'All Rejected';
        else requestStatus = 'Awaiting Quotes';

        return {
            id,
            clientName,
            product,
            status: requestStatus,
            createdBy: creators[Math.floor(Math.random() * creators.length)],
            creatorId: 'broker-sales-rm',
            zone: zones[Math.floor(Math.random() * zones.length)],
            createdAt: new Date(createdTime).toISOString(),
            details: {
                policyType: Math.random() > 0.5 ? 'Renewal' : 'New',
                sumInsured: Math.floor(Math.random() * 100000000) + 1000000,
                city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][Math.floor(Math.random() * 5)],
            },
            documents: [{ name: 'proposal.pdf', type: 'Proposal' }],
            insurers: insurersData
        };
    });
};

// Generate 1300 to ensure robust coverage across all 43 insurers (approx 150 requests per insurer with batch size 5)
export const INITIAL_REQUESTS = generateMockRequests(1300);