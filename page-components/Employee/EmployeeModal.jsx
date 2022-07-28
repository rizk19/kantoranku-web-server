import React, { useRef } from 'react';
import styles from './EmployeeModal.module.css';
import { SignUpMember } from '@/page-components/Auth';
// import clsx from 'clsx';

const EmployeeModal = ({ show, handleShow }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const nameRef = useRef();

  const handleDone = () => {
    emailRef.current.value = '';
    passwordRef.current.value = '';
    usernameRef.current.value = '';
    nameRef.current.value = '';
    handleShow();
  };
  return (
    <div id="employeeModal" className={show ? styles.modalShow : styles.modal}>
      <div className={styles['modal-content']}>
        <span onClick={() => handleShow()} className={styles.close}>
          &times;
        </span>
        <SignUpMember
          handleCloseModal={handleDone}
          emailRef={emailRef}
          passwordRef={passwordRef}
          usernameRef={usernameRef}
          nameRef={nameRef}
        />
      </div>
    </div>
  );
};

export default EmployeeModal;
