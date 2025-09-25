export const translations = {
  en: {
    welcomeBack: 'Welcome Back!',
    loginPrompt: 'Log in to access your dashboard.',
    anamnesisTitle: 'Anamnesis',
    anamnesisDescription: 'Fill out the patient\'s anamnesis form.',
    // Add other English translations here
  },
  pt: {
    welcomeBack: 'Bem-vindo(a) de volta!',
    loginPrompt: 'Faça login para acessar seu painel.',
    anamnesisTitle: 'Anamnese',
    anamnesisDescription: 'Preencha o formulário de anamnese do paciente.',
    // Add other Portuguese translations here
  },
};

export type Translation = typeof translations.en;
