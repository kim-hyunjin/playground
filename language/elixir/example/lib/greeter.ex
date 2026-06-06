defmodule Greeter do
  @moduledoc """
  ...
  """

  @doc """
  hello 메시지를 출력합니다.

  ## Parameters

    - name: 사람의 이름을 나타내는 문자열입니다.

  ## Examples

      iex> Greeter.hello("Sean")
      "Hello, Sean"

      iex> Greeter.hello("pete")
      "Hello, pete"

  """
  @spec hello(String.t()) :: :ok
  def hello(name) do
    "Hello, " <> name |> IO.puts
  end
end
