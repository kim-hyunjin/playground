import React, { useState, useEffect } from "react";

export type User = {
  name: string;
  age: number;
  address: string;
};

export default function UserProfile(props: { id: string }) {
  const [user, setUser] = useState<User | null>(null);

  async function fetchUserData(id: string) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return <div>"loading..."</div>;
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
