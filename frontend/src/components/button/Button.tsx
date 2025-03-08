import React from 'react';

import styles from './Button.module.css';

type buttonProps = {
  className: string;
  text: string;
  iconPath?: string;
  iconLeading?: string;
  iconTrailing?: string;
};

const Button: React.FC<buttonProps> = ({ className, text }) => {
  return (
    <div className={`${className} ${styles.button}`}>
      <div>{text}</div>
    </div>
  );
};

export default Button;
