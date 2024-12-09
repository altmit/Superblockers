import { useState } from "react";
import styled from "styled-components";
import Cell from "./Cell";

type Props = {
  rows?: number;
  columns?: number;
  balloonProbability?: number;
};

export default function GameBoard({
  rows = 6,
  columns = 6,
  balloonProbability = 40,
}: Props) {
  if (balloonProbability < 0 || balloonProbability > 100) {
    throw new Error("balloonProbability은 0이상, 100이하까지 가능합니다.");
  }

  const probability = balloonProbability / 100;

  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Math.random() < probability)
  );

  const [gridState, setGridState] = useState(grid);

  const onClick = (rowIndex: number, columnIndex: number) => {
    const balloonGroup = getBalloonGroup(rowIndex, columnIndex);
    const newGrid = [...gridState];

    balloonGroup.forEach(([x, y]) => (newGrid[x][y] = false));

    setGridState(newGrid);
  };

  const getBalloonGroup = (x: number, y: number) => {
    const row = gridState.length;
    const column = gridState[0].length;

    const checkedGrid = Array.from({ length: row }, () =>
      Array.from({ length: column }, () => false)
    );

    const directions = [
      [-1, 0], // 상
      [1, 0], // 하
      [0, -1], // 좌
      [0, 1], // 우
    ];

    const isValid = (x: number, y: number) => {
      return x >= 0 && y >= 0 && x < row && y < column && !checkedGrid[x][y];
    };

    const calcGroup = (x: number, y: number) => {
      const sum: [number, number][] = [];

      sum.push([x, y]);
      checkedGrid[x][y] = true;

      const top = [x + directions[0][0], y + directions[0][1]];
      const down = [x + directions[1][0], y + directions[1][1]];
      const left = [x + directions[2][0], y + directions[2][1]];
      const right = [x + directions[3][0], y + directions[3][1]];

      if (isValid(top[0], top[1])) {
        checkedGrid[top[0]][top[1]] = true;
        if (gridState[top[0]][top[1]]) {
          sum.push(...calcGroup(top[0], top[1]));
        }
      }
      if (isValid(down[0], down[1])) {
        checkedGrid[down[0]][down[1]] = true;
        if (gridState[down[0]][down[1]]) {
          sum.push(...calcGroup(down[0], down[1]));
        }
      }
      if (isValid(left[0], left[1])) {
        checkedGrid[left[0]][left[1]] = true;
        if (gridState[left[0]][left[1]]) {
          sum.push(...calcGroup(left[0], left[1]));
        }
      }
      if (isValid(right[0], right[1])) {
        checkedGrid[right[0]][right[1]] = true;
        if (gridState[right[0]][right[1]]) {
          sum.push(...calcGroup(right[0], right[1]));
        }
      }

      return sum;
    };

    return calcGroup(x, y);
  };

  return (
    <div>
      {gridState.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((hasBalloon, columnIndex) => (
            <Cell
              key={`${rowIndex}-${columnIndex}`}
              hasBalloon={hasBalloon}
              onClick={
                hasBalloon ? () => onClick(rowIndex, columnIndex) : () => {}
              }
            />
          ))}
        </Row>
      ))}
    </div>
  );
}

const Row = styled.div`
  display: flex;
`;
