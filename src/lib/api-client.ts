// Mock API client
// In a real application, this would make fetch requests to a backend API

// Simulates getting a risk assessment
export const getRisk = async (payload: any) => {
  console.log("API CALL: getRisk", payload);
  await new Promise(res => setTimeout(res, 1000));
  return {
    infection: { level: 'medium', score: Math.random() },
    healing: { probHeal30: Math.random() },
  };
};

// Simulates creating an assessment record
export const createAssessment = async (anamnesisId: string, payload: any) => {
  console.log("API CALL: createAssessment", anamnesisId, payload);
  await new Promise(res => setTimeout(res, 500));
  return { assessmentId: `assessment_${Date.now()}` };
};

// Simulates getting an image analysis
export const getAnalysis = async (assessmentId: string) => {
  console.log("API CALL: getAnalysis", assessmentId);
  await new Promise(res => setTimeout(res, 1500));
  return {
    segmentationMaskUri: `https://picsum.photos/seed/${assessmentId}/400/400`,
    tissueQuant: [
      { class: 'granulation', percent: Math.round(Math.random() * 80) },
      { class: 'slough', percent: Math.round(Math.random() * 20) },
    ]
  };
};

// Simulates pushing data to a FHIR server
export const fhirPush = async (assessmentId: string) => {
  console.log("API CALL: fhirPush", assessmentId);
  await new Promise(res => setTimeout(res, 800));
  return { status: 'success', bundleId: `bundle_${Date.now()}` };
};

// Simulates pulling data from a FHIR server
export const fhirPull = async (patientId: string) => {
  console.log("API CALL: fhirPull", patientId);
  await new Promise(res => setTimeout(res, 1200));
  return { resources: [{ resourceType: 'Observation', value: 1 }] };
};
