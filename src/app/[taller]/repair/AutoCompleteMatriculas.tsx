import { Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { Matriculas } from "./page"
import { Key } from "react"

interface AutocompleteMatriculasProps {
    matriculas: Matriculas[]
    onMatriculaSelected: (matricula: Matriculas) => void
}

export default function AutocompleteMatriculas({ matriculas, onMatriculaSelected }: AutocompleteMatriculasProps) {

    function handleChange(matricula: Key) {
        onMatriculaSelected({
            numMatricula: Number(matricula)
        })
    }

    return (
        <Autocomplete
            label="Select Matricula"
            className="max-w-xs"
            onSelectionChange={handleChange}
        >
            {matriculas.map((matricula) => (
                <AutocompleteItem textValue={String(matricula.numMatricula)} key={matricula.numMatricula} value={matricula.numMatricula}>
                    {matricula.numMatricula}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    )
}