defmodule ExampleTest do
  use ExUnit.Case
  doctest Example

  test "greets the world" do
    assert Example.hello() == :world
  end
end

defmodule AnagramTest do
  use ExUnit.Case

  test "test anagram" do
    assert Anagram.anagrams?("Hello", "ohell") == true
  end

  test "expect error" do
    assert_raise FunctionClauseError, fn ->
      Anagram.anagrams?(3, 5)
    end
  end
end
