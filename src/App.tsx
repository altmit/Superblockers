import styled from "styled-components";
import GameBoard from "./balloonGame/GameBoard";

export default function App() {
  return (
    <>
      <GameBoardWrapper>
        <GameBoard />
      </GameBoardWrapper>
    </>
  );
}

const GameBoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
