import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { Filter, Briefcase, Star, TrendingUp, Clock, PieChart as PieIcon, Activity } from 'lucide-react';
import { Icon, Card } from './Shared';
import { icons, EB_PRODUCTS, PREFERRED_INSURERS, INSURERS_WITH_VLI, MOCK_INSURERS, COLORS } from '../constants';
import { Request } from '../types';

const PerformanceTable = ({ data, title }: { data: any[], title: string }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
            {title} 
            <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{data.length} Insurers</span>
        </h3>
        <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">Insurer Name</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Quote Requested</th>
                        <th className="px-4 py-3 text-center font-semibold text-blue-600 uppercase tracking-wider text-xs">Shared</th>
                        <th className="px-4 py-3 text-center font-semibold text-blue-600 uppercase tracking-wider text-xs">Resp %</th>
                        <th className="px-4 py-3 text-center font-semibold text-green-600 uppercase tracking-wider text-xs">L1 Count</th>
                        <th className="px-4 py-3 text-center font-semibold text-green-600 uppercase tracking-wider text-xs">L1 %</th>
                        <th className="px-4 py-3 text-center font-semibold text-yellow-600 uppercase tracking-wider text-xs">Pending</th>
                        <th className="px-4 py-3 text-center font-semibold text-red-600 uppercase tracking-wider text-xs">Rejected</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Avg TAT</th>
                        <th className="px-4 py-3 text-center font-semibold text-orange-600 uppercase tracking-wider text-xs">Rating</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.length > 0 ? data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{row.requestsReceived}</td>
                            <td className="px-4 py-3 text-center font-medium text-blue-700 bg-blue-50/30">{row.quotesShared}</td>
                            <td className="px-4 py-3 text-center font-medium text-blue-600">{row.responseRate}%</td>
                            <td className="px-4 py-3 text-center font-bold text-green-700 bg-green-50/30">{row.l1Count}</td>
                            <td className="px-4 py-3 text-center font-medium text-green-600">{row.l1Rate}%</td>
                            <td className="px-4 py-3 text-center text-yellow-700">{row.pending}</td>
                            <td className="px-4 py-3 text-center text-red-700">{row.rejected}</td>
                            <td className="px-4 py-3 text-center text-gray-700">{row.avgTat}</td>
                            <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center text-orange-500 font-bold">
                                    <span className="mr-1">{row.rating}</span>
                                    <Star className="w-3 h-3 fill-current" />
                                    </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-500">No data available for this category.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export const AnalyticsView = ({ requests, currentUser }: { requests: Request[], currentUser: any }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [businessFilter, setBusinessFilter] = useState('All');
    const [insurerCategoryFilter, setInsurerCategoryFilter] = useState('All');

    const totalRequests = requests.length;
    const acceptedQuotes = requests.filter(r => r.status === 'Accepted').length;
    const conversionRate = totalRequests > 0 ? ((acceptedQuotes / totalRequests) * 100).toFixed(1) : 0;

    const isEB = (product: string) => EB_PRODUCTS.includes(product);
    
    const formatTat = (hours: number) => {
        if (!hours || hours <= 0) return '-';
        const totalHours = Math.floor(hours);
        const days = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;
        if (days > 0) return `${days}d ${remHours}h`;
        return `${remHours}h`;
    };

    const getInsurerCategory = (name: string) => {
        if (MOCK_INSURERS.general.includes(name)) return 'General';
        if (MOCK_INSURERS.health.includes(name)) return 'Health';
        if (MOCK_INSURERS.life.includes(name)) return 'Life';
        return 'Other';
    };

    const filteredRequests = useMemo(() => {
        if (businessFilter === 'All') return requests;
        return requests.filter(req => businessFilter === 'EB' ? isEB(req.product) : !isEB(req.product));
    }, [requests, businessFilter]);

    // --- NEW OVERVIEW DATA PREP ---
    const overviewData = useMemo(() => {
        // 1. Weekly Trend
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const weeks: any[] = [];
        for(let i=11; i>=0; i--) {
            const end = now - (i * oneWeek);
            const start = end - oneWeek;
            const d = new Date(end);
            weeks.push({ 
                key: `${d.getDate()}/${d.getMonth()+1}`, 
                start, end, 
                requests: 0, 
                quotes: 0,
                accepted: 0 
            });
        }

        // 2. Product Mix
        const productMix: any = { 'General': 0, 'Health': 0, 'Life': 0 };

        // 3. TAT Distribution
        const tatDist = { '< 24h': 0, '24h-48h': 0, '48h-72h': 0, '> 72h': 0 };

        // 4. Insurer Activity Map
        const insurerMap: any = {};

        requests.forEach(req => {
            const t = new Date(req.createdAt).getTime();
            
            // Trend
            const week = weeks.find(w => t >= w.start && t < w.end);
            if (week) {
                week.requests++;
                if (req.status === 'Accepted') week.accepted++;
                const quotes = req.insurers.filter(i => i.status === 'Quoted' || i.status === 'Accepted').length;
                week.quotes += quotes;
            }

            // Mix
            if (EB_PRODUCTS.includes(req.product)) {
                if (req.product.includes('Life')) productMix['Life']++;
                else productMix['Health']++;
            } else {
                productMix['General']++;
            }

            // TAT
            req.insurers.forEach(ins => {
                if ((ins.status === 'Quoted' || ins.status === 'Accepted') && ins.submittedAt) {
                    const subT = new Date(ins.submittedAt).getTime();
                    const hours = (subT - t) / (3600000);
                    if (hours < 24) tatDist['< 24h']++;
                    else if (hours < 48) tatDist['24h-48h']++;
                    else if (hours < 72) tatDist['48h-72h']++;
                    else tatDist['> 72h']++;
                }

                // Insurer Activity
                if (!insurerMap[ins.name]) insurerMap[ins.name] = { name: ins.name, Quoted: 0, Rejected: 0, Pending: 0 };
                if (ins.status === 'Quoted' || ins.status === 'Accepted') insurerMap[ins.name].Quoted++;
                else if (ins.status === 'Rejected') insurerMap[ins.name].Rejected++;
                else insurerMap[ins.name].Pending++;
            });
        });

        return {
            trend: weeks,
            mix: Object.keys(productMix).map(k => ({ name: k, value: productMix[k] })),
            tat: Object.keys(tatDist).map(k => ({ name: k, value: tatDist[k as keyof typeof tatDist] })),
            insurers: Object.values(insurerMap)
                .sort((a:any, b:any) => (b.Quoted + b.Rejected) - (a.Quoted + a.Rejected))
                .slice(0, 10) 
        };
    }, [requests]);

    // Standard Performance Data
    const insurerStats = useMemo(() => {
        const stats: any = {};
        
        filteredRequests.forEach(req => {
            req.insurers.forEach(ins => {
                const category = getInsurerCategory(ins.name);
                if (insurerCategoryFilter !== 'All' && category !== insurerCategoryFilter) return;

                if (!stats[ins.name]) {
                    stats[ins.name] = { 
                        name: ins.name,
                        requestsReceived: 0,
                        quotesShared: 0,
                        l1Count: 0,
                        pending: 0,
                        rejected: 0,
                        totalTat: 0,
                        quoteCountForTat: 0,
                        isVli: INSURERS_WITH_VLI.includes(ins.name)
                    };
                }
                
                const s = stats[ins.name];
                s.requestsReceived += 1;

                if (ins.status === 'Quoted') {
                    s.quotesShared += 1;
                    const created = new Date(req.createdAt);
                    const submitted = ins.submittedAt ? new Date(ins.submittedAt) : new Date(created.getTime() + Math.random() * 172800000); 
                    const timeDiff = submitted.getTime() - created.getTime();
                    const hours = timeDiff > 0 ? timeDiff / (1000 * 60 * 60) : 24;
                    
                    s.totalTat += hours;
                    s.quoteCountForTat += 1;

                    const l1Premium = Math.min(...req.insurers.filter(i => i.quote?.premium).map(i => i.quote!.premium));
                    if (ins.quote && ins.quote.premium === l1Premium) {
                        s.l1Count += 1;
                    }
                } else if (ins.status === 'Rejected') {
                    s.rejected += 1;
                } else {
                    s.pending += 1;
                }
            });
        });

        const rows = Object.values(stats).map((s: any) => {
            const avgTat = s.quoteCountForTat > 0 ? (s.totalTat / s.quoteCountForTat) : 0;
            const responseRate = s.requestsReceived > 0 ? (s.quotesShared / s.requestsReceived) * 100 : 0;
            const l1Rate = s.quotesShared > 0 ? (s.l1Count / s.quotesShared) * 100 : 0; 
            
            let tatScore = 0;
            if (avgTat > 0) {
                 if (avgTat <= 24) tatScore = 10;
                 else if (avgTat >= 96) tatScore = 0;
                 else tatScore = 10 - ((avgTat - 24) / (96 - 24) * 10);
            }

            const rating = (responseRate * 0.04) + (l1Rate * 0.04) + (tatScore * 0.2);

            return {
                ...s,
                avgTat: formatTat(avgTat),
                avgTatRaw: avgTat,
                responseRate: responseRate.toFixed(1),
                l1Rate: l1Rate.toFixed(1),
                rating: Math.min(Math.max(rating, 0), 10).toFixed(1) 
            };
        });

        rows.sort((a: any, b: any) => b.rating - a.rating);

        if (currentUser.entity === 'Insurer') {
            return { all: rows };
        }

        return {
            preferred: rows.filter((r: any) => PREFERRED_INSURERS.includes(r.name)),
            others: rows.filter((r: any) => !PREFERRED_INSURERS.includes(r.name)),
            all: rows // For overview chart
        };
    }, [filteredRequests, currentUser.entity, insurerCategoryFilter]);

    // Comprehensive Performance Data (Expanded 19+ Metrics)
    const comprehensiveStats = useMemo(() => {
        const stats: any = {};
        
        filteredRequests.forEach(req => {
            const l1Premium = req.insurers.some(i => i.quote) 
                ? Math.min(...req.insurers.filter(i => i.quote?.premium).map(i => i.quote!.premium)) 
                : 0;
                
            req.insurers.forEach(ins => {
                const category = getInsurerCategory(ins.name);
                if (insurerCategoryFilter !== 'All' && category !== insurerCategoryFilter) return;

                if (!stats[ins.name]) {
                    stats[ins.name] = {
                        name: ins.name,
                        // Submission
                        totalRequested: 0,
                        quotesSubmitted: 0,
                        partialQuotes: 0,
                        technicalDeviations: 0,
                        revisedRequested: 0,
                        // Timeliness
                        totalTatHours: 0,
                        delayedQuotes: 0,
                        slaComplianceCount: 0,
                        // Rejection
                        rejectionCount: 0,
                        rejectionAfterL1: 0,
                        // L1
                        l1Count: 0,
                        l1AccuracyGap: 0, // Mocked difference
                        // Conversion
                        conversionCount: 0,
                        premiumWon: 0,
                        totalCommission: 0,
                        shareOfWalletPoints: 0, // Mocked score
                        // Commercials
                        totalMargin: 0,
                        discountRequests: 0,
                        negotiationMovement: 0,
                        // UW
                        totalQueries: 0,
                        uwResponseTime: 0,
                        // Service (Mocked later)
                        pendingCases: 0
                    };
                }

                const s = stats[ins.name];
                s.totalRequested++;

                // Mock randomness for deep metrics
                if (Math.random() > 0.8) s.technicalDeviations++;
                if (Math.random() > 0.9) s.revisedRequested++;
                if (Math.random() > 0.9) s.discountRequests++;

                if (ins.status === 'Quoted') {
                    s.quotesSubmitted++;
                    s.totalCommission += (ins.quote!.commission || 0);

                    // Timeliness Logic
                    const created = new Date(req.createdAt);
                    const submitted = ins.submittedAt ? new Date(ins.submittedAt) : new Date(created.getTime() + 86400000); 
                    const hours = Math.max(0, (submitted.getTime() - created.getTime()) / (1000 * 60 * 60));
                    s.totalTatHours += hours;
                    
                    if (hours > 48) s.delayedQuotes++;
                    if (hours <= 24) s.slaComplianceCount++;

                    // L1 Logic
                    if (ins.quote!.premium === l1Premium) {
                        s.l1Count++;
                        // Mock L1 accuracy gap (variation from final)
                        s.l1AccuracyGap += (Math.random() * 5); 
                    }
                    
                    // Margin Mock
                    s.totalMargin += (Math.random() * 10 + 5); // 5-15% margin
                    s.negotiationMovement += (Math.random() * 50000); // 0-50k movement

                    // UW Queries Mock
                    const queriesForCase = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
                    s.totalQueries += queriesForCase;

                    // Conversion Logic
                    if (req.status === 'Accepted' && ins.quote!.premium === l1Premium) {
                         s.conversionCount++;
                         s.premiumWon += ins.quote!.premium;
                    }

                } else if (ins.status === 'Accepted') {
                    s.quotesSubmitted++;
                    s.conversionCount++;
                    s.l1Count++; 
                    if (ins.quote) {
                        s.premiumWon += ins.quote.premium;
                        s.totalCommission += (ins.quote.commission || 0);
                    }
                } else if (ins.status === 'Rejected') {
                    s.rejectionCount++;
                    if (ins.reason === 'Price') s.rejectionAfterL1++; // Hypothetical
                } else {
                    s.pendingCases++;
                }
            });
        });

        // 2. Calculation Pass & Mocking Operational Metrics
        return Object.values(stats).map((s: any) => {
            const count = s.quotesSubmitted || 1; // Avoid div by zero
            const reqCount = s.totalRequested || 1;

            // Derived Metrics
            const quoteSubRate = (s.quotesSubmitted / reqCount * 100);
            const avgTat = (s.totalTatHours / count);
            const slaCompliance = (s.slaComplianceCount / count * 100);
            
            const rejectionRate = (s.rejectionCount / reqCount * 100);
            const l1WinRate = (s.l1Count / count * 100);
            const conversionRate = (s.conversionCount / count * 100);
            
            const avgMargin = (s.totalMargin / count);
            const avgCommission = (s.totalCommission / count);
            const queryCountPerCase = (s.totalQueries / reqCount);

            // Purely Mocked Operational Metrics (Not in DB)
            const uwResponseTime = (Math.random() * (48 - 4) + 4); // 4-48h
            const serviceTat = (Math.random() * (5 - 1) + 1); // 1-5 days
            const claimTat = (Math.random() * (30 - 7) + 7); // 7-30 days
            const claimApproval = (Math.random() * (99 - 85) + 85); // 85-99%
            const competitiveIndex = (Math.random() * 10).toFixed(1); 
            const participationScore = (Math.random() * 100).toFixed(1); // Participation strength
            
            // Composite Score Calculation
            let score = 0;
            score += (quoteSubRate / 100) * 15; // Submission Weight
            score += (Math.max(0, 100 - avgTat)/100) * 10; // TAT Weight
            score += (l1WinRate / 100) * 15; // Price Competitiveness
            score += (conversionRate / 100) * 20; // Success
            score += (claimApproval / 100) * 20; // Service Quality
            score += (1 - (serviceTat/10)) * 10; // Speed
            score += ((100 - rejectionRate)/100) * 10; // Appetite

            // Scale score to 0-10 range (Sum of weights is 100)
            score = score / 10;

            return {
                ...s,
                quoteSubRate: quoteSubRate.toFixed(1),
                avgTat: formatTat(avgTat),
                slaCompliance: slaCompliance.toFixed(1),
                rejectionRate: rejectionRate.toFixed(1),
                l1WinRate: l1WinRate.toFixed(1),
                conversionRate: conversionRate.toFixed(1),
                avgMargin: avgMargin.toFixed(1),
                avgCommission: avgCommission.toFixed(1),
                queryCountPerCase: queryCountPerCase.toFixed(2),
                uwResponseTime: `${uwResponseTime.toFixed(1)}h`,
                serviceTat: `${serviceTat.toFixed(1)}d`,
                claimTat: `${claimTat.toFixed(0)}d`,
                claimApproval: claimApproval.toFixed(1),
                competitiveIndex,
                participationScore,
                score: Math.min(Math.max(score, 0), 10).toFixed(1)
            };
        }).sort((a: any, b: any) => b.score - a.score);

    }, [filteredRequests, insurerCategoryFilter]);

    const tatData = requests.map(req => {
        const firstQuote = req.insurers.find(i => i.submittedAt);
        if (!firstQuote || !firstQuote.submittedAt) return null;
        const created = new Date(req.createdAt);
        const submitted = new Date(firstQuote.submittedAt);
        return (submitted.getTime() - created.getTime()) / (1000 * 60 * 60); 
    }).filter((t): t is number => t !== null);
    const avgTatOverall = tatData.length > 0 ? (tatData.reduce((a, b) => a + b, 0) / tatData.length) : 0;


    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center"><Icon path={icons.analytics} className="mr-2"/> Analytics</h1>
                
                <div className="flex bg-gray-200 p-1 rounded-lg mt-4 md:mt-0">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('performance')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'performance' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Insurer Performance
                    </button>
                    <button 
                        onClick={() => setActiveTab('comprehensive')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'comprehensive' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Comprehensive
                    </button>
                </div>
            </div>

            {activeTab !== 'overview' && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700">Business Line:</span>
                        {['All', 'EB', 'Non-EB'].map(filter => (
                            <button 
                                key={filter}
                                onClick={() => setBusinessFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${businessFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700">Insurer Category:</span>
                        {['All', 'General', 'Health', 'Life'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setInsurerCategoryFilter(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${insurerCategoryFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'overview' && (
                <>
                    {/* Row 1: KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-blue-500">
                            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total Requests</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalRequests}</p>
                        </Card>
                        <Card className="border-l-4 border-green-500">
                            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Quotes Accepted</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{acceptedQuotes}</p>
                        </Card>
                        <Card className="border-l-4 border-purple-500">
                            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Conversion Rate</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{conversionRate}%</p>
                        </Card>
                        <Card className="border-l-4 border-orange-500">
                            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">Avg. TAT (Hours)</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{formatTat(avgTatOverall)}</p>
                        </Card>
                    </div>

                    {/* Row 2: Trend & Mix */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> 
                                    Weekly Activity Trend
                                </h3>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={overviewData.trend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="key" tick={{fontSize: 12}} />
                                        <YAxis tick={{fontSize: 12}} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="requests" name="Requests Sent" stroke="#8884d8" fillOpacity={1} fill="url(#colorReq)" />
                                        <Area type="monotone" dataKey="quotes" name="Quotes Received" stroke="#82ca9d" fillOpacity={1} fill="url(#colorAcc)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <PieIcon className="w-5 h-5 mr-2 text-purple-600" />
                                Product Mix
                            </h3>
                            <div className="h-80 flex justify-center items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={overviewData.mix}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {overviewData.mix.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Row 3: TAT & Funnel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                                Turnaround Time Distribution
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={overviewData.tat} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tick={{fontSize: 12}} width={80} />
                                        <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                                        <Bar dataKey="value" name="Quotes" fill="#FF8042" radius={[0, 4, 4, 0]} barSize={30}>
                                             {overviewData.tat.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#4ade80' : index === 1 ? '#facc15' : '#f87171'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                                Top Insurer Activity (Funnel)
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={overviewData.insurers} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} tick={{fontSize: 10}} />
                                        <YAxis />
                                        <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                                        <Legend verticalAlign="top" />
                                        <Bar dataKey="Quoted" stackId="a" fill="#4ade80" />
                                        <Bar dataKey="Rejected" stackId="a" fill="#f87171" />
                                        <Bar dataKey="Pending" stackId="a" fill="#fbbf24" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </>
            )}
            
            {activeTab === 'performance' && (
                <>
                    {insurerStats.all && !insurerStats.preferred ? (
                        <PerformanceTable data={insurerStats.all} title="Insurer Performance Overview" />
                    ) : (
                        <>
                            <PerformanceTable data={insurerStats.preferred} title="Preferred Insurers" />
                            <PerformanceTable data={insurerStats.others} title="Other Insurers" />
                        </>
                    )}
                </>
            )}

            {activeTab === 'comprehensive' && (
                <div className="space-y-4">
                    <Card className="overflow-hidden">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Comprehensive Insurer Performance</h3>
                            <p className="text-sm text-gray-500">Detailed multi-parameter breakdown of insurer capabilities and service quality.</p>
                        </div>
                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                             <table className="min-w-max text-xs text-left whitespace-nowrap border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-300">
                                        <th className="px-4 py-3 sticky left-0 bg-gray-100 z-20 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Insurer Identity</th>
                                        <th colSpan={4} className="px-4 py-3 text-center border-r border-gray-300 bg-blue-50 text-blue-700">Submission & Timeliness</th>
                                        <th colSpan={3} className="px-4 py-3 text-center border-r border-gray-300 bg-red-50 text-red-700">Rejection & Quality</th>
                                        <th colSpan={3} className="px-4 py-3 text-center border-r border-gray-300 bg-green-50 text-green-700">L1 Performance</th>
                                        <th colSpan={3} className="px-4 py-3 text-center border-r border-gray-300 bg-purple-50 text-purple-700">Conversion & Business</th>
                                        <th colSpan={3} className="px-4 py-3 text-center border-r border-gray-300 bg-orange-50 text-orange-700">Commercials</th>
                                        <th colSpan={3} className="px-4 py-3 text-center border-r border-gray-300 bg-indigo-50 text-indigo-700">Underwriting Service</th>
                                        <th colSpan={3} className="px-4 py-3 text-center border-r border-gray-300 bg-teal-50 text-teal-700">Claims & Service</th>
                                        <th className="px-4 py-3 text-center bg-gray-200 text-gray-800 sticky right-0 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Overall</th>
                                    </tr>
                                    <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                        <th className="px-4 py-2 sticky left-0 bg-gray-50 z-20 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Name</th>
                                        {/* Submission */}
                                        <th className="px-4 py-2 text-center bg-blue-50/50">Requested</th>
                                        <th className="px-4 py-2 text-center bg-blue-50/50">Sub %</th>
                                        <th className="px-4 py-2 text-center bg-blue-50/50">Avg TAT</th>
                                        <th className="px-4 py-2 text-center bg-blue-50/50">SLA Met %</th>
                                        {/* Rejection */}
                                        <th className="px-4 py-2 text-center bg-red-50/50">Rej %</th>
                                        <th className="px-4 py-2 text-center bg-red-50/50">Tech Dev.</th>
                                        <th className="px-4 py-2 text-center bg-red-50/50">Revised</th>
                                        {/* L1 */}
                                        <th className="px-4 py-2 text-center bg-green-50/50">L1 Count</th>
                                        <th className="px-4 py-2 text-center bg-green-50/50">L1 Win %</th>
                                        <th className="px-4 py-2 text-center bg-green-50/50">Acc. Gap</th>
                                        {/* Conversion */}
                                        <th className="px-4 py-2 text-center bg-purple-50/50">Conv %</th>
                                        <th className="px-4 py-2 text-center bg-purple-50/50">Prem Won</th>
                                        <th className="px-4 py-2 text-center bg-purple-50/50">Wallet %</th>
                                        {/* Commercials */}
                                        <th className="px-4 py-2 text-center bg-orange-50/50">Avg Margin</th>
                                        <th className="px-4 py-2 text-center bg-orange-50/50">Comp. Index</th>
                                        <th className="px-4 py-2 text-center bg-orange-50/50">Avg Comm.</th>
                                        {/* UW */}
                                        <th className="px-4 py-2 text-center bg-indigo-50/50">Q/Case</th>
                                        <th className="px-4 py-2 text-center bg-indigo-50/50">Resp Time</th>
                                        <th className="px-4 py-2 text-center bg-indigo-50/50">UW Score</th>
                                        {/* Claims */}
                                        <th className="px-4 py-2 text-center bg-teal-50/50">Pol. TAT</th>
                                        <th className="px-4 py-2 text-center bg-teal-50/50">Claim TAT</th>
                                        <th className="px-4 py-2 text-center bg-teal-50/50">Appr %</th>
                                        {/* Overall */}
                                        <th className="px-4 py-2 text-center bg-gray-100 sticky right-0 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {comprehensiveStats.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{row.name}</td>
                                            
                                            {/* Submission */}
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100">{row.totalRequested}</td>
                                            <td className="px-4 py-3 text-center font-medium text-blue-600 border-r border-gray-100">{row.quoteSubRate}%</td>
                                            <td className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{row.avgTat}</td>
                                            <td className="px-4 py-3 text-center text-green-600 border-r border-gray-200">{row.slaCompliance}%</td>
                                            
                                            {/* Rejection */}
                                            <td className="px-4 py-3 text-center text-red-600 border-r border-gray-100">{row.rejectionRate}%</td>
                                            <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-100">{row.technicalDeviations}</td>
                                            <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-200">{row.revisedRequested}</td>

                                            {/* L1 */}
                                            <td className="px-4 py-3 text-center font-bold text-gray-800 border-r border-gray-100">{row.l1Count}</td>
                                            <td className="px-4 py-3 text-center text-green-600 border-r border-gray-100">{row.l1WinRate}%</td>
                                            <td className="px-4 py-3 text-center text-gray-400 border-r border-gray-200">±{Math.floor(row.l1AccuracyGap)}%</td>

                                            {/* Conversion */}
                                            <td className="px-4 py-3 text-center font-medium text-purple-600 border-r border-gray-100">{row.conversionRate}%</td>
                                            <td className="px-4 py-3 text-center font-mono text-gray-700 border-r border-gray-100">₹{(row.premiumWon/100000).toFixed(1)}L</td>
                                            <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-200">{row.participationScore}%</td>

                                            {/* Commercials */}
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100">{row.avgMargin}%</td>
                                            <td className="px-4 py-3 text-center text-blue-600 border-r border-gray-100">{row.competitiveIndex}</td>
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-200">{row.avgCommission}%</td>

                                            {/* UW */}
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100">{row.queryCountPerCase}</td>
                                            <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-100">{row.uwResponseTime}</td>
                                            <td className="px-4 py-3 text-center text-indigo-600 font-bold border-r border-gray-200">{(row.score * 0.9).toFixed(1)}</td>

                                            {/* Claims */}
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100">{row.serviceTat}</td>
                                            <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-100">{row.claimTat}</td>
                                            <td className="px-4 py-3 text-center text-green-600 font-bold border-r border-gray-200">{row.claimApproval}%</td>

                                            {/* Overall */}
                                            <td className="px-4 py-3 text-center sticky right-0 bg-white z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-xs ${parseFloat(row.score) > 8 ? 'bg-green-500' : parseFloat(row.score) > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                    {row.score}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};