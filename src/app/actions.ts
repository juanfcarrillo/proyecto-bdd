'use server'
import { getConnection, tallerConfig } from "src/data/dbInstance";
import * as sql from 'mssql'
import { Empleado } from "./[taller]/employee/page";
import { Repuesto } from "./[taller]/parts/page";
import { Vehiculo } from "./[taller]/vehicle/page";
import { Reparacion } from "./[taller]/repair/page";

// Cliente functions

export async function deleteCliente(cedula: number) {
    const connection = await getConnection()
    try {
        const cliente = await selectCliente(cedula.toString());

        let result = await connection.request()
            .input('cedula', sql.Int, cedula)
            .input('codTaller', sql.Int, tallerConfig.codTaller)
            .execute('sp_DeleteCliente');

        const inf = await deleteClienteInf(cliente.nombre, cliente.apellido);
        const inf2 = await deleteVehiculo(cliente.numMatricula);

        console.log(inf2);
        console.log(inf);
        console.log(result);
    } catch (err) {
        console.error('SQL error', err);
    }
}

export async function selectCliente(cedula: string) {
    const connection = await getConnection()
    try {
        let result = await connection.request()
            .input('cedula', sql.NVarChar(20), cedula)
            .execute('sp_SelectCliente');

        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
    }
}

async function insertCliente(nombre: string, apellido: string, cedula: string, ciudad: string, codTaller: number) {
    const connection = await getConnection()

    try {
        let result = await connection.request()
            .input('nombre', sql.NVarChar(50), nombre)
            .input('apellido', sql.NVarChar(50), apellido)
            .input('cedula', sql.NVarChar(20), cedula)
            .input('ciudad', sql.NVarChar(50), ciudad)
            .input('codTaller', sql.Int, codTaller)
            .execute('sp_InsertCliente');

        let inf = await insertClienteInf({ nombre, apellido });

        console.log(inf);
        console.log(result);
    } catch (err) {
        console.error('SQL error', err);
    }
}

export async function updateCliente(nombre: string, apellido: string, cedula: string, ciudad: string, codTaller: number) {
    try {
        const connection = await getConnection()

        const cliente = await selectCliente(cedula);

        let result = await connection.request()
            .input('nombre', sql.NVarChar(50), nombre)
            .input('apellido', sql.NVarChar(50), apellido)
            .input('cedula', sql.NVarChar(20), cedula)
            .input('ciudad', sql.NVarChar(50), ciudad)
            .input('codTaller', sql.Int, codTaller)
            .execute('sp_UpdateCliente');

        let inf = await updateClienteInf(
            cliente.nombre,
            cliente.apellido,
            nombre,
            apellido
        );

        console.log(inf);
        console.log(result);
    } catch (err) {
        console.error('SQL error', err);
    }
}

export async function upsertCliente(nombre: string, apellido: string, cedula: string, ciudad: string, codTaller: number) {
    const cliente = await selectCliente(cedula);
    if (cliente) {
        updateCliente(nombre, apellido, cedula, ciudad, codTaller);
    } else {
        insertCliente(nombre, apellido, cedula, ciudad, codTaller);
    }
}

// Funciones empleado

async function insertEmpleado(
    codEmpleado: number,
    cedula: string,
    fechaContrato: Date,
    nombre: string,
    tipo: string,
    salario: number,
    codTaller: number
): Promise<void> {
    const connection = await getConnection();

    try {
        const request = connection.request();
        request.input('codEmpleado', sql.Int, codEmpleado);
        request.input('cedula', sql.VarChar(50), cedula);
        request.input('fechaContrato', sql.Date, fechaContrato);
        request.input('nombre', sql.VarChar(100), nombre);
        request.input('tipo', sql.VarChar(50), tipo);
        request.input('salario', sql.Decimal(10, 2), salario);
        request.input('codTaller', sql.Int, codTaller);

        const result = await request.execute('sp_InsertEmpleado');

        // Optionally, you can process the result if needed, e.g.,
        console.log(result);
    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error; // Re-throw to allow for error handling at a higher level
    }
}

async function updateEmpleado(
    codEmpleado: number,
    cedula: string,
    fechaContrato: Date,
    nombre: string,
    tipo: string,
    salario: number,
    codTaller: number
): Promise<void> {
    const connection = await getConnection();

    try {
        const request = connection.request();
        request.input('codEmpleado', sql.Int, codEmpleado);
        request.input('cedula', sql.VarChar(50), cedula);
        request.input('fechaContrato', sql.Date, fechaContrato);
        request.input('nombre', sql.VarChar(100), nombre);
        request.input('tipo', sql.VarChar(50), tipo);
        request.input('salario', sql.Decimal(10, 2), salario);
        request.input('codTaller', sql.Int, codTaller);

        const result = await request.execute('sp_UpdateEmpleado');

    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error; // Re-throw to allow for error handling at a higher level
    }
}

async function selectEmpleadoById(cedula: string): Promise<Empleado> { // Assuming 'any' for flexibility of results
    const connection = await getConnection();

    try {
        const request = connection.request();
        request.input('cedula', sql.VarChar(50), cedula);
        const result = await request.execute('sp_SelectEmpleadoById');

        return result.recordset[0]; // Return the result set
    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error; // Re-throw to allow for error handling at a higher level
    }
}

export async function getEmpleados(codTaller: number): Promise<Empleado[]> { // Assuming 'any' for flexibility of results
    const connection = await getConnection();

    try {
        const request = connection.request();
        if (codTaller !== undefined) {
            request.input('codTaller', sql.Int, codTaller);
        }
        const result = await request.execute('sp_SelectEmpleados');

        return result.recordset as Empleado[]; // Return the result set
    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error; // Re-throw to allow for error handling at a higher level
    }
}

export async function deleteEmpleado(empleado: Empleado): Promise<void> {
    const connection = await getConnection();

    try {
        const request = connection.request();
        request.input('cedula', sql.VarChar(50), String(empleado.cedula));

        await request.execute('sp_DeleteEmpleado');

    } catch (error) {
        throw error; // Re-throw to allow for error handling at a higher level
    }
}

export async function upsertEmpleado(formData: FormData): Promise<void> {
    const codEmpleado = Number(formData.get('codEmpleado'));
    const cedula = String(formData.get('cedula'));
    const fechaContrato = new Date(String(formData.get('fechaContrato')));
    const nombre = String(formData.get('nombre'));
    const tipo = String(formData.get('tipo'));
    const salario = Number(formData.get('salario'));
    const codTaller = Number(formData.get('codTaller')) || 1;

    if (!cedula || !nombre || !tipo || !salario) {
        throw new Error('Invalid form data');
    }

    const empleado = await selectEmpleadoById(cedula);

    console.log(empleado)

    if (empleado) {
        updateEmpleado(codEmpleado, cedula, fechaContrato, nombre, tipo, salario, codTaller);
    } else {
        insertEmpleado(codEmpleado, cedula, fechaContrato, nombre, tipo, salario, codTaller);
    }
}

// Repuestos

export async function getRepuestosByCodTaller(codTaller: number): Promise<Repuesto[]> {
    const connection = await getConnection();
    const request = connection.request();

    // Define input parameters
    request.input('codTaller', sql.Int, codTaller);

    try {
        const result = await request.execute('GetRepuestos');
        return result.recordset as any[];
    } catch (err) {
        console.error("Error executing stored procedure:", err);
        throw err; // Re-throw to allow for error handling where this function is used
    }
}

async function getRepuestoById(codRepuesto: number): Promise<Repuesto | null> {
    const connection = await getConnection();
    const request = connection.request();

    request.input('codRepuesto', sql.Int, codRepuesto);

    try {
        const result = await request.execute('GetRepuestoByID');

        // Check if a record was found
        if (result.recordset.length > 0) {
            return result.recordset[0] as Repuesto; // Assuming recordset[0] holds the relevant data
        } else {
            return null; // No repuesto found with the given ID
        }

    } catch (err) {
        console.error("Error fetching repuesto:", err);
        throw err;
    }
}

async function insertRepuesto(codRepuesto: number, nombreRepuesto: string, descripcionRepuesto: string, codTaller: number) {
    const connection = await getConnection();
    const request = connection.request();

    request.input('codRespuesto', sql.Int, codRepuesto);
    request.input('nombreRepuesto', sql.NVarChar, nombreRepuesto);
    request.input('descripcionRepuesto', sql.NVarChar, descripcionRepuesto);
    request.input('codTaller', sql.Int, codTaller);

    try {
        await request.execute('InsertRepuesto');
        console.log("Repuesto inserted successfully");
    } catch (err) {
        console.error("Error inserting repuesto:", err);
        throw err;
    }
}

async function updateRepuesto(
    codRepuesto: number,
    nombreRepuesto: string,
    descripcionRepuesto: string,
    codTaller: number
) {
    const connection = await getConnection();
    const request = connection.request();

    // Define input parameters
    request.input('codRepuesto', sql.Int, codRepuesto);
    request.input('nombreRepuesto', sql.NVarChar, nombreRepuesto);
    request.input('descripcionRepuesto', sql.NVarChar, descripcionRepuesto);
    request.input('codTaller', sql.Int, codTaller);

    try {
        await request.execute('UpdateRepuesto');
        console.log("Repuesto updated successfully");
    } catch (err) {
        console.error("Error updating repuesto:", err);
        throw err;
    }
}

export async function deleteRepuesto(repuesto: Repuesto) {
    const nombreRepuesto = repuesto.nombreRepuesto;

    const connection = await getConnection();
    const request = connection.request();

    // Define input parameters
    request.input('nombreRepuesto', sql.NVarChar, nombreRepuesto);

    try {
        await request.execute('DeleteRepuesto');
        console.log("Repuesto deleted successfully (if it existed)");
    } catch (err) {
        console.error("Error deleting repuesto:", err);
        throw err;
    }
}

export async function upsertRepuesto(formData: FormData): Promise<void> {
    const codRepuesto = Number(formData.get('codRepuesto')) || null; // Assuming ID is optional for insert
    const nombreRepuesto = String(formData.get('nombreRepuesto'));
    const descripcionRepuesto = String(formData.get('descripcionRepuesto'));
    const codTaller = Number(formData.get('codTaller')) || 1;

    if (!nombreRepuesto || !descripcionRepuesto || !codTaller || !codRepuesto) {
        throw new Error('Invalid form data');
    }

    try {
        const existingRepuesto = await getRepuestoById(codRepuesto);

        if (existingRepuesto) {
            await updateRepuesto(codRepuesto, nombreRepuesto, descripcionRepuesto, codTaller);
        } else {
            await insertRepuesto(codRepuesto, nombreRepuesto, descripcionRepuesto, codTaller);
        }

    } catch (err) {
        console.error("Error in upsertRepuesto:", err);
        throw err;
    }
}

// Vehiculo

export async function getVehiculos(codTaller: number): Promise<any[]> {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Prepare input parameter
        request.input('codTaller', sql.Int, codTaller);

        // Execute stored procedure and get results
        const result = await request.execute('Select_VW_VEHICULO');

        // Assuming your stored procedure returns records from 'VW_VEHICULO'
        return result.recordset;
    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error; // Re-throw to allow for error handling further up
    }
}

async function getVehiculoId(numMatricula: string): Promise<Vehiculo | null> {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Prepare input parameter
        request.input('numMatricula', sql.VarChar(50), numMatricula);

        // Execute stored procedure, getting results
        const result = await request.execute('Read_VW_VEHICULO_By_ID');

        // Process the result (assuming one or zero records)
        if (result.recordset.length > 0) {
            return result.recordset[0] as Vehiculo;
        } else {
            return null; // No vehicle found
        }

    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error;
    }
}

async function insertVehiculo(
    numMatricula: string,
    codTaller: number,
    fechaCompra: Date,
    nombre: string,
    apellido: string
): Promise<void> {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Prepare input parameters
        request.input('numMatricula', sql.VarChar(50), numMatricula);
        request.input('codTaller', sql.Int, codTaller);
        request.input('fechaCompra', sql.Date, fechaCompra);
        request.input('nombre', sql.VarChar(50), nombre);
        request.input('apellido', sql.VarChar(50), apellido);

        // Execute stored procedure
        await request.execute('Insert_VW_VEHICULO');

        await insertMatricula(Number(numMatricula))

    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error;
    }
}

async function updateVehiculo(
    numMatricula: string,
    codTaller: number,
    fechaCompra: Date,
    nombre: string,
    apellido: string
): Promise<void> {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Prepare input parameters
        request.input('numMatricula', sql.VarChar(50), numMatricula);
        request.input('codTaller', sql.Int, codTaller);
        request.input('fechaCompra', sql.Date, fechaCompra);
        request.input('nombre', sql.VarChar(50), nombre);
        request.input('apellido', sql.VarChar(50), apellido);

        // Execute stored procedure
        await request.execute('Update_VW_VEHICULO');

        await updateMatricula(Number(numMatricula), Number(numMatricula))

    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error;
    }
}

export async function deleteVehiculo(vehiculo: Vehiculo): Promise<void> {

    const numMatricula = String(vehiculo.numMatricula);

    try {
        const connection = await getConnection();
        const request = connection.request();

        // Prepare input parameter
        request.input('numMatricula', sql.VarChar(50), numMatricula);

        // Execute stored procedure
        await request.execute('Delete_VW_VEHICULO');

    } catch (error) {
        console.error("Error executing stored procedure:", error);
        throw error;
    }

    try {
        await deleteMatricula(vehiculo.numMatricula);
    } catch (err) {
        console.error("Error deleting matricula:", err);
        throw err;
    }

}

export async function upsertVehiculo(formData: FormData): Promise<void> {
    const numMatricula = String(formData.get('numMatricula'));
    const codTaller = Number(formData.get('codTaller')) || 1;
    const fechaCompra = new Date(String(formData.get('fechaCompra')));
    const nombre = String(formData.get('nombre'));
    const apellido = String(formData.get('apellido'));

    if (!numMatricula || !codTaller || !fechaCompra || !nombre || !apellido) {
        throw new Error('Invalid form data');
    }

    const vehiculo = await getVehiculoId(numMatricula);

    if (vehiculo) {
        await updateVehiculo(numMatricula, codTaller, fechaCompra, nombre, apellido);
    } else {
        await insertVehiculo(numMatricula, codTaller, fechaCompra, nombre, apellido);
    }
}

// Reparaciones

async function getRepair(codReparacion: number, numMatricula: number): Promise<any> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('codReparacion', sql.Int, codReparacion);
        request.input('numMatricula', sql.Int, numMatricula);

        const result = await request.execute('sp_GetRepair');

        // Assuming sp_GetRepair returns a single row 
        return result.recordset[0];
    } catch (err) {
        console.error('Error getting repair:', err);
        throw err; // Re-throw for further error handling
    }
}

export async function getAllRepairs(): Promise<any[]> {
    const connection = await getConnection();
    const request = connection.request();

    const result = await request.execute('sp_GetAllRepairs');

    // Assuming your stored procedure returns result sets
    if (result.recordset) {
        return result.recordset as any[];
    } else {
        return []; // Return an empty array if no results
    }
}


export async function getRepairsByNumMatricula(numMatricula: number): Promise<Reparacion[]> {
    const connection = await getConnection();
    const request = connection.request();

    request.input('numMatricula', sql.Int, numMatricula);

    const result = await request.execute('sp_GetRepairsByNumMatricula');

    if (result.recordset) {
        return result.recordset as Reparacion[];
    } else {
        return [];
    }
}


async function insertRepair(repairData: Reparacion, codTaller: number): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    // Add input parameters (adjust types as necessary)
    request.input('codTaller', sql.Int, tallerConfig.codTaller = codTaller);
    request.input('codReparacion', sql.Int, repairData.codReparacion);
    request.input('numMatricula', sql.Int, repairData.numMatricula);
    request.input('fecha', sql.Date, repairData.fecha);
    request.input('tipo', sql.VarChar(50), repairData.tipo);
    try {
        await request.execute('sp_InsertRepair');
    } catch (err) {
        console.error("Error executing stored procedure:", err);
        throw err;
    }
}

async function updateRepair(repairData: Reparacion, codTaller: number): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    const vehicle = await getVehiculoId(repairData.numMatricula.toString());

    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    const codTallerVe = vehicle.codTaller;

    request.input('codTaller', sql.Int, codTallerVe);
    request.input('codReparacion', sql.Int, repairData.codReparacion);
    request.input('numMatricula', sql.Int, repairData.numMatricula);
    request.input('fecha', sql.Date, repairData.fecha);
    request.input('tipo', sql.VarChar(50), repairData.tipo);

    // Execute the stored procedure
    await request.execute('sp_UpdateRepair');
}

export async function deleteRepair(codTaller: number, codReparacion: number, numMatricula: number): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    request.input('codTaller', sql.Int, codTaller);
    request.input('codReparacion', sql.Int, codReparacion);
    request.input('numMatricula', sql.Int, numMatricula);

    await request.execute('sp_DeleteRepair');
}

export async function upsertRepair(formData: FormData): Promise<void> {
    const codTaller = Number(formData.get('codTaller')) || 1; // Default if not provided 
    const codReparacion = Number(formData.get('codReparacion')); // Optional for inserts
    const numMatricula = Number(formData.get('numMatricula'));
    const fecha = new Date(String(formData.get('fecha')));
    const tipo = String(formData.get('tipo'));

    if (!numMatricula || !fecha || !tipo) {
        throw new Error('Invalid repair data');
    }

    const existingRepair = await getRepair(
        codReparacion,
        numMatricula
    );

    const repairData = { codReparacion, numMatricula, fecha, tipo };

    if (existingRepair) {
        await updateRepair({
            ...existingRepair,
            ...repairData
        }, codTaller);
    } else {
        await insertRepair(repairData, codTaller);
    }
}

// Rematricula vehiculo

export async function getAllReMatriculaVehiculo(): Promise<any[]> {
    try {
        const connection = await getConnection();
        const request = connection.request();

        const result = await request.execute('get_re_matricula');

        return result.recordset;
    } catch (err) {
        console.error("Error executing stored procedure:", err);
        throw err;
    }
}

async function insertMatricula(numMatricula: number) {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Set input parameter for the stored procedure
        request.input('numMatricula', sql.Int, numMatricula);

        // Execute the stored procedure 
        const result = await request.execute('sp_InsertMatricula');

        // Handle the result if needed (e.g., get inserted ID)
        console.log('Insert result:', result);

    } catch (err) {
        console.error('Error executing stored procedure:', err);
    }
}

export async function getMatricula(numMatricula?: number) { // Make numMatricula optional 
    try {
        const connection = await getConnection();
        const request = connection.request();

        if (numMatricula !== undefined) {
            request.input('numMatricula', sql.Int, numMatricula);
        }

        const result = await request.execute('sp_GetMatricula');

        console.log('Matriculas:', result.recordset);
        return result.recordset;

    } catch (err) {
        console.error('Error executing stored procedure:', err);
    }
}

async function updateMatricula(prevNumMatricula: number, numMatricula: number) {
    try {
        const connection = await getConnection();
        const request = connection.request();

        request.input('prevNumMatricula', sql.Int, prevNumMatricula);
        request.input('numMatricula', sql.Int, numMatricula);

        const result = await request.execute('sp_UpdateMatricula');

        console.log('Rows updated:', result.rowsAffected);

    } catch (err) {
        console.error('Error executing stored procedure:', err);
    }
}

async function deleteMatricula(numMatricula: number) {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Set input parameter
        request.input('numMatricula', sql.Int, numMatricula);

        // Execute the stored procedure 
        const result = await request.execute('sp_DeleteMatricula');

        // Check affected rows if necessary
        console.log('Rows deleted:', result.rowsAffected);

    } catch (err) {
        console.error('Error executing stored procedure:', err);
    }
}

// Clientes inf

async function insertClienteInf(cliente: { nombre: string, apellido: string }): Promise<void> {
    try {
        if (!cliente.nombre || cliente.nombre.trim() === '') {
            throw new Error('nombre cannot be null or empty');
        }
        if (!cliente.apellido || cliente.apellido.trim() === '') {
            throw new Error('apellido cannot be null or empty');
        }

        const connection = await getConnection();
        const request = connection.request();

        request.input('nombre', sql.VarChar(50), cliente.nombre);
        request.input('apellido', sql.VarChar(50), cliente.apellido);
        await request.execute('sp_InsertClientesInf');

        console.log('Cliente inserted successfully');
    } catch (err) {
        console.error('Error inserting cliente:', err);
    }
}

export async function selectClientesInf(nombre?: string, apellido?: string): Promise<any[]> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        if (nombre) request.input('nombre', sql.VarChar(50), nombre);
        if (apellido) request.input('apellido', sql.VarChar(50), apellido);

        const result = await request.execute('sp_SelectClientesInf');

        const clientes: any[] = result.recordset.map((record) => ({
            nombre: record.nombre,
            apellido: record.apellido
        }));

        return clientes;
    } catch (err) {
        console.error('Error selecting clientes:', err);
        throw err;
    }
}

async function updateClienteInf(
    nombre: string,
    apellido: string,
    newNombre: string,
    newApellido: string
): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('nombre', sql.VarChar(50), nombre);
        request.input('apellido', sql.VarChar(50), apellido);
        request.input('newNombre', sql.VarChar(50), newNombre);
        request.input('newApellido', sql.VarChar(50), newApellido);

        await request.execute('sp_UpdateClientesInf');

        console.log('Cliente updated successfully');
    } catch (err) {
        console.error('Error updating cliente:', err);
        throw err;
    }
}

async function deleteClienteInf(nombre: string, apellido: string): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        // Bind parameters for the stored procedure
        request.input('nombre', sql.VarChar(50), nombre);
        request.input('apellido', sql.VarChar(50), apellido);

        // Execute the stored procedure
        await request.execute('sp_DeleteClientesInf');

        console.log('Cliente deleted successfully');
    } catch (err) {
        console.error('Error deleting cliente:', err);
        throw err; // Re-throw error for further handling if needed
    }
}

// Telefono empleado

async function createTelefonoEmpleado(codEmpleado: number, telefono: number, codTaller: number): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('p_codEmpleado', sql.Int, codEmpleado);
        request.input('p_telefono', sql.Int, telefono);
        request.input('p_codTaller', sql.Int, codTaller);

        // Execute the stored procedure
        await request.execute('CreateTelefonoEmpleado');

        console.log('Phone number created successfully.');
    } catch (err) {
        console.error('Error creating phone number:', err);
        // Re-throw for further error handling if needed
        throw err;
    }
}

async function readTelefonoEmpleado(codEmpleado: number, telefono: number): Promise<any> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('p_codEmpleado', sql.Int, codEmpleado);
        request.input('p_telefono', sql.Int, telefono);

        // Execute the stored procedure
        const result = await request.execute('ReadTelefonoEmpleado');

        // Retrieve the output parameter valu

        return result.recordset[0]
    } catch (err) {
        console.error('Error reading phone number:', err);
        // Re-throw for further error handling if needed
        throw err;
    }
}

export async function readTelefonoEmpleadoByCodEmpleado(codEmpleado: number): Promise<any[]> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('codEmpleado', sql.Int, codEmpleado);

        // Execute the stored procedure
        const result = await request.execute('sq_ReadTelefonoEmpleadoByCodEmpleado');

        // Assuming VW_TELEFONO_EMPLEADO returns multiple columns
        return result.recordset;
    } catch (err) {
        console.error('Error reading phone numbers:', err);
        throw err; // Re-throw for further error handling
    }
}

async function updateTelefonoEmpleado(
    codEmpleado: number,
    telefono: number,
    prevTelefono: number,
    codTaller: number
): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('p_codEmpleado', sql.Int, codEmpleado);
        request.input('p_telefono', sql.Int, telefono);
        request.input('prevTelefono', sql.Int, prevTelefono);  // Add prevTelefono input
        request.input('p_codTaller', sql.Int, codTaller);

        // Execute the stored procedure
        await request.execute('sp_UpdateTelefonoEmpleado');

        console.log('Phone number updated successfully.');
    } catch (err) {
        console.error('Error updating phone number:', err);
        throw err; // Re-throw for further error handling
    }
}

async function deleteTelefonoEmpleado(telefono: number, codTaller: number): Promise<void> {
    const connection = await getConnection();
    const request = connection.request();

    try {
        request.input('telefono', sql.Int, telefono);
        request.input('p_codTaller', sql.Int, codTaller);

        await request.execute('DeleteTelefonoEmpleado');

        console.log('Phone number deleted successfully.');
    } catch (err) {
        console.error('Error deleting phone number:', err);
        throw err;
    }
}

async function upsertTelefonoEmpleado(
    formData: FormData
): Promise<void> {
    const codEmpleado = Number(formData.get('codEmpleado'));
    const telefono = Number(formData.get('telefono'));
    const codTaller = Number(formData.get('codTaller')) || 1;

    if (!codEmpleado || !telefono || !codTaller) {
        throw new Error('Invalid form data');
    }

    const telefonoExists = await readTelefonoEmpleado(codEmpleado, telefono);

    if (telefonoExists) {
        const prevTelefono = telefonoExists.telefono;
        await updateTelefonoEmpleado(codEmpleado, telefono, prevTelefono, codTaller);
    } else {
        await createTelefonoEmpleado(codEmpleado, telefono, codTaller);
    }
}