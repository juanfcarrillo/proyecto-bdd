import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import { SchemaElem } from "../AllTables";
import { useEffect, useState } from "react";

interface TableFormProps {
    schema: SchemaElem[]
    isNew: boolean
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onOpen?: () => void,
    handleSubmit: (formData: FormData) => void
    current?: any
}

export function TableForm({
    schema,
    isNew,
    isOpen,
    onOpenChange,
    onOpen,
    handleSubmit,
    current
}: TableFormProps) {
    const [formFields, setFormFields] = useState({} as any)

    useEffect(() => {
        if (current) {
            if (Object.keys(current).length === 0) {
                return
            }

            const formFields = Object.keys(schema).reduce((acc, key) => {
                const field = schema[key as any].field
                const value = current[field]

                return {
                    ...acc,
                    [field]: value
                }
            }, {})

            setFormFields(formFields)
        }
    }, [current])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormFields({} as any)

        const currentData = current ? Object.entries(current) : []

        const formData = new FormData();

        const currentForm = new FormData(e.currentTarget)

        if (currentData.length === 0) {
            handleSubmit(currentForm)
            return
        }

        currentData.forEach(([key, value]) => {
            formData.append(key,
                currentForm.get(key)
                    ? String(currentForm.get(key))
                    : String(value))
        })

        handleSubmit(formData)
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {() => (
                    <form onSubmit={handleSubmitForm} className="flex flex-wrap gap-4 p-4 justify-center">
                        {
                            schema.map((elem, index) => (
                                <Input key={index} type="text" label={elem.headerName} name={elem.field} onChange={handleChange} value={formFields[elem.field]} />
                            ))
                        }
                        <Button type="submit" color={isNew ? 'primary' : 'secondary'} variant="ghost" onClick={onOpen}>
                            {
                                isNew ? 'Crear' : 'Actualizar'
                            }
                        </Button>
                    </form>
                )}
            </ModalContent>
        </Modal>
    )
}