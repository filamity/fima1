import styles from "../../styles/global/Box.module.css";

const Box = ({ title, children, className, disablePadding = false }) => {
  return (
    <div className={`${styles.box} ${className}`}>
      <div className={styles.title}>{title}</div>
      <div
        className={`${styles.content} ${disablePadding && "disablepadding"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Box;
