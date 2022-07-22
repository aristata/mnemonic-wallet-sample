import { NextApiRequest, NextApiResponse } from "next";
import lightWallet from "eth-lightwallet";
import apiHandler, { ResponseType } from "@libs/apiHandler";

function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const mnemonic = lightWallet.keystore.generateRandomSeed();
  console.log("mnemonic = ", mnemonic);
  return res.status(200).json({ ok: true, mnemonic });
}

export default apiHandler("POST", handler);
