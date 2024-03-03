import { deleteEmpleado, getEmpleados, upsertEmpleado } from "src/app/actions"
import { EmployeeTable } from "src/components/AllTables";
import { getCodTaller } from "src/utils/getCodTaller"

export interface Empleado {
    codEmpleado: number;
    cedula: number;
    fechaContrato: Date;
    nombre: string;
    tipo: string;
    salario: number;
    codTaller: number;
}

export default async function Employee({ params }: { params: { taller: string } }) {
    const codTaller = getCodTaller(params.taller)

    const empleados: Empleado[] = await getEmpleados(codTaller)

    return (
        <div className="flex justify-center">
            <div className="flex flex-col max-w-[60%]">
                <EmployeeTable deleteDB={deleteEmpleado} upsert={upsertEmpleado} data={empleados} />
            </div>
        </div>
    )
}