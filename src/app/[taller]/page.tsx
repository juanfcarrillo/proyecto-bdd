import Link from "next/link"
import { redirect } from "next/navigation"
import { ClientIcon } from "src/components/ClientIcon"
import { EmployeeIcon } from "src/components/EmployeeIcon"
import { Module } from "src/components/Module"
import { PartsIcon } from "src/components/PartsIcon"
import { RepairIcon } from "src/components/RepairIcon"
import { VehicleIcon } from "src/components/VehicleIcon"
import { getCodTaller } from "src/utils/getCodTaller"
import { setGlobalCodTaller } from "src/utils/setGlobalCodTaller"

export default async function Modulos({ params }: { params: { taller: string } }) {
    const codTaller = getCodTaller(params.taller)

    setGlobalCodTaller(codTaller)

    if (params.taller !== "quito" && params.taller !== "guayaquil") {
        redirect("/quito")
    }

    if (!params.taller) {
        return <h1>El taller no existe</h1>
    }

    return (
        <div className="flex items-center flex-col px-[20%] py-8">
            <Link href="client" >
                <h1 className="text-5xl">Modulos</h1>
            </Link>
            <div className="flex my-10 gap-5 flex-wrap max-w-[50%] justify-center">
                <Module title="Clientes" href="client" >
                    <ClientIcon />
                </Module>
                <Module title="Empleados" href="employee" >
                    <EmployeeIcon />
                </Module>
                <Module title="Repuestos" href="parts" >
                    <PartsIcon />
                </Module>
                <Module title="Vehiculos" href="vehicle" >
                    <VehicleIcon />
                </Module>
                <Module title="Reparaciones" href="repair" >
                    <RepairIcon />
                </Module>
            </div>
        </div>
    )
}