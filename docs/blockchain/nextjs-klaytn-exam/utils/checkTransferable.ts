import Caver from "caver-js";

const checkTransferable = (from: string, to: string) => {
  if (typeof window.klaytn === "undefined") {
    throw Error("kaikas 지갑이 없습니다.");
  }
  const caver = new Caver(window.klaytn);

  if (!caver.utils.isAddress(from) || !caver.utils.isAddress(to)) {
    throw Error("주소가 유효하지 않습니다.");
  }

  if (from === to) {
    throw Error("보내는 주소와 받는 주소가 같습니다.");
  }
};

export default checkTransferable;
