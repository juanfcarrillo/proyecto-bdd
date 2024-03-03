import { tallerConfig } from "src/data/dbInstance";

export function setGlobalCodTaller(codTaller: number) {
    tallerConfig.codTaller = codTaller
}