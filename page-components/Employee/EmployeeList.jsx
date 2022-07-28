import React from 'react';
import { useEmployeePages } from '@/lib/user';
import styles from './Employee.module.css';
import clsx from 'clsx';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('email', {
    header: () => 'Email',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('role', {
    header: () => 'Role',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('username', {
    header: () => <span>Username</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('company.name', {
    header: 'Company',
    footer: (info) => info.column.id,
  }),
];

const EmployeeList = () => {
  const { data2, error } = useEmployeePages();
  console.log('erroremployee', error);

  const table = useReactTable({
    data: data2 && data2.users ? data2.users : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={'p-2'}>
      <table className={clsx(styles['responsive-table'])}>
        <thead className={styles['table-header']}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={styles['tr-head']} key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => (
                <th
                  className={clsx(styles.col, styles[`col-${i + 1}`])}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              className={clsx(styles['table-row'], styles['tr-body'])}
              key={row.id}
            >
              {row.getVisibleCells().map((cell, i) => (
                <td
                  className={clsx(styles.col, styles[`col-${i + 1}`])}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
