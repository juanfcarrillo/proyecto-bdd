import * as sql from 'mssql'

export const tallerConfig = {
    codTaller: 1
}

export const bdQuitoConfig = {
    user: 'sa',
    password: 'Password123',
    database: 'TALLER_QUITO',
    server: '100.90.196.12',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true
    }
}

export const bdGuayaquilConfig = {
    user: 'sa',
    password: 'Password123',
    database: 'TALLER_GUAYAQUIL',
    server: 'DESKTOP-MAX\\MSSQLSERVER02',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true
    }
}

export async function getConnection() {
    if (tallerConfig.codTaller === 1) {
        return await sql.connect(bdQuitoConfig)
    }
    return await sql.connect(bdGuayaquilConfig)
}