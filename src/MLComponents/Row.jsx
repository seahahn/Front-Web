import React, { useRef } from "react";
import DropZone from "MLComponents/DropZone";
// import Component from "./Component";
import Component from "MLComponents/Component";

const Row = ({ data, handleDrop, path }) => {
  const ref = useRef(null);

  const renderComponent = (component, compoType, currentPath) => {
    return (
      <Component
        key={component.id}
        data={component}
        compoType={compoType} // PREPROCESS TRAIN EVAL
        path={currentPath}
      />
    );
  };

  return (
    <div ref={ref} className="base row rounded-lg my-3">
      {data.id}
      {data.children.map((component, index) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            <DropZone
              data={{ path: currentPath, childrenCount: data.children.length }}
              onDrop={handleDrop}
              accept={data.id} // PREPROCESS TRAIN EVAL
            />
            {renderComponent(component, data.id, currentPath)}
          </React.Fragment>
        );
      })}
      <DropZone data={{ path: `${path}-${data.children.length}`, childrenCount: data.children.length }} onDrop={handleDrop} accept={data.id} isLast />
    </div>
  );
};
export default Row;
