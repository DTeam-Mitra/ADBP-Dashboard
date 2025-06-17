
export interface CSVData {
  sno: number;
  stateName: string;
  stateLGDCode: number;
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
  socialInfra: {
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
}

export const parseCSVData = (csvText: string): CSVData[] => {
  const lines = csvText.split('\n');
  const data: CSVData[] = [];
  
  // Skip header rows (first 2 lines)
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    
    if (values.length >= 65) {
      const row: CSVData = {
        sno: parseFloat(values[0]) || 0,
        stateName: values[1] || '',
        stateLGDCode: parseFloat(values[2]) || 0,
        districtName: values[3] || '',
        districtLGDCode: parseFloat(values[4]) || 0,
        blockName: values[5] || '',
        blockLGDCode: parseFloat(values[6]) || 0,
        health: {
          ancRegistration: parseFloat(values[7]) || 0,
          institutionalDeliveries: parseFloat(values[8]) || 0,
          lowBirthWeight: parseFloat(values[9]) || 0,
          nqasCertified: parseFloat(values[10]) || 0,
          hypertensionScreening: parseFloat(values[11]) || 0,
          diabetesScreening: parseFloat(values[12]) || 0,
          tbTreatmentSuccess: parseFloat(values[13]) || 0,
          compositeScore: parseFloat(values[14]) || 0,
          rank: parseFloat(values[15]) || 0,
        },
        nutrition: {
          pregnantWomenSN: parseFloat(values[16]) || 0,
          childrenSN: parseFloat(values[17]) || 0,
          measurementEfficiency: parseFloat(values[18]) || 0,
          samChildren: parseFloat(values[19]) || 0,
          mamChildren: parseFloat(values[20]) || 0,
          toiletsAWC: parseFloat(values[21]) || 0,
          drinkingWaterAWC: parseFloat(values[22]) || 0,
          compositeScore: parseFloat(values[23]) || 0,
          rank: parseFloat(values[24]) || 0,
        },
        basicInfra: {
          tapWaterConnections: parseFloat(values[25]) || 0,
          odfPlus: parseFloat(values[26]) || 0,
          bharatNet: parseFloat(values[27]) || 0,
          liveBharatNet: parseFloat(values[28]) || 0,
          pmayG: parseFloat(values[29]) || 0,
          compositeScore: parseFloat(values[30]) || 0,
          rank: parseFloat(values[31]) || 0,
        },
        socialInfra: {
          shgHouseholds: parseFloat(values[32]) || 0,
          revolvingFund: parseFloat(values[33]) || 0,
          bankingTouchPoints: parseFloat(values[34]) || 0,
          digitalCertification: parseFloat(values[35]) || 0,
          compositeScore: parseFloat(values[36]) || 0,
          rank: parseFloat(values[37]) || 0,
        },
        education: {
          boysTransitionUS: parseFloat(values[38]) || 0,
          girlsTransitionUS: parseFloat(values[39]) || 0,
          boysTransitionSHS: parseFloat(values[40]) || 0,
          girlsTransitionSHS: parseFloat(values[41]) || 0,
          ptrSchools: parseFloat(values[42]) || 0,
          girlsToilets: parseFloat(values[43]) || 0,
          trainedTeachers: parseFloat(values[44]) || 0,
          boysMarksX: parseFloat(values[45]) || 0,
          girlsMarksX: parseFloat(values[46]) || 0,
          boysMarksXII: parseFloat(values[47]) || 0,
          girlsMarksXII: parseFloat(values[48]) || 0,
          compositeScore: parseFloat(values[49]) || 0,
          rank: parseFloat(values[50]) || 0,
        },
        agriculture: {
          fpoFormed: parseFloat(values[51]) || 0,
          soilHealthCards: parseFloat(values[52]) || 0,
          pmKisanBeneficiaries: parseFloat(values[53]) || 0,
          animalVaccination: parseFloat(values[54]) || 0,
          groundWaterExtraction: parseFloat(values[55]) || 0,
          compositeScore: parseFloat(values[56]) || 0,
          rank: parseFloat(values[57]) || 0,
        },
        balancedCompositeScore: parseFloat(values[58]) || 0,
      };
      
      data.push(row);
    }
  }
  
  return data;
};
