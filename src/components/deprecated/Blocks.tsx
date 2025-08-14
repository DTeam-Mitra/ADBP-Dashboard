import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {THEMES} from '@/utils/csvParser'; // Importing THEMES from the main dashboard file
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const BlockDetailView = ({ block, onBack }) => { 
    if (!block) return <div>No block selected</div>;

    const getSvgPath = (blockName) => {
        // Remove special characters but keep spaces and hyphens
        const safeName = blockName.replace(/[^\w\s\-]/g, '');
        return `/Block Image/${safeName}.svg`;
    };

    const imgSrc = getSvgPath(block.blockName);

    return (
        <Card>
             <CardHeader className="grid grid-cols-2 gap-4 p-6 bg-white shadow-sm rounded-lg">
      {/* Column 1, Row 1: Back Button */}
      <div className="row-start-1 col-start-1">
        <Button onClick={onBack} variant="outline" className="w-fit">
          ← Back to All Blocks
        </Button>
      </div>

      {/* Column 1, Row 2: Title & Description */}
      <div className="row-start-2 col-start-1 space-y-1">
        <CardTitle className="text-2xl font-semibold">
          {block.blockName}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {block.districtName}
        </CardDescription>
      </div>

      {/* Column 2: Avatar / Image */}
      <div className="row-span-2 col-start-2 flex justify-end items-center pr-6">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${block.blockName} map`}
            className="object-contain w-[150px] h-[150px] md:w-[200px] md:h-[200px] drop-shadow-lg"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <Avatar className="w-[150px] h-[150px] md:w-[200px] md:h-[200px]">
            <AvatarFallback className="text-2xl">
              {block.blockName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </CardHeader>
            <CardContent className="space-y-4 margin-top-4 p-6">
                {THEMES && Object.keys(THEMES).map(themeKey => (
                    <div key={themeKey}>
                        <h4 className="font-semibold text-lg mb-2 border-b pb-1">
                            {THEMES[themeKey].name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                            {Object.keys(THEMES[themeKey].indicators).map(indicatorKey => (
                                <div key={indicatorKey} className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {THEMES[themeKey].indicators[indicatorKey]}:
                                    </span>
                                    <span className="font-bold">
                                        {block[themeKey]?.[indicatorKey] ?? 'N/A'}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
        
    );
}


export const BlocksView = ({ data, onBlockSelect, rankingMap }) => { 
    const findBestTheme = (block) => {
        let bestTheme = { name: 'N/A' };
        let bestRank = Infinity;
        Object.keys(THEMES).forEach(themeKey => {
            const themeData = block[themeKey];
            if(themeData && themeData.rank < bestRank) {
                bestRank = themeData.rank;
                bestTheme = { name: THEMES[themeKey].name };
            }
        });
        return bestTheme;
    };

    // Utility to create safe SVG file name from block name
    const getSvgPath = (blockName) => {
        // Replace special characters as per your file naming convention
        const safeName = blockName.replace(/[^\w\s\-]/g, '');

        // Assuming your SVGs are like "public/Block Image/Some_Block.svg"
        return `/Block Image/${safeName}.svg`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((block) => {
                const bestAt = findBestTheme(block);
                const imgSrc = getSvgPath(block.blockName);
                return (
                    <Card 
                        key={block.sno} 
                        className="cursor-pointer hover:border-primary transition-colors" 
                        onClick={() => onBlockSelect(block)}
                    >
                        <div className="flex gap-4 p-4 items-center">
                            <div className="w-1/3 flex-shrink-0">
                                <img 
                                    src={imgSrc}
                                    alt={block.blockName}
                                    className="w-full h-auto object-contain"
                                    onError={e => e.currentTarget.style.display='none'} // fallback if not found
                                />
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
