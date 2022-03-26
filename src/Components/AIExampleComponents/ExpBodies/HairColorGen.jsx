import React from "react";
import { Switch } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { targetURL, DL_API_URL, DL_API_CV, URLS_DL_API } from "utils/networkConfigs";
import blankPic from "assets/blank_pic.png";

const HairColorGen = () => {
  const [img, setImg] = React.useState(null);

  const previewImgRef = React.useRef();
  const previewInputRef = React.useRef();
  const resultImgRef = React.useRef();

  // 변환 대상 이미지를 올려서 미리보기에 출력함
  const changeImg = (e) => {
    e.preventDefault();
    console.log(e.target.files);
    e.target.files[0] && setImg(e.target.files[0]);
    previewImgRef.current.src = URL.createObjectURL(e.target.files[0]);
  };

  // 올린 이미지를 API에 전송하여 변환된 이미지 결과를 받아옴
  const uploadImg = async (e) => {
    e.preventDefault();
    console.log("uploadImg");
    const formData = new FormData();
    formData.append("img", img);

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

    const targetUrl = targetURL(DL_API_URL.concat(DL_API_CV, URLS_DL_API.hair_color_gen));
    const response = await fetch(targetUrl, config);
    if (response.ok) {
      console.log(response);
      const result = await response.blob();
      resultImgRef.current.src = URL.createObjectURL(result);
    }
  };

  return (
    <form className="flex flex-col space-y-8">
      <div className="relative flex flex-col space-y-2 items-center">
        <img ref={previewImgRef} src={blankPic} alt="미리보기" className="max-h-60" />
        <label htmlFor={previewInputRef} className="absolute bottom-0 bg-primary-500 rounded-lg p-1 cursor-pointer">
          이미지 업로드
        </label>
        <input
          id={previewInputRef}
          ref={previewInputRef}
          type="file"
          name="img"
          accept="image/jpg, image/png, image/jpeg"
          className="hidden"
          onChange={changeImg}
        />
      </div>
      <div className="relative flex flex-col space-y-2 items-center">
        <button type="submit" onClick={uploadImg} className="bg-primary-500 rounded-lg h-fit self-center px-4 py-2 my-4">
          실행
        </button>
        <img ref={resultImgRef} src={blankPic} alt="결과" className="my-4" />
      </div>
      {/* <Switch name={"ig_idx"} text="옵션 1 : " onChange={handleChange} checked={param.ig_idx} /> */}
      {/* <div className="flex flex-row space-x-2 justify-center bg-slate-100 rounded w-fit self-center p-2 my-5">
        <Switch name={"opt1"} text="옵션 1 : " />
        <Switch name={"opt2"} text="옵션 2 : " />
        <Switch name={"opt3"} text="옵션 3 : " />
        <Switch name={"opt4"} text="옵션 4 : " />
        <Switch name={"opt5"} text="옵션 5 : " />
      </div> */}
    </form>
  );
};

export default HairColorGen;
