import styles from "../../styles/global/Box.module.css";

const Box = ({ title, children, className }) => {
  return (
    <div className={`${styles.box} ${className}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Box;
