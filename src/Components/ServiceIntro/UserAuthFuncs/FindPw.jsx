import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";

function FindPw({ isOpen, setIsOpen, setIsSignInOpen }) {
  const [input, setInput] = useState({
    email: "",
  });

  const emailRef = useRef();

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");

    // input 초기화
    emailRef.current.value = "";
    setInput({
      email: "",
    });
  }, [isOpen]);

  const handleChange = _.debounce((event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  }, 500);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.email === "") {
      alert("이메일을 입력해주세요.");
      return;
    }

    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.search_pw));
    await fetch(targetUrl, httpConfig(JSON.stringify(input), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          alert("임시 비밀번호 발송 완료");
          setIsSignInOpen(true);
          setIsOpen(false);
        } else {
          alert("가입하지 않은 이메일입니다.");
        }
      });
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <form
        onSubmit={handleSubmit}
        className="absolute w-full lg:w-1/3 h-fit bg-slate-500 border-2 rounded-lg flex flex-col justify-around divide-solid space-y-4">
        {/* 제목 부분 */}
        <div className="relative flex flex-row justify-center items-center">
          <h3 className="text-xl font-bold p-2 text-white self-center">임시 비밀번호 발송</h3>
          <HiX onClick={() => setIsOpen(false)} className="absolute right-0 inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        {/* 이메일 입력란 */}
        <div className="flex flex-row mx-8">
          <input
            ref={emailRef}
            type="email"
            name="email"
            className={"mx-2 px-2 flex-1 text-lg placeholder:text-base rounded-md"}
            placeholder="이메일"
            onChange={handleChange}
          />
        </div>
        <p className="text-sm text-slate-200 mx-2 text-center">입력하신 메일로 임시 비밀번호를 보내드립니다.</p>

        <div className="flex flex-row justify-around pb-3">
          <button
            type="submit"
            className="mb-2 bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 text-base md:text-sm font-bold w-2/5 py-2 px-2 rounded-full">
            임시 비밀번호 발송
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(FindPw);
