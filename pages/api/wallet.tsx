import { NextApiRequest, NextApiResponse } from "next";
import lightWallet, { VaultOptions } from "eth-lightwallet";
import apiHandler from "@libs/apiHandler";
import fs from "fs";

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mnemonic, password } = req.body;

  const vaultOption: VaultOptions = {
    password: password,
    seedPhrase: mnemonic,
    hdPathString: "m/44'/60'/0'/0"
  };

  lightWallet.keystore.createVault(vaultOption, function (error, keystore) {
    keystore.keyFromPassword(password, function (error, pwDerivedKey) {
      keystore.generateNewAddress(pwDerivedKey, 1);

      const address = keystore.getAddresses().at(0);
      const serializedKeystore = keystore.serialize();
      const now = Date.now();

      fs.writeFile(
        `createdWallets/wallet_${now}.json`,
        serializedKeystore,
        function (error) {
          if (error) {
            res.json({ ok: false, message: error.message });
          } else {
            console.log("address = ", address);
            res.json({ ok: true, address });
          }
        }
      );
    });
  });
}

export default apiHandler("POST", handler);
