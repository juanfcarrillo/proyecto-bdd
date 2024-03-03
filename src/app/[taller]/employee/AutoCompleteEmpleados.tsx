import { Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { Key } from "react"
import { Empleado } from "./page"

interface AutocompleteEmpleadosProps {
    empleados: Empleado[]
    onEmpleadoSelected: (empleado: Empleado) => void
}

export function AutocompleteEmpleados({ empleados, onEmpleadoSelected }: AutocompleteEmpleadosProps) {
    function handleChange(empleado: Key) {
        onEmpleadoSelected({
            cedula: Number(empleado as number)
        })
    }

    return (
        <Autocomplete
            label="Select Employee"
            className="max-w-xs"
            onSelectionChange={handleChange}
        >
            {empleados.map((empleado) => (
                <AutocompleteItem textValue={String(empleado.id)} key={empleado.id} value={empleado.id}>
                    {empleado.name}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    )
}