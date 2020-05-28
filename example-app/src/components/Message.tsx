import React from 'react';

interface IProps {
  readonly message: string;
  readonly selfClose: () => void;
}

export const Message: React.FC<IProps> = ({ message, selfClose }: IProps) => {
  setTimeout(selfClose, 1500);
  return <div>{message}</div>;
};
