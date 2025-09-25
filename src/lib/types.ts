export type WoundEntry = {
  id: string;
  date: string;
  notes: string;
  imageUrl: string;
  imageHint: string;
  aiAssessment?: {
    riskAssessment: string;
    recommendations: string;
  };
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  avatarHint: string;
  lastVisit: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  wounds: WoundEntry[];
  progressSummary?: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Canceled';
};
