import { useEffect, useRef } from "react";
import styled from "styled-components";

type Props = {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
};

export default function Dialog({ isOpen, title, onConfirm }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onClose = () => {
    dialogRef.current?.close();
  };

  const onClick = () => {
    onClose();
    onConfirm();
  };

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  return (
    <StyledDialog ref={dialogRef} onClose={onClose}>
      <Title>{title}</Title>
      <StyledButton onClick={onClick}>확인</StyledButton>
    </StyledDialog>
  );
}

const StyledDialog = styled.dialog`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  width: 300px;
  height: 150px;
  border: 1px solid black;
  border-radius: 4px;
`;

const Title = styled.h2`
  font-size: 24px;
`;

const StyledButton = styled.button`
  width: 50px;
  height: 25px;
  border: 1px solid black;
  border-radius: 4px;
`;
