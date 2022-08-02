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
import { cls } from "@libs/utils";

interface MnemonicMutationResult {
  ok: boolean;
  mnemonic: string;
}

interface WalletCreateForm {
  mnemonic: string;
  password: string;
  address?: string;
  privateKey?: string;
  note?: string;
}

interface WalletMutationResult {
  ok: boolean;
  message?: string;
  address?: string;
  privateKey?: string;
  mnemonic?: string;
}

const Home: NextPage = () => {
  // state
  const [walletList, setWalletList] = useState<Wallet[]>([]);
  const [formData, setFormData] = useState<WalletCreateForm>({
    mnemonic: "",
    password: "",
    address: "",
    privateKey: "",
    note: ""
  });
  const [mode, setMode] = useState<"create" | "update">("create");

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
    // 기존 입력 폼은 초기화 한다
    resetAll();

    // 니모닉 생성
    mnemonic();
  };

  // 니모닉이 생성되면, 폼에 니모닉을 자동으로 입력한다
  useEffect(() => {
    if (mnemonicData) {
      setValue("mnemonic", mnemonicData.mnemonic);
    } else {
      setValue("mnemonic", walletData?.mnemonic ? walletData?.mnemonic : "");
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
        address: walletData?.address ? walletData?.address : formData.address,
        password: formData.password,
        privateKey: walletData?.privateKey
          ? walletData?.privateKey
          : formData.privateKey,
        mnemonic: formData.mnemonic,
        note: formData.note
      });

      setMode("update");

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
    setMode("create");
  };

  // 지갑 목록에서 로우 클릭시
  const handleRowClicked = (row: Wallet, event: React.MouseEvent) => {
    setMode("update");
    setValue("mnemonic", row.walletMnemonic);
    setValue("password", row.walletPassword);
    setValue("address", row.walletAddress);
    setValue("privateKey", row.walletPrivateKey);
    setValue("note", row.note ? row.note : "");
  };

  return (
    <div className="py-5 px-10">
      {/* 버튼 영역 */}
      <div className="border-b-2 border-black border-dashed space-x-2 py-2 flex items-center">
        <button
          className="bg-green-300 rounded-3xl text-white font-bold text-3xl px-12 py-10 hover:bg-green-400"
          onClick={createMnemonic}
        >
          니모닉 생성
        </button>
        <button
          type="submit"
          form="form"
          className="bg-red-300 rounded-3xl text-white font-bold text-3xl px-12 py-10 hover:bg-red-400"
        >
          지갑 생성 및 수정
        </button>
        <button
          className="bg-amber-300 rounded-3xl text-white px-12 py-10 hover:bg-amber-400"
          onClick={resetAll}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* 폼 영역 */}
      <div className="border-b-2 border-black border-dashed space-x-2 py-2">
        <form
          className="flex flex-col space-y-2"
          id="form"
          onSubmit={handleSubmit(onValid, onInvalid)}
        >
          <div className="flex items-center justify-center">
            <label className="w-1/12">노트</label>
            <input
              className="w-full"
              type={"text"}
              placeholder="노트는 "
              {...register("note")}
            />
          </div>
          <div className="flex items-center justify-center">
            <label className="w-1/12">비밀번호</label>
            <input
              className="w-full"
              type={"text"}
              placeholder="비밀번호를 입력하세요"
              {...register("password", {
                required: "비밀번호를 입력하세요"
              })}
            />
          </div>
          <div className="flex items-center justify-center">
            <label className="w-1/12">공개키</label>
            <input
              className={cls(
                "w-full",
                mnemonicData === undefined && mode !== "update"
                  ? ""
                  : "bg-gray-300"
              )}
              type={"text"}
              placeholder="공개키"
              {...register("address")}
              disabled={
                mnemonicData === undefined && mode !== "update" ? false : true
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <label className="w-1/12">비밀키</label>
            <input
              className={cls(
                "w-full",
                mnemonicData === undefined && mode !== "update"
                  ? ""
                  : "bg-gray-300"
              )}
              type={"text"}
              placeholder="비밀키"
              {...register("privateKey")}
              disabled={
                mnemonicData === undefined && mode !== "update" ? false : true
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <label className="w-1/12">니모닉</label>
            <input
              className={cls("w-full", mode === "update" ? "bg-gray-300" : "")}
              type={"text"}
              placeholder="니모닉을 입력하세요"
              {...register("mnemonic", {
                required: "니모닉을 입력하세요"
              })}
              disabled={mode === "update" ? true : false}
            />
          </div>
        </form>
      </div>

      {/* 목록 영역 */}
      <div className="space-x-2 py-2">
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
