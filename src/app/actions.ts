// This file is empty in the template but is a good place for server actions.
'use server';
import {revalidatePath} from 'next/cache';
import {
  aiWoundRiskAssessment,
  AIWoundRiskAssessmentOutput,
} from '@/ai/flows/ai-wound-risk-assessment';
import {
  summarizeWoundHealingProgress,
  SummarizeWoundHealingProgressOutput,
} from '@/ai/flows/summarize-wound-healing-progress';
import {patients} from '@/lib/data';

export async function getWoundRiskAssessmentAction(
  patientId: string,
  woundId: string,
  notes: string,
  photoDataUri: string
): Promise<AIWoundRiskAssessmentOutput> {
  if (!notes || !photoDataUri) {
    throw new Error('Notes and photo are required for assessment.');
  }

  const result = await aiWoundRiskAssessment({notes, photoDataUri});

  const patient = patients.find(p => p.id === patientId);
  if (patient) {
    const wound = patient.wounds.find(w => w.id === woundId);
    if (wound) {
      wound.aiAssessment = result;
    }
  }
  revalidatePath(`/patients/${patientId}`);
  return result;
}

export async function summarizeWoundProgressAction(
  patientId: string,
  images: string[],
  notes: string
): Promise<SummarizeWoundHealingProgressOutput> {
  if (images.length === 0 || !notes) {
    throw new Error('Images and notes are required for summarization.');
  }

  const result = await summarizeWoundHealingProgress({images, notes});

  const patient = patients.find(p => p.id === patientId);
  if (patient) {
    patient.progressSummary = result.summary;
  }
  revalidatePath(`/patients/${patientId}`);
  return result;
}
