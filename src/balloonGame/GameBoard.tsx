import styled from "styled-components";
import Cell from "./Cell";
import Dialog from "./Dialog/Dialog";
import useBalloonGame, { BalloonGameType } from "./hook/useBalloonGame";

export default function GameBoard({
  rows = 6,
  columns = 6,
  balloonProbability = 30,
}: BalloonGameType) {
  const { grid, isClear, isFailure, onClick, onReset } = useBalloonGame({
    rows,
    columns,
    balloonProbability,
  });

  return (
    <>
      <StyledGameBoard>
        <ResetButton onClick={onReset}>게임 재시작</ResetButton>

        <div>
          {grid.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((hasBalloon, columnIndex) => (
                <Cell
                  key={`${rowIndex}-${columnIndex}`}
                  hasBalloon={hasBalloon}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  onClick={onClick}
                />
              ))}
            </Row>
          ))}
        </div>
      </StyledGameBoard>

      {(isClear || isFailure) && (
        <Dialog
          isOpen={isClear || isFailure}
          title={isClear ? "성공🎉" : "실패😥"}
          onConfirm={onReset}
        />
      )}
    </>
  );
}

const StyledGameBoard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const Row = styled.div`
  display: flex;
`;

const ResetButton = styled.button`
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 4px;
  text-align: center;
`;
