import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "MLML/MLComponents/CompoOptions/networkConfigs";

function SignIn({ isOpen, openerStates, setProfilePic }) {
  const setIsOpen = openerStates.setIsSignInOpen;
  const setIsSignUpOpen = openerStates.setIsSignUpOpen;
  const setIsFindPwOpen = openerStates.setIsFindPwOpen;
  const setLoggedIn = openerStates.setLoggedIn;

  const [input, setInput] = useState({
    email: "",
    pw: "",
  });

  const [pwVisible, setPwVisible] = useState(false);
  console.log(input);

  const emailRef = useRef();
  const pwRef = useRef();

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");

    // input 초기화
    emailRef.current.value = "";
    pwRef.current.value = "";
    setInput({
      email: "",
      pw: "",
    });
    setPwVisible(false);
  }, [isOpen]);

  const handleChange = _.debounce((event) => {
    console.log(event.target);
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  }, 200);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.email === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (input.pw === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.login));
    await fetch(targetUrl, httpConfig(JSON.stringify(input), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // alert("로그인 성공");
          // USER_IDX localStorage에 저장하기
          const userData = data.user_data;
          localStorage.setItem("AIPLAY_USER_IDX", userData.idx);
          localStorage.setItem("AIPLAY_USER_EMAIL", userData.email);
          localStorage.setItem("AIPLAY_USER_NICKNAME", userData.nickname);
          localStorage.setItem("AIPLAY_USER_PIC", userData.profile_pic);
          setProfilePic(userData.profile_pic);
          setLoggedIn(true);
          setIsOpen(false);
        } else {
          data.email_state ? alert("비밀번호가 일치하지 않습니다.") : alert("가입하지 않은 이메일입니다.");
        }
      });
  };

  const goToSignUp = (event) => {
    console.log(event.target);
    switch (event.target.name) {
      case "signUp":
        setIsSignUpOpen(true);
        break;
      case "findPw":
        setIsFindPwOpen(true);
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <form onSubmit={handleSubmit} className="absolute w-2/5 h-fit bg-white border-2 rounded-lg flex flex-col justify-around divide-solid space-y-2">
        {/* 제목 부분 */}
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl p-2">로그인</h3>
          <HiX onClick={() => setIsOpen(false)} className="inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        {/* 이메일 입력란 */}
        <div className="flex flex-row">
          <input ref={emailRef} type="email" name="email" className={inputStyle + " mx-2 flex-1"} placeholder="이메일" onChange={handleChange} />
        </div>
        {/* 비밀번호 입력란 */}
        <div className="flex flex-row items-center">
          <input
            ref={pwRef}
            type={pwVisible ? "text" : "password"}
            name="pw"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="비밀번호"
            onChange={handleChange}
          />
          <button type="button" className="absolute right-0 mr-4" onClick={() => setPwVisible(!pwVisible)}>
            {pwVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        <div className="flex flex-row justify-around">
          <button type="submit" className="border border-blue-500 hover:bg-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            로그인
          </button>
        </div>
        <div className="flex flex-row justify-around">
          <button type="button" name="signUp" onClick={goToSignUp} className="hover:text-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2">
            회원가입
          </button>
          <button type="button" name="findPw" onClick={goToSignUp} className="hover:text-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2">
            비밀번호 찾기
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(SignIn);
