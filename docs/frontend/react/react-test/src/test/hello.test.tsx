import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import Hello from "../components/Hello";

let rootContainer: Element | null = null;
beforeEach(() => {
  // 렌더링 대상으로 DOM 엘리먼트를 설정합니다.
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  // 기존의 테스트 환경을 정리합니다.
  unmountComponentAtNode(rootContainer!);
  rootContainer!.remove();
  rootContainer = null;
});

it("renders with or without a name", () => {
  render(<Hello />, rootContainer);
  expect(rootContainer!.textContent).toBe("Hey, stranger");

  render(<Hello name="Jenny" />, rootContainer);
  expect(rootContainer!.textContent).toBe("Hello, Jenny!");

  render(<Hello name="Margaret" />, rootContainer);
  expect(rootContainer!.textContent).toBe("Hello, Margaret!");
});
