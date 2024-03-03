import * as sql from 'mssql'

async function getUsers() {
  const sqlConfig = {
    user: 'sa',
    password: 'Password123',
    database: 'TALLER1',
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
  await sql.connect(sqlConfig)
  const result = await sql.query`select * from CLIENTE_1`
  return result.recordsets[0]
}

export default async function Home() {
  console.log(await getUsers())

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
