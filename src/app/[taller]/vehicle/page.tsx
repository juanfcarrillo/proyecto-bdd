import { deleteRepuesto, deleteVehiculo, getVehiculos, upsertRepuesto, upsertVehiculo } from "src/app/actions"
import { VehicleTable } from "src/components/AllTables"
import { getCodTaller } from "src/utils/getCodTaller"

export interface Vehiculo {
    numMatricula: number;
    codTaller: number;
    fechaCompra: Date;
    nombre: string;
    apellido: string;
}

export default async function Vehicle({ params }: { params: { taller: string } }) {
    const codTaller = getCodTaller(params.taller)

    const vehiculos: Vehiculo[] = await getVehiculos(codTaller)

    return (
        <div className="flex justify-center py-8">
            <div className="flex flex-col max-w-[60%]">
                <VehicleTable deleteDB={deleteVehiculo} upsert={upsertVehiculo} data={vehiculos} />
            </div>
        </div>
    )

}