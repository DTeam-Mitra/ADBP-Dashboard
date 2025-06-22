type BoundaryPoint = {
  X: number;
  Y: number;
  sdtname: string;
};

export const groupBoundaryByBlock = (data: BoundaryPoint[]) => {
  const grouped: { [blockName: string]: [number, number][] } = {};
  data.forEach((row) => {
    if (!grouped[row.sdtname]) grouped[row.sdtname] = [];
    grouped[row.sdtname].push([+row.X, +row.Y]);
  });
  return grouped;
};
