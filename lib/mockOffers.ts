import { Offer } from './types';

/**
 * Mock loan offers for the FinTech Promo App
 */

export const mockOffers: Offer[] = [
  {
    id: 'offer_1',
    title: 'Wachstumskredit fuer Unternehmen',
    description:
      'Ideal fuer Expansion, neue Standorte oder Betriebskapital mit flexiblen Laufzeiten bis 250.000 EUR.',
    maxAmount: 250000,
    interestRate: 5.1,
  },
  {
    id: 'offer_2',
    title: 'Privatkredit Komfort',
    description:
      'Schnelle Auszahlung fuer private Vorhaben mit Kreditrahmen von 5.000 bis 75.000 EUR.',
    maxAmount: 75000,
    interestRate: 6.4,
  },
  {
    id: 'offer_3',
    title: 'Energieeffizienz-Darlehen',
    description:
      'Finanzierung fuer Solaranlagen, Waermepumpen und Sanierungen mit bis zu 120.000 EUR.',
    maxAmount: 120000,
    interestRate: 4.2,
  },
  {
    id: 'offer_4',
    title: 'Startup-Technikleasing',
    description:
      'Leasing fuer Hardware, Software und Arbeitsplaetze fuer junge Tech-Teams bis 90.000 EUR.',
    maxAmount: 90000,
    interestRate: 6.1,
  },
  {
    id: 'offer_5',
    title: 'Immobilien-Modernisierungskredit',
    description:
      'Fuer Renovierung, Umbau oder barrierefreies Wohnen mit Finanzierung bis 180.000 EUR.',
    maxAmount: 180000,
    interestRate: 4.9,
  },
  {
    id: 'offer_6',
    title: 'Autokredit Elektro & Hybrid',
    description:
      'Attraktive Konditionen fuer neue oder junge gebrauchte Elektro- und Hybridfahrzeuge bis 85.000 EUR.',
    maxAmount: 85000,
    interestRate: 3.9,
  },
  {
    id: 'offer_7',
    title: 'Praxis- und Kanzleifinanzierung',
    description:
      'Massgeschneiderte Finanzierung fuer medizinische Praxen und Kanzleien mit bis zu 300.000 EUR.',
    maxAmount: 300000,
    interestRate: 5.6,
  },
  {
    id: 'offer_8',
    title: 'Studien- und Weiterbildungskredit',
    description:
      'Flexible Finanzierung fuer Masterprogramme, Zertifikate und internationale Weiterbildung bis 40.000 EUR.',
    maxAmount: 40000,
    interestRate: 5.8,
  },
  {
    id: 'offer_9',
    title: 'E-Commerce Betriebsmittellinie',
    description:
      'Kurzfristige Liquiditaet fuer Lageraufbau, Marketing und Saisonspitzen bis 150.000 EUR.',
    maxAmount: 150000,
    interestRate: 6.7,
  },
  {
    id: 'offer_10',
    title: 'Premium Umschuldung Plus',
    description:
      'Bessere Monatsrate durch Zusammenfassung bestehender Kredite mit Volumen bis 130.000 EUR.',
    maxAmount: 130000,
    interestRate: 4.6,
  },
];
