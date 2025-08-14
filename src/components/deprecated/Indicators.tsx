import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { THEMES, INDICATOR_DETAILS } from '@/utils/csvParser';
export const IndicatorDetail = ({ themeKey, indicatorKey, data, previous, baseline }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const indicatorName = THEMES[themeKey]?.indicators[indicatorKey] || 'Unknown Indicator';

    const performance = useMemo(() => {
    if (!data?.length) 
        return { best: null, worst: null, sorted: [], min: 0, max: 0 };

    const isReversed = ['lowBirthWeight', 'samChildren'].includes(indicatorKey);

    // 1) Enrich each current row with prev/baseline values
    const enriched = data.map(curr => {
        // find the matching rows by sno
        const prev = previous.find(p => p.sno === curr.sno);
        const base = baseline.find(b => b.sno === curr.sno);

        // extract the two indicator values (default to 0 if missing)
        const currVal = curr[themeKey]?.[indicatorKey] ?? 0;
        const prevVal = prev?.[themeKey]?.[indicatorKey] ?? currVal;
        const baseVal = base?.[themeKey]?.[indicatorKey] ?? currVal;

        // if “better” means smaller (e.g. lowBirthWeight), invert
        const diffPrev = isReversed ? prevVal - currVal : currVal - prevVal;
        const diffBase = isReversed ? baseVal - currVal : currVal - baseVal;

        return {
        ...curr,
        currVal,
        prevVal,
        baseVal,
        improvementFromPrevious: diffPrev,
        improvementFromBaseline: diffBase,
        };
    });

    // 2) Sort by improvement from previous quarter
    const sorted = enriched.sort(
        (a, b) => b.improvementFromPrevious - a.improvementFromPrevious
    );

    // 3) Figure out min/max improvements for your scales
    const improvements = sorted.map((row) => row.improvementFromPrevious);
    const min = Math.min(...improvements);
    const max = Math.max(...improvements);

    return {
        best:  sorted[0],
        worst: sorted[sorted.length - 1],
        sorted,
        min,
        max,
    };
    }, [data, previous, baseline, themeKey, indicatorKey]);



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
                          <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">Best</Badge>{" "}
                          {performance.best.blockName} ({performance.best[themeKey][indicatorKey]}%)
                        </div>
                        <div>
                          <Badge className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]">Worst</Badge>{" "}
                          {performance.worst.blockName} ({performance.worst[themeKey][indicatorKey]}%)
                        </div>
                        <div className="text-xs sm:text-sm">
                            <span className="rounded px-2 py-1 text-xs bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                              SDG: {INDICATOR_DETAILS[indicatorKey]?.sdg}
                            </span>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Description:</span>{" "}
                            {INDICATOR_DETAILS[indicatorKey]?.desc || 'No description available.'}
                        </p>
                         <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Intervention:</span>{" "}
                            {INDICATOR_DETAILS[indicatorKey]?.Intervention || 'N/A'}
                        </p>

                        <div className="space-y-3 max-h-128 overflow-y-auto pr-2">
                            {performance.sorted.map((block, idx) => {
                              const value = block.currVal;
                              const prevValue = block.prevVal;
                              const baseValue = block.baseVal;
                              // Visual normalization
                            //   let normalized = 100;
                            //   if (performance.max !== performance.min) {
                            //       normalized = ((value - performance.min) / (performance.max - performance.min)) * 100;
                            //       // Optionally ensure minimum bar is visible (e.g., min 8%)
                            //       normalized = Math.max(normalized, 1);
                            //   }

                              //const isBest = block.blockName === performance.best.blockName;
                              //const isWorst = block.blockName === performance.worst.blockName;
                              const progressColor = {/*isWorst
                                  ? "bg-[hsl(var(--destructive))]"
                                  : isBest
                                  ? "bg-[hsl(var(--success))]"*/}
                                  "bg-[hsl(var(--white))]";
                              return (
                                  <div key={idx}>
                                      <div className="flex justify-between text-sm mb-1">
                                          <span>{block.blockName} ({block.districtName})</span>
                                          <span>{value}%</span>
                                      </div>
                                      <Progress value={value} className={`h-2 ${progressColor}`} />
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

export const IndicatorsView = ({ data, previous, baseline }) => {
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
                        <IndicatorDetail key={indicatorKey} themeKey={selectedTheme} indicatorKey={indicatorKey} data={data} previous={previous} baseline={baseline}/>
                    ))}
                </div>
            )}
        </div>
    );
};
