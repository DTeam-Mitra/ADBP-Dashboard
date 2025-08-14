import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { THEMES, INDICATOR_DETAILS } from '@/utils/csvParser';
import { CaretDownIcon, CaretUpIcon } from '@/components/ui/react-icons';

/* ------------- Horizontal Bar helper ------------- */
const BarHorizontal = ({
  current,
  previous,
  baseline,
  max,
}: {
  current: number;
  previous: number;
  baseline: number;
  max: number;
}) => {
  const toPct = (v: number) => (max === 0 ? 0 : (v / max) * 100);

  const [hovered, setHovered] = useState(false);
  const barHeight = 12;           // each individual bar’s height
  const containerHeight = hovered ? barHeight * 3 : barHeight;

  // bottom offsets for each layer when “split”
  const baseOffset = 0;
  const prevOffset = hovered ? barHeight : 0;
  const currOffset = hovered ? barHeight * 2 : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 rounded bg-slate-100"
      style={{
        height: containerHeight,
        width: '100%',
        overflow: 'hidden',
        transition: 'height 0.3s',
      }}
    >
      {/* baseline */}
      <div
        style={{
          width: `${toPct(baseline)}%`,
          height: barHeight,
          backgroundColor: '#2563EB',
          position: 'absolute',
          left: 0,
          bottom: baseOffset,
          zIndex: 30,
          transition: 'bottom 0.3s',
        }}
      />
      {/* previous */}
      <div
        style={{
          width: `${toPct(previous)}%`,
          height: barHeight,
          backgroundColor: '#EAB308',
          position: 'absolute',
          left: 0,
          bottom: prevOffset,
          zIndex: 20,
          transition: 'bottom 0.3s',
        }}
      />
      {/* current */}
      <div
        style={{
          width: `${toPct(current)}%`,
          height: barHeight,
          backgroundColor: '#DC2626',
          position: 'absolute',
          left: 0,
          bottom: currOffset,
          zIndex: 10,
          transition: 'bottom 0.3s',
        }}
      />
    </div>
  );
};

/* ------------- Main component ------------- */
export const IndicatorV2 = ({
  data,
  previous,
  baseline,
}: {
  data: any[];
  previous: any[];
  baseline: any[];
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(Object.keys(THEMES)[0]);
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [showTechniques, setShowTechniques] = useState(false);

  const indicatorList = useMemo(
    () => Object.keys(THEMES[selectedTheme]?.indicators || {}),
    [selectedTheme]
  );

  const greenDate = 'March 2025';
  const yellowDate = 'December 2024';
  const redDate = 'March 2023';

  /* ---------- Data crunch ---------- */
  const indicatorData = useMemo(() => {
    if (!selectedIndicator) return null;

    const isReversed = ['lowBirthWeight', 'samChildren'].includes(selectedIndicator);

    const enriched = data.map((curr) => {
      const prev = previous.find((p) => p.sno === curr.sno);
      const base = baseline.find((b) => b.sno === curr.sno);

      const currVal = curr[selectedTheme]?.[selectedIndicator] ?? 0;
      const prevVal = prev?.[selectedTheme]?.[selectedIndicator] ?? currVal;
      const baseVal = base?.[selectedTheme]?.[selectedIndicator] ?? currVal;

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

    // sort the rows by currVal descending, then pick best/worst from that same sorted array
    // sort descending by current value…
   const sortedByCurrent = [...enriched].sort(
     (a, b) => b.currVal - a.currVal
   );

   // then inject a rank (1…N)
   const withRanks = sortedByCurrent.map((row, idx) => ({
     ...row,
     rank: idx + 1,
   }));

   const best = withRanks[0];
   const worst = withRanks[withRanks.length - 1];
   return { list: withRanks, best, worst };
  }, [data, previous, baseline, selectedTheme, selectedIndicator]);

  const maxValue = useMemo(() => {
    if (!indicatorData) return 0;
    const all = indicatorData.list.flatMap((row) => [row.currVal, row.prevVal, row.baseVal]);
    return Math.max(...all, 0);
  }, [indicatorData]);

  const meta = INDICATOR_DETAILS[selectedIndicator];

  return (
    <div className="space-y-6">
      {/* ↓ flex container with Theme, Indicator, and new Legend ↓ */}
      <div className="flex flex-wrap gap-6 items-center">
        {/* Theme selector */}
        <div className="max-w-sm flex-1">
          <Label htmlFor="theme">Theme</Label>
          <Select
            name="theme"
            value={selectedTheme}
            onValueChange={(val) => {
              setSelectedTheme(val);
              setSelectedIndicator('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose theme…" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(THEMES).map((key) => (
                <SelectItem key={key} value={key}>
                  {THEMES[key].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Indicator selector */}
        {indicatorList.length > 0 && (
          <div className="max-w-sm flex-1">
            <Label htmlFor="indicator">Indicator</Label>
            <Select
              name="indicator"
              value={selectedIndicator}
              onValueChange={setSelectedIndicator}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose indicator…" />
              </SelectTrigger>
              <SelectContent>
                {indicatorList.map((key) => (
                  <SelectItem key={key} value={key}>
                    {THEMES[selectedTheme].indicators[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Traffic-light legend */}
        <div className="ml-auto flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
            <span className="text-sm font-medium">{greenDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium">{yellowDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium">{redDate}</span>
          </div>
        </div>
      </div>


      {/* Main card */}
      {indicatorData && meta && (
        <Card>
          <CardHeader>
            <CardTitle>{THEMES[selectedTheme].indicators[selectedIndicator]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Info panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold">Best performing</p>
                <Badge className="bg-green-500 text-white">
                  {indicatorData.best.blockName}
                </Badge>{' '}
                ({indicatorData.best.currVal}%)
              </div>
              <div>
                <p className="font-semibold">Lagging block</p>
                <Badge className="bg-red-500 text-white">
                  {indicatorData.worst.blockName}
                </Badge>{' '}
                ({indicatorData.worst.currVal}%)
              </div>
              <div>
                <span className="rounded bg-slate-200 px-2 py-1 text-xs font-medium">
                  SDG: {meta.sdg}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Description:</span>{' '}
              {meta.desc || 'No description available.'}
            </p>

            {/* Bar chart */}
            <div className="overflow-y-auto ">{/*max-h-96*/}
            <div className="space-y-2">
                {indicatorData.list.map((row) => (
                <div key={row.sno} className="flex items-center gap-2">
                    {/* Block name column */}
                    <span className="w-24 text-xs">{row.blockName}</span>
                    {/* The horizontal stacked bar */}
                    <div className="flex-1">
                    <BarHorizontal 
                        current={row.currVal}
                        previous={row.prevVal}
                        baseline={row.baseVal}
                        max={maxValue}
                    />
                    </div>
                    {/* Optional: show value */}
                    <span className="w-10 text-xs text-right">{row.currVal}%</span>
                </div>
                ))}
            </div>
            </div>


            {/* Intervention techniques */}
            {meta.Intervention && (
              <div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowTechniques(!showTechniques)}
                >
                  How to improve?
                  {showTechniques ? <CaretUpIcon /> : <CaretDownIcon />}
                </Button>
                {showTechniques && (
                  <div className="mt-2 p-3 bg-muted rounded text-sm">
                    {meta.Intervention}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};