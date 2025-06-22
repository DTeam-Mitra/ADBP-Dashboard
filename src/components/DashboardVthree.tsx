import React, { useState, useEffect, useMemo } from 'react';
// --- UI Component Imports ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// --- SVG Placeholder for Block Profile ---
const PlaceholderSvg = () => (
    <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center">
        <svg className="w-1/2 h-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    </div>
);


// --- Data Parsing Logic (adapted from your csvParser.ts) ---
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
{/* 
export interface CSVData {
    sno: number;
    stateName: string;
    districtName: string;
    blockName: string;
    health: { [key: string]: number };
    nutrition: { [key: string]: number };
    education: { [key: string]: number };
    agriculture: { [key: string]: number };
    basicInfra: { [key: string]: number };
    socialDevelopment: { [key: string]: number };
    balancedCompositeScore: number;
    [key: string]: any;
} */}
export const parseCSVData = (csvText: string): CSVData[] => {
    const lines = csvText.split('\n').slice(2); // Skip header rows
    const data: CSVData[] = [];
    lines.forEach(line => {
        const values = line.split(',');
        if (values.length < 59) return;
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
      socialDevelopment: {
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
    });
    return data;
};

// --- Static Data Definitions ---
const THEMES = {
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
const INDICATOR_DETAILS = {
  ancRegistration: {
    desc: 'Percentage of pregnant women who have received Ante-Natal Care (ANC) registration.',
    sdg: 'SDG 3: Good Health and Well-being'
  },
  institutionalDeliveries: {
    desc: 'Percentage of deliveries that occurred in a medical institution.',
    sdg: 'SDG 3: Good Health and Well-being'
  },
  lowBirthWeight: {
    desc: 'Percentage of newborns with a birth weight below 2.5kg. Lower is better.',
    sdg: 'SDG 2: Zero Hunger, SDG 3: Good Health'
  },
  nqasCertified: {
    desc: 'Percentage of health facilities certified under National Quality Assurance Standards (NQAS).',
    sdg: 'SDG 3: Good Health and Well-being'
  },
  hypertensionScreening: {
    desc: 'Percentage of individuals screened for hypertension under national health programs.',
    sdg: 'SDG 3: Good Health and Well-being'
  },
  diabetesScreening: {
    desc: 'Percentage of individuals screened for diabetes under national health programs.',
    sdg: 'SDG 3: Good Health and Well-being'
  },
  tbTreatmentSuccess: {
    desc: 'Percentage of tuberculosis patients who successfully completed treatment.',
    sdg: 'SDG 3: Good Health and Well-being'
  },
  pregnantWomenSN: {
    desc: 'Percentage of pregnant women receiving supplementary nutrition.',
    sdg: 'SDG 2: Zero Hunger'
  },
  childrenSN: {
    desc: 'Percentage of children (6 months–6 years) receiving supplementary nutrition.',
    sdg: 'SDG 2: Zero Hunger'
  },
  measurementEfficiency: {
    desc: 'Efficiency of anthropometric measurement of children in Anganwadi Centres.',
    sdg: 'SDG 2: Zero Hunger'
  },
  samChildren: {
    desc: 'Percentage of children with Severe Acute Malnutrition (SAM). Lower is better.',
    sdg: 'SDG 2: Zero Hunger'
  },
  mamChildren: {
    desc: 'Percentage of children with Moderate Acute Malnutrition (MAM). Lower is better.',
    sdg: 'SDG 2: Zero Hunger'
  },
  toiletsAWC: {
    desc: 'Percentage of Anganwadi Centres (AWCs) equipped with functional toilets.',
    sdg: 'SDG 6: Clean Water and Sanitation'
  },
  drinkingWaterAWC: {
    desc: 'Percentage of AWCs with access to safe drinking water.',
    sdg: 'SDG 6: Clean Water and Sanitation'
  },
  girlsTransitionUS: {
    desc: 'Percentage of girls successfully transitioning from upper primary to secondary school.',
    sdg: 'SDG 4: Quality Education, SDG 5: Gender Equality'
  },
  ptrSchools: {
    desc: 'Percentage of schools with an adequate Pupil-Teacher Ratio (PTR) as per norms.',
    sdg: 'SDG 4: Quality Education'
  },
  girlsToilets: {
    desc: 'Percentage of schools with functional and separate toilets for girls.',
    sdg: 'SDG 4: Quality Education, SDG 6: Clean Water and Sanitation'
  },
  soilHealthCards: {
    desc: 'Percentage of farmers who have received Soil Health Cards.',
    sdg: 'SDG 2: Zero Hunger, SDG 15: Life on Land'
  },
  pmKisanBeneficiaries: {
    desc: 'Percentage of eligible landholding farmers benefitting from PM-KISAN scheme.',
    sdg: 'SDG 1: No Poverty, SDG 2: Zero Hunger'
  },
  animalVaccination: {
    desc: 'Percentage of cattle and buffaloes vaccinated against Foot and Mouth Disease (FMD).',
    sdg: 'SDG 2: Zero Hunger'
  },
  tapWaterConnections: {
    desc: 'Percentage of rural households with access to functional tap water connections.',
    sdg: 'SDG 6: Clean Water and Sanitation'
  },
  odfPlus: {
    desc: 'Percentage of villages declared as ODF Plus, indicating solid and liquid waste management.',
    sdg: 'SDG 6: Clean Water and Sanitation'
  },
  bharatNet: {
    desc: 'Percentage of Gram Panchayats connected by BharatNet infrastructure.',
    sdg: 'SDG 9: Industry, Innovation and Infrastructure'
  },
  liveBharatNet: {
    desc: 'Percentage of Gram Panchayats with live and functional BharatNet connectivity.',
    sdg: 'SDG 9: Industry, Innovation and Infrastructure'
  },
  pmayG: {
    desc: 'Number of houses completed under the Pradhan Mantri Awas Yojana - Gramin (PMAY-G).',
    sdg: 'SDG 11: Sustainable Cities and Communities'
  },
  shgHouseholds: {
    desc: 'Percentage of households participating in Self-Help Groups (SHGs).',
    sdg: 'SDG 1: No Poverty, SDG 5: Gender Equality'
  },
  revolvingFund: {
    desc: 'Percentage utilization of Revolving Fund assistance by Self-Help Groups.',
    sdg: 'SDG 1: No Poverty, SDG 5: Gender Equality'
  },
  bankingTouchPoints: {
    desc: 'Percentage of Gram Panchayats with access to banking touch points such as CSPs or ATMs.',
    sdg: 'SDG 8: Decent Work and Economic Growth'
  },
  digitalCertification: {
    desc: 'Number of individuals who have received certification under digital literacy programs.',
    sdg: 'SDG 4: Quality Education'
  }
};


// --- Child Components ---
{/*
const IndicatorDetail = ({ themeKey, indicatorKey, data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const indicatorName = THEMES[themeKey]?.indicators[indicatorKey] || 'Unknown Indicator';

    const performance = useMemo(() => {
        if (!data || data.length === 0) return { best: null, worst: null };
        const isReversed = indicatorKey === 'lowBirthWeight' || indicatorKey === 'samChildren';
        const sortedData = [...data].sort((a, b) => {
            const valA = a[themeKey]?.[indicatorKey] ?? (isReversed ? Infinity : -Infinity);
            const valB = b[themeKey]?.[indicatorKey] ?? (isReversed ? Infinity : -Infinity);
            return isReversed ? valA - valB : valB - valA;
        });
        return { best: sortedData[0], worst: sortedData[sortedData.length - 1] };
    }, [data, themeKey, indicatorKey]);

    if (!performance.best) return null;

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-md sm:text-lg">{indicatorName}</h4>
                        <Button variant="ghost" size="sm">{isExpanded ? 'Collapse' : 'Expand'}</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                        <div><Badge variant="outline" className="border-green-500 text-green-600">Best</Badge> {performance.best.blockName} ({performance.best[themeKey][indicatorKey]}%)</div>
                        <div><Badge variant="destructive">Worst</Badge> {performance.worst.blockName} ({performance.worst[themeKey][indicatorKey]}%)</div>
                    </div>
                </div>
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-muted-foreground mb-1 text-sm"><span className="font-semibold text-foreground">Description:</span> {INDICATOR_DETAILS[indicatorKey]?.desc || 'No description available.'}</p>
                        <p className="text-muted-foreground mb-4 text-sm"><span className="font-semibold text-foreground">Related SDG:</span> {INDICATOR_DETAILS[indicatorKey]?.sdg || 'N/A'}</p>
                        <div className="max-h-60 overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Block</TableHead>
                                        <TableHead>District</TableHead>
                                        <TableHead className="text-right">Value (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((block, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{block.blockName}</TableCell>
                                            <TableCell>{block.districtName}</TableCell>
                                            <TableCell className="text-right font-medium">{block[themeKey][indicatorKey]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
*/}
const IndicatorDetail = ({ themeKey, indicatorKey, data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const indicatorName = THEMES[themeKey]?.indicators[indicatorKey] || 'Unknown Indicator';

    const performance = useMemo(() => {
        if (!data || data.length === 0) return { best: null, worst: null };
        const isReversed = ['lowBirthWeight', 'samChildren'].includes(indicatorKey);
        const sortedData = [...data].sort((a, b) => {
            const valA = a[themeKey]?.[indicatorKey] ?? (isReversed ? Infinity : -Infinity);
            const valB = b[themeKey]?.[indicatorKey] ?? (isReversed ? Infinity : -Infinity);
            return isReversed ? valA - valB : valB - valA;
        });
        return { best: sortedData[0], worst: sortedData[sortedData.length - 1], sorted: sortedData };
    }, [data, themeKey, indicatorKey]);

    if (!performance.best) return null;

    return (
        <Card>
            <CardContent className="pt-6">
                <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-md sm:text-lg">{indicatorName}</h4>
                        <Button variant="ghost" size="sm">
                            {isExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                        <div>
                            <Badge variant="outline" className="border-green-500 text-green-600">Best</Badge>{" "}
                            {performance.best.blockName} ({performance.best[themeKey][indicatorKey]}%)
                        </div>
                        <div>
                            <Badge variant="destructive">Worst</Badge>{" "}
                            {performance.worst.blockName} ({performance.worst[themeKey][indicatorKey]}%)
                        </div>
                        <div className="text-xs sm:text-sm">
                            <span className="font-semibold">SDG:</span>{" "}
                            {INDICATOR_DETAILS[indicatorKey]?.sdg || 'N/A'}
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Description:</span>{" "}
                            {INDICATOR_DETAILS[indicatorKey]?.desc || 'No description available.'}
                        </p>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {performance.sorted.map((block, idx) => {
                                const value = block[themeKey]?.[indicatorKey] ?? 0;
                                const isBest = block.blockName === performance.best.blockName;
                                const isWorst = block.blockName === performance.worst.blockName;
                                const progressColor = isWorst
                                    ? "bg-red-500"
                                    : isBest
                                    ? "bg-green-600"
                                    : "bg-blue-500";

                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{block.blockName} ({block.districtName})</span>
                                            <span className="font-medium">{value}%</span>
                                        </div>
                                        <Progress value={value} className="h-2"  /> {/*indicatorClassName={progressColor} */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const IndicatorsView = ({ data }) => {
    const [selectedTheme, setSelectedTheme] = useState('health');
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {Object.keys(THEMES).map(key => (
                    <Button key={key} variant={selectedTheme === key ? 'default' : 'outline'} onClick={() => setSelectedTheme(key)}>
                        {THEMES[key].name}
                    </Button>
                ))}
            </div>
            {selectedTheme && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{THEMES[selectedTheme].name} Indicators</h3>
                    {Object.keys(THEMES[selectedTheme].indicators).map(indicatorKey => (
                        <IndicatorDetail key={indicatorKey} themeKey={selectedTheme} indicatorKey={indicatorKey} data={data} />
                    ))}
                </div>
            )}
        </div>
    );
};

const BlockDetailView = ({ block, onBack }) => {
    return (
        <Card>
            <CardHeader>
                <Button onClick={onBack} variant="outline" className="mb-4 w-fit">← Back to All Blocks</Button>
                <CardTitle>{block.blockName}</CardTitle>
                <CardDescription>{block.districtName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.keys(THEMES).map(themeKey => (
                    <div key={themeKey}>
                        <h4 className="font-semibold text-lg mb-2 border-b pb-1">{THEMES[themeKey].name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                        {Object.keys(THEMES[themeKey].indicators).map(indicatorKey => (
                           <div key={indicatorKey} className="flex justify-between">
                               <span className="text-muted-foreground">{THEMES[themeKey].indicators[indicatorKey]}:</span>
                               <span className="font-bold">{block[themeKey]?.[indicatorKey] ?? 'N/A'}%</span>
                           </div>
                        ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

const BlocksView = ({ data, onBlockSelect, rankingMap}) => {
    const findBestTheme = (block) => {
        let bestTheme = { name: 'N/A' };
        let bestRank = Infinity;
        
        Object.keys(THEMES).forEach(themeKey => {
            const themeData = block[themeKey];
            // Assuming the CSV has a `rank` property within each theme object
            if(themeData && themeData.rank < bestRank) {
                bestRank = themeData.rank;
                bestTheme = { name: THEMES[themeKey].name };
            }
        });
        return bestTheme;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((block) => {
                const bestAt = findBestTheme(block);
                return (
                    <Card key={block.sno} className="cursor-pointer hover:border-primary transition-colors" onClick={() => onBlockSelect(block)}>
                        <div className="flex gap-4 p-4 items-center">
                            <div className="w-1/3 flex-shrink-0">
                                <PlaceholderSvg/>
                            </div>
                            <div className="w-2/3 space-y-1">
                                <h4 className="font-bold text-lg leading-tight">{block.blockName}</h4>
                                <p className="text-sm text-muted-foreground">{block.districtName}</p>
                                <div className="text-sm pt-2">
                                    <p>Overall Rank: <span className="font-bold">{rankingMap[block.sno] || 'N/A'}</span></p>
                                    <p>Best Theme: <span className="font-bold">{bestAt.name}</span></p>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

const RankingView = ({ data, rankingMap }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Block Rankings</CardTitle>
                <CardDescription>Overall ranking based on the balanced composite score.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Overall Rank</TableHead>
                            <TableHead>Block</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead className="text-right">Composite Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((block) => (
                            <TableRow key={block.sno}>
                                <TableCell className="font-bold text-lg">{rankingMap[block.sno]}</TableCell>
                                <TableCell>{block.blockName}</TableCell>
                                <TableCell className="text-muted-foreground">{block.districtName}</TableCell>
                                <TableCell className="text-right font-medium">{block.balancedCompositeScore.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

// --- Main Component ---
export const DashV3 = () => {
    const [activeTab, setActiveTab] = useState('indicator');
    const [csvData, setCsvData] = useState<CSVData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<CSVData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Dashboard%20Data.csv'); 
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                const parsedData = parseCSVData(text);
                setCsvData(parsedData);
            } catch (e) {
                console.error("Failed to load or parse CSV data:", e);
                setError('Failed to load dashboard data. Please check the file path and format.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const rankedData = useMemo(() => {
        return [...csvData].sort((a, b) => b.balancedCompositeScore - a.balancedCompositeScore);
    }, [csvData]);
    
    const rankingMap = useMemo(() => {
       const map: { [key: number]: number } = {};
       rankedData.forEach((block, index) => {
           map[block.sno] = index + 1;
       });
       return map;
    }, [rankedData]);

    const handleSelectBlock = (block: CSVData) => {
        setSelectedBlock(block);
        setActiveTab('blocks');
    };

    const renderContent = () => {
        if (loading) return <div className="text-center p-10">Loading Data...</div>;
        if (error) return <div className="text-center p-10 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">{error}</div>;
        
        if(activeTab === 'blocks' && selectedBlock) {
            return <BlockDetailView block={selectedBlock} onBack={() => setSelectedBlock(null)} />
        }

        switch (activeTab) {
            case 'indicator':
                return <IndicatorsView data={csvData} />;
            case 'blocks':
                return <BlocksView data={csvData} onBlockSelect={handleSelectBlock} rankingMap={rankingMap} />;
            case 'ranking':
                return <RankingView data={rankedData} rankingMap={rankingMap} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Aspirational Blocks Dashboard</h1>
                    <p className="text-muted-foreground">Analyzing key development indicators across blocks.</p>
                </div>
                <div className="border-b mb-6">
                    <div className="flex space-x-4">
                        <Button variant="ghost" onClick={() => { setActiveTab('indicator'); setSelectedBlock(null); }} className={`pb-3 rounded-none ${activeTab === 'indicator' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Indicators</Button>
                        <Button variant="ghost" onClick={() => setActiveTab('blocks')} className={`pb-3 rounded-none ${activeTab === 'blocks' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Block Profile</Button>
                        <Button variant="ghost" onClick={() => { setActiveTab('ranking'); setSelectedBlock(null); }} className={`pb-3 rounded-none ${activeTab === 'ranking' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Ranking</Button>
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default DashV3;
