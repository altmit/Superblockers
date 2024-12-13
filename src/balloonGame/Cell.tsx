import { memo } from "react";
import styled from "styled-components";

type Props = {
  hasBalloon: boolean;
  rowIndex: number;
  columnIndex: number;
  onClick: (rowIndex: number, colIndex: number) => void;
};

export default memo(function Cell({
  hasBalloon,
  rowIndex,
  columnIndex,
  onClick,
}: Props) {
  return (
    <StyledCell
      onClick={() => onClick(rowIndex, columnIndex)}
      $hasBalloon={hasBalloon}
    >
      {hasBalloon ? "🎈" : ""}
    </StyledCell>
  );
});

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
