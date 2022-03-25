import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "App";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";
import { refreshToken } from "utils/auth";

function SignIn({ isOpen, openerStates, setProfilePic }) {
  const { setUserIdx, setUserNickname, setIsSignInOpenFromHome, refreshTokenInterval } = useContext(AppContext);

  const setIsOpen = openerStates.setIsSignInOpen;
  const setIsSignUpOpen = openerStates.setIsSignUpOpen;
  const setIsFindPwOpen = openerStates.setIsFindPwOpen;
  const setLoggedIn = openerStates.setLoggedIn;

  const [input, setInput] = useState({
    email: "",
    pw: "",
  });

  const [pwVisible, setPwVisible] = useState(false);

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
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  }, 200);

  const handleClose = () => {
    setIsOpen(false);
    setIsSignInOpenFromHome(false);
  };

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
          const userData = data.user_data;
          localStorage.setItem("AIPLAY_USER_IDX", userData.idx);
          localStorage.setItem("AIPLAY_USER_EMAIL", userData.email);
          localStorage.setItem("AIPLAY_USER_NICKNAME", userData.nickname);
          localStorage.setItem("AIPLAY_USER_PIC", userData.profile_pic);
          localStorage.setItem("AIPLAY_USER_MEMBERSHIP", userData.membership);
          setUserIdx(userData.idx);
          setUserNickname(userData.nickname);
          setProfilePic(userData.profile_pic);
          setLoggedIn(true);
          setIsOpen(false);
          setIsSignInOpenFromHome(false);

          // 1시간마다 JWT 갱신 시작
          setTimeout(() => {
            refreshTokenInterval.current = setInterval(refreshToken, 1000 * 10 * 60);
          }, 1000 * 10 * 60);
        } else {
          data.email_state ? alert("비밀번호가 일치하지 않습니다.") : alert("가입하지 않은 이메일입니다.");
        }
      });
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
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
    setIsSignInOpenFromHome(false);
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <form onSubmit={handleSubmit} className="absolute w-1/5 h-fit bg-slate-500 border-2 rounded-lg flex flex-col justify-around divide-solid space-y-4">
        {/* 제목 부분 */}
        <div className="relative flex flex-row justify-center items-center">
          <h3 className="text-xl p-2 font-bold text-white self-center">Login</h3>
          <HiX onClick={handleClose} className="absolute right-0 inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        {/* 이메일 입력란 */}
        <div className="flex flex-row px-8">
          <input
            ref={emailRef}
            type="email"
            name="email"
            className={"mx-2 px-2 flex-1 text-lg placeholder:text-base rounded-md"}
            placeholder="이메일"
            onChange={handleChange}
          />
        </div>
        {/* 비밀번호 입력란 */}
        <div className="flex flex-row items-center px-8">
          <input
            ref={pwRef}
            type={pwVisible ? "text" : "password"}
            name="pw"
            className={"mx-2 px-2 flex-1 text-lg placeholder:text-base rounded-md"}
            placeholder="비밀번호"
            onChange={handleChange}
          />
          <button type="button" className="absolute right-8 mr-4" onClick={() => setPwVisible(!pwVisible)}>
            {pwVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        <div className="flex flex-row justify-around pb-2">
          <button
            type="submit"
            onKeyPress={handleEnter}
            className="bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 text-base md:text-sm font-bold w-3/5 py-2 px-2 rounded-full">
            로그인
          </button>
        </div>
        <div className="flex flex-col items-center pb-3">
          <button type="button" name="signUp" onClick={goToSignUp} className="text-white hover:text-primary-300 text-sm md:text-xs font-bold w-2/5 py-1 px-2">
            회원가입
          </button>
          <button type="button" name="findPw" onClick={goToSignUp} className="text-white hover:text-primary-300 text-sm md:text-xs font-bold w-2/5 py-1 px-2">
            비밀번호 찾기
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(SignIn);
