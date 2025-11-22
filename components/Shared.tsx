import React from 'react';
import { icons } from '../constants';

export const Icon = ({ path, className = "w-6 h-6" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

export const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
        {children}
    </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = "", type = "button", disabled = false }: any) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    const variants: any = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</button>;
};

export const Badge = ({ children, color = 'blue' }: { children: React.ReactNode, color?: string }) => {
    const colors: any = {
        blue: "bg-blue-100 text-blue-800",
        green: "bg-green-100 text-green-800",
        yellow: "bg-yellow-100 text-yellow-800",
        red: "bg-red-100 text-red-800",
        gray: "bg-gray-100 text-gray-800",
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>{children}</span>;
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Accepted':
        case 'Quotes Received':
        case 'Quoted':
              return 'green';
        case 'Awaiting Quotes':
        case 'Pending':
        case 'Request Sent':
        case 'Query Raised':
            return 'yellow';
        case 'Rejected':
        case 'All Rejected':
            return 'red';
        default:
            return 'gray';
    }
};

export const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <Icon path={icons.close} className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const FormSection = ({ title, children }: any) => (
    <fieldset className="border border-gray-200 rounded-lg p-4 mb-6">
        <legend className="text-base font-semibold leading-6 text-blue-700 px-2 bg-white">{title}</legend>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            {children}
        </div>
    </fieldset>
);

export const FormInput = ({ label, name, type = 'text', defaultValue, required = false, className = "sm:col-span-2" }: any) => (
    <div className={className}>
        <label htmlFor={name} className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">{label}</label>
        <input type={type} name={name} id={name} defaultValue={defaultValue} required={required} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
    </div>
);

export const FormSelect = ({ label, name, children, value, onChange, required = false, className = "sm:col-span-2" }: any) => (
    <div className={className}>
        <label htmlFor={name} className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} required={required} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border">
            {children}
        </select>
    </div>
);