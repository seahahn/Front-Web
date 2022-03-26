import React from "react";
import { AppContext } from "App";
import { ContainerContext } from "Components/MLML/MLComponents/Container";
import LeftMLNavPart from "Components/MLML/Navbar/LeftMLNavPart";

const LeftMLNavCover = ({ props }) => {
  const { setLeftNavPart, setContainerContextValues } = React.useContext(AppContext);
  const ccv = React.useContext(ContainerContext);

  // MLML의 Navbar 좌측 부분 초기화
  // 컨테이너 컴포넌트에서 사용하는 컴포넌트들의 정보를 전달하기 위해 사용
  React.useEffect(() => {
    setLeftNavPart(<LeftMLNavPart props={props} />); // Navbar 좌측 햄버거 버튼과 프로젝트 관련 메뉴 세팅
  }, []);

  // 컨테이너 컴포넌트의 Context를 컨테이너에 포함되지 않은 곳에 전달하기 위해 App으로 보냄
  // 보내진 Context는 AppContext를 통해서 필요한 곳에 전달됨
  React.useEffect(() => {
    console.log(ccv);
    setContainerContextValues(ccv);
  }, [ccv.projName, ccv.isLoading, ccv.isLoadProjectOpen, ccv.isInitialOpen]);

  return null;
};

export default LeftMLNavCover;
