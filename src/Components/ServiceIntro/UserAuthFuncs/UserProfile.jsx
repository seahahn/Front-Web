import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "App";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";
import blankPic from "assets/blank_pic.png";
import ChangePw from "./ChangePw";
import Inactive from "./Inactive";
import ProfilePic from "./ProfilePic";

function UserProfile({ isOpen, setIsOpen, logout, profilePic, setProfilePic, handleImgError }) {
  const { userIdx, userNickname, setUserNickname } = useContext(AppContext);
  const userEmail = localStorage.getItem("AIPLAY_USER_EMAIL");

  const [input, setInput] = useState({
    nickname: userNickname,
  });

  const [isNicknameChanging, setNicknameChanging] = useState(false);
  const [pwChanging, setPwChanging] = useState(false);
  const [inactiveOpen, setInactiveOpen] = useState(false);

  const nicknameRef = useRef();

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");

    // input 초기화
    // nicknameRef.current.value = "";
    setInput({
      nickname: userNickname,
    });
  }, [isOpen]);

  const handleChange = _.debounce((event) => {
    console.log(event.target);
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  }, 200);

  const submitNicknameChange = async () => {
    const { nickname: newNickname } = input;
    const oldNickname = userNickname;
    // const token = localStorage.getItem("AIPLAY_TOKEN");

    if (newNickname === oldNickname) {
      console.log("이전과 동일한 닉네임");
      setNicknameChanging(false);
      return;
    }

    if (newNickname === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.nickname_change));
    await fetch(targetUrl, httpConfig(JSON.stringify({ idx: userIdx, nickname: newNickname }), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // alert("닉네임 변경 성공");
          localStorage.setItem("AIPLAY_USER_NICKNAME", newNickname);
          setUserNickname(newNickname);
          setNicknameChanging(false);
        } else {
          alert("닉네임 변경 실패");
        }
      });
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-2/5 h-fit bg-white border-2 rounded-lg flex flex-col justify-around divide-solid space-y-2">
        {/* 제목 부분 */}
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl p-2">프로필 설정</h3>
          <HiX onClick={() => setIsOpen(false)} className="inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        {/* 프로필 사진 부분 */}
        <div className="relative flex flex-row justify-center items-center">
          <img src={profilePic ? profilePic : blankPic} alt="profile" className="object-cover w-32 h-32 rounded-full" onError={handleImgError} />
          <ProfilePic profilePic={profilePic} setProfilePic={setProfilePic} />
        </div>
        {/* 이메일 부분 */}
        <div className="flex flex-row">
          <span className={"mx-2"}>Email</span>
          <span className={"mx-2 flex-1"}>{userEmail}</span>
        </div>
        {/* 닉네임 부분 */}
        <div className="flex flex-row items-center">
          <span className={"mx-2"}>닉네임</span>
          {isNicknameChanging ? (
            <input
              ref={nicknameRef}
              type="text"
              name="nickname"
              className={inputStyle + " mx-2 flex-1"}
              placeholder="닉네임을 입력해주세요."
              onChange={handleChange}
              defaultValue={userNickname}
            />
          ) : (
            <span className={"mx-2 flex-1"}>{userNickname}</span>
          )}
          <div className="flex flex-row items-center mr-2">
            <button
              type="button"
              className="border border-blue-500 hover:bg-blue-300 text-black text-sm md:text-xs font-bold py-2 px-2 rounded"
              onClick={!isNicknameChanging ? () => setNicknameChanging(true) : submitNicknameChange}>
              {!isNicknameChanging ? "변경하기" : "변경 완료"}
            </button>
            {isNicknameChanging && (
              <button
                type="button"
                onClick={() => setNicknameChanging(false)}
                className="border border-red-500 hover:bg-red-300 text-black text-sm md:text-xs font-bold py-2 px-2 rounded">
                변경 취소
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col content-start">
          <button
            type="button"
            name="pwChange"
            onClick={() => setPwChanging(true)}
            className="self-start hover:text-blue-300 text-black text-sm md:text-xs font-bold py-2 px-2">
            비밀번호 변경하기
          </button>
          <button
            type="button"
            name="inactive"
            onClick={() => setInactiveOpen(true)}
            className="self-start hover:text-red-500 text-red-700 text-xs font-bold py-2 px-2">
            회원 탈퇴
          </button>
        </div>
      </div>
      {pwChanging && <ChangePw isOpen={pwChanging} setIsOpen={setPwChanging} />}
      {inactiveOpen && <Inactive isOpen={inactiveOpen} setIsOpen={setInactiveOpen} logout={logout} />}
    </div>
  );
}

export default React.memo(UserProfile);
