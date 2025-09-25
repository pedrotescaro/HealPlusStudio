import type {Patient, Appointment} from './types';
import {PlaceHolderImages} from './placeholder-images';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(i => i.id === id);
  return {
    url: img?.imageUrl ?? 'https://picsum.photos/seed/placeholder/100/100',
    hint: img?.imageHint ?? 'image',
  };
};

export const appointments: Appointment[] = [
  {
    id: 'appt1',
    patientName: 'John Doe',
    patientId: 'p1',
    doctor: 'Dr. Smith',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    time: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 'appt2',
    patientName: 'Emily Davis',
    patientId: 'p4',
    doctor: 'Dr. Smith',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    time: '02:30 PM',
    status: 'Confirmed',
  },
  {
    id: 'appt3',
    patientName: 'Jane Smith',
    patientId: 'p2',
    doctor: 'Dr. Jones',
    date: '2024-07-20T11:00:00.000Z',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 'appt4',
    patientName: 'Mike Johnson',
    patientId: 'p3',
    doctor: 'Dr. Smith',
    date: '2024-07-18T09:00:00.000Z',
    time: '09:00 AM',
    status: 'Canceled',
  },
];

export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    age: 45,
    avatarUrl: getImage('avatar1').url,
    avatarHint: getImage('avatar1').hint,
    lastVisit: '2024-07-15T00:00:00.000Z',
    riskLevel: 'Medium',
    wounds: [
      {
        id: 'w1',
        date: '2024-07-15T00:00:00.000Z',
        notes:
          'Initial assessment. Diabetic foot ulcer, 2cm diameter. Granulation tissue present.',
        imageUrl: getImage('wound1_1').url,
        imageHint: getImage('wound1_1').hint,
      },
      {
        id: 'w2',
        date: '2024-07-22T00:00:00.000Z',
        notes:
          'Wound size reduced to 1.5cm. Less exudate. Edges are epithelializing.',
        imageUrl: getImage('wound1_2').url,
        imageHint: getImage('wound1_2').hint,
      },
    ],
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    age: 68,
    avatarUrl: getImage('avatar2').url,
    avatarHint: getImage('avatar2').hint,
    lastVisit: '2024-07-20T00:00:00.000Z',
    riskLevel: 'Low',
    wounds: [
      {
        id: 'w3',
        date: '2024-07-20T00:00:00.000Z',
        notes:
          'Post-operative incision check. Clean, dry, and intact. Healing well.',
        imageUrl: getImage('wound2_1').url,
        imageHint: getImage('wound2_1').hint,
      },
    ],
  },
  {
    id: 'p3',
    name: 'Mike Johnson',
    age: 32,
    avatarUrl: getImage('avatar3').url,
    avatarHint: getImage('avatar3').hint,
    lastVisit: '2024-07-10T00:00:00.000Z',
    riskLevel: 'Low',
    wounds: [
      {
        id: 'w4',
        date: '2024-07-01T00:00:00.000Z',
        notes: 'Abrasion on left forearm from a fall. Cleaned and dressed.',
        imageUrl: getImage('wound3_1').url,
        imageHint: getImage('wound3_1').hint,
      },
      {
        id: 'w5',
        date: '2024-07-10T00:00:00.000Z',
        notes: 'Scab has formed, no signs of infection. Good progress.',
        imageUrl: getImage('wound3_2').url,
        imageHint: getImage('wound3_2').hint,
      },
    ],
  },
  {
    id: 'p4',
    name: 'Emily Davis',
    age: 75,
    avatarUrl: getImage('avatar4').url,
    avatarHint: getImage('avatar4').hint,
    lastVisit: '2024-07-22T00:00:00.000Z',
    riskLevel: 'High',
    wounds: [
      {
        id: 'w6',
        date: '2024-07-22T00:00:00.000Z',
        notes:
          'Venous leg ulcer. Significant exudate and some slough observed. Measures 4x3 cm.',
        imageUrl: getImage('wound4_1').url,
        imageHint: getImage('wound4_1').hint,
      },
    ],
  },
];
