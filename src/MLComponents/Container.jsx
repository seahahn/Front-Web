import React, { useState, useCallback, useEffect, useRef, createContext } from "react";
import LoadingSpin from "react-loading-spin";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import classNames from "classnames";
import Navbar from "Navbar/Navbar";
import TrashDropZone from "MLComponents/TrashDropZone";
import SideBar from "MLComponents/SideBar";
import Column from "MLComponents/Column";
import emptyData from "MLComponents/initial-data"; // COLUMN-ROW-COMPONENT
import initialData from "MLComponents/initial-data-test"; // COLUMN-ROW-COMPONENT
import initialBlockForm from "MLComponents/initial-data-form"; // 새로운 블록 생성 폼
import { handleMoveWithinParent, handleMoveToDifferentParent, handleMoveSidebarComponentIntoParent, handleRemoveItemFromLayout } from "MLComponents/helpers";
import styled from "styled-components";
import { SIDEBAR_ITEM, COLUMN } from "MLComponents/constants";
import { httpConfig, UPM_URL, UPM_TARGET, USER_IDX } from "MLComponents/CompoOptions/networkConfigs";
import shortid from "shortid";

const Toolbox = styled.div`
  display: flex;
  position: fixed;
  z-index: 5;
  justify-content: center;
  width: 80%;
  pointer-events: none;
  button {
    padding: 10px 5px;
    width: 5rem;
    font-size: 0.8em;
    border: 1px solid #ccc;
    pointer-events: auto;
  }
  button:hover {
    color: #008cba;
  }
`;

export const LayoutContext = createContext(); // 전체 프로젝트 구조(layout)를 개별 컴포넌트에 전달하기 위한 컨텍스트

const Container = () => {
  const emptyLayout = emptyData.layout; // 현재 더미 데이터 -> 이후 MongoDB에서 사용자의 프로젝트에 맞는 데이터 가져와야 함
  const initialLayout = initialData.layout; // 현재 더미 데이터 -> 이후 MongoDB에서 사용자의 프로젝트에 맞는 데이터 가져와야 함

  const projIdx = Number(window.localStorage.getItem("aiplay_proj_idx"));
  console.log(projIdx);

  const [projName, setProjName] = useState("");
  const [layout, setLayout] = useState(emptyLayout);
  const [movingEnabled, setMovingEnabled] = useState(false); // 마우스 휠, 드래그 등을 이용한 작업 영역 위치 조정 가능 여부 상태
  const [isLoading, setIsLoading] = useState(false); // 저장 중 상태

  /**
   * 프로젝트 구조 저장을 하기 위한 레퍼런스.
   * layout state를 사용할 경우, 사소한 개별 옵션 값 변경에도 과도한 rerender 발생함.
   * (layout state를 사용하는 Container 내에 모든 컴포넌트들이 있기 때문)
   * 따라서 별도로 layout 데이터를 저장할 ref를 생성하여 rerender를 방지하였음.
   */
  const layoutRef = useRef(layout);

  // 새 프로젝트 생성
  const newProject = useCallback(
    async (proj_name) => {
      setIsLoading(true);
      const projectData = {
        user_idx: USER_IDX,
        proj_name: proj_name,
        layout: initialLayout,
      };
      const response = await fetch(UPM_URL, httpConfig(JSON.stringify(projectData), "POST", true));
      const newProjIdx = await response.json();
      console.log(newProjIdx);

      window.sessionStorage.clear(); // 기존 프로젝트 데이터 삭제
      window.localStorage.setItem("aiplay_proj_idx", newProjIdx); // 새로운 프로젝트 고유 번호 지정
      setLayout(initialLayout);
      setProjName(proj_name);
      setIsLoading(false);
    },
    [initialLayout]
  );

  // 프로젝트 목록에서 수행 가능한 프로젝트 삭제 기능
  const deleteProject = useCallback(async (proj_idx) => {
    if (window.confirm("정말로 삭제하시겠어요?")) {
      setIsLoading(true);
      const response = await fetch(UPM_URL + `/${USER_IDX}/${proj_idx}`, httpConfig(null, "DELETE"));
      const result = await response.json();
      console.log(result);
      setIsLoading(false);
      return true;
    }
    return false;
  }, []);

  // 프로젝트명 변경
  const updateProjName = useCallback(async (proj_name) => {
    setIsLoading(true);
    const projectData = {
      proj_name: proj_name,
    };
    const response = await fetch(UPM_URL + "/name" + UPM_TARGET, httpConfig(JSON.stringify(projectData), "PUT", true));
    const result = await response.json();
    console.log(result);
    result === true && setProjName(proj_name);
    setIsLoading(false);
  }, []);

  // 프로젝트 실행 시 프로젝트 구조 불러와서 적용하기
  const initProject = async (proj_idx) => {
    console.log(proj_idx);
    // 사용자 번호와 프로젝트 번호를 통해 프로젝트 구조 불러오기
    const response = await fetch(UPM_URL + `/${USER_IDX}/${proj_idx}`, httpConfig(null, "GET"));
    // 기존 프로젝트라면 불러오고, 새로운 프로젝트라면 새로운 프로젝트 데이터 생성
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      window.localStorage.setItem("aiplay_proj_idx", proj_idx);
      setLayout(data.layout);
      setProjName(data.proj_name);
    } else {
      console.log("initProject error");
      // saveProject(proj_idx, proj_name);
    }
  };

  // 새 프로젝트 생성 시 사용할 함수 -> newProject에게 역할 빼앗김
  // const saveProject = useCallback(
  //   async (proj_idx, proj_name) => {
  //     setLayout(initialLayout);
  //     setProjName(proj_name);
  //     const projectData = {
  //       user_idx: USER_IDX,
  //       proj_idx: proj_idx,
  //       proj_name: proj_name ? proj_name : "untitled",
  //       layout: initialLayout,
  //     };
  //     await fetch(UPM_URL, httpConfig(JSON.stringify(projectData), "POST", true))
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //       })
  //       .catch((error) => console.error(error));
  //   },
  //   [initialLayout]
  // );

  const updateProject = useCallback(async () => {
    // 기존 프로젝트 수정 시 사용할 함수
    setIsLoading(true); // 저장 시작
    const projectData = {
      layout: layoutRef.current,
    };
    await fetch(UPM_URL + UPM_TARGET, httpConfig(JSON.stringify(projectData), "PUT", true))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("project updated");
        setIsLoading(false); // 저장 완료
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // 저장 완료
      });
  }, []);

  // 프로젝트 실행 시 초기 세팅
  useEffect(() => {
    console.log("initProject");
    initProject(projIdx);
  }, [projIdx]);

  useEffect(() => {
    // layout 데이터 변경 시 저장
    layoutRef.current = layout;
  }, [layout]);

  // TrashDropZone에 아이템 드랍 시 아이템 삭제 기능
  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  // DropZone에 아이템 드랍 시 아이템 추가 기능
  const handleDrop = useCallback(
    (dropZone, item) => {
      // console.log("item", item);

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type, func: item.func, param: item.param ? item.param : null };
      // console.log('newItem id type', newItem);
      // if (item.type === COLUMN) {
      //   newItem.children = item.children;
      // }

      // 사이드바로부터 컴포넌트 가져와서 추가하는 경우
      if (item.type.includes(SIDEBAR_ITEM)) {
        // if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        // const newComponent = {
        //   id: shortid.generate(),
        //   ...item.component
        // };

        // 실제로 Container에 추가된 컴포넌트의 정보
        const newItem = {
          id: shortid.generate(), // layout에 포함되기 위해 새로운 id를 생성
          type: item.type.split("/")[1], // 전처리 / 훈련 / 평가 구분하기 위한 값
          func: item.func, // 사이드바 아이템의 func가 어떤 기능인지 나타냄
          param: item.param ? item.param : null, // 사이드바 아이템의 기능에서 사용되는 parameter
        };
        // setComponents({
        //   ...components,
        //   [newComponent.id]: newComponent
        // });

        setLayout(handleMoveSidebarComponentIntoParent(layout, splitDropZonePath, newItem));
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. 단순 이동인 경우
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(handleMoveWithinParent(layout, splitDropZonePath, splitItemPath));
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(handleMoveToDifferentParent(layout, splitDropZonePath, splitItemPath, newItem));
        return;
      }

      // 3. Move + Create
      // setLayout(
      //   handleMoveToDifferentParent(
      //     layout,
      //     splitDropZonePath,
      //     splitItemPath,
      //     newItem
      //   )
      // );
    },
    [layout]
  );

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        // components={components}
        handleDrop={handleDrop}
        path={currentPath}
        removeBlock={removeBlock}
      />
    );
  };

  // 새로운 블록 추가 기능
  const addNewBlock = useCallback(() => {
    const newBlock = {
      type: COLUMN,
      id: shortid.generate(),
      children: initialBlockForm.newBlock.children,
    };
    // console.log([...layout, newBlock]);
    setLayout([...layout, newBlock]);
  }, [layout]);

  // 블록 삭제 기능
  const removeBlock = useCallback(
    (event) => {
      const newLayout = layout.filter((value, index, arr) => {
        return value.id !== event.target.value;
      });

      setLayout(newLayout);
    },
    [layout]
  );

  return (
    <React.Fragment>
      <Navbar
        projName={projName}
        isLoading={isLoading}
        initProject={initProject}
        updateProject={updateProject}
        newProject={newProject}
        updateProjName={updateProjName}
        deleteProject={deleteProject}
      />
      <div className="flex flex-row h-full mt-16">
        <div className="flex flex-col bg-slate-700">
          {/* 요소 확대/축소 및 위치 이동 기능을 넣기 위한 Wrapper */}
          <TransformWrapper minScale={0.1} maxScale={2} limitToBounds={false} disabled={!movingEnabled}>
            {/* 확대 / 축소 / 원 위치 이동 함수 넣기 */}
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <React.Fragment>
                <Toolbox>
                  {/* 위치 이동 가능 여부를 설정할 수 있는 버튼 추가 */}
                  <button
                    className={classNames(movingEnabled ? "bg-green-500" : "bg-green-50", "rounded-bl-lg")}
                    onClick={() => setMovingEnabled(!movingEnabled)}>
                    Move
                  </button>
                  {/* 확대 / 축소 / 원 위치 이동을 위한 버튼 */}
                  <button className="bg-green-50" onClick={() => zoomIn(0.2)}>
                    Zoom In
                  </button>
                  <button className="bg-green-50" onClick={() => zoomOut(0.2)}>
                    Zoom Out
                  </button>
                  <button className="bg-green-50 rounded-br-lg" onClick={() => resetTransform()}>
                    Reset
                  </button>
                </Toolbox>
                {/* TransformComponent 안의 컴포넌트가 실제로 확대 / 축소 / 위치 이동 기능이 적용되는 대상임 */}
                <TransformComponent>
                  <div className="page columns h-full">
                    {/* layout 데이터에서 column 하나씩 내놓음. 한 column에 한 index */}
                    <LayoutContext.Provider value={{ layoutRef }}>
                      {layout.map((column, index) => {
                        const currentPath = `${index}`; // index는 현재 경로로 지정됨
                        return (
                          <React.Fragment key={column.id}>
                            {/* column 하나마다 좌측에 TrashDropZone 놔둠 */}
                            <TrashDropZone data={{ layout }} onDrop={handleDropToTrashBin} />
                            {/* column 데이터 하나씩 전달하여 column 생성
                        동시에 각각의 column의 index를 전달하여 해당 column의 경로로 지정 */}
                            {renderColumn(column, currentPath)}
                          </React.Fragment>
                        );
                      })}
                    </LayoutContext.Provider>
                    {/* column 다 추가하고 나면 마지막으로 맨 오른쪽에 TrashDropZone 추가 */}
                    <TrashDropZone data={{ layout }} onDrop={handleDropToTrashBin} />
                  </div>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
        {/* layout.length === 0 이면 새로운 블록 추가 요청 메시지 보이기 */}
        {layout.length === 0 ? (
          <div className="fixed inset-0 w-4/5 text-5xl text-cyan-200 flex justify-center items-center">
            <h1>블록을 추가해주세요!</h1>
          </div>
        ) : null}
        {/* 사이드바와 사이드바 내 아이템들 */}
        <SideBar addNewBlock={addNewBlock} />
      </div>
      {/* 데이터 저장, 불러오기 등 진행 시 로딩 애니메이션 출력 */}
      <div className={classNames(!isLoading && "hidden", "fixed inset-0 z-50 flex justify-center items-center")}>
        <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
        <LoadingSpin />
      </div>
    </React.Fragment>
  );
};
export default React.memo(Container);
