import { deleteEmpleado, deleteRepuesto, getEmpleados, getRepuestosByCodTaller, upsertEmpleado, upsertRepuesto } from "src/app/actions"
import { EmployeeTable, PartTable } from "src/components/AllTables";
import { getCodTaller } from "src/utils/getCodTaller"

export interface Repuesto {
    codRepuesto: number;
    nombreRepuesto: string;
    descripcionRepuesto: string;
    codTaller: number;
}

export default async function Employee({ params }: { params: { taller: string } }) {
    const codTaller = getCodTaller(params.taller)

    const repuestos: Repuesto[] = await getRepuestosByCodTaller(codTaller)

    return (
        <div className="flex justify-center py-8">
            <div className="flex flex-col max-w-[60%]">
                <PartTable deleteDB={deleteRepuesto} upsert={upsertRepuesto} data={repuestos} />
            </div>
        </div>
    )
}