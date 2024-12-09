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

  const onClick = (rowIndex: number, columnIndex: number) => {
    console.log(rowIndex, columnIndex);
  };

  return (
    <div>
      {grid.map((row, rowIndex) => (
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
