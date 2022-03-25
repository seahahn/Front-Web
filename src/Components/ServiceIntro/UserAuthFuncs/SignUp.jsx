import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { pwRegexStr } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";
import Timer from "./Timer";

function SignUp({ isOpen, setIsOpen, setIsSignInOpen }) {
  const [input, setInput] = useState({
    email: "",
    pw: "",
    nickname: "",
    cert_number: "",
  });

  const [emailState, setEmailState] = useState({
    emailSent: false,
    emailChecked: false,
    emailCheckTimeout: false,
    emailSendingError: false,
  });
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);

  const emailRef = useRef();
  const pwRef = useRef();
  const nicknameRef = useRef();
  const cert_numberRef = useRef();

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");

    // input 초기화
    emailRef.current.value = "";
    pwRef.current.value = "";
    nicknameRef.current.value = "";
    cert_numberRef.current.value = "";
    setEmailState({
      emailSent: false,
      emailChecked: false,
      emailCheckTimeout: false,
      emailSendingError: false,
    });
    setInput({
      email: "",
      pw: "",
      nickname: "",
      cert_number: "",
    });
    setNicknameChecked(false);
    setPwVisible(false);
  }, [isOpen]);

  const handleChange = _.debounce((event) => {
    console.log(event.target);
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmailState({
          ...emailState,
          emailChecked: false,
        });
        break;
      case "nickname":
        setNicknameChecked(false);
        break;
      default:
        console.log("error");
        break;
    }
    setInput({
      ...input,
      [name]: value,
    });
  }, 200);

  const sendEmail = async () => {
    // input.email을 User-Auth의 email_check로 보내기
    // 보낸 순간부터 5분이 지나면 이메일 인증 실패
    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.email_check));

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify({ email: input.email }), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          setEmailState({
            ...emailState,
            emailSent: true,
            emailChecked: false,
            emailSendingError: false,
          });
        } else {
          alert("중복된 이메일입니다.");
        }
      })
      .catch((error) => console.error(error));
  };

  const cancelSendEmail = () => {
    setEmailState({
      ...emailState,
      emailSent: false,
      emailChecked: false,
      emailCheckTimeout: false,
    });
  };

  const checkEmail = async () => {
    // input.cert_num(인증 번호)이 맞게 입력되었는지 확인하기
    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.email_confirm));
    await fetch(targetUrl, httpConfig(JSON.stringify({ email: input.email, cert_number: input.cert_number })), "POST", true)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setEmailState({
            ...emailState,
            emailSent: false,
            emailChecked: true,
            emailCheckTimeout: false,
          });
        } else {
          alert("인증번호가 일치하지 않습니다.");
        }
      });
  };

  const checkNickname = async () => {
    if (input.nickname === "") {
      alert("닉네임을 입력해주세요!");
      return;
    }
    // input.nickname이 중복되지 않는지 확인하기
    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.nickname_check), { nickname: input.nickname });
    await fetch(targetUrl, httpConfig(null, "GET"))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          setNicknameChecked(true);
        } else {
          alert("이미 사용중인 닉네임입니다.");
        }
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailState.emailChecked) {
      alert("이메일 인증을 해주세요.");
      return;
    }

    if (!nicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.signup));
    await fetch(targetUrl, httpConfig(JSON.stringify(_.omit(input, ["cert_number"])), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          alert("회원가입이 완료되었습니다.");
          setIsSignInOpen(true);
          setIsOpen(false);
        } else {
          alert("회원가입에 실패했습니다. 잠시 뒤에 시도해주세요.");
        }
      });
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <form onSubmit={handleSubmit} className="absolute w-2/5 h-fit bg-slate-500 border-2 rounded-lg flex flex-col justify-around divide-solid space-y-4">
        {/* 제목 부분 */}
        <div className="relative flex flex-row justify-center items-center">
          <h3 className="text-xl font-bold p-2 text-white self-center">가입하기</h3>
          <HiX onClick={() => setIsOpen(false)} className="absolute right-0 inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        <div className="flex flex-col space-y-2 px-16">
          {/* 이메일 입력란 */}
          <div className="flex flex-row">
            <input
              ref={emailRef}
              type="email"
              name="email"
              className={"ml-2 px-2 flex-1 text-lg placeholder:text-base rounded-l-md"}
              placeholder="이메일"
              onChange={handleChange}
              required={true}
            />
            <button
              type="button"
              onClick={emailState.emailSent ? cancelSendEmail : sendEmail}
              className="bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 text-sm md:text-xs font-bold w-2/5 py-2 px-2 mr-2 rounded-r-md">
              {emailState.emailSent ? <Timer onStop={cancelSendEmail} /> : "인증 요청"}
            </button>
          </div>
          {/* 인증 번호 입력란 */}
          <div className="flex flex-row">
            <input
              ref={cert_numberRef}
              type="text"
              name="cert_number"
              className={"ml-2 px-2 flex-1 text-lg placeholder:text-base rounded-l-md disabled:rounded-md"}
              placeholder="인증 번호"
              onChange={handleChange}
              disabled={!emailState.emailSent || emailState.emailChecked ? true : false}
            />
            <button
              type="button"
              onClick={checkEmail}
              className={classNames(
                emailState.emailSent ? "bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300" : "text-slate-300",
                "text-sm md:text-xs font-bold w-2/5 py-2 px-2 mr-2 rounded-r-md"
              )}
              disabled={!emailState.emailSent || emailState.emailChecked ? true : false}>
              {emailState.emailChecked ? "인증 완료" : emailState.emailSent ? "인증하기" : emailState.emailCheckTimeout ? "시간 초과" : "인증하기"}
            </button>
          </div>
          {/* 비밀번호 입력란 */}
          <div className="flex flex-row items-center">
            <input
              ref={pwRef}
              type={pwVisible ? "text" : "password"}
              name="pw"
              pattern={pwRegexStr}
              className={"mx-2 px-2 flex-1 text-lg placeholder:text-base rounded-md h-8"}
              placeholder="비밀번호(영문, 숫자, 특수문자 포함 8~16자)"
              title="비밀번호(영문, 숫자, 특수문자 포함 8~16자)"
              onChange={handleChange}
              required={true}
            />
            <button type="button" className="absolute right-16 mr-4" onClick={() => setPwVisible(!pwVisible)}>
              {pwVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          {/* 닉네임 입력란 */}
          <div className="flex flex-row">
            <input
              ref={nicknameRef}
              type="text"
              name="nickname"
              className={"ml-2 px-2 flex-1 text-lg placeholder:text-base rounded-l-md"}
              placeholder="닉네임"
              onChange={handleChange}
              required={true}
            />
            <button
              type="button"
              onClick={checkNickname}
              className={classNames(
                !nicknameChecked ? "bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300" : "text-slate-300",
                "text-sm md:text-xs font-bold w-2/5 py-2 px-2 mr-2 rounded-r-md"
              )}
              disabled={nicknameChecked ? true : false}>
              {nicknameChecked ? "확인 완료" : "중복 확인"}
            </button>
          </div>
        </div>

        <p className="text-xs py-2 mx-16 text-center">
          가입하기 버튼을 누르시면 AI Play의{" "}
          <a
            className="text-primary-300 hover:text-primary-400"
            href={"https://seahahn.notion.site/AI-PLAY-33d2becf91c744638b5dd412e0ebffed"}
            target="_blank"
            rel="noreferrer">
            개인정보 처리방침
          </a>{" "}
          및 <br />
          <a
            className="text-primary-300 hover:text-primary-400"
            href={"https://seahahn.notion.site/AI-PLAY-1ca5f843b4d043d495757921a5f40ea2"}
            target="_blank"
            rel="noreferrer">
            서비스 이용약관
          </a>
          에 동의하게 됩니다.
        </p>
        <div className="flex flex-row justify-around py-2">
          <button
            type="submit"
            className="mb-2 bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 md:text-base sm:text-xs font-bold w-2/5 py-2 px-2 rounded-full">
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(SignUp);
