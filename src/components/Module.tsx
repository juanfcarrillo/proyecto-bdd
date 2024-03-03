"use client"
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useTallerContext } from "src/context/useTallerContext";

interface ModuleProps {
    title: string;
    children: React.ReactElement;
    href: string;
}

export function Module({ children, title, href }: ModuleProps) {
    const router = useRouter()
    const { codTaller } = useTallerContext()

    function handleClick() {
        router.push(codTaller + "/" + href)
    }

    return (
        <Card shadow="sm" className="p-5" isPressable onClick={handleClick} >
            <CardBody className="flex overflow-visible p-0 justify-center items-center">
                {children}
            </CardBody>
            <CardFooter className="text-small justify-center">
                <h3>{title}</h3>
            </CardFooter>
        </Card>
    )
}