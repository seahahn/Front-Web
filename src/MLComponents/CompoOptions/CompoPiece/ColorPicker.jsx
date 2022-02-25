import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

function ColorPicker(defaultColor, setColorState) {
  const [btnColor, setBtnColor] = useState(defaultColor);
  const [isColorPickOpened, setIsColorPickOpened] = useState(false);

  // 색 선택창 열려 있으면 다른 영역 아무 곳이나 클릭 시 선택창 닫기
  const handleColorPickerClose = () => {
    setIsColorPickOpened(false);
  };

  // 선택한 색에 맞춰 해당 버튼 색 변경
  const colorBtn = {
    backgroundColor: btnColor,
  };

  const handleColorChange = (color) => {
    setColorState(color);
    setBtnColor(color);
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        style={colorBtn}
        className="text-black focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => setIsColorPickOpened(!isColorPickOpened)}>
        배경색 선택
      </button>
      {isColorPickOpened ? (
        <div className="relative">
          {/* relative는 버튼 위치 기준으로 나오게 하기 위함 */}
          <div className="absolute z-10">
            {/* absolute는 다른 요소 위에 겹쳐서 표시되게 하기 위함 */}
            {/* fixed는 색 선택 창 외 전체화면 영역 어디든 클릭하면 닫히게 만드는 부분 만들기 위함 */}
            <div className="fixed top-0 right-0 bottom-0 left-0" onClick={handleColorPickerClose} />
            <HexColorPicker color={defaultColor} onChange={handleColorChange} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ColorPicker;
