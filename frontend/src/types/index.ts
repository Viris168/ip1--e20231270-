export type UserRole = 'STUDENT' | 'ADVISOR';

export type ApplicationStatus =
  | 'DRAFT'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'APPROVED'
  | 'REJECTED';

export type ReviewDecision =
  | 'PENDING'
  | 'NEEDS_CHANGES'
  | 'APPROVED'
  | 'REJECTED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  studentIdNumber?: string | null;
  createdAt?: string;
}

export interface Review {
  id: number;
  applicationId: number;
  advisorId: number;
  advisorName?: string;
  comment: string;
  decision: ReviewDecision;
  createdAt: string;
}

export interface InternshipApplication {
  id: number;
  studentId: number;
  studentName?: string;
  companyName: string;
  positionTitle: string;
  location: string;
  stipend?: number | null;
  status: ApplicationStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
