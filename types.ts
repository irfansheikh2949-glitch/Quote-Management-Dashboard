export interface User {
  id: string;
  name: string;
  role: string;
  entity: string;
  brokerage?: string;
  insurer?: string;
  zone?: string;
  status: string;
  assignedRm?: string;
}

export interface QuoteDetails {
  premium: number;
  commission: number;
  terms?: string;
  quoteDocument?: string;
}

export interface Resolution {
  text: string;
  attachment: any;
  resolvedAt: string;
}

export interface InsurerStatus {
  id: string;
  name: string;
  status: string; // 'Pending', 'Quoted', 'Rejected', 'Query Raised', 'Accepted'
  quote?: QuoteDetails | null;
  query?: string | null;
  queryAttachment?: any;
  reason?: string | null;
  submittedAt?: string | null;
  resolution?: Resolution;
}

export interface RequestDetails {
  policyType: string;
  sumInsured: number;
  city: string;
  partnerCode?: string;
  partnerName?: string;
  clientEmail?: string;
  clientMobile?: string;
  pincode?: string;
  customerType?: string;
  occupancy?: string;
  previousPolicy?: any;
  coverage?: any;
}

export interface Request {
  id: string;
  clientName: string;
  product: string;
  status: string; // 'Request Sent', 'Accepted', 'Quotes Received', 'Query Raised', 'All Rejected', 'Awaiting Quotes'
  createdBy: string;
  creatorId: string;
  zone: string;
  createdAt: string;
  details: RequestDetails;
  documents: { name: string; type: string }[];
  insurers: InsurerStatus[];
}