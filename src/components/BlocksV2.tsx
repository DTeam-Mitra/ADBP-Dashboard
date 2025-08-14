import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { THEMES } from '@/utils/csvParser';

interface BlockType {
  sno: number;
  blockName: string;
  districtName: string;
  [key: string]: any;
}

interface BlocksV2Props {
  data: BlockType[];
  baselineData: BlockType[];
  rankingMap: Record<number, any>;
}

export const BlocksV2: React.FC<BlocksV2Props> = ({ data, baselineData, rankingMap }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedBlockSno, setSelectedBlockSno] = useState<string>('All Blocks');

  const districts = useMemo<string[]>(
    () => ['All Districts', ...Array.from(new Set(data.map(d => d.districtName)))],
    [data]
  );

  const filteredByDistrict = useMemo<BlockType[]>(
    () => selectedDistrict === 'All Districts' ? data : data.filter(d => d.districtName === selectedDistrict),
    [selectedDistrict, data]
  );

  const blockOptions = useMemo<string[]>(
    () => ['All Blocks', ...filteredByDistrict.map(d => d.sno.toString())],
    [filteredByDistrict]
  );

  const selectedBlock = useMemo<BlockType | null>(
    () => selectedBlockSno === 'All Blocks' ? null : data.find(d => d.sno.toString() === selectedBlockSno) || null,
    [selectedBlockSno, data]
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {/* District Selector */}
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            {districts.map(dist => <SelectItem key={dist} value={dist}>{dist}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Block Selector */}
        <Select value={selectedBlockSno} onValueChange={setSelectedBlockSno}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Block" />
          </SelectTrigger>
          <SelectContent>
            {blockOptions.map(sno => {
              const block = data.find(d => d.sno.toString() === sno);
              const label = sno === 'All Blocks' ? sno : block?.blockName || sno;
              return <SelectItem key={sno} value={sno}>{label}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedBlock ? (
        <BlockDetailViewV2
          block={selectedBlock}
          baseline={baselineData}
          allBlocks={filteredByDistrict}
          onBack={() => setSelectedBlockSno('All Blocks')}
        />
      ) : (
        <BlocksGridV2
          data={filteredByDistrict}
          onBlockSelect={b => setSelectedBlockSno(b.sno.toString())}
          rankingMap={rankingMap}
        />
      )}
    </div>
  );
};

interface BlocksGridV2Props {
  data: BlockType[];
  onBlockSelect: (block: BlockType) => void;
  rankingMap: Record<number, any>;
}

const BlocksGridV2: React.FC<BlocksGridV2Props> = ({ data, onBlockSelect, rankingMap }) => {
  const findBestTheme = (block: BlockType) => {
    let best = { name: 'N/A' };
    let bestRank = Infinity;
    Object.keys(THEMES).forEach(key => {
      const td = block[key];
      if (td?.rank < bestRank) {
        bestRank = td.rank;
        best = { name: THEMES[key].name };
      }
    });
    return best;
  };

  const getSvgPath = (blockName: string) => `/Block Image/${blockName.replace(/[^\w\s-]/g, '')}.svg`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(block => {
        const best = findBestTheme(block);
        const imgSrc = getSvgPath(block.blockName);
        return (
          <Card
            key={block.sno}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onBlockSelect(block)}
          >
            <div className="flex items-center gap-4 p-4">
              <img
                src={imgSrc}
                alt={block.blockName}
                className="max-w-20 max-h-20 object-contain flex-shrink-0"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <div>
                <h4 className="font-bold text-lg leading-tight">{block.blockName}</h4>
                <p className="text-sm text-muted-foreground">{block.districtName}</p>
                <div className="text-sm pt-2">
                  <p>Overall Rank: <span className="font-bold">{rankingMap[block.sno] || 'N/A'}</span></p>
                  <p>Best Theme: <span className="font-bold">{best.name}</span></p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

interface BlockDetailViewV2Props {
  block: BlockType;
  baseline: BlockType[];
  allBlocks: BlockType[];
  onBack: () => void;
}

const BlockDetailViewV2: React.FC<BlockDetailViewV2Props> = ({ block, baseline, allBlocks, onBack }) => {
  const baselineRecord = useMemo(
    () => baseline.find(b => b.sno === block.sno) || ({} as BlockType),
    [baseline, block.sno]
  );
  const [comparisonSno, setComparisonSno] = useState<string>('');
  const comparisonBlock = useMemo(
  () => comparisonSno === 'none'
    ? null
    : allBlocks.find(b => b.sno.toString() === comparisonSno) || null,
  [comparisonSno, allBlocks]
);

  const imgSrc = `/Block Image/${block.blockName.replace(/[^\w\s-]/g, '')}.svg`;

  return (
    <Card>
      {/* Custom header replacing CardHeader */}
      <div className="flex justify-between items-center p-6 bg-white shadow-sm rounded-t-lg">
        <Button onClick={onBack} variant="outline">← Back</Button>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <CardTitle className="text-2xl font-semibold">{block.blockName}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{block.districtName}</CardDescription>
          </div>
          <img
            src={imgSrc}
            alt={block.blockName}
            className="w-20 h-20"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-end">
          <Select value={comparisonSno} onValueChange={setComparisonSno}>
            <SelectTrigger className="w-48">
                <SelectValue placeholder="Compare With" />
            </SelectTrigger>
            <SelectContent>
                {/* Nil option: use sentinel 'none' instead of empty string */}
                <SelectItem key="none" value="none">
                Don't compare
                </SelectItem>
                {/* Other blocks to compare with */}
                {allBlocks
                .filter(b => b.sno !== block.sno)
                .map(b => (
                    <SelectItem key={b.sno} value={b.sno.toString()}>
                    {b.blockName}
                    </SelectItem>
                ))}
            </SelectContent>
            </Select>

        </div>

        {Object.keys(THEMES).map(themeKey => (
          <div key={themeKey} className="mb-6">
            <h4 className="font-semibold text-lg mb-2 border-b pb-1">{THEMES[themeKey].name}</h4>
            <table className="table-fixed w-full divide-y divide-gray-200 text-sm">
              <colgroup>
                <col className="w-[40%]" />
                <col />
                <col />
                {comparisonBlock && <col />}
                <col />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Indicator</th>
                  <th className="px-4 py-2 text-center">Baseline Data</th>
                  <th className="px-4 py-2 text-center">Current Data</th>
                  {comparisonBlock && (
                    <th className="px-4 py-2 text-center">{comparisonBlock.blockName}</th>
                  )}
                  <th className="px-4 py-2 text-center">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.keys(THEMES[themeKey].indicators).map(indicatorKey => (
                  <tr key={indicatorKey}>
                    <td className="px-4 py-2 ">{THEMES[themeKey].indicators[indicatorKey]}</td>
                    <td className="px-4 py-2 text-center">{baselineRecord[themeKey]?.[indicatorKey] != null ? `${baselineRecord[themeKey][indicatorKey]}%`: 'N/A'}</td>
                    <td className="px-4 py-2 text-center">
                      {block[themeKey]?.[indicatorKey] != null ? `${block[themeKey][indicatorKey]}%` : 'N/A'}
                    </td>
                    {comparisonBlock && (
                      <td className="px-4 py-2 text-center">
                        {comparisonBlock[themeKey]?.[indicatorKey] != null ? `${comparisonBlock[themeKey][indicatorKey]}%` : 'N/A'}
                      </td>
                    )}
                    <td>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
