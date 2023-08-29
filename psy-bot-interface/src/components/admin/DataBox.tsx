import React, { ReactNode } from 'react';

type GeneralBoxProps = {
  title?: string;
  children: ReactNode;
};

const DataBox = ({ title, children }: GeneralBoxProps) => {
  return (
    <div className="h-max bg-gray-100 p-4 rounded-3xl">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div className="input-container">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            if (child.type === 'input') {
              // Clone the input element with additional props
              const clonedElement = React.cloneElement(
                child as React.ReactElement,
                {
                  className: "w-full border rounded-xl p-2 mt-1",
                  key: index,
                }
              );
              return clonedElement;
            } else if (child.type === 'p'){
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
