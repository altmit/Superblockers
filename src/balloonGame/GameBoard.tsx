import styled from "styled-components";
import Cell from "./Cell";
import Dialog from "./Dialog/Dialog";
import useBalloonGame from "./hook/useBalloonGame";

type Props = {
  rows?: number;
  columns?: number;
  balloonProbability?: number;
};

export default function GameBoard({
  rows = 6,
  columns = 6,
  balloonProbability = 30,
}: Props) {
  const { grid, isClear, isFailure, onClick, onReset } = useBalloonGame({
    rows,
    columns,
    balloonProbability,
  });

  return (
    <>
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
      {isClear && (
        <Dialog isOpen={isClear} title="성공🎉" onConfirm={onReset} />
      )}
      {isFailure && (
        <Dialog isOpen={isFailure} title="실패😥" onConfirm={onReset} />
      )}
    </>
  );
}

const Row = styled.div`
  display: flex;
`;
