import { useMemo } from "react";

// Utility function
const groupBoundaryByBlock = (data) => {
    const grouped = {};
    data.forEach((row) => {
        const name = row.sdtname?.trim();
        if (!grouped[name]) grouped[name] = [];
        grouped[name].push([+row.X, +row.Y]);
    });
    return grouped;
};

const BoundarySvg = ({ geoCsvData, blockName }) => {
    const pathData = useMemo(() => {
        if (!geoCsvData?.length || !blockName) return null;

        const grouped = groupBoundaryByBlock(geoCsvData);
        const points = grouped[blockName];
        if (!points || points.length < 3) return null;

        // Normalize coordinates
        const scale = 5;
        const minX = Math.min(...points.map(p => p[0]));
        const minY = Math.min(...points.map(p => p[1]));

        const normalized = points.map(([x, y]) => [
            (x - minX) * scale,
            (minY - y) * scale
        ]);

        return `M ${normalized.map(p => p.join(",")).join(" L ")} Z`;
    }, [geoCsvData, blockName]);

    if (!pathData) {
        return (
            <div className="w-full h-64 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No boundary data</span>
            </div>
        );
    }

    return (
        <div className="w-full h-64 bg-secondary rounded-lg flex items-center justify-center p-4">
            <svg viewBox="0 0 500 500" className="w-full h-full text-primary/70">
                <path d={pathData} fill="currentColor" stroke="black" strokeWidth="0.5" />
            </svg>
        </div>
    );
};

export default BoundarySvg;
