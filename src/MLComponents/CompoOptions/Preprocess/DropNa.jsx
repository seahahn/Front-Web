import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { saveDf, showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import classNames from "classnames";
import { BlockContext } from "MLComponents/Column";

function DropNa({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [axis, setAxis] = useState(0); // Select 축 선택(0: 행, 1: 열)
  const [how, setHow] = useState("any"); // Select 제거 방법(any: 하나라도 결측치면 제거, all: 전부 결측치면 제거)
  const [thresh, setThresh] = useState(""); // input number 최소 데이터 개수(결측치 제외)
  const [subset, setSubset] = useState([]); // MultiSelect 결측치 감지 대상 컬럼

  // DOM 접근 위한 Ref
  const axisRef = useRef();
  const howRef = useRef();
  const threshRef = useRef();
  const subsetRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingSubset = (e) => {
    setSubset([...e.map((col) => col.value)]);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case axisRef.current:
        setAxis(event.target.value);
        break;
      case howRef.current:
        setHow(event.target.value);
        break;
      case threshRef.current:
        setThresh(event.target.value);
        break;
      default:
        console.log("error");
        break;
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      axis: axis,
      how: how,
      thresh: thresh,
      subset: subset,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.DropNa), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);

        // 컬럼 삭제된 경우 새로운 컬럼 목록 가져와서 입력 목록에 넣기
        // if (axis == 1) {
        //   const newColOptions = columns.filter((col) => !labelsCol.includes(col));
        //   setColOptions([...newColOptions.map((col) => ({ label: col, value: col }))]);
        // }
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row space-x-2">
        <div className="flex flex-col flex-1">
          <Select options={[0, 1]} optionText={["행", "열"]} ref={axisRef} text="축 선택(axis)" onChange={handleChange} defaultValue={0} />
          <div className={classNames()}>
            <label>
              결측치 제외 최소 데이터 수 기준(thresh)
              <input ref={threshRef} className={inputStyle} type="number" min={1} placeholder="기본값 None" onChange={handleChange} />
            </label>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <Select options={["any", "all"]} ref={howRef} text="결측치 제거 방식(how)" onChange={handleChange} />
          <div className={classNames("flex items-center space-x-2")}>
            <label className="block">결측치 감지 대상 컬럼(subset)</label>
            <MultiSelect ref={subsetRef} options={colObjArray} onChange={settingSubset} className="block" isMulti={true} closeMenuOnSelect={false} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default React.memo(DropNa);
