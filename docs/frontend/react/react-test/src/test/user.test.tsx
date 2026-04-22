import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import UserProfile from "../components/UserProfile";

let container: Element | null = null;
beforeEach(() => {
  // 렌더링 대상으로 DOM 엘리먼트를 설정합니다.
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리합니다.
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue",
  };
  jest
    .spyOn(global, "fetch")
    .mockImplementation(
      (input: RequestInfo, init?: RequestInit | undefined) => {
        const res = {
          json: () => Promise.resolve(fakeUser),
        } as Response;
        return Promise.resolve(res);
      }
    );

  // resolved promises를 적용하려면 `act()`의 비동기 버전을 사용하세요.
  await act(async () => {
    render(<UserProfile id="123" />, container);
  });

  expect(container!.querySelector("summary")!.textContent).toBe(fakeUser.name);
  expect(container!.querySelector("strong")!.textContent).toBe(fakeUser.age);
  expect(container!.textContent).toContain(fakeUser.address);

  // 테스트가 완전히 격리되도록 mock을 제거하세요.
  // global.fetch.mockRestore();
});
