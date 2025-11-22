import React, { useState, useMemo, useEffect } from 'react';
import { icons, MOCK_INSURERS } from '../constants';
import { Request, InsurerStatus } from '../types';
import { Icon, Button, Badge, Card, Modal, FormSection, FormInput, FormSelect, getStatusColor } from './Shared';

export const QuoteRequestForm = ({ onClose, onAddRequest, currentUser }: any) => {
    const [selectedProduct, setSelectedProduct] = useState('Fire Insurance');
    const [policyType, setPolicyType] = useState('New');
    const [selectedInsurers, setSelectedInsurers] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [docType, setDocType] = useState('Proposal Form');
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const productCategories = {
        general: MOCK_INSURERS.general.map(() => 'Fire Insurance').filter((v,i,a) => a.indexOf(v)===i).concat(['Fire Insurance', 'Marine Insurance']),
        health: ['Group Health Insurance / Group Mediclaim'],
        life: ['Group Term Life Insurance']
    };

    useEffect(() => {
        let defaultInsurers: string[] = [];
        if (productCategories.health.includes(selectedProduct)) {
            defaultInsurers = [...MOCK_INSURERS.general.slice(0, 3), ...MOCK_INSURERS.health.slice(0, 4)];
        } else if (productCategories.life.includes(selectedProduct)) {
            defaultInsurers = MOCK_INSURERS.life.slice(0, 7);
        } else {
            defaultInsurers = MOCK_INSURERS.general.slice(0, 7);
        }
        setSelectedInsurers(defaultInsurers);
    }, [selectedProduct]);

    const availableInsurers = useMemo(() => {
        if (productCategories.health.includes(selectedProduct)) {
            return { "General Insurers (Health Offered)": MOCK_INSURERS.general, "Standalone Health Insurers": MOCK_INSURERS.health };
        }
        if (productCategories.life.includes(selectedProduct)) {
            return { "Life Insurers": MOCK_INSURERS.life };
        }
        return { "General Insurers": MOCK_INSURERS.general };
    }, [selectedProduct]);

    const handleInsurerSelection = (insurerName: string) => {
        setSelectedInsurers(prev => prev.includes(insurerName) ? prev.filter(name => name !== insurerName) : [...prev, insurerName]);
    };

    const handleSelectAllInCategory = (categoryInsurers: string[]) => {
        const allInCategorySelected = categoryInsurers.every(insurer => selectedInsurers.includes(insurer));
        if (allInCategorySelected) {
            setSelectedInsurers(prev => prev.filter(insurer => !categoryInsurers.includes(insurer)));
        } else {
            setSelectedInsurers(prev => [...new Set([...prev, ...categoryInsurers])]);
        }
    };
    
    const handleFileAdd = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFiles(prev => [...prev, { file, type: docType }]);
            setFileInputKey(Date.now());
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setUploadedFiles(prev => prev.filter(f => f.file.name !== fileName));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data: any = Object.fromEntries(formData.entries());

        const newRequest = {
            id: `OTE-${String(Date.now()).slice(-3)}`,
            clientName: data.clientName,
            product: data.product,
            status: 'Request Sent',
            createdBy: currentUser.name,
            creatorId: currentUser.id,
            zone: currentUser.zone || 'N/A',
            createdAt: new Date().toISOString(),
            details: {
                policyType: data.policyType, partnerCode: data.partnerCode, partnerName: data.partnerName,
                clientEmail: data.clientEmail, clientMobile: data.clientMobile, city: data.city,
                pincode: data.pincode, customerType: data.customerType, sumInsured: Number(data.sumInsured),
                occupancy: data.occupancy
            },
            documents: uploadedFiles.map(f => ({ name: f.file.name, type: f.type })),
            insurers: selectedInsurers.map((name, index) => ({
                id: `insurer-${index}-${Date.now()}`, name: name, status: 'Pending', quote: null, submittedAt: null
            }))
        };
        onAddRequest(newRequest);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <FormSection title="Quote Details">
                    <FormInput label="Client Name" name="clientName" required={true} className="sm:col-span-3"/>
                    <FormSelect label="Policy Type" name="policyType" value={policyType} onChange={(e: any) => setPolicyType(e.target.value)} className="sm:col-span-3">
                        <option>New</option>
                        <option>Rollover</option>
                        <option>Renewal</option>
                    </FormSelect>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Creation Date</label>
                        <input type="text" disabled value={new Date().toLocaleDateString()} className="block w-full rounded-md border-gray-200 bg-gray-50 shadow-sm sm:text-sm py-2 px-3 border text-gray-500" />
                    </div>
                    <FormInput label="Client Email ID" name="clientEmail" type="email" required={true} className="sm:col-span-3"/>
                    <FormInput label="Client Mobile Number" name="clientMobile" type="tel" required={true} className="sm:col-span-3"/>
                    <FormInput label="City" name="city" className="sm:col-span-2"/>
                    <FormInput label="Pin Code" name="pincode" className="sm:col-span-2"/>
                    <FormSelect label="Customer Type" name="customerType" className="sm:col-span-2">
                        <option>Corporate</option>
                        <option>Individual</option>
                    </FormSelect>
                    <FormInput label="Sum Insured (₹)" name="sumInsured" type="number" required={true} className="sm:col-span-3"/>
                    <FormInput label="Occupancy" name="occupancy" required={true} className="sm:col-span-3"/>
                </FormSection>

                <FormSection title="Product Selection">
                     <FormSelect label="Product Category" name="product" value={selectedProduct} onChange={(e: any) => setSelectedProduct(e.target.value)} className="sm:col-span-full">
                         <optgroup label="General Insurance Products">{productCategories.general.map(p => <option key={p} value={p}>{p}</option>)}</optgroup>
                         <optgroup label="Health Insurance Products – Group">{productCategories.health.map(p => <option key={p} value={p}>{p}</option>)}</optgroup>
                         <optgroup label="Life Insurance Products – Group">{productCategories.life.map(p => <option key={p} value={p}>{p}</option>)}</optgroup>
                    </FormSelect>
                </FormSection>

                <FormSection title="Select Insurers">
                    <div className="sm:col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Insurers ({selectedInsurers.length} selected)</label>
                        <div className="p-3 border border-gray-200 rounded-md max-h-60 overflow-y-auto space-y-4 bg-gray-50">
                            {Object.entries(availableInsurers).map(([type, insurers]) => {
                                const allSelected = insurers.every(insurer => selectedInsurers.includes(insurer));
                                return (
                                    <div key={type}>
                                        <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-2">
                                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{type}</h4>
                                            <button type="button" onClick={() => handleSelectAllInCategory(insurers)} className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none">
                                                {allSelected ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                                            {insurers.map(insurer => (
                                                <label key={insurer} className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 p-1 rounded">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedInsurers.includes(insurer)} onChange={() => handleInsurerSelection(insurer)} />
                                                    <span>{insurer}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </FormSection>
                
                <FormSection title="Supporting Documents">
                    <div className="sm:col-span-full">
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-md space-y-3 bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                            <div className="flex justify-center">
                                <Icon path={icons.upload} className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex justify-center items-center space-x-2">
                                <select value={docType} onChange={(e) => setDocType(e.target.value)} className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-1 px-2">
                                    <option>Proposal Form</option>
                                    <option>Risk Report</option>
                                    <option>Claim Data</option>
                                    <option>Previous Policy</option>
                                    <option>Other</option>
                                </select>
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none px-3 py-1 border">
                                    <span>Browse File</span>
                                    <input id="file-upload" key={fileInputKey} name="file-upload" type="file" className="sr-only" onChange={handleFileAdd} />
                                </label>
                            </div>
                            {uploadedFiles.length > 0 && (
                                <div className="mt-4 space-y-2 text-left">
                                    {uploadedFiles.map((f, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm p-2 bg-white border rounded-md">
                                            <div className="flex items-center">
                                                <Icon path={icons.document} className="w-4 h-4 mr-2 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{f.file.name}</p>
                                                    <p className="text-xs text-gray-500">{f.type}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveFile(f.file.name)} className="text-red-500 hover:text-red-700">
                                                <Icon path={icons.trash} className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </FormSection>
            </div>

            <div className="mt-8 flex justify-end gap-x-3 border-t pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" className="shadow-lg shadow-blue-500/50">Create & Send Request</Button>
            </div>
        </form>
    );
};

export const QuoteRequestsTable = ({ requests, onSelectRequest, currentUser }: any) => {
    const isAdmin = currentUser.role === 'Admin';
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        {currentUser.role !== 'Sales RM' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                         {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotes Shared</th>}
                         {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>}
                         {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>}

                        {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L1 Premium</th>}
                        {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L1 Commission</th>}
                        {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L1 Insurer</th>}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {requests.map((req: Request) => {
                        const l1Insurer = req.insurers
                            .filter(i => i.quote && i.quote.premium)
                            .sort((a, b) => a.quote!.premium - b.quote!.premium)[0];
                        
                        const quotedCount = req.insurers.filter(i => i.status === 'Quoted').length;
                        const rejectedCount = req.insurers.filter(i => i.status === 'Rejected').length;
                        const pendingCount = req.insurers.length - quotedCount - rejectedCount;

                        return (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{req.clientName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.product}</td>
                                {currentUser.role !== 'Sales RM' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.createdBy}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Badge color={getStatusColor(req.status)}>{req.status}</Badge>
                                </td>
                                {isAdmin && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 font-medium text-xs border border-green-200">
                                                {quotedCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`px-2 py-1 rounded-full font-medium text-xs border ${rejectedCount > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {rejectedCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`px-2 py-1 rounded-full font-medium text-xs border ${pendingCount > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                {pendingCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                            {l1Insurer ? `₹${l1Insurer.quote!.premium.toLocaleString('en-IN')}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                            {l1Insurer ? `${l1Insurer.quote!.commission}%` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {l1Insurer ? l1Insurer.name : 'N/A'}
                                        </td>
                                    </>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button onClick={() => onSelectRequest(req)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                                        <Icon path={icons.eye} className="w-4 h-4" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const ResolveQueryForm = ({ request, insurer, onSubmit, onClose }: any) => {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const responseText = e.target.elements.response.value;
        const fileData = null; 
        onSubmit(request.id, insurer.name, responseText, fileData);
        onClose();
    };
    
    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm p-3 bg-yellow-50 rounded-md border border-yellow-100">
                <p className="font-bold text-yellow-800 flex items-center"><Icon path={icons.chat} className="w-4 h-4 mr-1"/> Query from {insurer.name}:</p>
                <p className="text-gray-700 mt-1 italic pl-5">"{insurer.query}"</p>
            </div>
             <div>
                <label htmlFor="response" className="block text-sm font-medium text-gray-700">Your Response</label>
                <textarea name="response" id="response" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Provide your response to the query..."></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Response</Button>
            </div>
        </form>
    );
};

export const QuoteComparisonView = ({ request, onClose, currentUser, onQueryResolve }: any) => {
    const isBrokerView = currentUser && currentUser.brokerage;
    const isInsurerView = currentUser && currentUser.insurer;
    const isAdmin = currentUser.role === 'Admin';

    const insurersToShow: InsurerStatus[] = isBrokerView ? request.insurers : request.insurers.filter((i: any) => i.name === currentUser.insurer);
    const [resolveQueryModal, setResolveQueryModal] = useState<{isOpen: boolean, insurer: any}>({ isOpen: false, insurer: null });
    const l1Insurer = useMemo(() => request.insurers
        .filter((i: any) => i.quote && i.quote.premium)
        .sort((a: any, b: any) => a.quote.premium - b.quote.premium)[0], [request.insurers]);

    return (
        <div className="animate-fade-in">
            <Modal isOpen={resolveQueryModal.isOpen} onClose={() => setResolveQueryModal({isOpen: false, insurer: null})} title={`Resolve Query for ${resolveQueryModal.insurer?.name}`}>
                <ResolveQueryForm
                    request={request}
                    insurer={resolveQueryModal.insurer}
                    onSubmit={onQueryResolve}
                    onClose={() => setResolveQueryModal({isOpen: false, insurer: null})}
                />
            </Modal>
            <button onClick={onClose} className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                <Icon path={icons.back} className="w-5 h-5" />
                Back to Dashboard
            </button>
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-4 mb-6 items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{request.clientName}</h3>
                        <p className="text-sm text-gray-500">{request.product}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-500">Request ID: <span className="font-mono text-gray-700">{request.id}</span></div>
                        <div className="text-sm font-medium text-gray-500">Sum Insured: <span className="font-mono text-gray-700">₹{request.details?.sumInsured?.toLocaleString()}</span></div>
                    </div>
                     <div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-500 mb-1">Status</span>
                            <Badge color={getStatusColor(request.status)}>{request.status}</Badge>
                            {isInsurerView && l1Insurer && (
                                <p className="text-sm text-gray-600 mt-2 bg-gray-100 px-2 py-1 rounded">
                                    <span className="font-semibold">Current L1:</span> ₹{l1Insurer.quote!.premium.toLocaleString('en-IN')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                    <Icon path={icons.quotes} className="w-4 h-4 mr-2" /> {isBrokerView ? "Insurer Quotes & Communication" : "My Response"}
                </h4>
                <div className="space-y-4">
                    {insurersToShow.map(insurer => (
                        <div key={insurer.id} className={`p-4 border rounded-lg transition-all ${insurer.id === l1Insurer?.id && isAdmin ? 'border-green-300 bg-green-50 ring-1 ring-green-300' : 'border-gray-200 hover:shadow-sm'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="font-semibold text-gray-800 col-span-1 flex flex-col">
                                    <span className="text-lg">{insurer.name}</span>
                                    {isAdmin && l1Insurer && insurer.id === l1Insurer.id && (
                                        <span className="text-xs font-bold text-green-600 flex items-center mt-1">
                                            <Icon path={icons.check} className="w-3 h-3 mr-1" /> L1 Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center md:justify-center">
                                    <Badge color={getStatusColor(insurer.status)}>{insurer.status}</Badge>
                                    {insurer.reason && <p className="text-xs text-red-600 ml-2">{insurer.reason}</p>}
                                </div>
                                <div className="text-sm md:col-span-1">
                                    {insurer.quote && (
                                        <div className="space-y-1">
                                            {(isBrokerView || isInsurerView) && (
                                                <p className="font-medium">Premium: <span className="font-bold text-gray-900 text-lg">₹{insurer.quote.premium.toLocaleString('en-IN')}</span></p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                             {insurer.query && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                                    <div className="text-sm p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                                        <p className="font-bold text-yellow-800 flex items-center"><Icon path={icons.chat} className="w-4 h-4 mr-1"/> Query from {insurer.name}:</p>
                                        <p className="text-gray-700 mt-1 italic pl-5">"{insurer.query}"</p>
                                    </div>
                                    {isBrokerView && insurer.status === 'Query Raised' && !insurer.resolution && (
                                         <div className="mt-3 text-right">
                                            <Button onClick={() => setResolveQueryModal({isOpen: true, insurer: insurer})} variant="primary" className="text-xs flex items-center gap-1 ml-auto">
                                                <Icon path={icons.reply} className="w-3 h-3"/> Resolve Query
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}