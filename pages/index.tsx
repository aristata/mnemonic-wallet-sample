import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useForm, FieldErrorsImpl } from "react-hook-form";
import useMutation from "@libs/useMutation";
import useFatch from "@libs/useFatch";
import { SaveWalletResponse } from "@api/db/saveWallet";
import { GetWalletsResponse } from "@api/db/getWallets";
import { Wallet } from "@prisma/client";
import DataTable, {
  Alignment,
  Direction,
  TableRow
} from "react-data-table-component";
import { walletTableColumns } from "@components/WalletTableColumns";
import SubHeaderComponent from "@components/SubHeaderComponent";

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
  // state
  const [walletList, setWalletList] = useState<Wallet[]>([]);
  const [formData, setFormData] = useState<WalletCreateForm>({
    mnemonic: "",
    password: ""
  });

  // mutation
  const [
    mnemonic,
    mnemonicReset,
    { loading: mnemonicLoading, data: mnemonicData, error: mnemonicError }
  ] = useMutation<MnemonicMutationResult>("/api/mnemonic");

  const [
    wallet,
    walletReset,
    { loading: walletLoading, data: walletData, error: walletError }
  ] = useMutation<WalletMutationResult>("/api/wallet");

  // fatch
  const [
    saveWallet,
    { loading: saveWalletLoading, data: saveWalletData, error: saveWalletError }
  ] = useFatch<SaveWalletResponse>("POST", "/api/db/saveWallet");

  const [
    getWallets,
    { loading: getWalletLoading, data: getWalletsData, error: getWalletError }
  ] = useFatch<GetWalletsResponse>("GET", "/api/db/getWallets");

  // form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<WalletCreateForm>();

  // 니모닉 생성 함수
  const createMnemonic = () => {
    mnemonic();
  };

  // 니모닉이 생성되면, 폼에 니모닉을 자동으로 입력한다
  useEffect(() => {
    if (mnemonicData) {
      setValue("mnemonic", mnemonicData.mnemonic);
    } else {
      setValue("mnemonic", "");
    }
  }, [mnemonicData]);

  // 폼 서브밋 (=지갑 생성 요청)
  const onValid = (data: WalletCreateForm) => {
    setFormData(data); // 지갑 생성 후 디비 저장을 위해 스테이트에 폼 데이터를 저장
    wallet(data); // 지갑 생성
  };

  // 지갑 생성 후 동작
  useEffect(() => {
    if (walletData?.ok) {
      // 디비에 데이터 저장
      saveWallet({
        address: walletData?.address,
        password: formData.password,
        mnemonic: formData.mnemonic
      });

      // 디비에서 목록 조회
      setTimeout(() => {
        getWallets();
      }, 500);
    }
  }, [walletData]);

  useEffect(() => {
    getWallets();
  }, []);

  useEffect(() => {
    if (getWalletsData?.ok) {
      setWalletList(getWalletsData.result);
    }
  }, [getWalletsData]);

  const onInvalid = (errors: FieldErrorsImpl) => {
    console.error(errors);
  };

  const resetAll = () => {
    reset();
    walletReset();
    mnemonicReset();
  };

  const handleRowClicked = (row: Wallet, event: React.MouseEvent) => {
    setValue("mnemonic", row.walletMnemonic);
  };

  return (
    <div className="py-5 px-10">
      <div className="border-b-2 border-dashed py-2 space-x-2">
        <button
          className="bg-red-300 rounded-3xl text-white font-bold text-3xl px-12 py-10"
          onClick={createMnemonic}
        >
          니모닉 생성
        </button>
        <button
          className="bg-green-300 rounded-3xl text-white font-bold text-3xl px-12 py-10"
          onClick={resetAll}
        >
          새로 만들기
        </button>
        {mnemonicData?.ok ? (
          <div className="py-2 space-x-2">
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
      </div>

      <div className="border-b-2 border-dashed py-2 space-x-2">
        <form
          className="flex flex-col space-y-2"
          onSubmit={handleSubmit(onValid, onInvalid)}
        >
          <input
            className="max-w-xl"
            type={"text"}
            placeholder="니모닉을 입력하세요"
            {...register("mnemonic", {
              required: "니모닉을 입력하세요"
            })}
          />
          <input
            className="max-w-xl"
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
        {!walletData ? null : walletData.ok ? (
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
              메세지
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

      <div className="py-2 space-x-2">
        {walletList.length > 0 ? (
          <div>
            <DataTable
              columns={walletTableColumns}
              data={walletList}
              title="지갑 목록"
              fixedHeader
              fixedHeaderScrollHeight="300px"
              highlightOnHover
              pagination
              pointerOnHover
              striped
              onRowClicked={handleRowClicked}
            />
          </div>
        ) : (
          <>
            <span>생성된 지갑이 없습니다</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
