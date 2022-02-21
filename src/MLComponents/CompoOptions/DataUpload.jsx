import React, {useState, useContext } from 'react';
import {CORS, UPLOAD_ACCEPT} from './NetworkConfig';
import { DfdContext } from '../../App';

function DataUpload() {

  const [file, setFile] = useState();
  const [result, setResult] = useState();

  const dfd = useContext(DfdContext);

  // 백앤드에서 받은 JSON 데이터프레임 문자열을 임시 파일로 만드는 함수
  const jsonToFile = jsonData => {
    const jsonFile = new File([jsonData], 'temp.json', {type: "application/json"});
    return jsonFile;
  }

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = event => {
    setFile(event.target.files[0]);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async event => {
    event.preventDefault(); // submit 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const url = 'http://localhost:8000/uploadfile'; // 백앤드 API url
    const formData = new FormData(); // 파일 정보를 담을 FormData 객체 생성
    formData.append('file', file);
    formData.append('fileName', file.name);
    // HTTP 통신 설정
    const config = {
      method: "POST",
      mode: CORS,
      Accept: UPLOAD_ACCEPT,
      body: formData,
    };

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(url, config)
    .then(response => response.json())
    .then(data => {
      // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
      dfd.readJSON(jsonToFile(data))
      .then(df => {
        // df.head().print(); // 콘솔에 출력됨
        // setResult(df); // result State에 저장하여 사용자 화면에 보이게 만들기
        const layout = {
          width: 1000,
          height: 600,
          // clickmode: "none", // 결과물 클릭 방지
          dragmode: false
        }
        const config = {
          tableCellStyle: {
            align: ["center"],
            font: { size: 12, color: "black" }
          },
          // staticPlot: true, // 컬럼 드래그 방지
        }

        df.head().plot("result").table({config, layout}); // 결과 영역에 출력
      }).catch(err=>{
        console.log(err);
      })
    })
    .catch(error => console.error(error));
  };

  return (
    <div className="max-w-full">
      {/* 옵션 영역 */}
      <form onSubmit={handleSubmit}>
        <h1>Dataset Upload</h1>
        <input type="file" accept={UPLOAD_ACCEPT} onChange={handleChange}/>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Upload</button>
      </form>

      {/* 출력 영역 */}
      <div className="max-w-full">
        <div className="overscroll-none" id="result"/>
      </div>
    </div>
  )
}

export default DataUpload