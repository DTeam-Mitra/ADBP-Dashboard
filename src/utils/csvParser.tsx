// --- CSV Parser Utility ---
// This utility parses the CSV data into a structured format for easier access in components.
export interface CSVData {
  sno: number;
  districtName: string;
  districtLGDCode: number;
  blockName: string;
  blockLGDCode: number;
  health: {
    ancRegistration: number;
    institutionalDeliveries: number;
    lowBirthWeight: number;
    nqasCertified: number;
    hypertensionScreening: number;
    diabetesScreening: number;
    tbTreatmentSuccess: number;
    compositeScore: number;
    rank: number;
  };
  nutrition: {
    pregnantWomenSN: number;
    childrenSN: number;
    measurementEfficiency: number;
    samChildren: number;
    mamChildren: number;
    toiletsAWC: number;
    drinkingWaterAWC: number;
    compositeScore: number;
    rank: number;
  };
  basicInfra: {
    tapWaterConnections: number;
    odfPlus: number;
    bharatNet: number;
    liveBharatNet: number;
    pmayG: number;
    compositeScore: number;
    rank: number;
  };
  socialDevelopment: {
    shgHouseholds: number;
    revolvingFund: number;
    bankingTouchPoints: number;
    digitalCertification: number;
    compositeScore: number;
    rank: number;
  };
  education: {
    boysTransitionUS: number;
    girlsTransitionUS: number;
    boysTransitionSHS: number;
    girlsTransitionSHS: number;
    ptrSchools: number;
    girlsToilets: number;
    trainedTeachers: number;
    boysMarksX: number;
    girlsMarksX: number;
    boysMarksXII: number;
    girlsMarksXII: number;
    compositeScore: number;
    rank: number;
  };
  agriculture: {
    fpoFormed: number;
    soilHealthCards: number;
    pmKisanBeneficiaries: number;
    animalVaccination: number;
    groundWaterExtraction: number;
    compositeScore: number;
    rank: number;
  };
  balancedCompositeScore: number;
  [key: string]: any; // For any additional fields that may be present
}

// Function to parse CSV data
export const parseCSVData = (csvText: string): CSVData[] => {
  // 1) Strip BOM, normalize line endings
  const clean = csvText.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.trim().length > 0);

  if (!lines.length) {
    console.warn('[parseCSVData] no lines!');
    return [];
  }

  // 2) Find the index of the first data row:
  //    a line that starts with a quoted digit:  "1",  "2", ...
  const dataStartIdx = lines.findIndex(l => /^"\d+"/.test(l));
  if (dataStartIdx < 0) {
    console.warn('[parseCSVData] no data rows detected – falling back to skipping header only');
  }
  // If we didn’t detect via regex, skip exactly 1 line (the header)
  const sliceIdx = dataStartIdx >= 0 ? dataStartIdx : 1;
  const dataLines = lines.slice(sliceIdx);

  console.log(`[parseCSVData] slicing at line ${sliceIdx}, remaining ${dataLines.length} lines`);

  const data: CSVData[] = [];

  dataLines.forEach((line, idx) => {
    // split on comma, then strip surrounding quotes
    const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));

    if (values.length < 58) {
      console.warn(
        `[parseCSVData] skipping line ${idx} (got ${values.length} cols, expected ≥58):`,
        line
      );
      return;
    }

    const row: CSVData = {
      sno:                    parseFloat(values[0])  || 0,
      stateName:              '',                   // no state in this CSV
      stateLGDCode:           0,
      districtName:           values[1]              || '',
      districtLGDCode:        parseFloat(values[2])  || 0,
      blockName:              values[3]              || '',
      blockLGDCode:           parseFloat(values[4])  || 0,

      health: {
        ancRegistration:        parseFloat(values[5])  || 0,
        institutionalDeliveries:parseFloat(values[6])  || 0,
        lowBirthWeight:         parseFloat(values[7])  || 0,
        nqasCertified:          parseFloat(values[8])  || 0,
        hypertensionScreening:  parseFloat(values[9])  || 0,
        diabetesScreening:      parseFloat(values[10]) || 0,
        tbTreatmentSuccess:     parseFloat(values[11]) || 0,
        compositeScore:         parseFloat(values[12]) || 0,
        rank:                   parseFloat(values[13]) || 0,
      },

      nutrition: {
        pregnantWomenSN:        parseFloat(values[14]) || 0,
        childrenSN:             parseFloat(values[15]) || 0,
        measurementEfficiency:  parseFloat(values[16]) || 0,
        samChildren:            parseFloat(values[17]) || 0,
        mamChildren:            parseFloat(values[18]) || 0,
        toiletsAWC:             parseFloat(values[19]) || 0,
        drinkingWaterAWC:       parseFloat(values[20]) || 0,
        compositeScore:         parseFloat(values[21]) || 0,
        rank:                   parseFloat(values[22]) || 0,
      },

      basicInfra: {
        tapWaterConnections:    parseFloat(values[23]) || 0,
        odfPlus:                parseFloat(values[24]) || 0,
        bharatNet:              parseFloat(values[25]) || 0,
        liveBharatNet:          parseFloat(values[26]) || 0,
        pmayG:                  parseFloat(values[27]) || 0,
        compositeScore:         parseFloat(values[28]) || 0,
        rank:                   parseFloat(values[29]) || 0,
      },

      socialDevelopment: {
        shgHouseholds:          parseFloat(values[30]) || 0,
        revolvingFund:          parseFloat(values[31]) || 0,
        bankingTouchPoints:     parseFloat(values[32]) || 0,
        digitalCertification:   parseFloat(values[33]) || 0,
        compositeScore:         parseFloat(values[34]) || 0,
        rank:                   parseFloat(values[35]) || 0,
      },

      education: {
        boysTransitionUS:       parseFloat(values[36]) || 0,
        girlsTransitionUS:      parseFloat(values[37]) || 0,
        boysTransitionSHS:       parseFloat(values[38]) || 0,
        girlsTransitionSHS:     parseFloat(values[39]) || 0,
        ptrSchools:             parseFloat(values[40]) || 0,
        girlsToilets:           parseFloat(values[41]) || 0,
        trainedTeachers:        parseFloat(values[42]) || 0,
        boysMarksX:             parseFloat(values[43]) || 0,
        girlsMarksX:            parseFloat(values[44]) || 0,
        boysMarksXII:           parseFloat(values[45]) || 0,
        girlsMarksXII:          parseFloat(values[46]) || 0,
        compositeScore:         parseFloat(values[47]) || 0,
        rank:                   parseFloat(values[48]) || 0,
      },

      agriculture: {
        fpoFormed:              parseFloat(values[49]) || 0,
        soilHealthCards:        parseFloat(values[50]) || 0,
        pmKisanBeneficiaries:   parseFloat(values[51]) || 0,
        animalVaccination:      parseFloat(values[52]) || 0,
        groundWaterExtraction:  parseFloat(values[53]) || 0,
        compositeScore:         parseFloat(values[54]) || 0,
        rank:                   parseFloat(values[55]) || 0,
      },

      balancedCompositeScore: parseFloat(values[56]) || 0,
    };

    data.push(row);
  });

  return data;
};



// --- Static Data Definitions ---
export const THEMES = {
  health: {
    name: 'Health',
    indicators: {
      ancRegistration: 'ANC Registration',
      institutionalDeliveries: 'Institutional Deliveries',
      lowBirthWeight: 'Low Birth Weight',
      nqasCertified: 'NQAS Certified Facilities',
      hypertensionScreening: 'Hypertension Screening',
      diabetesScreening: 'Diabetes Screening',
      tbTreatmentSuccess: 'TB Treatment Success Rate'
    }
  },
  nutrition: {
    name: 'Nutrition',
    indicators: {
      pregnantWomenSN: 'Pregnant Women under Supplementary Nutrition',
      childrenSN: 'Children under Supplementary Nutrition',
      measurementEfficiency: 'Measurement Efficiency in AWCs',
      samChildren: '% Severe Acute Malnourished (SAM) Children',
      mamChildren: '% Moderate Acute Malnourished (MAM) Children',
      toiletsAWC: 'AWCs with Toilets',
      drinkingWaterAWC: 'AWCs with Drinking Water'
    }
  },
  basicInfra: {
    name: 'Basic Infrastructure',
    indicators: {
      tapWaterConnections: 'Tap Water Connections',
      odfPlus: 'ODF Plus Villages',
      bharatNet: 'BharatNet Connectivity',
      liveBharatNet: 'Live BharatNet Connections',
      pmayG: 'PMAY-G Houses Completed'
    }
  },
  socialDevelopment: {
    name: 'Social Development',
    indicators: {
      shgHouseholds: 'Households in Self-Help Groups (SHGs)',
      revolvingFund: 'Revolving Fund Utilization',
      bankingTouchPoints: 'Banking Touch Points',
      digitalCertification: 'Digital Literacy Certifications'
    }
  },
  education: {
    name: 'Education',
    indicators: {
      boysTransitionUS: 'Boys Transition Rate (U.P to Sec.)',
      girlsTransitionUS: 'Girls Transition Rate (U.P to Sec.)',
      boysTransitionSHS: 'Boys Transition Rate (Sec. to Hr. Sec.)',
      girlsTransitionSHS: 'Girls Transition Rate (Sec. to Hr. Sec.)',
      ptrSchools: 'Pupil-Teacher Ratio in Schools',
      girlsToilets: 'Schools with Girls Toilets',
      trainedTeachers: 'Schools with Trained Teachers',
      boysMarksX: 'Average Marks in Class X (Boys)',
      girlsMarksX: 'Average Marks in Class X (Girls)',
      boysMarksXII: 'Average Marks in Class XII (Boys)',
      girlsMarksXII: 'Average Marks in Class XII (Girls)'
    }
  },
  agriculture: {
    name: 'Agriculture & Allied Activities',
    indicators: {
      fpoFormed: 'Farmer Producer Organizations Formed',
      soilHealthCards: 'Soil Health Cards Distributed',
      pmKisanBeneficiaries: 'PM-KISAN Beneficiaries',
      animalVaccination: 'Animal Vaccination Coverage',
      groundWaterExtraction: 'Ground Water Extraction Rate'
    }
  }
};

// --- Indicator Details ---
export const INDICATOR_DETAILS = {
  ancRegistration: {
    desc: 'Percentage of pregnant women registered for ANC within the first trimester.',
    Intervention: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) - Janani Suraksha Yojana (JSY)',
    sdg: '3.1 - Reduce maternal mortality'
  },
  institutionalDeliveries: {
    desc: 'Percentage of institutional deliveries against total reported deliveries.',
    Intervention: 'Janani Suraksha Yojana (JSY) - Janani Shishu Suraksha Karyakram (JSSK)',
    sdg: '3.1 - Reduce maternal mortality'
  },
  lowBirthWeight: {
    desc: 'Percentage of low-birth weight babies (less than 2500g). Lower is better.',
    Intervention: 'Integrated Child Development Services (ICDS) - Poshan Abhiyaan',
    sdg: '2.2 - End malnutrition'
  },
  nqasCertified: {
    desc: 'Percentage of NQAS certified facilities in Block.',
    Intervention: 'National Quality Assurance Standards (NQAS) Program',
    sdg: '3.8 - Achieve universal health coverage'
  },
  hypertensionScreening: {
    desc: 'Percentage of persons screened for Hypertension.',
    Intervention: 'Ayushman Bharat - Health and Wellness Centres (AB-HWC)',
    sdg: '3.4 - Reduce premature mortality from NCDs'
  },
  diabetesScreening: {
    desc: 'Percentage of persons screened for Diabetes.',
    Intervention: 'Ayushman Bharat - Health and Wellness Centres (AB-HWC)',
    sdg: '3.4 - Reduce premature mortality from NCDs'
  },
  tbTreatmentSuccess: {
    desc: 'Percentage of TB cases treated successfully.',
    Intervention: 'National Tuberculosis Elimination Programme (NTEP)',
    sdg: '3.3 - End epidemics of communicable diseases'
  },
  pregnantWomenSN: {
    desc: 'Percentage of pregnant women taking Supplementary Nutrition.',
    Intervention: 'Integrated Child Development Services (ICDS) - Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    sdg: '2.2 - End malnutrition'
  },
  childrenSN: {
    desc: 'Percentage of children (6 months–6 years) taking Supplementary Nutrition.',
    Intervention: 'Integrated Child Development Services (ICDS) - Poshan Abhiyaan',
    sdg: '2.2 - End malnutrition'
  },
  measurementEfficiency: {
    desc: 'Measurement efficiency of children at Anganwadi Centres.',
    Intervention: 'Poshan Abhiyaan - ICDS',
    sdg: '2.2 - End malnutrition'
  },
  samChildren: {
    desc: 'Percentage of children under 5 years with Severe Acute Malnutrition (SAM). Lower is better.',
    Intervention: 'Poshan Abhiyaan - ICDS',
    sdg: '2.2 - End malnutrition'
  },
  mamChildren: {
    desc: 'Percentage of children under 5 years with Moderate Acute Malnutrition (MAM). Lower is better.',
    Intervention: 'Poshan Abhiyaan - ICDS',
    sdg: '2.2 - End malnutrition'
  },
  toiletsAWC: {
    desc: 'Percentage of operational Anganwadis with functional toilets.',
    Intervention: 'Swachh Bharat Mission (SBM)',
    sdg: '6.2 - Access to sanitation and hygiene'
  },
  drinkingWaterAWC: {
    desc: 'Percentage of operational Anganwadis with drinking water facilities.',
    Intervention: 'Jal Jeevan Mission',
    sdg: '6.1 - Access to safe water'
  },
  girlsTransitionUS: {
    desc: 'Transition Rate - Girls (Upper Primary to Secondary).',
    Intervention: 'Beti Bachao Beti Padhao - Samagra Shiksha Abhiyan',
    sdg: '4.1 - Ensure free, equitable education'
  },
  ptrSchools: {
    desc: 'Schools with PTR ≤ 30.',
    Intervention: 'Samagra Shiksha Abhiyan',
    sdg: '4.c - Increase the supply of qualified teachers'
  },
  girlsToilets: {
    desc: 'Schools with adequate girls’ toilet facilities.',
    Intervention: 'Swachh Bharat Swachh Vidyalaya',
    sdg: '6.2 - Access to sanitation and hygiene'
  },
  soilHealthCards: {
    desc: 'Soil Health Cards generated.',
    Intervention: 'Soil Health Card Scheme',
    sdg: '2.4 - Ensure sustainable food production'
  },
  pmKisanBeneficiaries: {
    desc: 'Beneficiaries under PM Kisan with AEPB Seeded.',
    Intervention: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    sdg: '2.3 - Double agricultural productivity'
  },
  animalVaccination: {
    desc: 'Animal Vaccinated (FMD).',
    Intervention: 'National Animal Disease Control Programme',
    sdg: '2.4 - Sustainable agriculture'
  },
  tapWaterConnections: {
    desc: 'Households with FHTC (Functional Household Tap Connection).',
    Intervention: 'Jal Jeevan Mission',
    sdg: '6.1 - Access to safe water'
  },
  odfPlus: {
    desc: 'Villages ODF Plus.',
    Intervention: 'Swachh Bharat Mission (Gramin)',
    sdg: '6.2 - Access to sanitation and hygiene'
  },
  bharatNet: {
    desc: 'Gram Panchayats with BharatNet.',
    Intervention: 'BharatNet Project',
    sdg: '9.c - Access to ICT'
  },
  pmayG: {
    desc: 'Households under Pradhan Mantri Awas Yojana - Gramin (PMAY-G).',
    Intervention: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    sdg: '11.1 - Safe and affordable housing'
  },
  shgHouseholds: {
    desc: 'Households added to SHGs.',
    Intervention: 'Deendayal Antyodaya Yojana - NRLM',
    sdg: '5.a - Economic empowerment of women'
  },
  revolvingFund: {
    desc: 'SHGs received Revolving Fund.',
    Intervention: 'Deendayal Antyodaya Yojana - NRLM',
    sdg: '1.4 - Equal rights to economic resources'
  },
  bankingTouchPoints: {
    desc: 'Banking touch points in block.',
    Intervention: 'Pradhan Mantri Jan Dhan Yojana',
    sdg: '8.10 - Financial inclusion'
  },
  digitalCertification: {
    desc: 'Digital certification under PMDSA.',
    Intervention: 'Pradhan Mantri Gramin Digital Saksharta Abhiyaan (PMGDISHA)',
    sdg: '4.4 - Skills for work'
  }
};
