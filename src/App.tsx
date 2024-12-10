import { useState } from "react";
import styled from "styled-components";
import GameBoard from "./balloonGame/GameBoard";
import useDebounce from "./hook/useDebounce";

export default function App() {
  const [rows, setRows] = useState(6);
  const [columns, setColumns] = useState(6);
  const [balloonProbability, setBalloonProbability] = useState(30);

  const debouncedRows = useDebounce(rows);
  const debouncedColumns = useDebounce(columns);
  const debouncedBalloonProbability = useDebounce(balloonProbability);

  return (
    <StyledApp>
      <InputWrapper>
        <label>가로</label>
        <StyledInput
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
        />
        <label>세로</label>
        <StyledInput
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
        />
        <label>확률</label>
        <StyledInput
          value={balloonProbability}
          onChange={(e) => setBalloonProbability(Number(e.target.value))}
        />
      </InputWrapper>

      <GameBoardWrapper>
        <GameBoard
          rows={debouncedRows}
          columns={debouncedColumns}
          balloonProbability={debouncedBalloonProbability}
        />
      </GameBoardWrapper>
    </StyledApp>
  );
}

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
  width: 100%;
`;

const GameBoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100px;
  height: 25px;
  border: 1px solid black;
  border-radius: 4px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
