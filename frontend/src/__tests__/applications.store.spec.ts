import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useApplicationStore } from '../stores/applications';
import { applicationsService } from '../services/applications.service';
import { ApiError } from '../services/http';
import type { InternshipApplication } from '../types';

vi.mock('../services/applications.service', () => ({
  applicationsService: { list: vi.fn(), get: vi.fn() }
}));

const sample: InternshipApplication = {
  id: 1,
  studentId: 1,
  companyName: 'Smart Axiata Co., Ltd.',
  positionTitle: 'Backend Intern',
  location: 'Phnom Penh, Cambodia',
  status: 'APPLIED',
  startDate: '2026-07-01',
  endDate: '2026-09-30',
  createdAt: '2026-05-10T08:30:00Z',
  updatedAt: '2026-05-10T08:30:00Z'
};

describe('applications store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  it('loads applications through the service', async () => {
    vi.mocked(applicationsService.list).mockResolvedValue([sample]);
    const store = useApplicationStore();

    const pending = store.fetchAll();
    expect(store.loading).toBe(true);
    await pending;

    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.applications).toHaveLength(1);
    expect(store.stats.applied).toBe(1);
  });

  it('exposes the error and status code when a request fails', async () => {
    vi.mocked(applicationsService.get).mockRejectedValue(new ApiError(404, 'The requested resource was not found.'));
    const store = useApplicationStore();

    await store.fetchById(42);

    expect(store.loading).toBe(false);
    expect(store.current).toBeNull();
    expect(store.errorStatus).toBe(404);
    expect(store.error).toMatch(/not found/);
  });
});
