import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import { Cliente } from "./page";
import { useState } from "react";
import { upsertCliente } from "src/app/actions";
import { useRouter } from "next/navigation";

interface ClientFormProps {
    client?: Cliente
    isNew: boolean
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onOpen?: () => void
}

export function ClientForm({ client, isNew, isOpen, onOpenChange, onOpen }: ClientFormProps) {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const nombre = formData.get('nombre') as string || client?.nombre || '';
        const apellido = formData.get('apellido') as string || client?.apellido || '';
        const cedula = formData.get('cedula') as string || String(client?.cedula) || '';
        const ciudad = formData.get('ciudad') as string || client?.ciudad || '';
        const codTaller = formData.get('codTaller') as string || String(client?.codTaller);

        await upsertCliente(nombre, apellido, cedula, ciudad, parseInt(codTaller));
        router.refresh();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {() => (<form onSubmit={handleSubmit} className="flex flex-wrap gap-4 p-4 justify-center">
                    <Input type="text" label="Nombre" name="nombre" />
                    <Input type="text" label="Apellido" name="apellido" />
                    <Input type="text" label="Cédula" name="cedula" />
                    <Input type="text" label="Ciudad" name="ciudad" />
                    <Input type="number" label="Código Taller" name="codTaller" />
                    <Button type="submit" color={isNew ? 'primary' : 'secondary'} variant="ghost" onClick={onOpen}>
                        {
                            isNew ? 'Crear' : 'Actualizar'
                        }
                    </Button>
                </form>)}
            </ModalContent>
        </Modal>
    )
}