import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { saveDf, showDataResult, getColumns } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { Select } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import classNames from "classnames";
import { BlockContext } from "Components/MLML/MLComponents/Column";

function DropNa({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  // 컬럼 선택(MultiSelect)
  const settingSubset = (e) => {
    setParam({
      ...param,
      subset: e,
    });
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParam({
      ...param,
      [name]: value,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const paramResult = {
      ...param,
      subset: [...param.subset.map((col) => col.value)],
    };
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.DropNa), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-around">
          <Select options={[0, 1]} optionText={["행", "열"]} name={"axis"} text="축 선택(axis)" onChange={handleChange} defaultValue={param.axis} />
          <Select options={["any", "all"]} name={"how"} text="결측치 제거 방식(how)" onChange={handleChange} defaultValue={param.how} />
        </div>
        <div className="flex flex-col space-y-2">
          <div className={classNames("flex flex-row")}>
            <label>결측치 제외 최소 데이터 수 기준(thresh)</label>
            <input name={"thresh"} className={inputStyle} type="number" min={1} placeholder="기본값 None" onChange={handleChange} defaultValue={param.thresh} />
          </div>
          <div className={classNames("flex items-center space-x-2 max-w-3/5")}>
            <label className="block">결측치 감지 대상 컬럼(subset)</label>
            <MultiSelect
              name={"subset"}
              options={colObjArray}
              onChange={settingSubset}
              className="block flex-1"
              isMulti={true}
              closeMenuOnSelect={false}
              defaultValue={param.subset}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default DropNa;
