import React, { useEffect, useState } from "react";

import "./TagsInput.css";

type TagsInputProp = {
  onTagsChange: (tags: string[]) => void;
};

export default function TagsInput({ onTagsChange }: TagsInputProp) {
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    onTagsChange(tags);
  }, [tags, onTagsChange]);

  const onChange = (val: string) => {
    setValue(val);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    if (tags.find((tag) => tag === value)) {
      alert("이미 존재하는 태그입니다.");
      setValue("");
      return;
    }
    setTags([...tags, value]);
    setValue("");
  };

  const onDelete = (id: number) => {
    setTags(tags.filter((_, i) => i !== id));
  };

  return (
    <div className="simple-tags">
      <ul>
        {tags.map((tag, i) => (
          <li key={i}>
            {tag}
            <span onClick={() => onDelete(i)}>&times;</span>
          </li>
        ))}
      </ul>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="태그를 입력해주세요."
      ></input>
    </div>
  );
}
