
export interface CSVData {
  sno: string;
  stateName: string;
  stateLgdCode: string;
  districtName: string;
  districtLgdCode: string;
  blockName: string;
  blockLgdCode: string;
  health: {
    ancRegistration: number;
    institutionalDeliveries: number;
    lowBirthWeight: number;
    nqasCertified: number;
    hypertensionScreening: number;
    diabetesScreening: number;
    tbTreatment: number;
    compositeScore: number;
    rank: number;
  };
  nutrition: {
    pregnantWomenNutrition: number;
    childrenNutrition: number;
    measurementEfficiency: number;
    samChildren: number;
    mamChildren: number;
    toiletFacilities: number;
    drinkingWater: number;
    compositeScore: number;
    rank: number;
  };
  basicInfra: {
    tapWaterConnections: number;
    odfPlus: number;
    bharatNet: number;
    liveBharatNet: number;
    pmayConstruction: number;
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
    boysTransitionSH: number;
    girlsTransitionSH: number;
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
  const lines = csvText.trim().split('\n');
  const dataLines = lines.slice(2); // Skip header rows
  
  return dataLines.map(line => {
    const values = line.split(',');
    
    return {
      sno: values[0] || '',
      stateName: values[1] || '',
      stateLgdCode: values[2] || '',
      districtName: values[3] || '',
      districtLgdCode: values[4] || '',
      blockName: values[5] || '',
      blockLgdCode: values[6] || '',
      health: {
        ancRegistration: parseFloat(values[7]) || 0,
        institutionalDeliveries: parseFloat(values[8]) || 0,
        lowBirthWeight: parseFloat(values[9]) || 0,
        nqasCertified: parseFloat(values[10]) || 0,
        hypertensionScreening: parseFloat(values[11]) || 0,
        diabetesScreening: parseFloat(values[12]) || 0,
        tbTreatment: parseFloat(values[13]) || 0,
        compositeScore: parseFloat(values[14]) || 0,
        rank: parseInt(values[15]) || 0,
      },
      nutrition: {
        pregnantWomenNutrition: parseFloat(values[16]) || 0,
        childrenNutrition: parseFloat(values[17]) || 0,
        measurementEfficiency: parseFloat(values[18]) || 0,
        samChildren: parseFloat(values[19]) || 0,
        mamChildren: parseFloat(values[20]) || 0,
        toiletFacilities: parseFloat(values[21]) || 0,
        drinkingWater: parseFloat(values[22]) || 0,
        compositeScore: parseFloat(values[23]) || 0,
        rank: parseInt(values[24]) || 0,
      },
      basicInfra: {
        tapWaterConnections: parseFloat(values[25]) || 0,
        odfPlus: parseFloat(values[26]) || 0,
        bharatNet: parseFloat(values[27]) || 0,
        liveBharatNet: parseFloat(values[28]) || 0,
        pmayConstruction: parseFloat(values[29]) || 0,
        compositeScore: parseFloat(values[30]) || 0,
        rank: parseInt(values[31]) || 0,
      },
      socialInfra: {
        shgHouseholds: parseFloat(values[32]) || 0,
        revolvingFund: parseFloat(values[33]) || 0,
        bankingTouchPoints: parseFloat(values[34]) || 0,
        digitalCertification: parseFloat(values[35]) || 0,
        compositeScore: parseFloat(values[36]) || 0,
        rank: parseInt(values[37]) || 0,
      },
      education: {
        boysTransitionUS: parseFloat(values[38]) || 0,
        girlsTransitionUS: parseFloat(values[39]) || 0,
        boysTransitionSH: parseFloat(values[40]) || 0,
        girlsTransitionSH: parseFloat(values[41]) || 0,
        ptrSchools: parseFloat(values[42]) || 0,
        girlsToilets: parseFloat(values[43]) || 0,
        trainedTeachers: parseFloat(values[44]) || 0,
        boysMarksX: parseFloat(values[45]) || 0,
        girlsMarksX: parseFloat(values[46]) || 0,
        boysMarksXII: parseFloat(values[47]) || 0,
        girlsMarksXII: parseFloat(values[48]) || 0,
        compositeScore: parseFloat(values[49]) || 0,
        rank: parseInt(values[50]) || 0,
      },
      agriculture: {
        fpoFormed: parseFloat(values[51]) || 0,
        soilHealthCards: parseFloat(values[52]) || 0,
        pmKisanBeneficiaries: parseFloat(values[53]) || 0,
        animalVaccination: parseFloat(values[54]) || 0,
        groundWaterExtraction: parseFloat(values[55]) || 0,
        compositeScore: parseFloat(values[56]) || 0,
        rank: parseInt(values[57]) || 0,
      },
      balancedCompositeScore: parseFloat(values[58]) || 0,
    };
  });
};
