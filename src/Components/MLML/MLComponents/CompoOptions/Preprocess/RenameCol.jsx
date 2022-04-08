import React, { useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { saveDf, showDataResult, getColumns } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { Select, Switch } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "Components/MLML/MLComponents/Column";

function RenameCol({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  // const [params, setParams] = useState({
  //   keys: [], // MultiSelect 변경될 컬럼명
  //   values: "", // input text 변경할 컬럼명
  //   copy: true, // Switch 컬럼명 복사/삽입 여부
  //   errors: "ignore", // Select 없는 컬럼명 지정 시 에러 발생 여부
  // });

  // DOM 접근 위한 Ref
  const keysRef = useRef();
  const valuesRef = useRef();

  const settingKeys = (e) => {
    setParam({
      ...param,
      keys: e,
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
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 입력 필수 값 체크
    if (param.keys.length === 0) {
      keysRef.current.focus();
      return;
    } else if (param.values === "") {
      valuesRef.current.focus();
      return;
    }

    const paramResult = {
      ...param,
      keys: [...param.keys.map((key) => key.value)],
    };

    // 백앤드 전송을 위한 설정
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.RenameCol), paramResult);
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
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <label className="flex-none self-center">변경 전 컬럼명(keys)</label>
          <MultiSelect
            ref={keysRef}
            options={colObjArray}
            onChange={settingKeys}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={param.keys}
          />
        </div>
        <div className="flex flex-row">
          <label className="flex-none">변경 후 컬럼명(values)</label>
          <input
            name={"values"}
            ref={valuesRef}
            className={inputStyle + " w-full"}
            type="text"
            placeholder="변경 후의 컬럼명들을 입력해주세요"
            onChange={handleChange}
            defaultValue={param.values}
          />
        </div>
        <Switch name={"copy"} text="Copy" onChange={handleChange} checked={param.copy} />
        <Select options={["ignore", "raise"]} name={"errors"} text="에러 표시 여부" onChange={handleChange} defaultValue={param.errors} />
      </div>
    </form>
  );
}

export default RenameCol;
