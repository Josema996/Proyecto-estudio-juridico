import type { Profile, Cliente, Causa, Evento, Honorario, Documento, Tarea } from '@/types/database'

export const mockProfile: Profile = {
  id: 'user-1',
  email: 'jgarcia@estudiojuridico.com',
  full_name: 'Dr. Juan García',
  role: 'titular',
  phone: '+54 11 4567-8901',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockAbogados: Profile[] = [
  mockProfile,
  {
    id: 'user-2',
    email: 'mlopez@estudiojuridico.com',
    full_name: 'Dra. María López',
    role: 'asociado',
    phone: '+54 11 2345-6789',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'cpardo@estudiojuridico.com',
    full_name: 'Dr. Carlos Pardo',
    role: 'asociado',
    phone: '+54 11 9876-1234',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
]

export const mockClientes: Cliente[] = [
  { id: 'c1', nombre: 'Martín', apellido: 'Rodríguez', dni: '28.451.223', email: 'mrodriguez@gmail.com', phone: '+54 11 1234-5678', direccion: 'Av. Corrientes 1500, CABA', notas: 'Cliente desde 2020. Prefiere comunicación por WhatsApp.', created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
  { id: 'c2', nombre: 'Luciana', apellido: 'Fernández', dni: '31.892.441', email: 'lfernandez@hotmail.com', phone: '+54 11 9876-5432', direccion: 'Av. Santa Fe 3200, CABA', notas: null, created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z' },
  { id: 'c3', nombre: 'Carlos', apellido: 'Méndez', dni: '25.103.887', email: 'cmendez@empresa.com.ar', phone: '+54 351 456-7890', direccion: 'San Martín 450, Córdoba', notas: 'Empresa: Méndez Construcciones SRL', created_at: '2024-03-05T00:00:00Z', updated_at: '2024-03-05T00:00:00Z' },
  { id: 'c4', nombre: 'Valeria', apellido: 'Suárez', dni: '35.672.119', email: 'vsuarez@gmail.com', phone: '+54 11 5555-1234', direccion: 'Hipólito Yrigoyen 800, Lomas de Zamora', notas: null, created_at: '2024-04-01T00:00:00Z', updated_at: '2024-04-01T00:00:00Z' },
  { id: 'c5', nombre: 'Roberto', apellido: 'Almada', dni: '22.330.567', email: 'ralmada@outlook.com', phone: '+54 11 6666-9876', direccion: 'Rivadavia 2100, CABA', notas: 'Jubilado. Caso de sucesión.', created_at: '2024-04-20T00:00:00Z', updated_at: '2024-04-20T00:00:00Z' },
  { id: 'c6', nombre: 'Patricia', apellido: 'Lagos', dni: '29.781.334', email: 'pLagos@gmail.com', phone: '+54 221 333-4455', direccion: 'Calle 7 nro 1200, La Plata', notas: null, created_at: '2024-05-12T00:00:00Z', updated_at: '2024-05-12T00:00:00Z' },
]

export const mockCausas: Causa[] = [
  { id: 'ca1', numero_expediente: '45.221/2024', caratula: 'RODRÍGUEZ, Martín c/ FERNÁNDEZ SA s/ Daños y Perjuicios', fuero: 'Civil', juzgado: 'Juzgado Civil N° 12', estado: 'activa', cliente_id: 'c1', abogado_id: 'user-1', descripcion: 'Accidente de tránsito en Av. 9 de Julio. Lesiones leves.', fecha_inicio: '2024-01-20', created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z' },
  { id: 'ca2', numero_expediente: '12.884/2023', caratula: 'FERNÁNDEZ, Luciana c/ OBRA SOCIAL OSDE s/ Amparo', fuero: 'Contencioso Administrativo', juzgado: 'Juzgado CAyT N° 5', estado: 'activa', cliente_id: 'c2', abogado_id: 'user-1', descripcion: 'Amparo por negativa de cobertura de medicación oncológica.', fecha_inicio: '2023-11-05', created_at: '2023-11-05T00:00:00Z', updated_at: '2023-11-05T00:00:00Z' },
  { id: 'ca3', numero_expediente: '8.901/2023', caratula: 'MÉNDEZ CONSTRUCCIONES SRL s/ Concurso Preventivo', fuero: 'Comercial', juzgado: 'Juzgado Comercial N° 3', estado: 'activa', cliente_id: 'c3', abogado_id: 'user-2', descripcion: 'Concurso preventivo de acreedores.', fecha_inicio: '2023-08-15', created_at: '2023-08-15T00:00:00Z', updated_at: '2023-08-15T00:00:00Z' },
  { id: 'ca4', numero_expediente: '33.100/2022', caratula: 'SUÁREZ, Valeria c/ EMPRESA DE TRANSPORTE SRL s/ Laboral', fuero: 'Laboral', juzgado: 'Juzgado Nacional del Trabajo N° 28', estado: 'resuelta', cliente_id: 'c4', abogado_id: 'user-2', descripcion: 'Despido sin causa. Cobro de indemnización.', fecha_inicio: '2022-05-10', created_at: '2022-05-10T00:00:00Z', updated_at: '2024-02-01T00:00:00Z' },
  { id: 'ca5', numero_expediente: '51.778/2024', caratula: 'ALMADA, Roberto s/ Sucesión Ab Intestato', fuero: 'Civil', juzgado: 'Juzgado Civil N° 7', estado: 'activa', cliente_id: 'c5', abogado_id: 'user-3', descripcion: 'Sucesión de los bienes del causante Sr. Almada Pedro.', fecha_inicio: '2024-03-01', created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z' },
  { id: 'ca6', numero_expediente: '9.445/2022', caratula: 'LAGOS, Patricia c/ DÍAZ, Roberto s/ Divorcio', fuero: 'Familia', juzgado: 'Juzgado de Familia N° 2 - La Plata', estado: 'archivada', cliente_id: 'c6', abogado_id: 'user-3', descripcion: 'Divorcio vincular con acuerdo de bienes.', fecha_inicio: '2022-01-20', created_at: '2022-01-20T00:00:00Z', updated_at: '2023-06-15T00:00:00Z' },
]

const now = new Date()
function daysFromNow(d: number) { return new Date(now.getTime() + d * 86400000).toISOString() }

export const mockEventos: Evento[] = [
  { id: 'e1', titulo: 'Audiencia preliminar - Rodríguez c/ Fernández SA', descripcion: 'Presentación de pruebas. Llevar peritaje médico.', tipo: 'audiencia', fecha_hora: daysFromNow(3), causa_id: 'ca1', creado_por: 'user-1', recordatorio_enviado: false, created_at: now.toISOString() },
  { id: 'e2', titulo: 'Vencimiento contestación demanda - Amparo OSDE', descripcion: 'Plazo fatal para presentar contestación.', tipo: 'vencimiento', fecha_hora: daysFromNow(7), causa_id: 'ca2', creado_por: 'user-1', recordatorio_enviado: false, created_at: now.toISOString() },
  { id: 'e3', titulo: 'Reunión con Carlos Méndez', descripcion: 'Actualización del estado del concurso preventivo.', tipo: 'reunion', fecha_hora: daysFromNow(1), causa_id: 'ca3', creado_por: 'user-1', recordatorio_enviado: false, created_at: now.toISOString() },
  { id: 'e4', titulo: 'Audiencia de vista de causa - Sucesión Almada', descripcion: null, tipo: 'audiencia', fecha_hora: daysFromNow(14), causa_id: 'ca5', creado_por: 'user-1', recordatorio_enviado: false, created_at: now.toISOString() },
  { id: 'e5', titulo: 'Presentación escrito de alegatos', descripcion: 'Laboral Suárez - alegatos finales.', tipo: 'vencimiento', fecha_hora: daysFromNow(-5), causa_id: 'ca4', creado_por: 'user-1', recordatorio_enviado: true, created_at: now.toISOString() },
  { id: 'e6', titulo: 'Reunión con perito contador', descripcion: 'Revisión del informe pericial del concurso.', tipo: 'reunion', fecha_hora: daysFromNow(-2), causa_id: 'ca3', creado_por: 'user-1', recordatorio_enviado: true, created_at: now.toISOString() },
]

export const mockHonorarios: Honorario[] = [
  { id: 'h1', causa_id: 'ca1', cliente_id: 'c1', concepto: 'Honorarios inicio causa + representación', monto_total: 350000, monto_pagado: 175000, estado: 'parcial', fecha_acuerdo: '2024-01-20', notas: 'Segundo pago acordado para junio 2024.', created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z' },
  { id: 'h2', causa_id: 'ca2', cliente_id: 'c2', concepto: 'Honorarios amparo de salud', monto_total: 180000, monto_pagado: 180000, estado: 'cancelado', fecha_acuerdo: '2023-11-05', notas: null, created_at: '2023-11-05T00:00:00Z', updated_at: '2024-01-10T00:00:00Z' },
  { id: 'h3', causa_id: 'ca3', cliente_id: 'c3', concepto: 'Concurso preventivo - etapa inicial', monto_total: 800000, monto_pagado: 300000, estado: 'parcial', fecha_acuerdo: '2023-08-15', notas: 'Pagos escalonados según avance del proceso.', created_at: '2023-08-15T00:00:00Z', updated_at: '2024-02-01T00:00:00Z' },
  { id: 'h4', causa_id: 'ca4', cliente_id: 'c4', concepto: 'Causa laboral - honorarios por éxito', monto_total: 420000, monto_pagado: 420000, estado: 'cancelado', fecha_acuerdo: '2022-05-10', notas: 'Cobrado al finalizar con sentencia favorable.', created_at: '2022-05-10T00:00:00Z', updated_at: '2024-02-15T00:00:00Z' },
  { id: 'h5', causa_id: 'ca5', cliente_id: 'c5', concepto: 'Sucesión - honorarios estimados', monto_total: 250000, monto_pagado: 0, estado: 'pendiente', fecha_acuerdo: '2024-03-01', notas: 'A cobrar al finalizar la sucesión.', created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z' },
]

export const mockDocumentos: Documento[] = [
  { id: 'd1', causa_id: 'ca1', cliente_id: 'c1', nombre: 'Demanda_Rodriguez_2024.pdf', descripcion: 'Escrito de demanda inicial', storage_path: 'mock/demanda.pdf', mime_type: 'application/pdf', size_bytes: 245000, uploaded_by: 'user-1', created_at: '2024-01-20T00:00:00Z' },
  { id: 'd2', causa_id: 'ca1', cliente_id: 'c1', nombre: 'Peritaje_Medico.pdf', descripcion: 'Informe pericial médico', storage_path: 'mock/peritaje.pdf', mime_type: 'application/pdf', size_bytes: 1200000, uploaded_by: 'user-1', created_at: '2024-03-10T00:00:00Z' },
  { id: 'd3', causa_id: 'ca2', cliente_id: 'c2', nombre: 'Escrito_Amparo_OSDE.pdf', descripcion: 'Escrito de amparo', storage_path: 'mock/amparo.pdf', mime_type: 'application/pdf', size_bytes: 380000, uploaded_by: 'user-1', created_at: '2023-11-05T00:00:00Z' },
  { id: 'd4', causa_id: 'ca3', cliente_id: 'c3', nombre: 'Balance_Mendez_2023.xlsx', descripcion: 'Balance contable presentado', storage_path: 'mock/balance.xlsx', mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size_bytes: 95000, uploaded_by: 'user-1', created_at: '2023-09-01T00:00:00Z' },
  { id: 'd5', causa_id: 'ca5', cliente_id: 'c5', nombre: 'DNI_Almada.jpg', descripcion: 'Documento de identidad', storage_path: 'mock/dni.jpg', mime_type: 'image/jpeg', size_bytes: 55000, uploaded_by: 'user-1', created_at: '2024-03-01T00:00:00Z' },
]

// Helpers para joins
export function causaConCliente(causa: Causa) {
  return { ...causa, cliente: mockClientes.find(c => c.id === causa.cliente_id) ?? null }
}

export function eventoConCausa(evento: Evento) {
  return { ...evento, causa: mockCausas.find(c => c.id === evento.causa_id) ?? null }
}

export function honorarioConRelaciones(h: Honorario) {
  return {
    ...h,
    causa: mockCausas.find(c => c.id === h.causa_id) ?? null,
    cliente: mockClientes.find(c => c.id === h.cliente_id) ?? null,
  }
}

export function causasDeAbogado(abogadoId: string) {
  return mockCausas.filter(c => c.abogado_id === abogadoId)
}

export const mockTareas: Tarea[] = [
  { id: 't1', titulo: 'Preparar escrito de demanda', descripcion: 'Redactar y revisar el escrito inicial para presentar ante el juzgado.', estado: 'en_proceso', prioridad: 'alta', asignado_a: 'user-1', causa_id: 'ca1', fecha_vencimiento: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10), creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't2', titulo: 'Solicitar peritos al juzgado', descripcion: null, estado: 'pendiente', prioridad: 'media', asignado_a: 'user-1', causa_id: 'ca1', fecha_vencimiento: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't3', titulo: 'Revisar balance contable Méndez', descripcion: 'Analizar el balance presentado por el contador de la empresa.', estado: 'pendiente', prioridad: 'alta', asignado_a: 'user-2', causa_id: 'ca3', fecha_vencimiento: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't4', titulo: 'Notificar resolución a cliente', descripcion: 'Informar a Valeria Suárez el resultado de la sentencia.', estado: 'finalizado', prioridad: 'media', asignado_a: 'user-2', causa_id: 'ca4', fecha_vencimiento: null, creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't5', titulo: 'Presentar documentación sucesión', descripcion: 'Reunir y presentar la documentación requerida por el juzgado.', estado: 'en_proceso', prioridad: 'media', asignado_a: 'user-3', causa_id: 'ca5', fecha_vencimiento: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't6', titulo: 'Actualizar legajo Lagos', descripcion: null, estado: 'finalizado', prioridad: 'baja', asignado_a: 'user-3', causa_id: 'ca6', fecha_vencimiento: null, creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't7', titulo: 'Coordinar reunión con cliente', descripcion: 'Agendar reunión con Rodríguez para actualización del caso.', estado: 'pendiente', prioridad: 'baja', asignado_a: null, causa_id: null, fecha_vencimiento: null, creado_por: 'user-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export function tareasDeAbogado(abogadoId: string) {
  return mockTareas.filter(t => t.asignado_a === abogadoId)
}

export function tareaConRelaciones(t: Tarea) {
  return {
    ...t,
    asignado: mockAbogados.find(a => a.id === t.asignado_a) ?? null,
    causa:    mockCausas.find(c => c.id === t.causa_id) ?? null,
  }
}

export type PlanillaCategoria = 'Civil' | 'Laboral' | 'Familia' | 'Comercial' | 'General'
export type PlanillaTipo = 'xlsx' | 'docx' | 'pdf'

export interface Planilla {
  id: string
  nombre: string
  descripcion: string
  categoria: PlanillaCategoria
  tipo: PlanillaTipo
  actualizado: string
  paginas?: number
  popular?: boolean
}

export const mockPlanillas: Planilla[] = [
  // Civil
  { id: 'p1',  nombre: 'Demanda por Daños y Perjuicios',       descripcion: 'Modelo completo para iniciar demanda por accidente de tránsito o responsabilidad civil.',           categoria: 'Civil',     tipo: 'docx', actualizado: '2025-02-10', paginas: 8,  popular: true  },
  { id: 'p2',  nombre: 'Escrito de Contestación de Demanda',   descripcion: 'Estructura formal para contestar una demanda civil con todas las excepciones previas.',             categoria: 'Civil',     tipo: 'docx', actualizado: '2025-01-20', paginas: 6               },
  { id: 'p3',  nombre: 'Planilla de Liquidación Civil',        descripcion: 'Cálculo de capital, intereses y costas para causas civiles. Incluye fórmulas automáticas.',        categoria: 'Civil',     tipo: 'xlsx', actualizado: '2025-03-05', paginas: 3,  popular: true  },
  { id: 'p4',  nombre: 'Escrito de Apelación',                 descripcion: 'Modelo para recurso de apelación ante cámara. Incluye fundamentos tipo y petitorio.',              categoria: 'Civil',     tipo: 'docx', actualizado: '2024-12-15', paginas: 5               },
  // Laboral
  { id: 'p5',  nombre: 'Liquidación Final de Haberes',         descripcion: 'Planilla de liquidación: indemnización art. 245, preaviso, SAC proporcional e integración.',       categoria: 'Laboral',   tipo: 'xlsx', actualizado: '2025-03-18', paginas: 4,  popular: true  },
  { id: 'p6',  nombre: 'Demanda Laboral por Despido',          descripcion: 'Escrito de demanda para despido sin causa con todos los rubros indemnizatorios.',                  categoria: 'Laboral',   tipo: 'docx', actualizado: '2025-02-28', paginas: 7               },
  { id: 'p7',  nombre: 'Acuerdo Conciliatorio SECLO',          descripcion: 'Modelo de acuerdo homologable ante el SECLO. Incluye cláusulas de pago en cuotas.',               categoria: 'Laboral',   tipo: 'docx', actualizado: '2025-01-08', paginas: 3               },
  { id: 'p8',  nombre: 'Telegrama de Despido Indirecto',       descripcion: 'Modelo de telegrama colacionado para colocar al empleador en mora. Art. 246 LCT.',               categoria: 'Laboral',   tipo: 'docx', actualizado: '2024-11-30', paginas: 1               },
  // Familia
  { id: 'p9',  nombre: 'Convenio de Alimentos',                descripcion: 'Convenio regulatorio de cuota alimentaria con cláusulas de actualización e indexación.',          categoria: 'Familia',   tipo: 'docx', actualizado: '2025-02-20', paginas: 4,  popular: true  },
  { id: 'p10', nombre: 'Acuerdo de Divorcio Vincular',         descripcion: 'Presentación conjunta con convenio regulador de bienes, alimentos y cuidado personal.',           categoria: 'Familia',   tipo: 'docx', actualizado: '2025-01-15', paginas: 9               },
  { id: 'p11', nombre: 'Denuncia por Violencia Familiar',      descripcion: 'Escrito de denuncia y solicitud de medidas cautelares urgentes. Ley 26.485.',                    categoria: 'Familia',   tipo: 'docx', actualizado: '2025-03-01', paginas: 3               },
  { id: 'p12', nombre: 'Planilla de Bienes Gananciales',       descripcion: 'Inventario y valuación de bienes del matrimonio para la liquidación de la sociedad conyugal.',    categoria: 'Familia',   tipo: 'xlsx', actualizado: '2024-10-22', paginas: 2               },
  // Comercial
  { id: 'p13', nombre: 'Solicitud de Concurso Preventivo',     descripcion: 'Escrito de presentación en concurso con todos los documentos exigidos por la LCQ.',              categoria: 'Comercial', tipo: 'docx', actualizado: '2025-02-05', paginas: 12, popular: true  },
  { id: 'p14', nombre: 'Verificación de Créditos',             descripcion: 'Formulario de insinuación de crédito ante el síndico en proceso concursal.',                     categoria: 'Comercial', tipo: 'docx', actualizado: '2024-12-10', paginas: 4               },
  { id: 'p15', nombre: 'Planilla de Pasivo Concursal',         descripcion: 'Planilla Excel para registrar y clasificar acreedores quirografarios y privilegiados.',           categoria: 'Comercial', tipo: 'xlsx', actualizado: '2025-01-30', paginas: 3               },
  // General
  { id: 'p16', nombre: 'Poder General Judicial',               descripcion: 'Modelo de poder notarial para representación en juicio con amplias facultades.',                 categoria: 'General',   tipo: 'docx', actualizado: '2025-03-10', paginas: 2,  popular: true  },
  { id: 'p17', nombre: 'Nota de Presentación al Juzgado',      descripcion: 'Nota estándar para presentar escritos, documentación o solicitar informes al juzgado.',          categoria: 'General',   tipo: 'docx', actualizado: '2025-03-12', paginas: 1               },
  { id: 'p18', nombre: 'Informe de Avance de Causa',           descripcion: 'Plantilla para informar el estado procesal de una causa al cliente. Incluye cronograma.',        categoria: 'General',   tipo: 'docx', actualizado: '2025-02-18', paginas: 2               },
  { id: 'p19', nombre: 'Presupuesto de Honorarios',            descripcion: 'Modelo profesional de presupuesto con desglose de etapas, honorarios y gastos.',                 categoria: 'General',   tipo: 'xlsx', actualizado: '2025-03-08', paginas: 2               },
  { id: 'p20', nombre: 'Checklist de Inicio de Causa',         descripcion: 'Lista de verificación con todos los pasos y documentos para iniciar una causa judicial.',        categoria: 'General',   tipo: 'pdf',  actualizado: '2025-01-25', paginas: 2               },
]
