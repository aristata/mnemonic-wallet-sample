// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/prismaClient";
import apiHandler, { ResponseType } from "@libs/apiHandler";
import { Wallet } from "@prisma/client";

export interface GetWalletsResponse {
  ok: boolean;
  result: Wallet[];
  message?: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetWalletsResponse>
) {
  const foundWallets = await client.wallet.findMany();
  if (foundWallets.length < 1) {
    return res
      .status(404)
      .json({ ok: false, message: "조회 결과가 없습니다.", result: [] });
  }

  return res.status(200).json({ ok: true, result: foundWallets });
}

export default apiHandler("GET", handler);
