import React, { ReactNode, useState, useEffect } from 'react';

type GeneralBoxProps = {
  title?: string;
  enabled?: boolean;
  children: ReactNode;
  id: string;
};

const DataBox: React.FC<GeneralBoxProps> = ({ title, enabled, children, id }) => {
  return (
    <div
      className={`h-max border border-black p-4 rounded-3xl ${enabled ? '' : 'opacity-50 pointer-events-none'}`}
      tabIndex={enabled ? 0 : -1}
      aria-disabled={!enabled}
    >
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div className="input-container">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            if (child.type === 'input') {
              const clonedElement = React.cloneElement(
                child as React.ReactElement,
                {
                  className: "w-full h-10 bg-gray-200 text-gray-900 border rounded-xl p-2 mt-2 mb-2 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder-gray-500 file:cursor-pointer text-sm",
                  key: index,
                  disabled: !enabled, // Disable the input when not enabled
                }
              );
              return clonedElement;
            } else if (child.type === 'p') {
              const clonedElement = React.cloneElement(
                child as React.ReactElement,
                {
                  className: "mt-4",
                  key: index,
                }
              );
              return clonedElement;
            } else {
              return child;
            }
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default DataBox;
