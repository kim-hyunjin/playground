defmodule Mix.Tasks.Hello do
  @moduledoc "The hello mix task: `mix help hello`"
  use Mix.Task

  @shortdoc "Simply runs the Greeter.hello/1 command."
  def run([name]) do
    Greeter.hello(name)
  end
end
