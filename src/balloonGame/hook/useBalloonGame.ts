import { useEffect, useState } from "react";

type Props = {
  rows?: number;
  columns?: number;
  balloonProbability?: number;
};

export default function useBalloonGame({
  rows = 6,
  columns = 6,
  balloonProbability = 30,
}: Props) {
  if (balloonProbability < 0 || balloonProbability > 100) {
    throw new Error("balloonProbability은 0이상, 100이하까지 가능합니다.");
  }

  const probability = balloonProbability / 100;

  const generateGrid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Math.random() < probability)
  );

  const [grid, setGrid] = useState(generateGrid);
  const [balloonCount, setBalloonCount] = useState<number[]>([]);
  const [isFailure, setIsFailure] = useState(false);

  const isClear = grid.every((row) => row.every((cell) => cell === false));

  const directions = [
    [-1, 0], // 상
    [1, 0], // 하
    [0, -1], // 좌
    [0, 1], // 우
  ];

  const isValid = (x: number, y: number, checkedGrid: boolean[][]) => {
    return (
      x >= 0 &&
      y >= 0 &&
      x < rows &&
      y < columns &&
      !checkedGrid[x][y] &&
      grid[x][y]
    );
  };

  const calcGroup = (x: number, y: number, checkedGrid: boolean[][]) => {
    const sum: [number, number][] = [];

    sum.push([x, y]);
    checkedGrid[x][y] = true;

    const top = [x + directions[0][0], y + directions[0][1]];
    const down = [x + directions[1][0], y + directions[1][1]];
    const left = [x + directions[2][0], y + directions[2][1]];
    const right = [x + directions[3][0], y + directions[3][1]];

    if (isValid(top[0], top[1], checkedGrid)) {
      checkedGrid[top[0]][top[1]] = true;
      if (grid[top[0]][top[1]]) {
        sum.push(...calcGroup(top[0], top[1], checkedGrid));
      }
    }
    if (isValid(down[0], down[1], checkedGrid)) {
      checkedGrid[down[0]][down[1]] = true;
      if (grid[down[0]][down[1]]) {
        sum.push(...calcGroup(down[0], down[1], checkedGrid));
      }
    }
    if (isValid(left[0], left[1], checkedGrid)) {
      checkedGrid[left[0]][left[1]] = true;
      if (grid[left[0]][left[1]]) {
        sum.push(...calcGroup(left[0], left[1], checkedGrid));
      }
    }
    if (isValid(right[0], right[1], checkedGrid)) {
      checkedGrid[right[0]][right[1]] = true;
      if (grid[right[0]][right[1]]) {
        sum.push(...calcGroup(right[0], right[1], checkedGrid));
      }
    }

    return sum;
  };

  const onClick = (rowIndex: number, columnIndex: number) => {
    const balloonGroup = getBalloonGroup(rowIndex, columnIndex);

    if (balloonCount[balloonCount.length - 1] === balloonGroup.length) {
      const newGrid = [...grid];

      balloonGroup.forEach(([x, y]) => (newGrid[x][y] = false));

      setGrid(newGrid);
    } else {
      setIsFailure(true);
    }
  };

  const onReset = () => {
    setGrid(generateGrid);
    setIsFailure(false);
  };

  const getBalloonGroup = (x: number, y: number) => {
    const row = grid.length;
    const column = grid[0].length;

    const checkedGrid = Array.from({ length: row }, () =>
      Array.from({ length: column }, () => false)
    );

    return calcGroup(x, y, checkedGrid);
  };

  const getBalloonCount = (grid: boolean[][]) => {
    const row = grid.length;
    const column = grid[0].length;

    const sum: number[] = [];

    const checkedGrid = Array.from({ length: row }, () =>
      Array.from({ length: column }, () => false)
    );

    checkedGrid.forEach((rows, rowIndex) => {
      rows.forEach((_, columnIndex) => {
        if (
          isValid(rowIndex, columnIndex, checkedGrid) &&
          grid[rowIndex][columnIndex]
        ) {
          const ballonGroup = calcGroup(rowIndex, columnIndex, checkedGrid);
          if (ballonGroup.length) {
            sum.push(ballonGroup.length);
          }
        }
      });
    });

    return sum.sort((a, b) => a - b);
  };

  useEffect(() => {
    setBalloonCount(getBalloonCount(grid));
  }, [grid]);

  return {
    grid,
    isClear,
    isFailure,
    onClick,
    onReset,
  };
}
