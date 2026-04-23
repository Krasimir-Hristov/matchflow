import { Question } from './types';

export const rootQuestions: Question[] = [
  // --- Familienstand (mutually exclusive) ---
  {
    id: 'q_ledig',
    category: 'Familienstand',
    groupId: 'familienstand',
    text: 'Sind Sie ledig?',
  },
  {
    id: 'q_verheiratet',
    category: 'Familienstand',
    groupId: 'familienstand',
    text: 'Sind Sie verheiratet?',
  },
  {
    id: 'q_geschieden',
    category: 'Familienstand',
    groupId: 'familienstand',
    text: 'Sind Sie geschieden?',
  },
  {
    id: 'q_verwitwet',
    category: 'Familienstand',
    groupId: 'familienstand',
    text: 'Sind Sie verwitwet?',
  },

  // --- Arbeitsvertrag (mutually exclusive) ---
  {
    id: 'q_befristet',
    category: 'Arbeitsvertrag',
    groupId: 'arbeitsvertrag',
    text: 'Haben Sie einen befristeten Arbeitsvertrag?',
  },
  {
    id: 'q_unbefristet',
    category: 'Arbeitsvertrag',
    groupId: 'arbeitsvertrag',
    text: 'Haben Sie einen unbefristeten Arbeitsvertrag?',
  },

  // --- Einkommen (mutually exclusive) ---
  {
    id: 'q_einkommen_niedrig',
    category: 'Monatliches Netto-Einkommen',
    groupId: 'einkommen',
    text: 'Liegt Ihr monatliches Netto-Einkommen zwischen € 500 und € 2.500?',
  },
  {
    id: 'q_einkommen_hoch',
    category: 'Monatliches Netto-Einkommen',
    groupId: 'einkommen',
    text: 'Liegt Ihr monatliches Netto-Einkommen zwischen € 2.500 und € 10.000?',
  },

  // --- Wohnsituation ---
  {
    id: 'q_miete',
    category: 'Wohnsituation',
    text: 'Wohnen Sie zur Miete?',
    subQuestions: [
      {
        id: 'q_miete_niedrig',
        category: 'Wohnsituation',
        groupId: 'miete_betrag',
        text: 'Beträgt Ihre monatliche Miete bis zu € 500?',
      },
      {
        id: 'q_miete_mittel',
        category: 'Wohnsituation',
        groupId: 'miete_betrag',
        text: 'Liegt Ihre monatliche Miete zwischen € 500 und € 1.500?',
      },
    ],
  },

  // --- Immobilien ---
  {
    id: 'q_immobilie',
    category: 'Immobilienbesitz',
    text: 'Besitzen Sie eine eigene Immobilie?',
    subQuestions: [
      {
        id: 'q_immobilie_selbst',
        category: 'Immobilienbesitz',
        text: 'Bewohnen Sie die Immobilie selber?',
      },
      {
        id: 'q_immobilie_schuldenfrei',
        category: 'Immobilienbesitz',
        groupId: 'immobilie_schulden',
        text: 'Ist Ihre Immobilie schuldenfrei?',
      },
      {
        id: 'q_immobilie_belastet',
        category: 'Immobilienbesitz',
        groupId: 'immobilie_schulden',
        text: 'Ist Ihre Immobilie noch mit Schulden belastet?',
      },
      {
        id: 'q_wohnflaeche_klein',
        category: 'Immobiliendetails',
        groupId: 'wohnflaeche',
        text: 'Beträgt die Wohnfläche Ihrer Immobilie zwischen 34 und 90 Quadratmeter?',
      },
      {
        id: 'q_wohnflaeche_gross',
        category: 'Immobiliendetails',
        groupId: 'wohnflaeche',
        text: 'Beträgt die Wohnfläche Ihrer Immobilie zwischen 90 und 300 Quadratmeter?',
      },
      {
        id: 'q_grundstueck_klein',
        category: 'Immobiliendetails',
        groupId: 'grundstueck',
        text: 'Beträgt das Grundstück Ihrer Immobilie zwischen 50 und 200 Quadratmeter?',
      },
      {
        id: 'q_grundstueck_gross',
        category: 'Immobiliendetails',
        groupId: 'grundstueck',
        text: 'Beträgt das Grundstück Ihrer Immobilie zwischen 200 und 1.000 Quadratmeter?',
      },
      {
        id: 'q_baujahr_alt',
        category: 'Immobiliendetails',
        groupId: 'baujahr',
        text: 'Wurde Ihre Immobilie zwischen 1800 und 1980 erbaut?',
      },
      {
        id: 'q_baujahr_neu',
        category: 'Immobiliendetails',
        groupId: 'baujahr',
        text: 'Wurde Ihre Immobilie zwischen 1980 und 2026 erbaut?',
      },
    ],
  },
];
