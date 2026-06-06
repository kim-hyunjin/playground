import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import TagsInput from "../components/TagsInput";

describe("TagsInput test", () => {
  let tags: string[] = [];
  const setTags = (newTags: string[]) => {
    tags = newTags;
  };

  it("renders tags input", () => {
    render(<TagsInput onTagsChange={setTags} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toBeInTheDocument();
  });

  it("tag add and delete test", () => {
    const { container } = render(<TagsInput onTagsChange={setTags} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;

    fireEvent.input(input, {
      target: { value: "123" },
    });
    expect(input.value).toEqual("123");

    fireEvent.keyPress(input, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    expect(tags).toEqual(["123"]);

    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();

    fireEvent.click(span);
    expect(tags).toEqual([]);
  });
});
