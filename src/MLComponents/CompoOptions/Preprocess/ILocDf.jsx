import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import classNames from "classnames";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";

function ILocDf({ formId, resultId, param, setParam }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const columnIdxs = columns.map((_, idx) => String(idx)); // 컬럼 인덱스 목록
  const colFromArray = ["처음", ...columnIdxs];
  const colToArray = ["끝", ...columnIdxs];
  const colObjArray = [...columns.map((_, idx) => ({ label: String(idx), value: String(idx) }))]; // MultiSelect에서 사용하는 객체 목록

  // 선택 : 불러올 인덱스 또는 컬럼을 개별 선택 / 범위 : 시작부터 종료까지의 범위 선택
  // 선택을 하면 범위 지정 불가. 반대도 마찬가지.
  // 인덱스는 선택, 컬럼은 범위 지정 가능. 반대도 마찬가지.
  // const [params, setParams] = useState({
  //   idx: "", // 선택 인덱스 목록(1, 2, 3, ...)
  //   idx_from: "", // 범위 시작 인덱스
  //   idx_to: "", // 범위 종료 인덱스
  //   cols: "", // 선택 컬럼 목록(컬럼1, 컬럼2, ...)
  //   col_from: "", // 범위 시작 컬럼
  //   col_to: "", // 범위 종료 컬럼
  // });

  // const [isIdxRange, setIsIdxRange] = useState(false); // 인덱스 범위 지정 여부
  // const [isColRange, setIsColRange] = useState(false); // 컬럼 범위 지정 여부

  // DOM 접근 위한 Ref
  const idxRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setParam({
      ...param,
      cols: e,
    });
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setParam({
        ...param,
        [name]: checked,
      });
    } else {
      setParam({
        ...param,
        [name]: value,
      });
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 입력 필수 값 체크
    if (!param.isIdxRange && param.idx === "") {
      idxRef.current.focus();
      return;
    }
    const paramResult = {
      idx: param.isIdxRange ? "" : param.idx,
      idx_from: param.isIdxRange ? param.idx_from : "",
      idx_to: param.isIdxRange ? param.idx_to : "",
      cols: param.isColRange ? "" : [...param.cols.map((col) => col.value)],
      col_from: param.isColRange ? param.col_from : "",
      col_to: param.isColRange ? param.col_to : "",
    }; // 입력해야 할 파라미터 설정
    console.log(param);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.ILocDf), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1 mr-4 space-y-2">
          <Switch text="범위 지정 여부" name="isIdxRange" onChange={handleChange} checked={param.isIdxRange} />
          <div className={classNames(param.isIdxRange ? "hidden" : "", "flex flex-row items-center")}>
            <label>
              인덱스 지정
              <input
                ref={idxRef}
                name={"idx"}
                className={inputStyle}
                type="text"
                onChange={handleChange}
                defaultValue={param.idx}
                placeholder="예시) 1, 2, 3, ..."
                pattern="/[0-9,]/gm"
              />
            </label>
          </div>
          <div className={classNames(param.isIdxRange ? "" : "hidden", "flex flex-col")}>
            <label>
              시작 인덱스
              <input
                name={"idx_from"}
                placeholder="미지정시 처음 인덱스"
                className={inputStyle}
                type="number"
                onChange={handleChange}
                defaultValue={param.idx_from}
              />
            </label>
            <label>
              종료 인덱스
              <input
                name={"idx_to"}
                placeholder="미지정시 마지막 인덱스"
                className={inputStyle}
                type="number"
                onChange={handleChange}
                defaultValue={param.idx_to}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col flex-1 space-y-2">
          <Switch text="범위 지정 여부" name="isColRange" onChange={handleChange} checked={param.isColRange} />
          <div className={classNames(param.isColRange ? "hidden" : "", "flex flex-row items-center")}>
            <span className="mr-2">컬럼 선택</span>
            <MultiSelect options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} defaultValue={param.cols} />
          </div>
          <div className={classNames(param.isColRange ? "" : "hidden", "flex flex-col align-middle")}>
            <Select options={colFromArray} name={"col_from"} text="시작 컬럼" onChange={handleChange} defaultValue={param.col_from} />
            <Select options={colToArray} name={"col_to"} text="종료 컬럼" onChange={handleChange} defaultValue={param.col_to} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default ILocDf;
