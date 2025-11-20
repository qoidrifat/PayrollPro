import React from 'react';
import { PayrollStatus } from '../types';

interface Props {
  status: PayrollStatus | string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  let colors = 'bg-gray-100 text-gray-800';

  switch (status) {
    case PayrollStatus.PAID:
      colors = 'bg-green-100 text-green-800 border border-green-200';
      break;
    case PayrollStatus.APPROVED:
      colors = 'bg-blue-100 text-blue-800 border border-blue-200';
      break;
    case PayrollStatus.SUBMITTED:
      colors = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      break;
    case PayrollStatus.DRAFT:
      colors = 'bg-gray-100 text-gray-600 border border-gray-200';
      break;
  }

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors}`}>
      {status}
    </span>
  );
};
