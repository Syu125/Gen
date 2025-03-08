import React from 'react';

import styles from './Button.module.css';

type buttonProps = {
  className: string;
  text: string;
  path: string;
  iconPath?: string;
  iconLeading?: string;
  iconTrailing?: string;
};

const Button: React.FC<buttonProps> = ({ className, text, path }) => {
  return (
    <div className={`${className} ${styles.button}`}>
      <a href={path}>
        <div>{text}</div>
      </a>
    </div>
  );
};

export default Button;
