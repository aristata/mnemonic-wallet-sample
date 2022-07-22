import useMutation from "@libs/useMutation";
import type { NextPage } from "next";
import { useForm, FieldErrorsImpl } from "react-hook-form";

interface MnemonicMutationResult {
  ok: boolean;
  mnemonic: string;
}

interface WalletCreateForm {
  mnemonic: string;
  password: string;
}

interface WalletMutationResult {
  ok: boolean;
  message?: string;
  address?: string;
}

const Home: NextPage = () => {
  const [
    mnemonic,
    { loading: mnemonicLoading, data: mnemonicData, error: mnemonicError }
  ] = useMutation<MnemonicMutationResult>("/api/mnemonic");

  const createMnemonic = () => {
    mnemonic();
  };

  const [
    wallet,
    { loading: walletLoading, data: walletData, error: walletError }
  ] = useMutation<WalletMutationResult>("/api/wallet");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<WalletCreateForm>();

  const onValid = (data: WalletCreateForm) => {
    // 지갑 생성 호출
    wallet(data);
    reset();
  };

  const onInvalid = (errors: FieldErrorsImpl) => {
    console.error(errors);
  };

  return (
    <div className="py-5 px-10">
      <div className="border-b-2 border-dashed py-2">
        <button
          className="bg-red-300 rounded-3xl text-white font-bold text-3xl px-12 py-10"
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
      <div>
        <form
          className="pt-4 flex flex-col space-y-2"
          onSubmit={handleSubmit(onValid, onInvalid)}
        >
          <input
            className="max-w-sm"
            type={"text"}
            placeholder="니모닉을 입력하세요"
            {...register("mnemonic", {
              required: "니모닉을 입력하세요"
            })}
          />
          <input
            className="max-w-sm"
            type={"password"}
            placeholder="비밀번호를 입력하세요"
            {...register("password", {
              required: "비밀번호를 입력하세요"
            })}
          />
          <button
            type="submit"
            className="bg-red-300 rounded-3xl text-white font-bold text-3xl p-10 max-w-sm"
          >
            지갑 생성
          </button>
        </form>
      </div>
      {walletData?.ok ? (
        <div className="py-2 border-b-2 border-dashed space-x-2">
          <label className="flex items-center">
            생성된 지갑
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
          <span>{walletData.address}</span>
        </div>
      ) : (
        <div className="py-2 border-b-2 border-dashed space-x-2">
          <label className="flex items-center">
            지갑 생성 실패 메세지
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
          <span>{walletData?.message}</span>
        </div>
      )}
    </div>
  );
};

export default Home;
