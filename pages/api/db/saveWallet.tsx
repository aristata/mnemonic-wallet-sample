// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/prismaClient";
import apiHandler, { ResponseType } from "@libs/apiHandler";

export interface SaveWalletResponse {
  ok: boolean;
  result?: object;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { address, password, mnemonic, note } = req.body;

  try {
    const walletOutput = await client.wallet.upsert({
      create: {
        walletAddress: address,
        walletPassword: password,
        walletMnemonic: mnemonic,
        note: note
      },
      update: {
        walletPassword: password,
        note: note
      },
      where: {
        walletAddress: address
      }
    });

    return res.status(200).json({ ok: true, result: walletOutput });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
}

export default apiHandler("POST", handler);
