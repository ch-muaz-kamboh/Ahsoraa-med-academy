'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Calendar,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowRight,
  BookOpen,
  DollarSign,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';
import LeadCaptureModal from '@/components/public/LeadCaptureModal';

interface ScholarshipRegion {
  id: string;
  name: string;
  capital: string;
  hasEnglishMedicine: boolean;
  isPendingAccreditation?: boolean;
  englishDegrees: string[];
  additionalContext: string;
  providers: {
    name: string;
    referenceWindow: string;
    officialUrl: string;
  }[];
  caveat: string;
}

const REGIONS_DATA: ScholarshipRegion[] = [
  {
    id: 'abruzzo',
    name: 'Abruzzo',
    capital: 'L’Aquila',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'University of L’Aquila; G. d’Annunzio University of Chieti–Pescara (primarily Italian-taught Medicine / Dentistry, subject to current catalogues).',
    providers: [
      { name: 'ADSU L’Aquila', referenceWindow: '16 Jul – 31 Aug 2026', officialUrl: 'https://adsuaq.org/2026/07/16/bando-borse-di-studio-a-a-2026-2027/' },
      { name: 'ADSU Teramo', referenceWindow: '30 Jul – 7 Sep 2026', officialUrl: 'https://www.adsuteramo.it/archivio10_galleria-immagini_0_500_13_8.html' },
      { name: 'ADSU Chieti–Pescara', referenceWindow: 'Check relevant annual call', officialUrl: 'https://www.adsuchietipescara.it/' },
    ],
    caveat: 'There is no single Abruzzo scholarship deadline. Verify which of the three ADSU regional agencies serves your specific enrolled university.',
  },
  {
    id: 'basilicata',
    name: 'Basilicata',
    capital: 'Potenza',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'University of Basilicata and eligible regional higher education institutes; verify course catalogues.',
    providers: [
      { name: 'ARDSU Basilicata', referenceWindow: '24 Aug – 2 Oct 2026', officialUrl: 'https://agr.regione.basilicata.it/post/ardsu-borse-di-studio-da-oggi-il-via-alle-domande/' },
    ],
    caveat: 'No English Medicine/Dentistry programme is listed under Basilicata in MUR Table B. Always check degree language before applying.',
  },
  {
    id: 'calabria',
    name: 'Calabria',
    capital: 'Catanzaro',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'Magna Graecia University of Catanzaro (Medicine/Dentistry, Italian); University of Calabria (Rende/Cosenza); Mediterranea University of Reggio Calabria.',
    providers: [
      { name: 'Fondazione Università Magna Graecia', referenceWindow: 'Deadline: 8 Sep 2026 (12:00)', officialUrl: 'https://www.fondazioneumg.it/servizi/notizie/notizie_fase02.aspx?ID=9677' },
      { name: 'University of Calabria – Centro Residenziale', referenceWindow: '9 Jul – 6 Aug 2026 (First-year cohort)', officialUrl: 'https://soscr.unical.it/Default.aspx?tabid=47' },
      { name: 'Mediterranea University of Reggio Calabria – DSU', referenceWindow: '6 Jul – 30 Sep 2026', officialUrl: 'https://www.unirc.it/studiare/diritto-allo-studio/scadenze-le-domande' },
    ],
    caveat: 'Multiple university-linked agencies operate in Calabria. Apply to the exact service linked to your faculty.',
  },
  {
    id: 'campania',
    name: 'Campania',
    capital: 'Naples',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Campania Luigi Vanvitelli — Medicine & Surgery in English (Naples)',
      'University of Naples Federico II — Medicine & Surgery in English (Naples)',
    ],
    additionalContext: 'Both English-taught courses are officially listed in national MUR Table B. Other regional medical degrees may be Italian-taught.',
    providers: [
      { name: 'ADISURC Campania', referenceWindow: '24 Jul – 10 Sep 2026 (12:00)', officialUrl: 'https://adisurcampania.it/notizie/approvazione-bando-di-concorso-20262027' },
    ],
    caveat: 'ADISURC administers both Vanvitelli and Federico II public scholarship applications. Check income bracket (ISEE Parificato) cutoffs.',
  },
  {
    id: 'emilia-romagna',
    name: 'Emilia-Romagna',
    capital: 'Bologna',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Bologna — Medicine & Surgery in English (Bologna)',
      'University of Parma — Medicine & Surgery in English (Piacenza campus)',
    ],
    additionalContext: 'Universities of Ferrara and Modena/Reggio Emilia run medical programmes; Parma’s English Medicine is hosted in Piacenza.',
    providers: [
      { name: 'ER.GO (Azienda DSU Emilia-Romagna)', referenceWindow: '24 Aug 2026 (16:00)', officialUrl: 'https://www.er-go.it/cosa-fare-per/bandi-di-concorso/leggi-il-bando' },
    ],
    caveat: 'ER.GO maintains distinct cutoff dates for accommodation vs monetary grant assistance. The August deadline is for scholarship submission.',
  },
  {
    id: 'friuli-venezia-giulia',
    name: 'Friuli Venezia Giulia',
    capital: 'Trieste',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'University of Trieste and University of Udine (Italian-taught medical programmes).',
    providers: [
      { name: 'ARDiS FVG', referenceWindow: 'Opened 15 Jul 2026 (Staggered benefit cutoffs)', officialUrl: 'https://www.ardis.fvg.it/contenuti.php?id=268&view=page' },
    ],
    caveat: 'ARDiS strictly differentiates deadlines depending on benefit type (scholarship vs housing). Check specific schedule per student category.',
  },
  {
    id: 'lazio',
    name: 'Lazio',
    capital: 'Rome',
    hasEnglishMedicine: true,
    englishDegrees: [
      'Sapienza University of Rome — Medicine & Surgery in English',
      'Sapienza University of Rome — Dentistry & Dental Prosthodontics in English',
      'University of Rome Tor Vergata — Medicine & Surgery in English (Rome campus)',
      'Università Cattolica del Sacro Cuore — Medicine (Rome)',
      'UniCamillus — Saint Camillus International University (Rome)',
      'Campus Bio-Medico University of Rome — Medicine / MedTech',
    ],
    additionalContext: 'Tor Vergata also operates a Tirana campus (Albania is outside Lazio study location). Private medical institutions may offer private aid alongside or in place of public grants.',
    providers: [
      { name: 'Lazio DiSCo', referenceWindow: '10 Jun – 23 Jul 2026 (20:00)', officialUrl: 'https://laziodisco.it/prorogato-alle-ore-2000-del-23-luglio-il-termine-di-presentazione-delle-domande/' },
    ],
    caveat: 'Lazio DiSCo is the regional agency. Private university students must verify how institutional fees interact with regional aid.',
  },
  {
    id: 'liguria',
    name: 'Liguria',
    capital: 'Genoa',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'University of Genoa (Medicine and Dentistry programmes taught in Italian).',
    providers: [
      { name: 'ALiSEO Liguria', referenceWindow: '15 Jun – 31 Jul 2026', officialUrl: 'https://www.aliseo.liguria.it/benefici-economici-universitari/borsa-di-studio-universitaria/faq/' },
    ],
    caveat: 'ALiSEO is the regional authority for Genoa. No English Medicine entry appears in national MUR Table B.',
  },
  {
    id: 'lombardia',
    name: 'Lombardia',
    capital: 'Milan',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Milan (Statale) — International Medical School (IMS)',
      'University of Milano-Bicocca — School of Medicine (Bergamo campus)',
      'University of Pavia — Harvey Medical Course (Pavia)',
      'Humanitas University — Medicine & Surgery / MEDTEC (Pieve Emanuele)',
      'Vita-Salute San Raffaele University — International MD Program (Milan)',
    ],
    additionalContext: 'Cattolica’s English Medicine programmes are located in Rome and Bolzano, not Milan. Bicocca’s English course is situated in Bergamo.',
    providers: [
      { name: 'University of Milan – DSU', referenceWindow: '10 Jul – 30 Sep 2026', officialUrl: 'https://www.unimi.it/it/studiare/borse-premi-mense-e-alloggi/borse-di-studio-regionali' },
      { name: 'Milano-Bicocca – DSU', referenceWindow: '7 Jul – 30 Sep 2026', officialUrl: 'https://www.unimib.it/studiare/servizi-studenti-e-laureati/diritto-allo-studio-contribuzione-studentesca-150-ore/benefici-diritto-allo-studio' },
      { name: 'EDiSU Pavia', referenceWindow: 'Deadline: 15 Sep 2026 (15:00)', officialUrl: 'https://www.edisu.pv.it/servizi/borsa-di-studio-ordinaria/' },
    ],
    caveat: 'Lombardy does not use a single shared regional application form. Each university or university EDiSU body runs its own portal and deadlines.',
  },
  {
    id: 'marche',
    name: 'Marche',
    capital: 'Ancona',
    hasEnglishMedicine: true,
    englishDegrees: [
      'Università Politecnica delle Marche — Medicine & Surgery in English (Ancona)',
    ],
    additionalContext: 'Other regional health and medical courses are Italian-taught.',
    providers: [
      { name: 'ERDIS Marche', referenceWindow: '13 Jul – 28 Aug 2026', officialUrl: 'https://erdis.it/servizi/servizio-dettaglio/3161252' },
    ],
    caveat: 'ERDIS maintains distinct rules for students entering through national IMAT vs Italian-language filter-semester programmes.',
  },
  {
    id: 'molise',
    name: 'Molise',
    capital: 'Campobasso',
    hasEnglishMedicine: true,
    isPendingAccreditation: true,
    englishDegrees: [
      'UNIEUROMED / Neuromed — Medicine & Surgery (Pozzilli campus) [Subject to official accreditation]',
    ],
    additionalContext: 'University of Molise offers Italian-taught Medicine in Campobasso.',
    providers: [
      { name: 'ESU Molise', referenceWindow: '23 Sep – 30 Oct 2026 (23:59)', officialUrl: 'https://esu.molise.it/avvisi-per-gli-studenti/news-avvisi.html' },
    ],
    caveat: 'The Neuromed English Medicine entry was registered “in fase di accreditamento”. Always confirm course activation before relying on scholarship aid.',
  },
  {
    id: 'piemonte',
    name: 'Piemonte',
    capital: 'Turin',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Turin (UniTo) — Medicine & Surgery in English (San Luigi Gonzaga, Orbassano campus)',
    ],
    additionalContext: 'The English medical school is located at Orbassano teaching hospital, outside central Turin.',
    providers: [
      { name: 'EDISU Piemonte', referenceWindow: '22 Jul – 4 Sep 2026 (12:00)', officialUrl: 'https://www.edisu.piemonte.it/novita/notices/richiesta-benefici-202627-pubblicazione-bando-di-concorso-e-avvio-procedura' },
    ],
    caveat: 'EDISU Piemonte manages student lodging, grants, and meal vouchers. Strict documentation dates apply for foreign-income students.',
  },
  {
    id: 'puglia',
    name: 'Puglia',
    capital: 'Bari',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Bari Aldo Moro — BEMC: Bari English Medical Curriculum (Bari)',
    ],
    additionalContext: 'Universities of Foggia and Salento offer other healthcare programmes.',
    providers: [
      { name: 'ADISU Puglia', referenceWindow: '14 Jul – 13 Aug 2026 (12:00)', officialUrl: 'https://adisupuglia.it/pagina106703_borse-di-studio.html/' },
    ],
    caveat: 'The mid-August cutoff applies to undergraduate and single-cycle students. Submit ISEE Parificato documentation promptly.',
  },
  {
    id: 'sardegna',
    name: 'Sardegna',
    capital: 'Cagliari',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Cagliari — Medicine & Surgery in English (Cagliari)',
    ],
    additionalContext: 'University of Sassari operates Italian-taught health degrees.',
    providers: [
      { name: 'ERSU Cagliari', referenceWindow: '10 Jul – 28 Aug 2026 (13:00)', officialUrl: 'https://www.ersucagliari.it/domande-frequenti/' },
      { name: 'ERSU Sassari', referenceWindow: '27 Jul – 7 Sep 2026 (13:00)', officialUrl: 'https://ersusassari.it/it/novita/notizia/Pubblicazione-Bando-Borse-di-Studio-e-Servizi-Abitativi-a.a.-2026-2027/' },
    ],
    caveat: 'Cagliari and Sassari have independent ERSU bodies with different cutoffs. Apply to the agency matching your university campus.',
  },
  {
    id: 'sicilia',
    name: 'Sicilia',
    capital: 'Palermo',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Messina (UniME) — Medicine & Surgery in English (Messina)',
      'University of Catania (UniCT) — Medicine & Surgery in English (Catania)',
    ],
    additionalContext: 'Palermo and Enna host Italian-taught medicine. Messina Dentistry is Italian-taught. Both Messina and Catania English Medicine are MUR Table B accredited.',
    providers: [
      { name: 'ERSU Messina', referenceWindow: '1 Jul – 18 Aug 2026 (14:00)', officialUrl: 'https://www.ersumessina.it/2026/07/01/bando-di-concorso-per-lattribuzione-di-borse-di-studio-altri-contributi-economici-e-servizi-per-il-diritto-allo-studio-universitario-per-la-a-2026-2027/' },
      { name: 'ERSU Catania', referenceWindow: '24 Jun – 10 Aug 2026 (14:00)', officialUrl: 'https://www.ersucatania.it/bando-di-concorso-per-lattribuzione-di-borse-di-studio-altri-contributi-economici-e-servizi-per-il-diritto-allo-studio-universitario-per-lanno-accademico-2026-27-sistema/' },
      { name: 'ERSU Palermo', referenceWindow: '5 Jun – 22 Jul 2026 (14:00)', officialUrl: 'https://www.ersupalermo.it/2026/06/05/bando-di-concorso-per-lattribuzione-di-borse-di-studio-altri-contributi-economici-e-servizi-per-il-diritto-allo-studio-universitario/' },
      { name: 'ERSU Enna', referenceWindow: '21 Jul – 7 Sep 2026 (14:00)', officialUrl: 'https://www.ersuenna.it/avviso-bando-di-concorso-per-borse-di-studio-altri-contributi-economici-e-servizi-a-a-2026-27/' },
    ],
    caveat: 'ERSU Messina officially accommodates students whose medical enrolment is confirmed after the initial deadline. Sicily has 4 autonomous ERSU boards.',
  },
  {
    id: 'toscana',
    name: 'Toscana',
    capital: 'Florence',
    hasEnglishMedicine: true,
    isPendingAccreditation: true,
    englishDegrees: [
      'University of Siena — Dentistry & Dental Prosthodontics in English (Siena)',
      'University of Florence — Medicine & Surgery in English (Florence) [Subject to MUR accreditation]',
    ],
    additionalContext: 'University of Pisa and others offer Italian-taught health programmes.',
    providers: [
      { name: 'DSU Toscana / ARDSU', referenceWindow: '20 Jul – 7 Sep 2026 (13:00)', officialUrl: 'https://www.dsu.toscana.it/it/-/borsa-di-studio-e-posto-alloggio-a.a.-2026-2027?p_l_back_url=%2Fit%2Fcerca%3Fcategory%3D4448881%26category%3D4460845%26delta%3D30%26start%3D6&p_l_back_url_title=Cerca' },
    ],
    caveat: 'DSU Toscana serves Florence, Pisa, and Siena. Foreign-income students must upload their translated/legalized consular declarations before the deadline.',
  },
  {
    id: 'trentino-alto-adige',
    name: 'Trentino-Alto Adige / Südtirol',
    capital: 'Trento / Bolzano',
    hasEnglishMedicine: true,
    englishDegrees: [
      'Università Cattolica del Sacro Cuore — Medicine & Surgery in English (Bolzano / Claudiana campus)',
    ],
    additionalContext: 'Provinces of Trento and Bolzano operate separate scholarship frameworks; Bolzano uses provincial DURP/VSE assessment, not standard ISEE.',
    providers: [
      { name: 'Opera Universitaria Trento', referenceWindow: '13 Jul – 7 Sep 2026', officialUrl: 'https://www.operauni.tn.it/it/news/bando-opera-2026-2027-apertura-domande/' },
      { name: 'Autonomous Province of Bolzano – University Grants', referenceWindow: '22 Sep – 3 Nov 2026 (12:00)', officialUrl: 'https://diritto-allo-studio.provincia.bz.it/it/news/borse-di-studio-universitarie-domanda-possibile-fino-al-3-novembre' },
    ],
    caveat: 'Bolzano evaluates economic status using its own provincial DURP/VSE rules. Do not assume the standard consular ISEE procedure applies.',
  },
  {
    id: 'umbria',
    name: 'Umbria',
    capital: 'Perugia',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'University of Perugia (Medicine and Dentistry, Italian-taught).',
    providers: [
      { name: 'ADiSU Umbria', referenceWindow: '15 Jul – 2 Sep 2026 (12:00)', officialUrl: 'https://www.adisu.umbria.it/concorso-borsa-di-studio/bando/2026-2027/bando-di-concorso-lassegnazione-di-borse-di-studio-e-altri' },
    ],
    caveat: 'ADiSU Umbria separates initial electronic application submission from post-deadline submission of certified foreign family documentation.',
  },
  {
    id: 'valle-daosta',
    name: 'Valle d’Aosta',
    capital: 'Aosta',
    hasEnglishMedicine: false,
    englishDegrees: [],
    additionalContext: 'University of Valle d’Aosta (no English Medicine/Dentistry courses listed in MUR Table B).',
    providers: [
      { name: 'Regione Autonoma Valle d’Aosta (VDA1/VDA2)', referenceWindow: '4 Dec 2026 (12:00)', officialUrl: 'https://www.regione.vda.it/istruzione/dirittostudio/borse_universita_valdostane/default_i.aspx' },
      { name: 'Valle d’Aosta Outside-Region Grants', referenceWindow: '4 Dec 2026 (12:00)', officialUrl: 'https://www.regione.vda.it/istruzione/dirittostudio/borse_universita_fuori_regione/default_i.aspx' },
    ],
    caveat: 'These schemes include residency and territorial eligibility criteria; they do not function as a blanket scholarship for all international students.',
  },
  {
    id: 'veneto',
    name: 'Veneto',
    capital: 'Venice',
    hasEnglishMedicine: true,
    englishDegrees: [
      'University of Padua — Medicine & Surgery in English (Venice campus)',
      'University of Padua — Medicine & Surgery / MedTech (Padua campus) [Subject to accreditation]',
    ],
    additionalContext: 'University of Verona offers medical courses (primarily Italian-taught).',
    providers: [
      { name: 'University of Padua – Regional DSU Grants', referenceWindow: 'Deadline: 30 Sep 2026', officialUrl: 'https://www.unipd.it/borse-studio-regionali?target=Futuri+studenti' },
      { name: 'University of Verona – DSU Aid', referenceWindow: 'Deadline: 30 Sep 2026 (13:00)', officialUrl: 'https://www.univr.it/it/i-nostri-servizi/futuri-studenti/borse-per-il-diritto-allo-studio' },
      { name: 'ESU Verona', referenceWindow: 'Specific calls; check category', officialUrl: 'https://www.esu.vr.it/en/2026/07/borse-di-studio-2026-2027/' },
    ],
    caveat: 'In Veneto, public university scholarships are administered directly through each university’s online portal (e.g. Uniweb at Padua), not a generic regional agency.',
  },
];

const FAQS = [
  {
    q: 'Can I apply for a regional scholarship before my IMAT admission result is published?',
    a: 'Yes! In fact, you MUST apply before the scholarship deadline, which often falls between July and September, even if IMAT rankings are released in October. Regional agencies allow prospective candidates to apply as "pre-enrolled" or "pending admission", and you will confirm your enrolment once your seat is assigned.',
  },
  {
    q: 'Does a higher IMAT score give me a bigger scholarship?',
    a: 'No. Italian regional scholarships (DSU, ERSU, EDISU, ER.GO) are primarily need-based financial aid, determined by your household income and assets (evaluated via ISEE Parificato). Your IMAT score determines university admission; your economic assessment determines scholarship entitlement.',
  },
  {
    q: 'Are scholarship deadlines and rules identical across all 20 regions?',
    a: 'No. Italy’s 20 administrative regions manage student welfare autonomously. For example, ER.GO (Emilia-Romagna) closes in late August, Lazio DiSCo in late July, and EDiSU Pavia in mid-September. Some regions like Sicily have 4 separate agencies (Messina, Catania, Palermo, Enna).',
  },
  {
    q: 'What is ISEE Parificato and how is it calculated for international students?',
    a: 'ISEE Parificato (Equivalent Economic Situation Indicator) calculates your family income and property held abroad converted into Euros. You must submit consular legalized/apostilled documents translated into Italian to an authorized CAF center in Italy to generate your certificate.',
  },
  {
    q: 'What are the 2026/27 national maximum economic thresholds?',
    a: 'Under Italian Ministerial Decree (MUR DD 176/2026), the national maximum thresholds are ISEE €28,339.88 and ISPE €61,608.48. Individual regional authorities may set slightly lower thresholds (e.g. Trento ISEE €26,000, Lombardia ISEE €26,887.93).',
  },
  {
    q: 'Can I combine a regional DSU scholarship with a MAECI government grant?',
    a: 'Generally no. Under Italian law, public university scholarships cannot be combined with other government-funded study grants for the same academic year. Furthermore, MAECI does not routinely cover standard 6-year single-cycle Medicine degrees.',
  },
];

export default function ScholarshipsHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'english' | 'pending'>('all');
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    sicilia: true,
    lombardia: true,
    campania: true,
    lazio: true,
    'emilia-romagna': true,
  });
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };
  const expandAllFaqs = () => setOpenFaqs(FAQS.map((_, i) => i));
  const collapseAllFaqs = () => setOpenFaqs([]);

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    REGIONS_DATA.forEach((r) => { all[r.id] = true; });
    setExpandedRegions(all);
  };

  const collapseAll = () => {
    setExpandedRegions({});
  };

  const filteredRegions = useMemo(() => {
    return REGIONS_DATA.filter((reg) => {
      // Category filter
      if (filterMode === 'english' && !reg.hasEnglishMedicine) return false;
      if (filterMode === 'pending' && !reg.isPendingAccreditation) return false;

      // Search filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const matchName = reg.name.toLowerCase().includes(q);
      const matchCapital = reg.capital.toLowerCase().includes(q);
      const matchDegrees = reg.englishDegrees.some((d) => d.toLowerCase().includes(q));
      const matchContext = reg.additionalContext.toLowerCase().includes(q);
      const matchProviders = reg.providers.some((p) => p.name.toLowerCase().includes(q));

      return matchName || matchCapital || matchDegrees || matchContext || matchProviders;
    });
  }, [searchTerm, filterMode]);

  return (
    <>
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
        {/* ── HERO BANNER ────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #022C22 0%, #064E3B 45%, #0B192C 100%)',
            color: '#FFFFFF',
            padding: '116px 20px 60px',
            borderBottom: '1px solid #1E293B',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glows */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '16px' }}>
              <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
              <span>›</span>
              <Link href="/universities" style={{ color: '#94A3B8', textDecoration: 'none' }}>Universities</Link>
              <span>›</span>
              <span style={{ color: '#5CED73', fontWeight: 600 }}>Scholarships</span>
            </div>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(92,237,115,0.15)', border: '1px solid rgba(92,237,115,0.35)', marginBottom: '16px' }}>
              <ShieldCheck size={14} color="#5CED73" />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                Italy Regional Scholarships Hub · 2026/27 Reference
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.18, letterSpacing: '-0.8px', margin: '0 0 16px 0', maxWidth: '880px' }}>
              Scholarships to Study Medicine &amp; Dentistry in Italy (2026/27)
            </h1>

            <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '820px', margin: '0 0 28px 0' }}>
              Comprehensive guide to public regional grants (DSU / ERSU / EDISU / ER.GO) across Italy’s 20 regions.
              Covering up to 100% of university tuition, free accommodation, subsidized meals, and annual cash stipends of up to €7,000+ for qualifying domestic and international candidates.
            </p>

            {/* 4 Compact Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', maxWidth: '960px' }}>
              {[
                { title: 'Regional Need-Based (DSU)', desc: 'Administered by regions (ER.GO, ERSU, EDISU) based on ISEE Parificato.' },
                { title: 'University & Merit Grants', desc: 'Direct tuition fee reductions from universities based on grades & exams.' },
                { title: 'Government / MAECI', desc: 'Italian Ministry of Foreign Affairs grants for specific international cohorts.' },
                { title: 'Housing & Canteen Subsidies', desc: 'Free or reduced student dormitory accommodation and daily meal allowances.' },
              ].map((c) => (
                <div key={c.title} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
                  <div style={{ color: '#FCD34D', fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px' }}>{c.title}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem', lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CRITICAL ELIGIBILITY CALLOUT ───────────────────────── */}
        <div className="container" style={{ marginTop: '-24px', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '300px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669' }}>
                <Info size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: '4px' }}>
                  National Maximum Economic Thresholds (MUR Decree DD 176/2026)
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>
                  National benchmark ceilings are <strong>ISEE €28,339.88</strong> and <strong>ISPE €61,608.48</strong>. Individual regional authorities may establish tighter local thresholds (e.g. Trento: €26,000; Lombardia: €26,887.93).
                </div>
              </div>
            </div>

            <button
              onClick={() => setLeadModalOpen(true)}
              style={{
                background: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 20px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(5,150,105,0.25)',
                whiteSpace: 'nowrap',
              }}
            >
              Verify My Documents <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* ── MAIN DIRECTORY: 20 REGIONS SEARCH & COLLAPSIBLE CARDS ── */}
        <div className="container" style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                Official Regional Directory
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 0 0', letterSpacing: '-0.5px' }}>
                Find Your Regional Scholarship Provider
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={expandAll}
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Tabs */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by region, university, campus (e.g. Messina, Pavia, ER.GO, Rome)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterMode('all')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterMode === 'all' ? '#059669' : '#F1F5F9',
                  color: filterMode === 'all' ? '#FFFFFF' : '#475569',
                }}
              >
                All 20 Regions
              </button>
              <button
                onClick={() => setFilterMode('english')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterMode === 'english' ? '#059669' : '#F1F5F9',
                  color: filterMode === 'english' ? '#FFFFFF' : '#475569',
                }}
              >
                MUR English Medicine Only
              </button>
              <button
                onClick={() => setFilterMode('pending')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterMode === 'pending' ? '#D97706' : '#F1F5F9',
                  color: filterMode === 'pending' ? '#FFFFFF' : '#475569',
                }}
              >
                Pending Accreditation
              </button>
            </div>
          </div>

          {/* Region Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredRegions.map((region) => {
              const isExpanded = !!expandedRegions[region.id];
              return (
                <div
                  key={region.id}
                  id={region.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1.5px solid',
                    borderColor: region.hasEnglishMedicine ? '#A7F3D0' : '#E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Card Header (Accordion trigger) */}
                  <div
                    onClick={() => toggleRegion(region.id)}
                    style={{
                      padding: '18px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isExpanded ? (region.hasEnglishMedicine ? '#F0FDF4' : '#F8FAFC') : '#FFFFFF',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: region.hasEnglishMedicine ? '#059669' : '#64748B',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}
                      >
                        {region.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                            {region.name}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                            ({region.capital})
                          </span>

                          {region.hasEnglishMedicine && (
                            <span
                              style={{
                                background: '#ECFDF5',
                                color: '#065F46',
                                border: '1px solid #A7F3D0',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                              }}
                            >
                              MUR English Medicine Available
                            </span>
                          )}

                          {region.isPendingAccreditation && (
                            <span
                              style={{
                                background: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #FCD34D',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                              }}
                            >
                              Accreditation Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                        {region.providers.length} provider{region.providers.length > 1 ? 's' : ''}
                      </span>
                      {isExpanded ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
                    </div>
                  </div>

                  {/* Card Expanded Content */}
                  {isExpanded && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid #E2E8F0' }}>
                      {/* English Medical Programmes if present */}
                      {region.englishDegrees.length > 0 && (
                        <div style={{ marginBottom: '18px' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                            MUR-Listed English Medicine &amp; Dentistry (2026/27)
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {region.englishDegrees.map((deg, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#0F172A', fontWeight: 600 }}>
                                <GraduationCap size={16} color="#059669" />
                                <span>{deg}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Additional Context */}
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Regional University Context
                        </div>
                        <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                          {region.additionalContext}
                        </p>
                      </div>

                      {/* Providers List */}
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          Regional Agency Notice &amp; 2026 Reference Schedule
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                          {region.providers.map((p, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '10px',
                                padding: '12px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '10px',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F172A' }}>{p.name}</div>
                                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                                  Ref. Window: <strong style={{ color: '#059669' }}>{p.referenceWindow}</strong>
                                </div>
                              </div>
                              <a
                                href={p.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: '#059669',
                                  textDecoration: 'none',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Official Notice <ExternalLink size={12} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Important Caveat */}
                      <div
                        style={{
                          background: '#FFFBEB',
                          border: '1px solid #FDE68A',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.82rem',
                          color: '#92400E',
                        }}
                      >
                        <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong>Crucial note:</strong> {region.caveat}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 6-STEP TIMELINE & ACTION ROADMAP ───────────────────── */}
        <div className="container" style={{ marginTop: '70px' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Strategic Application Roadmap
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginTop: '6px', letterSpacing: '-0.5px' }}>
              6 Steps to Securing Your Italian Medical Scholarship
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Identify Campus Geography', desc: 'Determine the exact geographic campus of your course (e.g. Bicocca English Medicine is in Bergamo, Parma is in Piacenza, Padua is in Venice).' },
              { step: '02', title: 'Check Official Regional Call', desc: 'Read the published bando for your region (June–July). Note opening dates, cutoff hours, and distinct housing deadlines.' },
              { step: '03', title: 'Prepare Consular Documents', desc: 'Assemble foreign family composition, annual tax returns, and property documents. Legalize/apostille and translate as required.' },
              { step: '04', title: 'Submit Online Application', desc: 'Register with the regional agency (ER.GO, ERSU, Lazio DiSCo) before deadline, even before IMAT scores are published.' },
              { step: '05', title: 'Verify Provisional Rankings', desc: 'Check rankings in September–October. If listed as “idoneo” (eligible) or if documents are missing, submit appeals promptly.' },
              { step: '06', title: 'Maintain Academic Progress', desc: 'Keep your scholarship into subsequent years by meeting annual CFU (university credit) milestones mandated by the regional call.' },
            ].map((s) => (
              <div key={s.step} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1.5px solid #E2E8F0', position: 'relative' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#A7F3D0', marginBottom: '8px' }}>{s.step}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DOCUMENTS CHECKLIST ────────────────────────────────── */}
        <div className="container" style={{ marginTop: '70px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)',
              borderRadius: '20px',
              padding: '40px',
              color: '#FFFFFF',
            }}
          >
            <div style={{ maxWidth: '650px', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#5CED73', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Essential Document Checklist
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
                Required Papers for International Applicants
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every regional agency requires authenticated proof of family financial standing. Prepare these early to avoid missing rigid summer cutoffs:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Valid Passport & Italian Codice Fiscale', desc: 'Official identity and Italian tax code assigned by consular authorities.' },
                { title: 'Family Composition Certificate', desc: 'Official registry statement detailing all members residing in the family household.' },
                { title: 'Annual Family Income Statement', desc: 'Gross annual income documentation for the preceding tax year for all working family members.' },
                { title: 'Real Estate & Property Documents', desc: 'Square footage of family home, or rental agreement indicating zero real estate holdings.' },
                { title: 'Bank Balances & Movable Assets', desc: 'Average balance statements as of 31 December of the reference tax assessment year.' },
                { title: 'Legal Translation & Consular Legalization', desc: 'Apostille or legalization stamp from Italian Embassy/Consulate in home country.' },
              ].map((doc, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5CED73', fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>
                    <FileCheck2 size={16} />
                    <span>{doc.title}</span>
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.5 }}>{doc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FREQUENTLY ASKED QUESTIONS ─────────────────────────── */}
        <div className="container" style={{ marginTop: '70px' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 30px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Got Questions?
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginTop: '6px', letterSpacing: '-0.5px' }}>
              Scholarship FAQs for International Medical Students
            </h2>
            {/* Expand / Collapse buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={expandAllFaqs}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronDown size={15} />
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAllFaqs}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  border: '1px solid #E2E8F0',
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronUp size={15} />
                Collapse All
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '860px', margin: '0 auto' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqs.includes(idx);
              return (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: isOpen ? '1px solid #10B981' : '1.5px solid #E2E8F0', overflow: 'hidden', transition: 'all 0.2s ease', boxShadow: isOpen ? '0 4px 16px -4px rgba(16, 185, 129, 0.15)' : 'none' }}>
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <HelpCircle size={18} color="#059669" style={{ flexShrink: 0 }} />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.4 }}>{faq.q}</h3>
                    </div>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isOpen ? '#ECFDF5' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={16} color="#059669" /> : <ChevronDown size={16} color="#64748B" />}
                    </div>
                  </button>
                  {isOpen && (
                    <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.65, margin: '0', padding: '0 22px 18px 50px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FINAL CTA CONSULTANCY BANNER ───────────────────────── */}
        <div className="container" style={{ marginTop: '70px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: '20px',
              padding: '44px 36px',
              textAlign: 'center',
              color: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid #334155',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#FFFFFF' }}>
              <Award size={24} />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 12px 0' }}>
              Need Help Understanding Your Scholarship Documents?
            </h2>

            <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Ahsora’s admissions mentors guide you through ISEE Parificato documentation, regional deadlines, and consular legalization for your target medical university in Italy.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setLeadModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '13px 28px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(5,150,105,0.4)',
                }}
              >
                Book 1-on-1 Scholarship Guidance <ArrowRight size={15} />
              </button>

              <Link
                href="/universities"
                style={{
                  color: '#CBD5E1',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Back to Universities Directory →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        defaultExam="IMAT (Italy Medical)"
        defaultCountry="Italy"
      />
    </>
  );
}
