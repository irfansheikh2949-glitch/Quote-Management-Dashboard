import React, { useState, useMemo } from 'react';
import { icons } from '../constants';
import { Request, InsurerStatus } from '../types';
import { Icon, Button, Badge, Card, Modal, getStatusColor } from './Shared';

export const SubmitQuoteForm = ({ request, insurerName, onSubmit, onClose }: any) => {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const quoteDetails = {
            premium: parseFloat(formData.get('premium') as string),
            commission: parseFloat(formData.get('commission') as string),
            terms: formData.get('terms'),
        };
        onSubmit(request.id, insurerName, quoteDetails);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="premium" className="block text-sm font-medium text-gray-700">Premium Amount (₹)</label>
                <input type="number" name="premium" id="premium" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div>
                <label htmlFor="commission" className="block text-sm font-medium text-gray-700">Commission (%)</label>
                <input type="number" name="commission" id="commission" step="0.1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div>
                <label htmlFor="terms" className="block text-sm font-medium text-gray-700">Remarks / Terms & Conditions</label>
                <textarea name="terms" id="terms" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Quote</Button>
            </div>
        </form>
    );
};

export const RejectQuoteForm = ({ request, insurerName, onSubmit, onClose }: any) => {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const reason = e.target.elements.reason.value;
        onSubmit(request.id, insurerName, reason);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Rejection</label>
                <textarea name="reason" id="reason" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Please provide a clear reason..."></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="danger">Confirm Rejection</Button>
            </div>
        </form>
    );
}

export const AskQueryForm = ({ request, insurerName, onSubmit, onClose }: any) => {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const query = e.target.elements.query.value;
        const fileData = null; // Simplified
        onSubmit(request.id, insurerName, query, fileData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700">Your Query</label>
                <textarea name="query" id="query" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Ask for clarification or additional documents..."></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Query</Button>
            </div>
        </form>
    );
}

const InsurerStats = ({ requests, insurerName }: { requests: Request[], insurerName: string }) => {
    const stats = useMemo(() => {
        const myReqs = requests.map(r => r.insurers.find(i => i.name === insurerName)).filter(Boolean) as InsurerStatus[];
        
        const total = myReqs.length;
        const pending = myReqs.filter(i => i.status === 'Pending' || i.status === 'Query Raised').length;
        const quoted = myReqs.filter(i => i.status === 'Quoted' || i.status === 'Accepted').length;
        const won = myReqs.filter(i => i.status === 'Accepted').length;
        const conversion = quoted > 0 ? ((won / quoted) * 100).toFixed(1) : '0.0';

        return { total, pending, quoted, won, conversion };
    }, [requests, insurerName]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Icon path={icons.dashboard} className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </Card>
            <Card className="border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Pending Action</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <Icon path={icons.chat} className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>
            </Card>
            <Card className="border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Quotes Submitted</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.quoted}</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-full">
                        <Icon path={icons.quotes} className="w-6 h-6 text-indigo-600" />
                    </div>
                </div>
            </Card>
            <Card className="border-l-4 border-green-500">
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Win Rate</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.conversion}%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                        <Icon path={icons.check} className="w-6 h-6 text-green-600" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const UnderwriterDashboard = ({ currentUser, requests, onSelectRequest, onQuoteSubmit, onQuoteReject, onQuoteAccept, onQuoteQuery }: any) => {
    // Filter for Pending or Active items only for the Worklist
    const activeWorklist = requests.filter((req: Request) => {
        const myStatus = req.insurers.find(i => i.name === currentUser.insurer)?.status;
        return myStatus === 'Pending' || myStatus === 'Query Raised';
    });

    const [quoteModal, setQuoteModal] = useState<{isOpen: boolean, request: Request | null}>({ isOpen: false, request: null });
    const [rejectModal, setRejectModal] = useState<{isOpen: boolean, request: Request | null}>({ isOpen: false, request: null });
    const [askQueryModal, setAskQueryModal] = useState<{isOpen: boolean, request: Request | null}>({ isOpen: false, request: null });

    const renderActionButtons = (req: Request) => {
        const insurer = req.insurers.find(i => i.name === currentUser.insurer);
        let actionButtons;

        if (!insurer) return null;

        switch(insurer.status) {
            case 'Pending':
                actionButtons = (
                    <div className="flex space-x-1">
                        <Button variant="success" onClick={() => onQuoteAccept(req.id, currentUser.insurer)} className="text-xs py-1 px-2 h-8">Accept</Button>
                        <Button variant="danger" onClick={() => setRejectModal({isOpen: true, request: req})} className="text-xs py-1 px-2 h-8">Reject</Button>
                        <Button variant="secondary" onClick={() => setAskQueryModal({isOpen: true, request: req})} className="text-xs py-1 px-2 h-8">Query</Button>
                    </div>
                );
                break;
            case 'Accepted':
                actionButtons = <Button variant="primary" onClick={() => setQuoteModal({isOpen: true, request: req})} className="text-xs py-1 px-2 h-8">Submit Quote</Button>;
                break;
            case 'Query Raised':
                actionButtons = <span className="text-xs italic text-gray-500 bg-gray-100 px-2 py-1 rounded">Awaiting Response</span>;
                break;
            default:
                actionButtons = null;
        }
        
        return (
            <div className="flex items-center justify-between w-full">
                <div className="mr-2">{actionButtons}</div>
                <Button variant="secondary" onClick={() => onSelectRequest(req)} className="text-xs py-1 px-2 h-8 bg-white border hover:bg-gray-50">Details</Button>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Modal isOpen={quoteModal.isOpen} onClose={() => setQuoteModal({ isOpen: false, request: null })} title={`Submit Quote for ${quoteModal.request?.clientName}`}>
                <SubmitQuoteForm request={quoteModal.request} insurerName={currentUser.insurer} onSubmit={onQuoteSubmit} onClose={() => setQuoteModal({ isOpen: false, request: null })} />
            </Modal>
            <Modal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, request: null })} title={`Reject Quote for ${rejectModal.request?.clientName}`}>
                <RejectQuoteForm request={rejectModal.request} insurerName={currentUser.insurer} onSubmit={onQuoteReject} onClose={() => setRejectModal({ isOpen: false, request: null })} />
            </Modal>
             <Modal isOpen={askQueryModal.isOpen} onClose={() => setAskQueryModal({ isOpen: false, request: null })} title={`Ask Query for ${askQueryModal.request?.clientName}`}>
                <AskQueryForm request={askQueryModal.request} insurerName={currentUser.insurer} onSubmit={onQuoteQuery} onClose={() => setAskQueryModal({ isOpen: false, request: null })} />
            </Modal>

            <h1 className="text-2xl font-bold text-gray-800 flex items-center"><Icon path={icons.dashboard} className="mr-2"/> Underwriter Dashboard</h1>
            
            {/* KPI Section */}
            <InsurerStats requests={requests} insurerName={currentUser.insurer} />

            <h2 className="text-lg font-bold text-gray-800 mb-4">Pending Worklist ({activeWorklist.length})</h2>
             <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                             {activeWorklist.length > 0 ? activeWorklist.map((req: Request) => {
                                 const myStatus = req.insurers.find(i => i.name === currentUser.insurer)!.status;
                                 return (
                                     <tr key={req.id} className="hover:bg-gray-50">
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{req.clientName}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.product}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                                             <Badge color={getStatusColor(myStatus)}>{myStatus}</Badge>
                                         </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                                             {renderActionButtons(req)}
                                         </td>
                                     </tr>
                                 );
                             }) : (
                                 <tr>
                                     <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">
                                         No pending actions. Good job!
                                     </td>
                                 </tr>
                             )}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
    );
};

export const InsurerQuotesView = ({ currentUser, requests, onSelectRequest }: any) => {
    // Filter for submitted/historical quotes (Quoted, Accepted, Rejected)
    const myQuotes = requests.filter((req: Request) => {
        const myStatus = req.insurers.find(i => i.name === currentUser.insurer)?.status;
        return ['Quoted', 'Accepted', 'Rejected'].includes(myStatus || '');
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Icon path={icons.quotes} className="mr-2"/> My Quotes History
            </h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium (₹)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comm (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                             {myQuotes.map((req: Request) => {
                                 const myInsurer = req.insurers.find(i => i.name === currentUser.insurer)!;
                                 return (
                                     <tr key={req.id} className="hover:bg-gray-50">
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{req.clientName}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.product}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                                             <Badge color={getStatusColor(myInsurer.status)}>{myInsurer.status}</Badge>
                                         </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                             {myInsurer.quote ? `₹${myInsurer.quote.premium.toLocaleString('en-IN')}` : '-'}
                                         </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                             {myInsurer.quote ? `${myInsurer.quote.commission}%` : '-'}
                                         </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button variant="secondary" onClick={() => onSelectRequest(req)} className="text-xs py-1 px-2 h-8 bg-white border hover:bg-gray-50">View</Button>
                                         </td>
                                     </tr>
                                 );
                             })}
                             {myQuotes.length === 0 && (
                                  <tr>
                                     <td colSpan={7} className="px-6 py-8 text-center text-gray-500 italic">
                                         No quote history available.
                                     </td>
                                 </tr>
                             )}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
    );
};