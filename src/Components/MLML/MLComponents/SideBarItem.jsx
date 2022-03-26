import React from "react";
import { useDrag } from "react-dnd";

const SideBarItem = ({ data }) => {
  const [{ opacity }, drag] = useDrag({
    type: data.type,
    item: data,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  return (
    <div className="rounded-lg bg-slate-100 hover:bg-teal-300 text-slate-900 hover:text-slate-700 px-2 py-1 mt-2 min-w-full" ref={drag} style={{ opacity }}>
      {/* {data.id}
      <br /> */}
      {/* break-normal whitespace-nowrap => 크기 줄여도 텍스트 줄바꿈 일어나지 않음 */}
      <p className="break-normal whitespace-nowrap text-sm font-bold">{data.title}</p>
      {/* <p className="break-normal whitespace-nowrap text-sm">{data.content}</p> */}
    </div>
  );
};
export default React.memo(SideBarItem);
