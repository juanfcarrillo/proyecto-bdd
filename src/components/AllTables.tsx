"use client"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, useDisclosure, Tooltip, Button } from "@nextui-org/react";
import { Fragment, useState } from "react";
import { TableForm } from "./Table/TableForm";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { useRouter } from "next/navigation";

const employee_schema: SchemaElem[] = [
    { field: 'codEmpleado', headerName: 'Código' },
    { field: 'cedula', headerName: 'Cédula' }, // Adjust header names if needed
    { field: 'fechaContrato', headerName: 'Fecha de Contrato', transform: (date: Date) => date.toDateString() },
    { field: 'nombre', headerName: 'Nombre' },
    { field: 'tipo', headerName: 'Tipo' },
    { field: 'salario', headerName: 'Salario' },
    { field: 'codTaller', headerName: 'Código Taller' }
];

const part_schema: SchemaElem[] = [
    { field: 'codRepuesto', headerName: 'Código Repuesto' },
    { field: 'nombreRepuesto', headerName: 'Nombre' }, // Keep 'Nombre' for consistency  
    { field: 'descripcionRepuesto', headerName: 'Descripción' },
    { field: 'codTaller', headerName: 'Código Taller' },
];

const vehiculo_schema: SchemaElem[] = [
    { field: 'numMatricula', headerName: 'Número de Matrícula' },
    { field: 'codTaller', headerName: 'Código de Taller' },
    { field: 'fechaCompra', headerName: 'Fecha de Compra', transform: (date: Date) => date.toLocaleDateString() }, // Or your preferred date formatting
    { field: 'nombre', headerName: 'Nombre Cliente' },
    { field: 'apellido', headerName: 'Apellido Cliente' }
];

const reparacion_schema: SchemaElem[] = [
    { field: "codReparacion", headerName: "Código Reparación" },
    { field: "numMatricula", headerName: "Número Matrícula" },
    { field: "fecha", headerName: "Fecha", transform: (date: Date) => date.toLocaleDateString() },
    { field: "tipo", headerName: "Tipo" }
];

export interface SchemaElem {
    field: string,
    headerName: string
    transform?: (value: any) => string
}

interface BaseTable<T> {
    data: T[]
    schema: SchemaElem[]
    upsert: (formData: FormData) => Promise<void>
    deleteDB: (elem: any) => Promise<void>
}

export function BaseTable<T>({ data: employees, schema, upsert, deleteDB }: BaseTable<T>) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isNew, setIsNew] = useState(true)
    const [current, setCurrent] = useState<T>({} as T)
    const router = useRouter()

    function handleNew() {
        setIsNew(true)
        setCurrent({} as T)
        onOpen()
    }

    function handleEdit(newCurrent: T) {
        setCurrent(newCurrent)
        setIsNew(false)
        onOpen()
    }

    async function handleSubmit(formData: FormData) {
        await upsert(formData)
        onClose()
        setCurrent({} as T)
        router.refresh()
    }

    async function handleDelete(elem: T) {
        await deleteDB(elem)
        router.refresh()
    }

    if (schema.length === 0) {
        return (
            <Fragment>
                <h1>Esquema vacío</h1>
            </Fragment>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <Button onClick={() => handleNew()}>Nuevo</Button>
            <TableForm current={current} isOpen={isOpen} handleSubmit={handleSubmit} schema={schema} onOpenChange={onOpenChange} isNew={isNew} onOpen={onOpen} />
            <Table aria-label="Clientes">
                <TableHeader>
                    {
                        schema.map((elem, index) => (
                            <TableColumn key={index}>{elem.headerName}</TableColumn>
                        )).concat(
                            <TableColumn>Acciones</TableColumn>
                        )
                    }
                </TableHeader>
                <TableBody>
                    {
                        employees.map((employee, index) => (
                            <TableRow key={index}>
                                {
                                    schema.map((elem, index) => (
                                        <TableCell key={index}>{
                                            elem.transform
                                                ? elem.transform(getKeyValue(employee, elem.field))
                                                : getKeyValue(employee, elem.field)
                                        }</TableCell>
                                    )).concat(
                                        <TableCell>
                                            <div className="relative flex items-center gap-2">
                                                <Tooltip content="Editar">
                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
                                                        handleEdit(employee)
                                                    }}>
                                                        <EditIcon />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip content="Eliminar">
                                                    <span
                                                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                        onClick={() => handleDelete(employee)}
                                                    >
                                                        <DeleteIcon />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

const withTableHOC = (schema: SchemaElem[]) => {
    function EnhancedTable<T>(props: Omit<BaseTable<T>, 'schema'>) {
        // Access config options
        // Conditional rendering based on data and schema 

        if (schema.length === 0) {
            return (
                <Fragment>
                    <h1>{'Cargando esquema...'}</h1>
                </Fragment>
            )
        }

        // Otherwise, use the BaseComponent with customizations
        return (
            <BaseTable
                {...props}
                schema={schema}
            />
        );
    };

    return EnhancedTable;
};

export const EmployeeTable = withTableHOC(employee_schema);
export const PartTable = withTableHOC(part_schema);
export const VehicleTable = withTableHOC(vehiculo_schema);
export const RepairTableForm = withTableHOC(reparacion_schema);