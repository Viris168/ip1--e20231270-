import { request } from './http';
import type { InternshipApplication, Review } from '@/types';

export type ApplicationInput = Omit<InternshipApplication, 'id' | 'createdAt' | 'updatedAt' | 'reviews'>;
export type ReviewInput = Omit<Review, 'id' | 'createdAt'>;

// json-server conventions: `_embed=reviews` joins reviews by `applicationId`,
// `_sort`/`_order` sort the list. Components never call these directly; they go through the store.
export const applicationsService = {
  list(): Promise<InternshipApplication[]> {
    return request<InternshipApplication[]>('/applications?_embed=reviews&_sort=createdAt&_order=desc');
  },

  get(id: number): Promise<InternshipApplication> {
    return request<InternshipApplication>(`/applications/${id}?_embed=reviews`);
  },

  create(data: ApplicationInput): Promise<InternshipApplication> {
    const now = new Date().toISOString();
    return request<InternshipApplication>('/applications', {
      method: 'POST',
      body: JSON.stringify({ ...data, createdAt: now, updatedAt: now })
    });
  },

  update(id: number, data: Partial<ApplicationInput>): Promise<InternshipApplication> {
    return request<InternshipApplication>(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() })
    });
  },

  remove(id: number): Promise<void> {
    return request<void>(`/applications/${id}`, { method: 'DELETE' });
  },

  addReview(data: ReviewInput): Promise<Review> {
    return request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ ...data, createdAt: new Date().toISOString() })
    });
  }
};
