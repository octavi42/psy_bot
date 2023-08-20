import React, { ReactNode } from 'react';

type GeneralBoxProps = {
  title?: string;
  children: ReactNode;
};

const DataBox = ({ title, children }: GeneralBoxProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
};

export default DataBox;
