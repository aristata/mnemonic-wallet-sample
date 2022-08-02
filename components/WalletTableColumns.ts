import { Wallet } from "@prisma/client";
import moment from "moment";
import { TableColumn } from "react-data-table-component";

export const walletTableColumns: TableColumn<Wallet>[] = [
  {
    name: "id",
    selector: (row) => row.id,
    width: "fit-content"
  },
  {
    name: "note",
    selector: (row) => (row.note ? row.note : ""),
    width: "150px"
  },
  {
    name: "walletPassword",
    selector: (row) => row.walletPassword,
    width: "150px"
  },
  {
    name: "walletAddress",
    selector: (row) => row.walletAddress,
    width: "350px"
  },

  {
    name: "walletPrivateKey",
    selector: (row) => row.walletPrivateKey,
    width: "500px"
  },
  {
    name: "walletMnemonic",
    selector: (row) => row.walletMnemonic,
    width: "500px"
  },
  {
    name: "createdAt",
    selector: (row) => row.createdAt,
    format: (row) => moment(row.createdAt).format("YYYY-MM-DD hh:mm:ss"),
    width: "200px",
    center: true
  },
  {
    name: "updatedAt",
    selector: (row) => row.updatedAt,
    format: (row) => moment(row.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
    width: "200px",
    center: true
  }
];
