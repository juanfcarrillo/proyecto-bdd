import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { bdQuitoConfig, getConnection } from "src/data/dbInstance";
import * as sql from 'mssql'
import { ClientTable } from "./ClientTable";
import { deleteCliente, selectCliente } from "src/app/actions";

export interface Cliente {
    nombre: string;
    apellido: string;
    cedula: number;
    ciudad: string;
    codTaller: number;
}

async function getClientes(codTaller: number) {
    const connection = await getConnection()

    const result = await connection.request()
        .input('codTaller', sql.Int, codTaller)
        .execute('sp_GetClientesByCodTaller');

    return result.recordset
}

export default async function Client({ params }: { params: { taller: string } }) {
    let codTaller: number

    if (params.taller === "quito") {
        codTaller = 1
    } else {
        codTaller = 2
    }

    const clientes = await getClientes(codTaller)

    return (
        <div className="flex w-[100%] justify-center">
            <div>
                <ClientTable clientes={clientes} deleteCli={deleteCliente} />
            </div>
        </div>
    )
}