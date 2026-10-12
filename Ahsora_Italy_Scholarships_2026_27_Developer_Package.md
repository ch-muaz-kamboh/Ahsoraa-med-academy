# Ahsora Meds Academy — Italy Scholarships Hub: developer handoff

**Reviewed:** 10 October 2026  
**Intended route:** `/universities/scholarships`  
**Companion file:** `italy_scholarships_hub_2026_27.html` (responsive, searchable static prototype).

## Critical distinctions

- Italy has 20 administrative regions, **not** one public scholarship provider per region. Sicily, Sardinia, Abruzzo, Calabria, Lombardy, Veneto and Trentino–Alto Adige in particular have multiple grant routes.
- Programme/campus geography must be used, **not** just university headquarters. Bicocca's English Medicine campus is Bergamo; Parma's is Piacenza; Padua's is Venice (plus a MedTech Padua course conditionally listed); Cattolica runs English Medicine in Rome and Bolzano.
- The 2026 English Medicine/Dentistry list is grounded in **MUR Decree 1005/2026 Table B**, and does **not** equate to all Italian-taught health degrees. Source: https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026 . Source PDF is available from that page (some public tools return 403 for its attachment). The MUR table explicitly indicates accreditation pending for Medicine in Florence, Padua MedTech and Pozzilli Neuromed; reconfirm the activation before displaying them as accepting students.
- **University admission/IMAT dates ≠ scholarship application dates ≠ housing dates ≠ additional-document dates.** Never display a generic 'university application closes' date under a region. Link back to each individual university admission profile.
- 2026/27 national **maximum** ISEE €28,339.88 and ISPE €61,608.48 (MUR DD 176/2026). Individual providers may use lower caps (e.g. Trento ISEE €26,000 / ISPE €52,000; Lombardia ISEE €26,887.93 / ISPE €58,452.06). Official: https://www.mur.gov.it/it/atti-e-normativa/decreto-direttoriale-n-176-del-10-02-2026 ; https://www.operauni.tn.it/it/bandiborse/bando-borse-di-studio-posto-alloggio-esonero-tasse-a-a-2026-2027/ ; https://www.regione.lombardia.it/istruzione-formazione-e-lavoro/universita-e-formazione-accademica/borse-di-studio-universitarie-2026-2027
- Scholarships are need-based with eligibility/progress rules, *not* automatic prizes for a high IMAT score. First-year academic criteria for keeping a grant can differ from subsequent-year CFU requirements. Do not promise automatic awards, free tuition at any private university, or visa approval.
- ISEE Universitario/ISEE Parificato: foreign-income applicants may need original foreign family income/property documents, translation/legalization/apostille **as applicable to the particular provider and country**. Do not state a universal document list or authentication type; province Bolzano uses DURP/VSE.
- MAECI is a distinct government programme with course-level eligibility; its 2026/27 call must **not** be advertised as a routine scholarship covering a newly enrolling six-year Medicine degree. Official: https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/borsestudio_stranieri/
- Private institutions are not necessarily covered by the public DSU call on the same terms. Link applicants to the institution's own grants / fee office.

## Page layout, from top to bottom

1. Breadcrumb `Home > Universities > Scholarships` and strong H1: `Scholarships to Study Medicine & Dentistry in Italy (2026/27)`.
2. One-paragraph plain-English introduction and four compact categories: regional need-based, university/merit, government/MAECI, other programmes.
3. One concise line on eligibility; national *maxima* shown with disclaimer, not a blanket requirement.
4. Most prominent section: `Find your regional scholarship`: search by region, university, campus or provider; filter `All regions / MUR-listed English Medicine/Dentistry / No listed English course`; 20 collapsible provider cards. Do not put 20 full-length essays in a page-length wall of text.
5. Each region card shows: regional name, exact MUR 2026 English Medicine/Dentistry entries where present (flag accreditation), example Italian programmes where applicable, **each** agency's verified 2026 reference window, official website link, concise caveat.
6. Steps: identify campus -> check official 2026/27 scholarship call -> prepare documents -> apply online before deadline -> check rankings and follow-up requests -> keep academic eligibility.
7. International student documents: passport/ID, tax code if obtained, admission/enrolment details, correct family composition, income/property docs, ISEE/ISEE parificato/DURP as applicable, translations/legalization if requested, accommodation contract for off-site category when required, correct bank account when asked.
8. Short FAQ: can I apply before admission? does IMAT score determine grant? are all regions the same? is a grant guaranteed? can I combine MAECI? English Medicine vs Italian filter-semester distinction.
9. Under each provider card show last checked and an outbound link to the official current notice. Disclose that the 2026 dates are *reference information* and do **not** predict 2027 windows.
10. Practical CTA: `Need help understanding your scholarship documents?` -> existing internal consultancy contact page (replace placeholder with a verified site route before launch). No exaggerated guarantee.

## International/SEO implementation

- SEO title: `Italy Regional Scholarships 2026/27 for Medicine & Dentistry | Ahsora Meds`.
- Meta description: `Compare regional scholarships in Italy's 20 regions: EDISU, ERSU, DSU Toscana, Lazio DiSCo, ER.GO and more. Find 2026/27 deadlines, eligibility and official links.`
- Suggested canonical after production: your **final production domain** + `/universities/scholarships`, not a staging Vercel URL. Single H1; H2 for main sections; native `<details>` / `<summary>` supported; permanent `/universities/scholarships#region-slug` anchors for deep linking.
- Render all 20 region entries **server-side as crawlable HTML**. Filtering should hide/show existing markup, not load data only client-side. Link from each matching university profile into this hub with region anchor (e.g. `/universities/scholarships#sicilia` from Messina); link back to university profiles with precise programme/campus context.
- Add BreadcrumbList schema after the real domain is decided. FAQPage schema should only be used if Google eligibility requirements and visible FAQ content match; it does not guarantee rich results. Avoid fabricated review, rating, grant availability or remaining-time badges. Update sitemap and sitemap `lastmod` only when content materially changes.
- External `Official call` links should open in new tab with `rel="noopener noreferrer"` and be periodically reverified. Put `Last reviewed: 10 October 2026` on page and individual dates labeled `2026/27 reference`.
- The current `/universities` staging page could not be accessed in the research environment; verify your actual links and visual tokens directly before merging.

## Recommended maintenance

Store entries as structured records (`region`, `campus`, `programmeLanguage`, `provider`, `cycleYear`, `opening`, `closing`, `timezone`, `specialCategory`, `officialUrl`, `sourceCheckedAt`, `status`). A named content editor should audit every link monthly during June–November, and weekly during application windows. Set any 2027 deadline to `Not yet announced` until a 2027/28 official notice explicitly confirms it. Mark any new programme as `Pending accreditation` until university/MUR confirmation.

## Scholarship provider directory — 2026/27 historical reference dates

*Every date below concerns the 2026/27 application cycle; do not silently reuse for 2027/28.*

### Abruzzo

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** University of L’Aquila; G. d’Annunzio University of Chieti–Pescara (mainly Italian-taught Medicine / Dentistry, subject to current course listings).  
- **ADSU L’Aquila:** 16 Jul–31 Aug 2026. Official/source: https://adsuaq.org/2026/07/16/bando-borse-di-studio-a-a-2026-2027/
- **ADSU Teramo:** 30 Jul–7 Sep 2026. Official/source: https://www.adsuteramo.it/archivio10_galleria-immagini_0_500_13_8.html
- **ADSU Chieti–Pescara:** Check the relevant ADSU call. Official/source: https://www.adsuchietipescara.it/

**Important:** There is no single Abruzzo scholarship deadline. Check which of the three ADSU bodies serves your university. Teramo is listed as a scholarship-provider example, not a claim of a 2026 English Medicine programme.

### Basilicata

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** University of Basilicata and other eligible local institutions; verify individual degree offerings.  
- **ARDSU Basilicata:** 24 Aug–2 Oct 2026. Official/source: https://agr.regione.basilicata.it/post/ardsu-borse-di-studio-da-oggi-il-via-alle-domande/

**Important:** Check the local university programme and application conditions separately; no English Medicine/Dentistry entry is listed in the MUR 2026 English admissions table.

### Calabria

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** Magna Graecia University of Catanzaro (Medicine/Dentistry, Italian); University of Calabria (check active medical courses).  
- **Fondazione Università Magna Graecia:** 2026 call: deadline 8 Sep, 12:00. Official/source: https://www.fondazioneumg.it/servizi/notizie/notizie_fase02.aspx?ID=9677
- **University of Calabria – Centro Residenziale:** First-year single-cycle: 9 Jul–6 Aug 2026; other cohorts differ. Official/source: https://soscr.unical.it/Default.aspx?tabid=47
- **Mediterranea University of Reggio Calabria – DSU:** 6 Jul–30 Sep 2026. Official/source: https://www.unirc.it/studiare/diritto-allo-studio/scadenze-le-domande

**Important:** Several university-linked schemes operate in Calabria. Choose the provider linked to your enrolled institution, not a generic “Calabria scholarship”.

### Campania

**MUR-listed English Medicine/Dentistry (2026/27):** University of Campania Luigi Vanvitelli — Medicine (Naples); University of Naples Federico II — Medicine (Naples).  
**Additional university context:** Other Medicine/Dentistry programmes in the region may be Italian-taught.  
- **ADISURC Campania:** 24 Jul–10 Sep 2026, 12:00 deadline. Official/source: https://adisurcampania.it/notizie/approvazione-bando-di-concorso-20262027

**Important:** Both named English Medicine programmes were listed in the national MUR 2026/27 admissions table.

### Emilia-Romagna

**MUR-listed English Medicine/Dentistry (2026/27):** University of Bologna — Medicine (Bologna); University of Parma — Medicine (Piacenza campus).  
**Additional university context:** Universities of Ferrara and Modena/Reggio Emilia have other medical programmes; verify language.  
- **ER.GO:** 2026 scholarship deadline: 24 Aug, 16:00. Official/source: https://www.er-go.it/cosa-fare-per/bandi-di-concorso/leggi-il-bando

**Important:** ER.GO publishes separate deadlines for housing and other benefits; the 24 August date above is the ordinary scholarship submission deadline.

### Friuli Venezia Giulia

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** University of Trieste and University of Udine (check current Italian-taught Medicine/Dentistry programmes).  
- **ARDiS FVG:** Opened 15 Jul 2026; deadline depends on benefit. Official/source: https://www.ardis.fvg.it/contenuti.php?id=268&view=page

**Important:** ARDiS explicitly distinguishes deadlines by benefit and publishes a separate schedule. Do not infer the last day from the opening date.

### Lazio

**MUR-listed English Medicine/Dentistry (2026/27):** Sapienza University of Rome — Medicine; Dentistry; University of Rome Tor Vergata — Medicine (Rome campus); Università Cattolica del Sacro Cuore — Medicine (Rome); UniCamillus — Medicine (Rome); Campus Bio-Medico University of Rome — Medicine / MedTech; Other private medicine providers: verify institution and provider-specific aid.  
**Additional university context:** Tor Vergata also has a Tirana campus listed by MUR: Albania is not a Lazio study location.  
- **Lazio DiSCo:** 10 Jun–23 Jul 2026, 20:00 (extended initial window). Official/source: https://laziodisco.it/prorogato-alle-ore-2000-del-23-luglio-il-termine-di-presentazione-delle-domande/

**Important:** Lazio DiSCo is the main public DSU contact. Private-university participation and tuition coverage require verification in the current call; do not promise full private tuition coverage.

### Liguria

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** University of Genoa (Medicine and Dentistry programmes in Italian, check current catalogue).  
- **ALiSEO Liguria:** 15 Jun–31 Jul 2026. Official/source: https://www.aliseo.liguria.it/benefici-economici-universitari/borsa-di-studio-universitaria/faq/

**Important:** ALiSEO is the regional reference for eligible Genoa students. No entry for English Medicine/Dentistry appears in MUR’s 2026/27 table.

### Lombardia

**MUR-listed English Medicine/Dentistry (2026/27):** University of Milan — Medicine (Milan); University of Milano-Bicocca — Medicine (Bergamo campus); University of Pavia — Medicine (Pavia); Humanitas University — Medicine (Pieve Emanuele); Vita-Salute San Raffaele University — Medicine (Milan).  
**Additional university context:** Private university grants and provincial services can follow different rules; Cattolica’s English Medicine campuses are in Rome and Bolzano, not Milan.  
- **University of Milan – DSU:** 10 Jul–30 Sep 2026. Official/source: https://www.unimi.it/it/studiare/borse-premi-mense-e-alloggi/borse-di-studio-regionali
- **Milano-Bicocca – DSU:** 7 Jul–30 Sep 2026. Official/source: https://www.unimib.it/studiare/servizi-studenti-e-laureati/diritto-allo-studio-contribuzione-studentesca-150-ore/benefici-diritto-allo-studio
- **EDiSU Pavia:** 2026 deadline: 15 Sep, 15:00. Official/source: https://www.edisu.pv.it/servizi/borsa-di-studio-ordinaria/

**Important:** Lombardy does not have one universal application form for all universities. Humanitas and San Raffaele applicants must check their own university aid pages and current DSU eligibility.

### Marche

**MUR-listed English Medicine/Dentistry (2026/27):** Università Politecnica delle Marche — Medicine (Ancona).  
**Additional university context:** Other Medicine/Dentistry programmes may be Italian-taught.  
- **ERDIS Marche:** 13 Jul–28 Aug 2026. Official/source: https://erdis.it/servizi/servizio-dettaglio/3161252

**Important:** ERDIS has special provisions for students on the Italian-language open/filter-semester route; these are not the ordinary English-Medicine IMAT procedure.

### Molise

**MUR-listed English Medicine/Dentistry (2026/27):** UNIEUROMED / Neuromed — Medicine (Pozzilli), MUR-listed subject to accreditation.  
**Additional university context:** University of Molise (Italian-taught Medicine, subject to programme catalogue).  
- **ESU Molise:** 23 Sep–30 Oct 2026, 23:59 deadline. Official/source: https://esu.molise.it/avvisi-per-gli-studenti/news-avvisi.html

**Important:** Important: the new Neuromed English Medicine course was marked “in fase di accreditamento” in the MUR 2026 table. Its accreditation, activation and ESU eligibility must be checked before an application recommendation.

### Piemonte

**MUR-listed English Medicine/Dentistry (2026/27):** University of Turin — Medicine (Orbassano campus).  
**Additional university context:** Other regional medical courses may be Italian-taught.  
- **EDISU Piemonte:** 22 Jul–4 Sep 2026, 12:00. Official/source: https://www.edisu.piemonte.it/novita/notices/richiesta-benefici-202627-pubblicazione-bando-di-concorso-e-avvio-procedura

**Important:** The English Medicine campus is Orbassano, within Piemonte; do not label it as central Turin.

### Puglia

**MUR-listed English Medicine/Dentistry (2026/27):** University of Bari Aldo Moro — Medicine (Bari).  
**Additional university context:** Universities of Foggia and Salento may host other health courses; check language and course activation.  
- **ADISU Puglia:** 14 Jul–13 Aug 2026, 12:00 deadline. Official/source: https://adisupuglia.it/pagina106703_borse-di-studio.html/

**Important:** The 2026 date listed is for undergraduate and single-cycle degrees, not the separate doctoral deadline.

### Sardegna

**MUR-listed English Medicine/Dentistry (2026/27):** University of Cagliari — Medicine (Cagliari).  
**Additional university context:** University of Sassari has other medical programmes; check teaching language.  
- **ERSU Cagliari:** 10 Jul–28 Aug 2026, 13:00 deadline. Official/source: https://www.ersucagliari.it/domande-frequenti/
- **ERSU Sassari:** 27 Jul–7 Sep 2026, 13:00 deadline. Official/source: https://ersusassari.it/it/novita/notizia/Pubblicazione-Bando-Borse-di-Studio-e-Servizi-Abitativi-a.a.-2026-2027/

**Important:** Cagliari and Sassari have different application deadlines. Apply to the appropriate ERSU.

### Sicilia

**MUR-listed English Medicine/Dentistry (2026/27):** University of Messina — Medicine (Messina); University of Catania — Medicine (Catania).  
**Additional university context:** Palermo and Enna universities have additional programmes; an English Medicine entry for these campuses is not listed in the MUR 2026 table. Messina Dentistry is not listed as an English-taught 2026 course.  
- **ERSU Messina:** 1 Jul–18 Aug 2026, 14:00 (OTP deadline 15:00). Official/source: https://www.ersumessina.it/2026/07/01/bando-di-concorso-per-lattribuzione-di-borse-di-studio-altri-contributi-economici-e-servizi-per-il-diritto-allo-studio-universitario-per-la-a-2026-2027/
- **ERSU Catania:** 24 Jun–10 Aug 2026, 14:00. Official/source: https://www.ersucatania.it/bando-di-concorso-per-lattribuzione-di-borse-di-studio-altri-contributi-economici-e-servizi-per-il-diritto-allo-studio-universitario-per-lanno-accademico-2026-27-sistema/
- **ERSU Palermo:** 5 Jun–22 Jul 2026, 14:00. Official/source: https://www.ersupalermo.it/2026/06/05/bando-di-concorso-per-lattribuzione-di-borse-di-studio-altri-contributi-economici-e-servizi-per-il-diritto-allo-studio-universitario/
- **ERSU Enna:** 21 Jul–7 Sep 2026, 14:00. Official/source: https://www.ersuenna.it/avviso-bando-di-concorso-per-borse-di-studio-altri-contributi-economici-e-servizi-a-a-2026-27/

**Important:** ERSU Messina’s official 2026/27 call includes applicants who complete enrollment later, including Medicine/Dentistry. ERSU Catania’s news announcement contains a typographical “2025” date; its 2026/27 signed PDF confirms 10 August 2026.

### Toscana

**MUR-listed English Medicine/Dentistry (2026/27):** University of Siena — Dentistry (Siena); University of Florence — Medicine (Florence), MUR-listed subject to accreditation.  
**Additional university context:** University of Pisa and others offer Italian-taught medical programmes; verify current catalogues.  
- **DSU Toscana / ARDSU:** 20 Jul–7 Sep 2026, 13:00 (single-cycle degree). Official/source: https://www.dsu.toscana.it/it/-/borsa-di-studio-e-posto-alloggio-a.a.-2026-2027?p_l_back_url=%2Fit%2Fcerca%3Fcategory%3D4448881%26category%3D4460845%26delta%3D30%26start%3D6&p_l_back_url_title=Cerca

**Important:** Florence’s new English Medicine entry was conditional on accreditation in MUR’s 2026 seat table. Check activation independently.

### Trentino-Alto Adige / Südtirol

**MUR-listed English Medicine/Dentistry (2026/27):** Università Cattolica del Sacro Cuore — Medicine (Bolzano / Claudiana campus).  
**Additional university context:** University of Trento has other medicine-related study options (verify language); the provinces of Trento and Bolzano have separate grant systems.  
- **Opera Universitaria Trento:** 13 Jul–7 Sep 2026 (scholarship); housing earlier. Official/source: https://www.operauni.tn.it/it/news/bando-opera-2026-2027-apertura-domande/
- **Autonomous Province of Bolzano – university study grants:** 22 Sep–3 Nov 2026, 12:00. Official/source: https://diritto-allo-studio.provincia.bz.it/it/news/borse-di-studio-universitarie-domanda-possibile-fino-al-3-novembre

**Important:** Bolzano uses its provincial DURP/VSE assessment system, not automatically the same ISEE procedure as ordinary DSU. Cattolica confirms an active Bolzano English Medicine 2026/27 course, while one Claudiana page already advertises 2027/28 new applications.

### Umbria

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** University of Perugia (Medicine and Dentistry, generally Italian-taught in 2026/27).  
- **ADiSU Umbria:** 15 Jul–2 Sep 2026, 12:00. Official/source: https://www.adisu.umbria.it/concorso-borsa-di-studio/bando/2026-2027/bando-di-concorso-lassegnazione-di-borse-di-studio-e-altri

**Important:** ADiSU separates the scholarship submission deadline from later deadlines for certain foreign-income documents and registered accommodation contracts.

### Valle d’Aosta

**MUR-listed English Medicine/Dentistry (2026/27):** None in MUR Table B.  
**Additional university context:** No English Medicine/Dentistry campus in the national MUR 2026/27 list. University of Valle d’Aosta has other programmes.  
- **Autonomous Region of Valle d’Aosta — VDA1/VDA2:** 2026 deadline: 4 Dec, 12:00 (specific VDA calls). Official/source: https://www.regione.vda.it/istruzione/dirittostudio/borse_universita_valdostane/default_i.aspx
- **Valle d’Aosta grants for eligible residents studying outside the region:** 2026 deadline: 4 Dec, 12:00. Official/source: https://www.regione.vda.it/istruzione/dirittostudio/borse_universita_fuori_regione/default_i.aspx

**Important:** These grants may have regional-residency or campus restrictions. They are not a generic scholarship available to every international student elsewhere in Italy.

### Veneto

**MUR-listed English Medicine/Dentistry (2026/27):** University of Padua — Medicine (Venice campus); University of Padua — Medicine/MedTech (Padua campus), MUR-listed subject to accreditation.  
**Additional university context:** University of Verona offers Medicine/Dentistry programmes (primarily Italian-taught).  
- **University of Padua – Regional Scholarships:** 2026 deadline: 30 Sep (Uniweb RdA + ISEE/ISEE parificato). Official/source: https://www.unipd.it/borse-studio-regionali?target=Futuri+studenti
- **University of Verona – DSU:** 2026 deadline: 30 Sep, 13:00. Official/source: https://www.univr.it/it/i-nostri-servizi/futuri-studenti/borse-per-il-diritto-allo-studio
- **ESU accommodation / other services:** Different deadlines and applicant groups; check local ESU. Official/source: https://www.esu.vr.it/en/2026/07/borse-di-studio-2026-2027/

**Important:** Critical exception: ESU Verona’s separate 2026/27 scholarship call is for Fine Arts/Conservatory students; University of Verona students apply for DSU through their university. Padua’s regional scholarship is also university-administered.

## Publication checklist

- [ ] Reconcile site university entries with the official MUR English 2026 admission table and each academic programme/campus location.
- [ ] For 2026/27 pending-accreditation campuses, verify final status; do not imply unconditional eligibility.
- [ ] Verify provider link accessibility, private-university participation, first-year vs subsequent-year rules, and later document cutoffs.
- [ ] Check 2026/27 funding amounts against the *specific* notice, rather than publishing one universally valid grant amount.
- [ ] Confirm verified internal links and official logo/brand colors on staging; test mobile, keyboard support, search filtering, empty-state and structured-data validity.
- [ ] Publish 2027/28 dates only after individual official notices appear, with a fresh review date.
