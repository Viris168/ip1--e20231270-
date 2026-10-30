import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InternshipApplication, ApplicationStatus, Review } from '@/types';

export const useApplicationStore = defineStore('applications', () => {
  // Static mock application dataset from SPEC.md
  const applications = ref<InternshipApplication[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'SOK Vireak',
      companyName: 'Smart Axiata Co., Ltd.',
      positionTitle: 'Backend Software Engineering Intern',
      location: 'Phnom Penh, Cambodia',
      stipend: 350,
      status: 'APPROVED',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      createdAt: '2026-05-10T08:30:00Z',
      updatedAt: '2026-05-20T14:15:00Z',
      reviews: [
        {
          id: 101,
          applicationId: 1,
          advisorId: 99,
          advisorName: 'Prof. CHUN Thavorac',
          comment: 'The internship terms, duration (3 months), and technical focus match ITC I4-GIC graduation requirements. Approved.',
          decision: 'APPROVED',
          createdAt: '2026-05-20T14:15:00Z'
        }
      ]
    },
    {
      id: 2,
      studentId: 1,
      studentName: 'SOK Vireak',
      companyName: 'CamDX - Digital Government Committee',
      positionTitle: 'Full-Stack Developer Intern',
      location: 'Phnom Penh, Cambodia',
      stipend: 300,
      status: 'INTERVIEWING',
      startDate: '2026-07-15',
      endDate: '2026-10-15',
      createdAt: '2026-05-12T10:00:00Z',
      updatedAt: '2026-05-18T09:45:00Z',
      reviews: [
        {
          id: 102,
          applicationId: 2,
          advisorId: 99,
          advisorName: 'Prof. CHUN Thavorac',
          comment: 'Good technical scope. Keep me updated once the technical interview round concludes.',
          decision: 'PENDING',
          createdAt: '2026-05-15T11:20:00Z'
        }
      ]
    },
    {
      id: 3,
      studentId: 1,
      studentName: 'SOK Vireak',
      companyName: 'ABA Bank Digital Division',
      positionTitle: 'Mobile & Cloud Infrastructure Intern',
      location: 'Phnom Penh, Cambodia',
      stipend: 400,
      status: 'APPLIED',
      startDate: '2026-08-01',
      endDate: '2026-11-01',
      createdAt: '2026-05-15T16:20:00Z',
      updatedAt: '2026-05-15T16:20:00Z',
      reviews: []
    },
    {
      id: 4,
      studentId: 1,
      studentName: 'SOK Vireak',
      companyName: 'Wing Bank (Cambodia) Plc',
      positionTitle: 'DevOps & Cloud Intern',
      location: 'Phnom Penh, Cambodia',
      stipend: 250,
      status: 'OFFERED',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      createdAt: '2026-05-01T09:00:00Z',
      updatedAt: '2026-05-22T16:00:00Z',
      reviews: [
        {
          id: 103,
          applicationId: 4,
          advisorId: 99,
          advisorName: 'Prof. CHUN Thavorac',
          comment: 'Please upload the formal offer letter so we can finalize university accreditation.',
          decision: 'NEEDS_CHANGES',
          createdAt: '2026-05-22T16:00:00Z'
        }
      ]
    },
    {
      id: 5,
      studentId: 1,
      studentName: 'SOK Vireak',
      companyName: 'Bongloy Payments',
      positionTitle: 'API Integration Intern',
      location: 'Phnom Penh, Cambodia',
      stipend: 200,
      status: 'DRAFT',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      createdAt: '2026-05-24T11:00:00Z',
      updatedAt: '2026-05-24T11:00:00Z',
      reviews: []
    },
    {
      id: 6,
      studentId: 2,
      studentName: 'CHAN Dara',
      companyName: 'Morodok FinTech',
      positionTitle: 'Frontend Engineer Intern',
      location: 'Phnom Penh, Cambodia',
      stipend: 280,
      status: 'REJECTED',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      createdAt: '2026-04-20T10:00:00Z',
      updatedAt: '2026-05-02T13:00:00Z',
      reviews: [
        {
          id: 104,
          applicationId: 6,
          advisorId: 99,
          advisorName: 'Prof. CHUN Thavorac',
          comment: 'The internship duration of 4 weeks does not fulfill the mandatory 8-week minimum requirement.',
          decision: 'REJECTED',
          createdAt: '2026-05-02T13:00:00Z'
        }
      ]
    }
  ]);

  const searchQuery = ref('');
  const statusFilter = ref<string>('ALL');

  const filteredApplications = computed(() => {
    return applications.value.filter((app) => {
      const matchesSearch =
        searchQuery.value.trim() === '' ||
        app.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        app.positionTitle.toLowerCase().includes(searchQuery.value.toLowerCase());

      const matchesStatus =
        statusFilter.value === 'ALL' || app.status === statusFilter.value;

      return matchesSearch && matchesStatus;
    });
  });

  const stats = computed(() => {
    const total = applications.value.length;
    const draft = applications.value.filter((a) => a.status === 'DRAFT').length;
    const applied = applications.value.filter((a) => a.status === 'APPLIED').length;
    const interviewing = applications.value.filter((a) => a.status === 'INTERVIEWING').length;
    const offered = applications.value.filter((a) => a.status === 'OFFERED').length;
    const approved = applications.value.filter((a) => a.status === 'APPROVED').length;
    const rejected = applications.value.filter((a) => a.status === 'REJECTED').length;
    return { total, draft, applied, interviewing, offered, approved, rejected };
  });

  function getById(id: number): InternshipApplication | undefined {
    return applications.value.find((app) => app.id === id);
  }

  function addApplication(data: Omit<InternshipApplication, 'id' | 'createdAt' | 'updatedAt' | 'reviews'>) {
    const newId = applications.value.length > 0 ? Math.max(...applications.value.map((a) => a.id)) + 1 : 1;
    const newApp: InternshipApplication = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviews: []
    };
    applications.value.unshift(newApp);
    return newApp;
  }

  function updateApplication(id: number, data: Partial<InternshipApplication>) {
    const idx = applications.value.findIndex((a) => a.id === id);
    if (idx !== -1) {
      applications.value[idx] = {
        ...applications.value[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return applications.value[idx];
    }
    return null;
  }

  function deleteApplication(id: number) {
    const idx = applications.value.findIndex((a) => a.id === id);
    if (idx !== -1) {
      applications.value.splice(idx, 1);
      return true;
    }
    return false;
  }

  function addReview(applicationId: number, comment: string, decision: Review['decision']) {
    const app = getById(applicationId);
    if (!app) return null;

    const newReview: Review = {
      id: Date.now(),
      applicationId,
      advisorId: 99,
      advisorName: 'Prof. CHUN Thavorac',
      comment,
      decision,
      createdAt: new Date().toISOString()
    };

    if (!app.reviews) {
      app.reviews = [];
    }
    app.reviews.push(newReview);

    // Atomic update status if approved or rejected (FR-REV-02 / FR-REV-03)
    if (decision === 'APPROVED') {
      app.status = 'APPROVED';
    } else if (decision === 'REJECTED') {
      app.status = 'REJECTED';
    }

    return newReview;
  }

  return {
    applications,
    searchQuery,
    statusFilter,
    filteredApplications,
    stats,
    getById,
    addApplication,
    updateApplication,
    deleteApplication,
    addReview
  };
});
