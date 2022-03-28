import React, { useEffect, useState, useRef } from "react";
import _ from "lodash";
import classNames from "classnames";
import { HiX } from "react-icons/hi";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { targetURL, httpConfig, DL_API_URL, URLS_DL_API } from "utils/networkConfigs";
import { Select } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";

function AddPost({ isOpen, setIsOpen, post }) {
  const [input, setInput] = useState(
    post
      ? post
      : {
          div: "ml",
        }
  );

  const imageSrcRef = useRef();
  const authorRef = useRef();
  const categoryRef = useRef();
  const titleRef = useRef();
  const dscRef = useRef();
  const linkRef = useRef();
  const refs = [imageSrcRef, authorRef, categoryRef, titleRef, dscRef, linkRef];

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleChange = _.debounce((event) => {
    const { name, value } = event.target;
    setInput({
      ...input,
      [name]: value,
    });
  }, 200);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(input);
    const targetUrl = targetURL(DL_API_URL.concat(URLS_DL_API.posts, post ? input.idx : ""));
    const response = await fetch(targetUrl, httpConfig(JSON.stringify(input), post ? "PUT" : "POST", true));
    if (response.ok) {
      setIsOpen(false);
      setInput({ div: "ml" });
      refs.forEach((ref) => (ref.current.value = ""));
    }
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <form onSubmit={handleSubmit} className="absolute w-2/5 h-fit bg-white border-2 rounded-lg flex flex-col justify-around divide-solid space-y-2">
        {/* 제목 부분 */}
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl p-2">Add Post</h3>
          <HiX onClick={() => setIsOpen(false)} className="inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        {/* 이메일 입력란 */}
        <div className="flex flex-col">
          <Select name="div" options={["ml", "dl"]} text="구분" onChange={handleChange} required={true} defaultValue={post ? post.div : "ml"} />
          <input
            ref={imageSrcRef}
            type="text"
            name="image_src"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="대표 사진 URL"
            onChange={handleChange}
            required={true}
            defaultValue={post ? post.image_src : null}
          />
          <input
            ref={authorRef}
            type="text"
            name="author"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="제작자"
            onChange={handleChange}
            required={true}
            defaultValue={post ? post.author : null}
          />
          <input
            ref={categoryRef}
            type="text"
            name="category"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="세분류(모델 종류 등)"
            onChange={handleChange}
            required={true}
            defaultValue={post ? post.category : null}
          />
          <input
            ref={titleRef}
            type="text"
            name="title"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="제목"
            onChange={handleChange}
            required={true}
            defaultValue={post ? post.title : null}
          />
          <input
            ref={dscRef}
            type="text"
            name="dsc"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="간단 설명"
            onChange={handleChange}
            required={true}
            defaultValue={post ? post.dsc : null}
          />
          <input
            ref={linkRef}
            type="text"
            name="link"
            className={inputStyle + " mx-2 flex-1"}
            placeholder="ML:게시물 URL / DL:route 경로"
            onChange={handleChange}
            required={true}
            defaultValue={post ? post.link : null}
          />
        </div>

        <div className="flex flex-row justify-around">
          <button type="submit" className="border border-blue-500 hover:bg-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            {post ? "수정" : "추가"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(AddPost);
