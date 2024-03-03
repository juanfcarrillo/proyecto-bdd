
export function getCodTaller(taller: string) {
    let codTaller: number

    if (taller === "quito") {
        codTaller = 1
    } else {
        codTaller = 2
    }

    return codTaller
}