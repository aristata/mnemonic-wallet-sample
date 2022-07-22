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
          className="bg-red-300 rounded-3xl text-white font-bold text-3xl p-10"
          onClick={createMnemonic}
        >
          generate mnemonic
        </button>
      </div>
      {mnemonicData?.ok ? (
        <div className="py-2 border-b-2 border-dashed space-x-2">
          <label className="flex items-center">
            생성된 니모닉
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 px-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </label>
          <span>{mnemonicData.mnemonic}</span>
        </div>
      ) : null}
      <div></div>
    </div>
  );
};

export default Home;
