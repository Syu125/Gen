import React from 'react';

import styles from './Button.module.css';

type buttonProps = {
  className: string;
  text: string;
  onClick: () => void;
  iconPath?: string;
  iconLeading?: string;
  iconTrailing?: string;
};

const Button: React.FC<buttonProps> = ({ className, text, onClick }) => {
  return (
    <button className={`${className} ${styles.button}`} onClick={onClick}>
      <div>{text}</div>
    </button>
  );
};

export default Button;
