'use client'

import { Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { Matriculas, Reparacion } from "./page"
import AutocompleteMatriculas from "./AutoCompleteMatriculas"
import { useEffect, useState } from "react"
import { RepairTableForm } from "src/components/AllTables"
import { deleteCliente } from "src/app/actions"

interface RepairTableProps {
    matriculas: Matriculas[]
    getRepairByMatricula: (numMatricula: number) => Promise<Reparacion[]>;
    upsertRepair: (formData: FormData) => Promise<void>;
    deleteRepair: (codTaller: number, codReparacion: number, numMatricula: number) => Promise<void>;
    codTaller: number;
}

export function RepairTable({ matriculas, getRepairByMatricula, codTaller, upsertRepair, deleteRepair }: RepairTableProps) {
    const [currentMatricula, setCurrentMatricula] = useState<Matriculas | null>(null)
    const [reparaciones, setReparaciones] = useState<Reparacion[]>([])

    async function getRepairs() {
        const reparaciones = await getRepairByMatricula(currentMatricula?.numMatricula as number)
        setReparaciones(reparaciones)
    }

    async function upsertRepairFn(formData: FormData) {
        formData.append('codTaller', String(codTaller))

        await upsertRepair(formData)
    }

    async function deleteRepairFn(repair: Reparacion) {
        await deleteRepair(codTaller, repair.codReparacion, repair.numMatricula)
    }

    useEffect(() => {
        if (currentMatricula !== null) {
            getRepairs()
        }
    }, [currentMatricula])

    return (
        <div className="flex flex-col items-center max-w-[60%] gap-8 my-8">
            <AutocompleteMatriculas matriculas={matriculas} onMatriculaSelected={(matricula) => setCurrentMatricula(matricula)} />
            <RepairTableForm deleteDB={deleteRepairFn} upsert={upsertRepairFn} data={reparaciones} />
        </div>
    )
}