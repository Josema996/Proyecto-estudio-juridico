// Seed de datos de prueba — ejecutar con: npm run db:seed
import { db } from './db'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding...')

  // Org de prueba
  const org = await db.organizacion.upsert({
    where:  { slug: 'estudio-demo' },
    update: {},
    create: { nombre: 'Estudio Jurídico Demo', slug: 'estudio-demo' },
  })

  // Usuario titular
  const hash = await bcrypt.hash('demo1234', 12)
  const titular = await db.usuario.upsert({
    where:  { email_orgId: { email: 'demo@estudio.com', orgId: org.id } },
    update: {},
    create: {
      email: 'demo@estudio.com', passwordHash: hash,
      nombreCompleto: 'Dr. Juan García', rol: 'TITULAR', orgId: org.id,
    },
  })

  // Clientes
  const c1 = await db.cliente.create({ data: { nombre: 'Martín', apellido: 'Rodríguez', dni: '28451223', email: 'mrodriguez@gmail.com', telefono: '+54 11 1234-5678', orgId: org.id } })
  const c2 = await db.cliente.create({ data: { nombre: 'Luciana', apellido: 'Fernández', dni: '31892441', email: 'lfernandez@hotmail.com', orgId: org.id } })
  const c3 = await db.cliente.create({ data: { nombre: 'Carlos', apellido: 'Méndez', dni: '25103887', email: 'cmendez@empresa.com.ar', notas: 'Empresa: Méndez Construcciones SRL', orgId: org.id } })

  // Causas
  const ca1 = await db.causa.create({
    data: {
      numeroExpediente: '45.221/2024', caratula: 'RODRÍGUEZ, Martín c/ FERNÁNDEZ SA s/ Daños y Perjuicios',
      fuero: 'Civil', juzgado: 'Juzgado Civil N° 12', estado: 'ACTIVA',
      clienteId: c1.id, abogadoId: titular.id, fechaInicio: new Date('2024-01-20'), orgId: org.id,
    },
  })
  const ca2 = await db.causa.create({
    data: {
      numeroExpediente: '12.884/2023', caratula: 'FERNÁNDEZ, Luciana c/ OBRA SOCIAL OSDE s/ Amparo',
      fuero: 'Contencioso Administrativo', estado: 'ACTIVA', clienteId: c2.id, orgId: org.id,
    },
  })

  // Eventos
  await db.evento.createMany({
    data: [
      { titulo: 'Audiencia preliminar', tipo: 'AUDIENCIA', fechaHora: new Date(Date.now() + 3 * 86400000), causaId: ca1.id, creadoPorId: titular.id, orgId: org.id },
      { titulo: 'Reunión con Carlos Méndez', tipo: 'REUNION', fechaHora: new Date(Date.now() + 86400000), creadoPorId: titular.id, orgId: org.id },
      { titulo: 'Vencimiento contestación - Amparo OSDE', tipo: 'VENCIMIENTO', fechaHora: new Date(Date.now() + 7 * 86400000), causaId: ca2.id, creadoPorId: titular.id, orgId: org.id },
    ],
  })

  // Honorarios
  await db.honorario.createMany({
    data: [
      { concepto: 'Honorarios inicio causa', montoTotal: 350000, montoPagado: 175000, estado: 'PARCIAL', clienteId: c1.id, causaId: ca1.id, orgId: org.id },
      { concepto: 'Amparo de salud', montoTotal: 180000, montoPagado: 180000, estado: 'CANCELADO', clienteId: c2.id, causaId: ca2.id, orgId: org.id },
    ],
  })

  console.log('✅ Seed completo')
  console.log('📧 Login: demo@estudio.com / demo1234 / org: estudio-demo')
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect())
