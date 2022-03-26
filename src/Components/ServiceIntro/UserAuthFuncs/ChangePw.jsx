import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "App";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";
import { pwRegexStr } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";

function ChangePw({ isOpen, setIsOpen }) {
  const { userIdx } = useContext(AppContext);

  const [input, setInput] = useState({
    pw: "",
    new_pw: "",
  });

  const [pwVisible, setPwVisible] = useState(false);
  const [newPwVisible, setnewPwVisible] = useState(false);

  const pwRef = useRef();
  const newPwRef = useRef();

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");

    // input 초기화
    pwRef.current.value = "";
    newPwRef.current.value = "";
    setInput({
      pw: "",
      new_pw: "",
    });
    setPwVisible(false);
  }, [isOpen]);

  const handleChange = _.debounce((event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  }, 200);

  const submitPwChange = async (event) => {
    event.preventDefault();
    const { pw, new_pw } = input;
    if (new_pw === pw) {
      alert("현재 비밀번호와 새 비밀번호가 같습니다.");
      return;
    }

    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.pw_change));
    await fetch(targetUrl, httpConfig(JSON.stringify({ ...input, idx: userIdx }), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          alert("비밀번호 변경 성공");
          setIsOpen(false);
        } else {
          data.user_state ? alert("현재 비밀번호가 맞지 않습니다.") : alert("가입하지 않은 이메일입니다.");
        }
      });
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <form
        onSubmit={submitPwChange}
        className="absolute w-full lg:w-2/5 h-fit bg-slate-500 border-2 rounded-lg flex flex-col justify-around divide-solid space-y-2">
        {/* 제목 부분 */}
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg p-2 text-white">비밀번호 변경하기</h3>
          <HiX onClick={() => setIsOpen(false)} className="inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        {/* 현재 비밀번호 입력란 */}
        <div className="flex flex-row items-center">
          <input
            ref={pwRef}
            type={pwVisible ? "text" : "password"}
            name="pw"
            className={"mx-2 px-2 flex-1 text-lg placeholder:text-base rounded-md"}
            placeholder="현재 비밀번호"
            onChange={handleChange}
            required={true}
          />
          <button type="button" className="absolute right-0 mr-4" onClick={() => setPwVisible(!pwVisible)}>
            {pwVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
        {/* 새 비밀번호 입력란 */}
        <div className="flex flex-row items-center">
          <input
            ref={newPwRef}
            type={newPwVisible ? "text" : "password"}
            name="new_pw"
            className={"mx-2 px-2 flex-1 text-lg placeholder:text-base rounded-md"}
            placeholder="새 비밀번호(영문, 숫자, 특수문자 포함 8~16자)"
            title="비밀번호(영문, 숫자, 특수문자 포함 8~16자)"
            pattern={pwRegexStr}
            onChange={handleChange}
            required={true}
          />
          <button type="button" className="absolute right-0 mr-4" onClick={() => setnewPwVisible(!newPwVisible)}>
            {newPwVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        <div className="flex flex-row justify-around">
          <button
            type="submit"
            className="mb-2 bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            변경하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(ChangePw);
