import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import database from "src/assets/databases.png"

export function NavBar() {
    return (
        <Navbar className="border-b-1 border-primary-50">
            <NavbarBrand>
                <Image src={database} alt="BDD" width={40} height={40} className="mr-4" />
                <p className="font-bold text-inherit">BDD</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Button as={Link} href="/quito" color="primary" variant="flat">
                        Quito
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} href="/guayaquil" color="primary" variant="flat">
                        Guayaquil
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}