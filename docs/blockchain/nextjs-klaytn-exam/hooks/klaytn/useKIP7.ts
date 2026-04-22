import useCaver from "./useCaver";

export default function useKIP7() {
  const caver = useCaver();

  if (!caver) {
    return;
  }

  try {
    const tth1TokenInstance = new caver.klay.KIP7(
      "0x0b08f228031758dd6375158f4e26e803176b3ac6"
    );
    return tth1TokenInstance;
  } catch (e) {
    throw e;
  }
}
