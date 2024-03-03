"use client"
import React, { createContext, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";

interface TallerContextType {
    codTaller: string;
    setTaller: (codTaller: string) => void;
}

const tallerContext = createContext<TallerContextType>({} as TallerContextType);

export function TallerContext({ children, codTaller }: { children: React.ReactNode, codTaller: string }) {
    const [codTallerState, setTaller] = useState(codTaller);

    return (
        <NextUIProvider>
            <tallerContext.Provider value={{ codTaller: codTallerState, setTaller }}>
                {children}
            </tallerContext.Provider>
        </NextUIProvider>
    );

}

export function useTallerContext() {
    const context = React.useContext(tallerContext);
    if (!context) {
        throw new Error("useTallerContext must be used within a TallerContext");
    }
    return context;
}