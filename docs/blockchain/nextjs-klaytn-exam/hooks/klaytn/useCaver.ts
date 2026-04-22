import Caver from "caver-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useCaver() {
  const [caver, setCaver] = useState<Caver | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (typeof window.klaytn !== "undefined") {
      const caver = new Caver(window.klaytn);
      setCaver(caver);
    } else {
      alert("Kaikas 지갑이 필요합니다.");
      router.push(
        "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi"
      );
    }
  }, [router]);

  return caver;
}
