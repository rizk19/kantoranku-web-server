import { Employee } from '@/page-components/Employee';
import Head from 'next/head';

const EmployeePage = () => {
  return (
    <>
      <Head>
        <title>Employee</title>
      </Head>
      <Employee />
    </>
  );
};

export default EmployeePage;
