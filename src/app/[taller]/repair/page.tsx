import { deleteRepair, getAllReMatriculaVehiculo, getAllRepairs, getRepairsByNumMatricula, upsertRepair } from "src/app/actions";
import { RepairTable } from "./RepairTable";
import { getCodTaller } from "src/utils/getCodTaller";

export interface Matriculas {
    numMatricula: number;
}

export interface Reparacion {
    codReparacion: number;
    numMatricula: number;
    fecha: Date;
    tipo: string;
}

export default async function Repair({ params }: { params: { taller: string } }) {
    const codTaller = getCodTaller(params.taller);
    const matriculas = await getAllReMatriculaVehiculo();

    return (
        <div className="flex justify-center">
            <RepairTable deleteRepair={deleteRepair} upsertRepair={upsertRepair} codTaller={codTaller} matriculas={matriculas} getRepairByMatricula={getRepairsByNumMatricula} />
        </div>
    )
}