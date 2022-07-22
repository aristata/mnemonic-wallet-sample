import { NextApiRequest, NextApiResponse } from "next";
import lightWallet from "eth-lightwallet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const mnemonic = await lightWallet.keystore.generateRandomSeed();
  console.log("mnemonic = ", mnemonic);
  return res.status(200).json({ mnemonic });
}
