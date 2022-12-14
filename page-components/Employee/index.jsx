import { Spacer } from '@/components/Layout';
import { useState } from 'react';
import styles from './Employee.module.css';
// import Poster from './Poster';
import EmployeeList from './EmployeeList';
import EmployeeModal from './EmployeeModal';
import { Button } from '@/components/Button';

export const Employee = () => {
  const [isModalShow, setModalShow] = useState(false);

  const handleShow = () => {
    setModalShow(!isModalShow);
  };

  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <div className={styles.container}>
        <Button type="secondary" onClick={handleShow}>
          Add Member
        </Button>
      </div>
      <Spacer size={1} axis="vertical" />
      <EmployeeList />
      <EmployeeModal show={isModalShow} handleShow={handleShow} />
    </div>
  );
};
