import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { THEMES } from '@/utils/csvParser';
import { generateBlockReport } from '@/utils/generateBlockReport';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const THEME_COLORS: Record<string, string> = {
  health: 'bg-red-500',
  nutrition: 'bg-amber-500',
  basicInfra: 'bg-blue-500',
  socialDevelopment: 'bg-purple-500',
  education: 'bg-green-500',
  agriculture: 'bg-emerald-600'
};

const getThemePerformance = (block: any) =>
  Object.keys(THEMES)
    .map(key => ({
      key,
      name: THEMES[key].name,
      rank: block[key]?.rank ?? Infinity,
      score: block[key]?.compositeScore
    }))
    .sort((a, b) => a.rank - b.rank);

export interface BlockReportPageProps {
  data: any[];
  rankingMap: Record<number, number>;
}


export const BlockReport: React.FC<BlockReportPageProps> = ({
  data,
  rankingMap
}) => {
  const [selectedSno, setSelectedSno] = useState<string>('');
  const { isDarkMode } = useAccessibility();

  const selectedBlock = useMemo(
    () => data.find(d => d.sno.toString() === selectedSno) || null,
    [selectedSno, data]
  );

  const themePerf = useMemo(
    () => (selectedBlock ? getThemePerformance(selectedBlock) : []),
    [selectedBlock]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ---------- BLOCK SELECT ---------- */}
      <Card>
        <CardContent className="p-6 flex justify-between items-center gap-4">
          <Select value={selectedSno} onValueChange={setSelectedSno}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select Block to Generate Report" />
            </SelectTrigger>
            <SelectContent>
              {data.map(block => (
                <SelectItem
                  key={block.sno}
                  value={block.sno.toString()}
                >
                  {block.blockName} — {block.districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedBlock && (
            <Button
              onClick={() =>
                generateBlockReport(selectedBlock, rankingMap)
              }
            >
              Download Report
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ---------- REPORT CONTENT ---------- */}
      {selectedBlock && (
        <>

          {/* HERO */}
          <Card>
            <div className="p-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedBlock.blockName}
                </h1>
                <p className="text-muted-foreground">
                  {selectedBlock.districtName}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">Overall Rank</p>
                <p className="text-3xl font-bold">
                  {rankingMap[selectedBlock.sno] ?? 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Balanced Score:{' '}
                  {selectedBlock.balancedCompositeScore}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 px-6 pb-4">
              {themePerf.map(t => (
                <Badge key={t.key} variant="outline">
                  {t.name} · Rank {t.rank}
                </Badge>
              ))}
            </div>
          </Card>

          {/* THEMES */}
          {Object.keys(THEMES).map(themeKey => {
            const theme = THEMES[themeKey];
            const data = selectedBlock[themeKey];
            if (!data) return null;

            return (
              <Card key={themeKey}>
                <div className={`h-2 ${THEME_COLORS[themeKey]}`} />
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {theme.name}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      Rank {data.rank} · Score {data.compositeScore}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {Object.keys(theme.indicators).map(ind => (
                      <div
                        key={ind}
                        className="flex justify-between border-b pb-1"
                      >
                        <span>{theme.indicators[ind]}</span>
                        <span className="font-medium">
                          {data[ind] != null
                            ? `${data[ind]}%`
                            : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* INSIGHTS */}
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
              <p>
                {selectedBlock.blockName} shows its strongest
                performance in{' '}
                <span className="font-medium">
                  {themePerf[0]?.name}
                </span>
                , reflecting effective implementation in this domain.
              </p>
              <p>
                Lower-ranked themes highlight areas where focused
                interventions can significantly improve outcomes.
              </p>

              <p className="pt-6 text-xs text-center opacity-60">
                crafted with intent · Himanshu C
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
