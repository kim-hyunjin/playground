import {createContext, useContext, useEffect} from 'react';

// 클라이언트 환경 : null
// 서버 환경 : { done: false, promises: [] }
const PreloadContext = createContext(null);
export default PreloadContext;

//resolve는 함수 타입
export const Preloader = ({resolve}) => {
        const preloadContext = useContext(PreloadContext);
        if(!preloadContext) return null; // context 값이 유효하지 않다면 아무것도 하지 않음
        if(preloadContext.done) return null; // 이미 작업이 끝났다면 아무것도 하지 않음

        // promises 배열에 프로미스 등록
        // resolve 함수가 프로미스를 반환하지 않더라도, 프로미스 취급을 하기위해 Promise.resolve 함수 사용
        preloadContext.promises.push(Promise.resolve(resolve())
    );
    return null;
};

// Hook 형태로 사용할 수 있는 함수
export const usePreloader = resolve => {
    const preloadContext = useContext(PreloadContext);
    if(!preloadContext) return null;
    if(preloadContext.done) return null;
    preloadContext.promises.push(Promise.resolve(resolve()));

};

 // PreloadContext는 서버 사이드 렌더링을 하는 과정에서 처리해야 할 작업들을 실행하고, 만약 기다려야 하는 프로미스가 있다면 프로미스를 수집한다.
// 모든 프로미스를 수집한 뒤, 수집된 프로미스들이 끝날 때까지 기다렸다가 다시 렌더링하면 데이터가 채워진 상태로 컴포넌트들이 나타나게 된다.