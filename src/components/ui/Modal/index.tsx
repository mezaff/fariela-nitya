import { Dispatch, useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { on } from "events";
import { doc } from "firebase/firestore";

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: any;
}) => {
  const ref: any = useRef();
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className={styles.modal}>
      <div className={styles.modal__main} ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
