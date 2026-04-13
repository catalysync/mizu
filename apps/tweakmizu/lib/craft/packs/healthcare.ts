import type { Entity, Page, NavItem } from '../app-schema';
import type { DomainPack, WorkflowDef } from './types';

const entities: Entity[] = [
  {
    id: 'patient',
    name: 'Patient',
    plural: 'Patients',
    fields: [
      { id: 'mrn', label: 'MRN', type: 'string', required: true, primary: true },
      { id: 'name', label: 'Name', type: 'string', required: true, primary: false },
      { id: 'dob', label: 'Date of birth', type: 'date', required: true, primary: false },
      { id: 'email', label: 'Email', type: 'email', required: false, primary: false },
      { id: 'phone', label: 'Phone', type: 'string', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'inactive', 'discharged', 'deceased'],
        required: false,
        primary: false,
      },
      {
        id: 'primaryProvider',
        label: 'Primary provider',
        type: 'string',
        required: false,
        primary: false,
      },
      { id: 'insuranceId', label: 'Insurance', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'appointment',
    name: 'Appointment',
    plural: 'Appointments',
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      { id: 'time', label: 'Time', type: 'string', required: true, primary: false },
      { id: 'patient', label: 'Patient', type: 'string', required: true, primary: true },
      { id: 'practitioner', label: 'Practitioner', type: 'string', required: true, primary: false },
      { id: 'type', label: 'Type', type: 'string', required: false, primary: false },
      { id: 'duration', label: 'Duration (min)', type: 'number', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: [
          'scheduled',
          'confirmed',
          'checked-in',
          'in-progress',
          'completed',
          'no-show',
          'cancelled',
        ],
        required: false,
        primary: false,
      },
      { id: 'notes', label: 'Notes', type: 'text', required: false, primary: false },
    ],
  },
  {
    id: 'practitioner',
    name: 'Practitioner',
    plural: 'Practitioners',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'specialty', label: 'Specialty', type: 'string', required: true, primary: false },
      { id: 'email', label: 'Email', type: 'email', required: false, primary: false },
      { id: 'npi', label: 'NPI', type: 'string', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'on-leave', 'inactive'],
        required: false,
        primary: false,
      },
      {
        id: 'patientsAssigned',
        label: 'Patients',
        type: 'number',
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'medication',
    name: 'Medication',
    plural: 'Medications',
    fields: [
      { id: 'name', label: 'Medication', type: 'string', required: true, primary: true },
      { id: 'patient', label: 'Patient', type: 'string', required: true, primary: false },
      { id: 'prescriber', label: 'Prescriber', type: 'string', required: true, primary: false },
      { id: 'dosage', label: 'Dosage', type: 'string', required: true, primary: false },
      { id: 'frequency', label: 'Frequency', type: 'string', required: false, primary: false },
      { id: 'startDate', label: 'Start', type: 'date', required: true, primary: false },
      { id: 'endDate', label: 'End', type: 'date', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'completed', 'discontinued', 'on-hold'],
        required: false,
        primary: false,
      },
      { id: 'refillsRemaining', label: 'Refills', type: 'number', required: false, primary: false },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    plural: 'Insurance plans',
    fields: [
      { id: 'planName', label: 'Plan', type: 'string', required: true, primary: true },
      { id: 'provider', label: 'Provider', type: 'string', required: true, primary: false },
      { id: 'memberId', label: 'Member ID', type: 'string', required: true, primary: false },
      { id: 'groupNumber', label: 'Group #', type: 'string', required: false, primary: false },
      { id: 'effectiveDate', label: 'Effective', type: 'date', required: true, primary: false },
      { id: 'expirationDate', label: 'Expires', type: 'date', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'expired', 'pending-verification'],
        required: false,
        primary: false,
      },
      { id: 'copay', label: 'Copay', type: 'currency', required: false, primary: false },
    ],
  },
  {
    id: 'lab-result',
    name: 'Lab result',
    plural: 'Lab results',
    fields: [
      { id: 'testName', label: 'Test', type: 'string', required: true, primary: true },
      { id: 'patient', label: 'Patient', type: 'string', required: true, primary: false },
      { id: 'orderedBy', label: 'Ordered by', type: 'string', required: true, primary: false },
      { id: 'collectedDate', label: 'Collected', type: 'date', required: true, primary: false },
      { id: 'resultDate', label: 'Resulted', type: 'date', required: false, primary: false },
      { id: 'value', label: 'Value', type: 'string', required: false, primary: false },
      { id: 'referenceRange', label: 'Reference', type: 'string', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['ordered', 'collected', 'in-progress', 'resulted', 'reviewed', 'cancelled'],
        required: false,
        primary: false,
      },
      {
        id: 'flag',
        label: 'Flag',
        type: 'badge',
        badgeValues: ['normal', 'abnormal', 'critical'],
        required: false,
        primary: false,
      },
    ],
  },
];

const workflows: WorkflowDef[] = [
  {
    entityId: 'appointment',
    states: [
      { id: 'scheduled', label: 'Scheduled', transitions: ['confirmed', 'cancelled'] },
      { id: 'confirmed', label: 'Confirmed', transitions: ['checked-in', 'no-show', 'cancelled'] },
      { id: 'checked-in', label: 'Checked in', transitions: ['in-progress'] },
      { id: 'in-progress', label: 'In progress', transitions: ['completed'] },
      { id: 'completed', label: 'Completed', transitions: [] },
      { id: 'no-show', label: 'No show', transitions: ['scheduled'] },
      { id: 'cancelled', label: 'Cancelled', transitions: ['scheduled'] },
    ],
  },
  {
    entityId: 'medication',
    states: [
      { id: 'active', label: 'Active', transitions: ['on-hold', 'completed', 'discontinued'] },
      { id: 'on-hold', label: 'On hold', transitions: ['active', 'discontinued'] },
      { id: 'completed', label: 'Completed', transitions: [] },
      { id: 'discontinued', label: 'Discontinued', transitions: [] },
    ],
  },
  {
    entityId: 'lab-result',
    states: [
      { id: 'ordered', label: 'Ordered', transitions: ['collected', 'cancelled'] },
      { id: 'collected', label: 'Collected', transitions: ['in-progress'] },
      { id: 'in-progress', label: 'In progress', transitions: ['resulted'] },
      { id: 'resulted', label: 'Resulted', transitions: ['reviewed'] },
      { id: 'reviewed', label: 'Reviewed', transitions: [] },
      { id: 'cancelled', label: 'Cancelled', transitions: [] },
    ],
  },
  {
    entityId: 'insurance',
    states: [
      { id: 'pending-verification', label: 'Pending verification', transitions: ['active'] },
      { id: 'active', label: 'Active', transitions: ['expired'] },
      { id: 'expired', label: 'Expired', transitions: [] },
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
        description: 'Today · April 12, 2026',
        actions: [{ label: 'New appointment', variant: 'primary' }],
      },
      sections: [
        {
          id: 'kpis',
          kind: 'kpi-row',
          kpis: [
            { label: 'Active patients', value: '1,248', delta: '+3%' },
            { label: "Today's appointments", value: '34', delta: '+2' },
            { label: 'Pending results', value: '18', delta: '-5' },
            { label: 'Open prescriptions', value: '412', delta: '+12' },
          ],
        },
        { id: 'activity', kind: 'activity-list', title: 'Recent activity' },
      ],
    },
  },
  {
    id: 'patients',
    path: '/patients',
    title: 'Patients',
    icon: 'users',
    composition: {
      header: {
        title: 'Patients',
        description: '1,248 total · 1,102 active · 146 inactive',
        actions: [
          { label: 'Import', variant: 'ghost' },
          { label: 'Register patient', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'patients-table',
          kind: 'table',
          entityId: 'patient',
          columnIds: ['mrn', 'name', 'dob', 'primaryProvider', 'insuranceId', 'status'],
        },
      ],
    },
  },
  {
    id: 'appointments',
    path: '/appointments',
    title: 'Appointments',
    icon: 'calendar',
    composition: {
      header: {
        title: 'Appointments',
        description: '34 today · 128 this week · 6 no-shows this month',
        actions: [
          { label: 'View calendar', variant: 'ghost' },
          { label: 'New appointment', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'appointments-table',
          kind: 'table',
          entityId: 'appointment',
          columnIds: ['date', 'time', 'patient', 'practitioner', 'type', 'duration', 'status'],
        },
      ],
    },
  },
  {
    id: 'prescriptions',
    path: '/prescriptions',
    title: 'Prescriptions',
    icon: 'pill',
    composition: {
      header: {
        title: 'Prescriptions',
        description: '412 active · 89 pending refill · 24 discontinued',
        actions: [{ label: 'New prescription', variant: 'primary' }],
      },
      sections: [
        {
          id: 'prescriptions-table',
          kind: 'table',
          entityId: 'medication',
          columnIds: [
            'name',
            'patient',
            'prescriber',
            'dosage',
            'frequency',
            'refillsRemaining',
            'status',
          ],
        },
      ],
    },
  },
  {
    id: 'practitioners',
    path: '/practitioners',
    title: 'Practitioners',
    icon: 'stethoscope',
    composition: {
      header: {
        title: 'Practitioners',
        description: '18 total · 16 active · 2 on leave',
        actions: [{ label: 'Add practitioner', variant: 'primary' }],
      },
      sections: [
        {
          id: 'practitioners-table',
          kind: 'table',
          entityId: 'practitioner',
          columnIds: ['name', 'specialty', 'email', 'npi', 'patientsAssigned', 'status'],
        },
      ],
    },
  },
  {
    id: 'lab-results',
    path: '/lab-results',
    title: 'Lab results',
    icon: 'flask-conical',
    composition: {
      header: {
        title: 'Lab results',
        description: '18 pending · 6 critical flags this week',
        actions: [{ label: 'Order lab', variant: 'primary' }],
      },
      sections: [
        {
          id: 'lab-results-table',
          kind: 'table',
          entityId: 'lab-result',
          columnIds: [
            'testName',
            'patient',
            'orderedBy',
            'collectedDate',
            'value',
            'referenceRange',
            'flag',
            'status',
          ],
        },
      ],
    },
  },
  {
    id: 'insurance',
    path: '/insurance',
    title: 'Insurance',
    icon: 'shield-check',
    composition: {
      header: {
        title: 'Insurance plans',
        description: '1,102 active · 34 pending verification · 112 expired',
        actions: [{ label: 'Verify plan', variant: 'primary' }],
      },
      sections: [
        {
          id: 'insurance-table',
          kind: 'table',
          entityId: 'insurance',
          columnIds: [
            'planName',
            'provider',
            'memberId',
            'groupNumber',
            'effectiveDate',
            'copay',
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
        description: 'Practice profile, providers, insurance, integrations',
        actions: [],
      },
      sections: [{ id: 'settings-form', kind: 'settings-form' }],
    },
  },
];

const defaultNav: NavItem[] = [
  { pageId: 'dashboard', section: 'primary' },
  { pageId: 'patients', section: 'primary' },
  { pageId: 'appointments', section: 'primary' },
  { pageId: 'prescriptions', section: 'primary' },
  { pageId: 'practitioners', section: 'primary' },
  { pageId: 'lab-results', section: 'primary' },
  { pageId: 'insurance', section: 'secondary' },
  { pageId: 'settings', section: 'secondary' },
];

const promptContext = `You are generating a healthcare practice management design system. Use the following domain knowledge:

ENTITIES: Patient (with MRN, demographics, provider assignment, insurance link), Appointment (full lifecycle: scheduled→confirmed→checked-in→in-progress→completed, plus no-show/cancelled), Practitioner (specialty, NPI, active status), Medication (prescriptions with dosage, frequency, refills: active→on-hold→completed→discontinued), Insurance (plan verification: pending-verification→active→expired), Lab Result (ordered→collected→in-progress→resulted→reviewed with normal/abnormal/critical flags).

CONSTRAINTS:
- HIPAA compliance: all PHI must be access-controlled, audit-logged, and encrypted at rest
- Patient identifiers: MRN (Medical Record Number) is the primary key, not name
- Appointment scheduling must handle provider availability, room allocation, and buffer times
- Prescriptions require e-prescribing integration (EPCS for controlled substances)
- Lab results must flag critical values immediately (panic values)
- Insurance verification should happen before appointments when possible
- Role-based access: front desk (scheduling), nurse (vitals, triage), physician (orders, notes), billing (claims)
- ICD-10 and CPT codes for diagnoses and procedures

REFERENCE PRODUCTS: Epic MyChart (enterprise EMR portal), Athenahealth (cloud-based practice management), DrChrono (modern small practice), Jane App (allied health), Kareo (SMB medical billing).

DESIGN LANGUAGE for healthcare:
- Clean, calming palette — soft blues and greens convey trust and care
- Clear hierarchy with generous whitespace — clinical environments demand zero ambiguity
- Status badges with semantic colors — critical results in red, normal in green
- Accessible typography with minimum 14px base — many users in clinical settings
- Muted, professional tone — "Patient record updated" not "All done!"
- Rounded corners (8px), subtle shadows — approachable without being casual
- Dense but scannable tables — clinicians need to review data quickly between patients

When generating pages, include proper entity-backed tables with realistic columns. Do not generate empty placeholder pages. Every page should have a composition with real sections, real entities bound to tables, and realistic KPI values.`;

export const healthcarePack: DomainPack = {
  id: 'healthcare',
  name: 'Healthcare',
  pro: true,
  entities,
  workflows,
  promptContext,
  defaultPages,
  defaultNav,
  referenceProducts: ['Epic MyChart', 'Athenahealth', 'DrChrono', 'Jane App', 'Kareo'],
};
