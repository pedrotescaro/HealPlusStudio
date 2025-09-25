export const TISSUE_TYPES = {
  percentual_granulacao_leito: { label: "Granulação", color: "#EF4444" }, // Vermelho
  percentual_epitelizacao_leito: { label: "Epitelização", color: "#FBBF24" }, // Amarelo
  percentual_esfacelo_leito: { label: "Esfacelo", color: "#A8A29E" }, // Cinza
  percentual_necrose_seca_leito: { label: "Necrose", color: "#18181B" }, // Preto
} as const;

export type TissueName = keyof typeof TISSUE_TYPES;

export type TissueType = {
  label: string;
  color: string;
};
