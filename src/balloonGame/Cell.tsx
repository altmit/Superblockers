import styled from "styled-components";

type Props = {
  hasBalloon: boolean;
  onClick: () => void;
};

export default function Cell({ hasBalloon, onClick }: Props) {
  return (
    <StyledCell onClick={onClick} $hasBalloon={hasBalloon}>
      {hasBalloon ? "🎈" : ""}
    </StyledCell>
  );
}

const StyledCell = styled.div<{ $hasBalloon: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px solid black;
  font-size: 30px;
  cursor: ${({ $hasBalloon }) => ($hasBalloon ? "pointer" : "not-allowed")};
`;
