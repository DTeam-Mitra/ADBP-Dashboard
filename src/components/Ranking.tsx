import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { CSVData } from "@/utils/csvParser";

interface RankingViewProps {
  data: CSVData[];
  rankingMap: Record<number, number>;
  previousRankingMap: Record<number, number>;
}

export const RankingView: React.FC<RankingViewProps> = ({
  data,
  rankingMap,
  previousRankingMap
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Rankings</CardTitle>
        <CardDescription>
          Overall ranking based on the balanced composite score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>District</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((block) => {
              const current = rankingMap[block.sno];
              const previous = previousRankingMap[block.sno];

              // positive diff => improvement (green ↑)
              // negative diff => worsened    (red ↓)
              const diff = previous != null ? previous - current : 0;
              let symbol = "";
              let colorCls = "";
              if (previous != null) {
                if (diff > 0) {
                  symbol = "↑";
                  colorCls = "text-green-600";
                } else if (diff < 0) {
                  symbol = "↓";
                  colorCls = "text-red-600";
                }
              }

              return (
                <TableRow key={block.sno}>
                  <TableCell className="font-bold text-lg">{current}</TableCell>
                  <TableCell className={`text-medium font-lg p-2 ${colorCls}`}>
                    {previous != null
                      ? `${symbol}${Math.abs(diff)}`
                      : "—"}
                  </TableCell>
                  <TableCell>{block.blockName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {block.districtName}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {block.balancedCompositeScore.toFixed(2)}
                  </TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
