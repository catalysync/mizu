import type { Entity, NavItem, Page } from '../app-schema';
import type { DomainPack, WorkflowDef } from './types';

const entities: Entity[] = [
  {
    id: 'employee',
    name: 'Employee',
    plural: 'Employees',
    fields: [
      { id: 'employeeId', label: 'ID', type: 'string', required: true, primary: true },
      { id: 'name', label: 'Name', type: 'string', required: true, primary: false },
      { id: 'email', label: 'Email', type: 'email', required: true, primary: false },
      { id: 'department', label: 'Department', type: 'string', required: true, primary: false },
      { id: 'title', label: 'Title', type: 'string', required: false, primary: false },
      { id: 'manager', label: 'Manager', type: 'string', required: false, primary: false },
      { id: 'startDate', label: 'Start date', type: 'date', required: true, primary: false },
      {
        id: 'type',
        label: 'Type',
        type: 'badge',
        badgeValues: ['full-time', 'part-time', 'contractor', 'intern'],
        required: false,
        primary: false,
      },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'on-leave', 'offboarding', 'terminated'],
        required: false,
        primary: false,
      },
      { id: 'location', label: 'Location', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'department',
    name: 'Department',
    plural: 'Departments',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'head', label: 'Head', type: 'string', required: false, primary: false },
      { id: 'headcount', label: 'Headcount', type: 'number', required: false, primary: false },
      { id: 'budget', label: 'Budget', type: 'currency', required: false, primary: false },
      { id: 'openRoles', label: 'Open roles', type: 'number', required: false, primary: false },
      { id: 'location', label: 'Location', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'leave-request',
    name: 'Leave request',
    plural: 'Leave requests',
    fields: [
      { id: 'employee', label: 'Employee', type: 'string', required: true, primary: true },
      {
        id: 'type',
        label: 'Type',
        type: 'badge',
        badgeValues: ['annual', 'sick', 'personal', 'parental', 'unpaid', 'bereavement'],
        required: true,
        primary: false,
      },
      { id: 'startDate', label: 'From', type: 'date', required: true, primary: false },
      { id: 'endDate', label: 'To', type: 'date', required: true, primary: false },
      { id: 'days', label: 'Days', type: 'number', required: false, primary: false },
      { id: 'reason', label: 'Reason', type: 'text', required: false, primary: false },
      { id: 'approver', label: 'Approver', type: 'string', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['pending', 'approved', 'rejected', 'cancelled', 'taken'],
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'payroll-run',
    name: 'Payroll run',
    plural: 'Payroll runs',
    fields: [
      { id: 'period', label: 'Period', type: 'string', required: true, primary: true },
      { id: 'runDate', label: 'Run date', type: 'date', required: true, primary: false },
      { id: 'employeeCount', label: 'Employees', type: 'number', required: false, primary: false },
      { id: 'grossTotal', label: 'Gross', type: 'currency', required: false, primary: false },
      { id: 'deductions', label: 'Deductions', type: 'currency', required: false, primary: false },
      { id: 'netTotal', label: 'Net', type: 'currency', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['draft', 'processing', 'approved', 'paid', 'void'],
        required: false,
        primary: false,
      },
      { id: 'approvedBy', label: 'Approved by', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'performance',
    name: 'Performance review',
    plural: 'Performance reviews',
    fields: [
      { id: 'employee', label: 'Employee', type: 'string', required: true, primary: true },
      { id: 'reviewer', label: 'Reviewer', type: 'string', required: true, primary: false },
      { id: 'period', label: 'Period', type: 'string', required: true, primary: false },
      {
        id: 'rating',
        label: 'Rating',
        type: 'badge',
        badgeValues: ['exceeds', 'meets', 'developing', 'below'],
        required: false,
        primary: false,
      },
      { id: 'goals', label: 'Goals met', type: 'string', required: false, primary: false },
      { id: 'dueDate', label: 'Due', type: 'date', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['not-started', 'self-review', 'manager-review', 'calibration', 'complete'],
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'vacancy',
    name: 'Vacancy',
    plural: 'Vacancies',
    fields: [
      { id: 'title', label: 'Title', type: 'string', required: true, primary: true },
      { id: 'department', label: 'Department', type: 'string', required: true, primary: false },
      {
        id: 'hiringManager',
        label: 'Hiring manager',
        type: 'string',
        required: false,
        primary: false,
      },
      { id: 'location', label: 'Location', type: 'string', required: false, primary: false },
      {
        id: 'type',
        label: 'Type',
        type: 'badge',
        badgeValues: ['full-time', 'part-time', 'contract', 'intern'],
        required: false,
        primary: false,
      },
      { id: 'applicants', label: 'Applicants', type: 'number', required: false, primary: false },
      { id: 'postedDate', label: 'Posted', type: 'date', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['draft', 'open', 'interviewing', 'offer-sent', 'filled', 'closed'],
        required: false,
        primary: false,
      },
      { id: 'salary', label: 'Salary range', type: 'string', required: false, primary: false },
    ],
  },
];

const workflows: WorkflowDef[] = [
  {
    entityId: 'leave-request',
    states: [
      { id: 'pending', label: 'Pending', transitions: ['approved', 'rejected', 'cancelled'] },
      { id: 'approved', label: 'Approved', transitions: ['taken', 'cancelled'] },
      { id: 'rejected', label: 'Rejected', transitions: ['pending'] },
      { id: 'cancelled', label: 'Cancelled', transitions: [] },
      { id: 'taken', label: 'Taken', transitions: [] },
    ],
  },
  {
    entityId: 'payroll-run',
    states: [
      { id: 'draft', label: 'Draft', transitions: ['processing'] },
      { id: 'processing', label: 'Processing', transitions: ['approved', 'void'] },
      { id: 'approved', label: 'Approved', transitions: ['paid'] },
      { id: 'paid', label: 'Paid', transitions: [] },
      { id: 'void', label: 'Void', transitions: ['draft'] },
    ],
  },
  {
    entityId: 'performance',
    states: [
      { id: 'not-started', label: 'Not started', transitions: ['self-review'] },
      { id: 'self-review', label: 'Self-review', transitions: ['manager-review'] },
      { id: 'manager-review', label: 'Manager review', transitions: ['calibration'] },
      { id: 'calibration', label: 'Calibration', transitions: ['complete'] },
      { id: 'complete', label: 'Complete', transitions: [] },
    ],
  },
  {
    entityId: 'vacancy',
    states: [
      { id: 'draft', label: 'Draft', transitions: ['open'] },
      { id: 'open', label: 'Open', transitions: ['interviewing', 'closed'] },
      { id: 'interviewing', label: 'Interviewing', transitions: ['offer-sent', 'open', 'closed'] },
      { id: 'offer-sent', label: 'Offer sent', transitions: ['filled', 'interviewing', 'closed'] },
      { id: 'filled', label: 'Filled', transitions: [] },
      { id: 'closed', label: 'Closed', transitions: ['draft'] },
    ],
  },
  {
    entityId: 'employee',
    states: [
      { id: 'active', label: 'Active', transitions: ['on-leave', 'offboarding'] },
      { id: 'on-leave', label: 'On leave', transitions: ['active'] },
      { id: 'offboarding', label: 'Offboarding', transitions: ['terminated'] },
      { id: 'terminated', label: 'Terminated', transitions: [] },
    ],
  },
];

const defaultPages: Page[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    icon: 'layout',
    composition: {
      header: {
        title: 'Dashboard',
        description: 'Q2 2026 · Company overview',
        actions: [{ label: 'New hire', variant: 'primary' }],
      },
      sections: [
        {
          id: 'kpis',
          kind: 'kpi-row',
          kpis: [
            { label: 'Headcount', value: '186', delta: '+4' },
            { label: 'Open roles', value: '12', delta: '+3' },
            { label: 'Pending leave', value: '8', delta: '-2' },
            { label: 'Avg tenure', value: '2.4 yr', delta: '+0.2' },
          ],
        },
        { id: 'activity', kind: 'activity-list', title: 'Recent activity' },
      ],
    },
  },
  {
    id: 'people',
    path: '/people',
    title: 'People',
    icon: 'users',
    composition: {
      header: {
        title: 'People',
        description: '186 total · 172 active · 6 on leave · 8 offboarding',
        actions: [
          { label: 'Import', variant: 'ghost' },
          { label: 'Add employee', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'people-table',
          kind: 'table',
          entityId: 'employee',
          columnIds: [
            'employeeId',
            'name',
            'department',
            'title',
            'manager',
            'startDate',
            'type',
            'status',
          ],
        },
      ],
    },
  },
  {
    id: 'leave',
    path: '/leave',
    title: 'Leave',
    icon: 'calendar-off',
    composition: {
      header: {
        title: 'Leave requests',
        description: '8 pending · 42 approved this quarter · 3 rejected',
        actions: [{ label: 'Request leave', variant: 'primary' }],
      },
      sections: [
        {
          id: 'leave-table',
          kind: 'table',
          entityId: 'leave-request',
          columnIds: ['employee', 'type', 'startDate', 'endDate', 'days', 'approver', 'status'],
        },
      ],
    },
  },
  {
    id: 'payroll',
    path: '/payroll',
    title: 'Payroll',
    icon: 'banknote',
    composition: {
      header: {
        title: 'Payroll',
        description: 'Monthly payroll runs · FY 2026',
        actions: [{ label: 'Run payroll', variant: 'primary' }],
      },
      sections: [
        {
          id: 'payroll-table',
          kind: 'table',
          entityId: 'payroll-run',
          columnIds: [
            'period',
            'runDate',
            'employeeCount',
            'grossTotal',
            'deductions',
            'netTotal',
            'status',
          ],
        },
      ],
    },
  },
  {
    id: 'departments',
    path: '/departments',
    title: 'Departments',
    icon: 'building-2',
    composition: {
      header: {
        title: 'Departments',
        description: '8 departments · 186 total headcount · 12 open roles',
        actions: [{ label: 'Add department', variant: 'primary' }],
      },
      sections: [
        {
          id: 'departments-table',
          kind: 'table',
          entityId: 'department',
          columnIds: ['name', 'head', 'headcount', 'budget', 'openRoles', 'location'],
        },
      ],
    },
  },
  {
    id: 'performance',
    path: '/performance',
    title: 'Performance',
    icon: 'target',
    composition: {
      header: {
        title: 'Performance reviews',
        description: 'Q1 2026 cycle · 142 in progress · 44 complete',
        actions: [{ label: 'Start review cycle', variant: 'primary' }],
      },
      sections: [
        {
          id: 'performance-table',
          kind: 'table',
          entityId: 'performance',
          columnIds: ['employee', 'reviewer', 'period', 'rating', 'goals', 'dueDate', 'status'],
        },
      ],
    },
  },
  {
    id: 'recruiting',
    path: '/recruiting',
    title: 'Recruiting',
    icon: 'megaphone',
    composition: {
      header: {
        title: 'Vacancies',
        description: '12 open · 4 interviewing · 2 offers pending',
        actions: [{ label: 'Post vacancy', variant: 'primary' }],
      },
      sections: [
        {
          id: 'vacancies-table',
          kind: 'table',
          entityId: 'vacancy',
          columnIds: [
            'title',
            'department',
            'hiringManager',
            'location',
            'type',
            'applicants',
            'status',
          ],
        },
      ],
    },
  },
  {
    id: 'settings',
    path: '/settings',
    title: 'Settings',
    icon: 'settings',
    composition: {
      header: {
        title: 'Settings',
        description: 'Company profile, departments, leave policies, payroll config',
        actions: [],
      },
      sections: [{ id: 'settings-form', kind: 'settings-form' }],
    },
  },
];

const defaultNav: NavItem[] = [
  { pageId: 'dashboard', section: 'primary' },
  { pageId: 'people', section: 'primary' },
  { pageId: 'leave', section: 'primary' },
  { pageId: 'payroll', section: 'primary' },
  { pageId: 'departments', section: 'primary' },
  { pageId: 'performance', section: 'primary' },
  { pageId: 'recruiting', section: 'primary' },
  { pageId: 'settings', section: 'secondary' },
];

const promptContext = `You are generating an HR / people operations design system. Use the following domain knowledge:

ENTITIES: Employee (full lifecycle: active→on-leave→offboarding→terminated, with employment type: full-time/part-time/contractor/intern), Department (org structure with headcount, budget, department head), Leave Request (approval workflow: pending→approved→rejected→cancelled→taken, types: annual/sick/personal/parental/unpaid/bereavement), Payroll Run (processing pipeline: draft→processing→approved→paid→void, with gross/deductions/net breakdowns), Performance Review (review cycle: not-started→self-review→manager-review→calibration→complete, with rating: exceeds/meets/developing/below), Vacancy (hiring pipeline: draft→open→interviewing→offer-sent→filled→closed).

CONSTRAINTS:
- Employee data is PII — access must be role-restricted and audit-logged
- Leave balances must be tracked per type per fiscal year with carry-over rules
- Payroll runs are immutable once paid — corrections go through a separate adjustment run
- Performance reviews have a calibration step to normalize ratings across managers
- Vacancy approvals may require headcount budget sign-off before posting
- Manager hierarchy determines approval chains (leave, expenses, hiring)
- Offboarding checklist: IT access revocation, equipment return, exit interview, final paycheck
- Compliance: overtime tracking, statutory leave minimums, equal opportunity reporting

REFERENCE PRODUCTS: BambooHR (SMB gold standard), Rippling (modern HR + IT), Personio (European HR), Gusto (payroll-first), Workday (enterprise HRIS).

DESIGN LANGUAGE for HR:
- Warm, people-centric palette — HR is about humans, not transactions
- Profile photos and names prominently displayed — put faces to records
- Clear status indicators for leave balances, approval states, review progress
- Org chart and team views alongside flat tables — relationships matter
- Conversational but professional tone — "Leave request submitted" not "Record created"
- Medium density, generous whitespace — HR admins handle sensitive situations, reduce cognitive load
- Rounded corners (8px), soft shadows — approachable, non-intimidating
- Calendar integration for leave visualization — overlap and coverage at a glance

When generating pages, include proper entity-backed tables with realistic columns. Do not generate empty placeholder pages. Every page should have a composition with real sections, real entities bound to tables, and realistic KPI values.`;

export const hrPack: DomainPack = {
  id: 'hr',
  name: 'HR & People Ops',
  pro: true,
  entities,
  workflows,
  promptContext,
  defaultPages,
  defaultNav,
  referenceProducts: ['BambooHR', 'Rippling', 'Personio', 'Gusto', 'Workday'],
};
