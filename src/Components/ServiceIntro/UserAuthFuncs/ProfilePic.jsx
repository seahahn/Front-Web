import React, { useRef, Fragment, useContext } from "react";
import { AppContext } from "App";
import { Menu, Transition } from "@headlessui/react";
import { AiOutlineCamera } from "react-icons/ai";
import classNames from "classnames";
import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";

function ProfilePic({ profilePic, setProfilePic }) {
  const { userIdx } = useContext(AppContext);

  const picInputRef = useRef();

  const uploadImage = async (e) => {
    console.log(e);
    console.log("image upload");
    const formData = new FormData();
    formData.append("profile_pic", e.target.files[0]);
    formData.append("idx", userIdx);

    const config = {
      method: "POST",
      mode: "cors", // 'cors'
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("aiplay_csrf_token")}`,
        "X-CSRFToken": localStorage.getItem("aiplay_csrf_token"),
      },
      credentials: "include",
    }; // HTTP 통신 설정

    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.profile_pic_change));
    await fetch(targetUrl, config)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const timestamp = new Date().getTime();
          setProfilePic(data.profile_pic + "?v=" + timestamp);
          picInputRef.current.value = null;
        } else {
          alert("사진 업로드 실패. 잠시 뒤에 시도해주세요.");
          picInputRef.current.value = null;
        }
      });
  };

  const removeImage = async () => {
    if (window.confirm("정말 삭제하시겠어요?")) {
      const formData = new FormData();
      formData.append("user_idx", userIdx);

      const config = {
        method: "POST",
        mode: "cors", // 'cors'
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aiplay_csrf_token")}`,
          "X-CSRFToken": localStorage.getItem("aiplay_csrf_token"),
        },
        credentials: "include",
      }; // HTTP 통신 설정

      const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.profile_pic_change));
      await fetch(targetUrl, config)
        .then((response) => response.json())
        .then((data) => {
          data.result ? setProfilePic(null) : alert("사진 삭제 실패. 잠시 뒤에 시도해주세요.");
        });
    }
  };

  return (
    <Menu as="div" className="absolute bottom-0" style={{ left: "55%" }}>
      <div>
        <Menu.Button className="flex text-sm rounded-full hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
          <span className="sr-only">Open profile pic menu</span>
          <AiOutlineCamera className="w-8 h-8 text-slate-300 hover:text-slate-100" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <label htmlFor={picInputRef} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>
                사진 업로드
              </label>
            )}
          </Menu.Item>
          {/* <Menu.Item>
            {({ active }) => <div className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>사진 찍기</div>}
          </Menu.Item> */}
          <Menu.Item>
            {({ active }) => (
              <div onClick={removeImage} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>
                사진 삭제
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
      <input
        id={picInputRef}
        ref={picInputRef}
        type="file"
        name="profile_pic"
        accept="image/jpg, image/png, image/jpeg"
        className="hidden"
        onChange={uploadImage}
      />
    </Menu>
  );
}

export default ProfilePic;
