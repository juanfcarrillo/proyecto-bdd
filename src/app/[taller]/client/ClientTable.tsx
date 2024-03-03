"use client"
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import { Cliente } from "./page";
import { DeleteIcon } from "src/components/DeleteIcon";
import { EditIcon } from "src/components/EditIcon";
import { ClientForm } from "./ClientForm";
import { useState } from "react";

interface ClientTableProps {
    clientes: Cliente[]
    deleteCli: (id: number) => void
}

export function ClientTable({ clientes, deleteCli }: ClientTableProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [client, setClient] = useState<Cliente | undefined>({} as Cliente)
    const [isNew, setIsNew] = useState(true)

    function handleNew() {
        setClient(undefined)
        setIsNew(true)
        onOpen()
    }

    function handleEdit(cliente: Cliente) {
        setClient(cliente)
        setIsNew(false)
        onOpen()
    }

    return (
        <div className="flex flex-col justify-center gap-6 my-9">
            <Button onClick={() => handleNew()}>Nuevo</Button>
            <ClientForm isOpen={isOpen} onOpenChange={onOpenChange} client={client} isNew={isNew} onOpen={onOpen} />
            <Table aria-label="Clientes">
                <TableHeader>
                    <TableColumn>NOMBRE</TableColumn>
                    <TableColumn>APELLIDO</TableColumn>
                    <TableColumn>CÉDULA</TableColumn>
                    <TableColumn>CIUDAD</TableColumn>
                    <TableColumn>CÓDIGO TALLER</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                    {clientes.map((cliente, index) => (
                        <TableRow key={index}>
                            <TableCell>{cliente.nombre}</TableCell>
                            <TableCell>{cliente.apellido}</TableCell>
                            <TableCell>{cliente.cedula}</TableCell>
                            <TableCell>{cliente.ciudad}</TableCell>
                            <TableCell>{cliente.codTaller}</TableCell>
                            <TableCell>
                                <div className="relative flex items-center gap-2">
                                    <Tooltip content="Editar">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                                            handleEdit(cliente)
                                        }}>
                                            <EditIcon />
                                        </span>
                                    </Tooltip>
                                    <Tooltip content="Eliminar">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => deleteCli(cliente.cedula)}>
                                            <DeleteIcon />
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}