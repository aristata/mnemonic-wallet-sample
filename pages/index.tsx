import useMutation from "@libs/useMutation";
import type { NextPage } from "next";

interface MnemonicMutationResult {
  ok: boolean;
  mnemonic: string;
}

const Home: NextPage = () => {
  const [mnemonic, { loading, data: mnemonicData, error }] =
    useMutation<MnemonicMutationResult>("/api/mnemonic");
  const createMnemonic = () => {
    mnemonic();
  };

  return (
    <div className="py-5 px-10">
      <div className="border-b-2 border-dashed py-2">
        <button
          className="bg-red-300 rounded-md text-white font-medium text-sm px-4 py-1"
          onClick={createMnemonic}
        >
          generate mnemonic
        </button>
      </div>
      {mnemonicData?.ok ? (
        <div className="py-2 flex flex-col border-b-2 border-dashed ">
          <label>생성된 니모닉</label>
          <span>{mnemonicData.mnemonic}</span>
        </div>
      ) : null}
      <div></div>
    </div>
  );
};

export default Home;
