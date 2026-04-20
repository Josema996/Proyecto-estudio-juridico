import type { Planilla } from './mockData'

const HOY = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
const AÑO  = new Date().getFullYear()

/* ─── Helpers ─── */
function wordDoc(title: string, body: string): string {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"/>
<style>
  body { font-family: "Times New Roman", serif; font-size: 12pt; margin: 2.5cm; line-height: 1.5; color: #000; }
  h1   { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 6pt; }
  h2   { font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 4pt; }
  h3   { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 2pt; }
  p    { margin: 6pt 0; text-align: justify; }
  .centro { text-align: center; }
  .firma  { margin-top: 60pt; text-align: center; border-top: 1px solid #000; padding-top: 4pt; width: 40%; display: inline-block; }
  .bloque { margin: 10pt 0; padding: 8pt 12pt; border-left: 3pt solid #333; background: #f9f9f9; }
  table  { width: 100%; border-collapse: collapse; margin: 10pt 0; }
  th, td { border: 1px solid #ccc; padding: 5pt 8pt; font-size: 11pt; }
  th     { background: #e8e8e8; font-weight: bold; }
  .numero { text-align: right; }
  .campo  { color: #1a56db; font-style: italic; }
</style>
</head><body>
<p class="centro" style="font-size:10pt;color:#666">Estudio Jurídico &bull; ${HOY}</p>
<h1>${title}</h1>
${body}
</body></html>`
}

function csv(headers: string[], rows: (string | number)[][]): string {
  const esc = (v: string | number) => typeof v === 'string' && v.includes(',') ? `"${v}"` : String(v)
  return [headers, ...rows].map(r => r.map(esc).join(',')).join('\n')
}

/* ─── Contenido por planilla ─── */
const templates: Record<string, { content: string; ext: string; mime: string }> = {

  /* ══ CIVIL ══ */

  p1: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('DEMANDA POR DAÑOS Y PERJUICIOS', `
<p class="centro"><strong>Señor Juez:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE Y APELLIDO]</span>, DNI Nº <span class="campo">[DNI]</span>, domicilio real en <span class="campo">[DOMICILIO]</span>, constituyendo domicilio procesal en <span class="campo">[DOMICILIO PROCESAL]</span>, con el patrocinio letrado del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, Mat. Prof. Nº <span class="campo">[MATRÍCULA]</span>, a V.S. respetuosamente me presento y digo:</p>
</div>

<h2>I. OBJETO</h2>
<p>Que vengo a promover formal demanda de DAÑOS Y PERJUICIOS contra <span class="campo">[NOMBRE DEMANDADO]</span>, DNI/CUIT Nº <span class="campo">[DNI/CUIT]</span>, domicilio en <span class="campo">[DOMICILIO DEMANDADO]</span>, por la suma de <strong>PESOS <span class="campo">[MONTO EN LETRAS]</span> ($<span class="campo">[MONTO]</span>)</strong>, o lo que en más o en menos resulte de la prueba a rendirse, con más sus intereses, costas y costos del proceso.</p>

<h2>II. HECHOS</h2>
<p>Con fecha <span class="campo">[FECHA DEL HECHO]</span>, siendo aproximadamente las <span class="campo">[HORA]</span> horas, en la intersección de las calles <span class="campo">[LUGAR DEL HECHO]</span>, de la ciudad de <span class="campo">[CIUDAD]</span>, se produjo un accidente de tránsito en el que el vehículo conducido por el demandado, <span class="campo">[DESCRIPCIÓN VEHÍCULO: marca, modelo, patente]</span>, impactó contra <span class="campo">[DESCRIPCIÓN DEL IMPACTO]</span>, causando los daños que a continuación se detallan.</p>
<p>El siniestro ocurrió como consecuencia directa de la negligencia e imprudencia del demandado, quien <span class="campo">[DESCRIPCIÓN DE LA CONDUCTA CULPOSA]</span>, en violación de las normas del Código de Tránsito.</p>

<h2>III. DAÑOS RECLAMADOS</h2>
<table>
  <tr><th>Rubro</th><th>Descripción</th><th class="numero">Monto ($)</th></tr>
  <tr><td>Daño emergente</td><td><span class="campo">[Gastos médicos, reparación, etc.]</span></td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Lucro cesante</td><td><span class="campo">[Ingresos dejados de percibir]</span></td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Daño moral</td><td><span class="campo">[Padecimiento psicofísico]</span></td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Daño estético</td><td><span class="campo">[Si corresponde]</span></td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><th colspan="2"><strong>TOTAL</strong></th><th class="numero"><strong>$<span class="campo">[TOTAL]</span></strong></th></tr>
</table>

<h2>IV. DERECHO</h2>
<p>Fundo la presente en los arts. 1708, 1716, 1717, 1724, 1726, 1737, 1738, 1739, 1740, 1741 y cc. del Código Civil y Comercial de la Nación; arts. 40 y 41 de la Ley Nacional de Tránsito Nº 24.449 y sus modificatorias; y demás normativa aplicable al caso.</p>

<h2>V. PRUEBA</h2>
<p><strong>Documental:</strong> Actuaciones policiales Nº <span class="campo">[N° ACTA]</span>; informe médico de fecha <span class="campo">[FECHA]</span>; presupuestos de reparación; recibos de gastos médicos; <span class="campo">[demás documentación]</span>.</p>
<p><strong>Testimonial:</strong> Se ofrecerán en el momento procesal oportuno los testigos que presenciaron el hecho.</p>
<p><strong>Pericial:</strong> Pericia médica y/o mecánica a cargo de perito oficial del juzgado.</p>
<p><strong>Informativa:</strong> A las compañías de seguros, organismos viales y demás que correspondan.</p>

<h2>VI. MEDIDA CAUTELAR</h2>
<p>Atento al carácter del crédito reclamado y el riesgo de insolvencia del demandado, solicito se libre inhibición general de bienes contra el demandado hasta la cobertura del monto demandado, bajo la caución juratoria que presto en este acto.</p>

<h2>VII. PETITORIO</h2>
<p>Por todo lo expuesto, a V.S. solicito:</p>
<p>1. Se me tenga por presentado, parte y por constituido el domicilio procesal indicado.</p>
<p>2. Se admita la presente demanda y se corra traslado al demandado por el término de ley.</p>
<p>3. Oportunamente se haga lugar a la demanda en todas sus partes, con costas.</p>
<p>Proveer de conformidad,</p>
<p style="margin-top:40pt"><strong>SERÁ JUSTICIA</strong></p>
<br/><br/>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA ABOGADO/A]</span><br/>Mat. Prof. Nº <span class="campo">[MATRÍCULA]</span></p>
`),
  },

  p2: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('CONTESTACIÓN DE DEMANDA', `
<p class="centro"><strong>Señor Juez:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE Y APELLIDO]</span>, DNI Nº <span class="campo">[DNI]</span>, en autos caratulados "<span class="campo">[CARÁTULA]</span>", Expte. Nº <span class="campo">[N° EXPTE]</span>, constituyendo domicilio procesal en <span class="campo">[DOMICILIO]</span>, con el patrocinio letrado del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, a V.S. digo:</p>
</div>

<h2>I. OBJETO</h2>
<p>En tiempo y forma, vengo a contestar la demanda interpuesta en mi contra, solicitando su íntegro rechazo, con expresa imposición de costas a la actora.</p>

<h2>II. EXCEPCIONES PREVIAS</h2>
<h3>A) Falta de legitimación activa/pasiva</h3>
<p><span class="campo">[Desarrollar si corresponde]</span></p>
<h3>B) Prescripción</h3>
<p><span class="campo">[Desarrollar si corresponde]</span></p>
<h3>C) Defecto legal en el modo de proponer la demanda</h3>
<p><span class="campo">[Desarrollar si corresponde]</span></p>

<h2>III. NEGATIVA GENERAL Y ESPECIAL</h2>
<p>Niego todos y cada uno de los hechos invocados en la demanda que no sean expresamente reconocidos en el presente escrito. Niego que mi mandante haya actuado con culpa o negligencia. Niego los montos reclamados por exagerados e improcedentes. Niego la existencia y cuantía de los daños invocados.</p>

<h2>IV. RELACIÓN DE LOS HECHOS</h2>
<p><span class="campo">[Narrar la versión del demandado sobre los hechos con todos los detalles relevantes]</span></p>

<h2>V. DERECHO</h2>
<p>Arts. 1724, 1726, 1734 y cc. del CCCN. La responsabilidad civil requiere la concurrencia de todos sus presupuestos, siendo que en el caso de autos la culpa no puede atribuirse a mi mandante.</p>

<h2>VI. PRUEBA</h2>
<p><strong>Documental:</strong> <span class="campo">[Listar documentos]</span></p>
<p><strong>Testimonial:</strong> <span class="campo">[Nombres y domicilios de testigos]</span></p>
<p><strong>Pericial:</strong> <span class="campo">[Tipo de pericia solicitada]</span></p>

<h2>VII. PETITORIO</h2>
<p>Por todo lo expuesto, solicito: 1. Se tengan por opuestas las excepciones previas. 2. Se rechace la demanda en todas sus partes, con costas.</p>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA ABOGADO/A]</span></p>
`),
  },

  p3: {
    ext: 'csv', mime: 'text/csv',
    content: csv(
      ['PLANILLA DE LIQUIDACIÓN CIVIL','','',''],
      [
        ['Autos:','[CARÁTULA DEL EXPEDIENTE]','',''],
        ['Juzgado:','[JUZGADO Y SECRETARÍA]','',''],
        ['Fecha de cálculo:',HOY,'',''],
        ['','','',''],
        ['CAPITAL E INTERESES','','',''],
        ['Concepto','Monto ($)','Tasa/Período','Resultado ($)'],
        ['Capital de condena','0','',''],
        ['Intereses desde [FECHA HECHO] hasta [FECHA SENTENCIA]','','[TASA %] anual','0'],
        ['Intereses desde [FECHA SENTENCIA] hasta HOY','','[TASA %] anual','0'],
        ['SUBTOTAL CAPITAL + INTERESES','','','0'],
        ['','','',''],
        ['HONORARIOS Y COSTAS','','',''],
        ['Honorarios actora (% sobre capital)','','25%','0'],
        ['Honorarios demandada (% sobre capital)','','25%','0'],
        ['Tasa de justicia','','3%','0'],
        ['Gastos y costas','0','',''],
        ['SUBTOTAL COSTAS','','','0'],
        ['','','',''],
        ['TOTAL A PAGAR','','','0'],
        ['','','',''],
        ['NOTAS','','',''],
        ['Tasa aplicable:','[Indicar tasa: BNA activa/pasiva, CER, etc.]','',''],
        ['Referencia legal:','Art. 768 CCCN - Intereses moratorios','',''],
        ['Elaborado por:','[NOMBRE ABOGADO/A]','',''],
      ]
    ),
  },

  p4: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('RECURSO DE APELACIÓN', `
<p class="centro"><strong>Señor Juez:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE]</span>, en autos "<span class="campo">[CARÁTULA]</span>", Expte. Nº <span class="campo">[N° EXPTE]</span>, parte <span class="campo">[actora/demandada]</span>, con el patrocinio del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, a V.S. respetuosamente digo:</p>
</div>
<h2>I. OBJETO</h2>
<p>Que dentro del término legal, vengo a interponer RECURSO DE APELACIÓN contra la resolución/sentencia de fecha <span class="campo">[FECHA]</span>, que <span class="campo">[describir qué resolvió]</span>, por ser la misma contraria a derecho y causar gravamen irreparable a mi parte.</p>
<h2>II. AGRAVIOS</h2>
<h3>Primer agravio: Error en la valoración de la prueba</h3>
<p><span class="campo">[Desarrollar el agravio con fundamentos concretos]</span></p>
<h3>Segundo agravio: Errónea aplicación del derecho</h3>
<p><span class="campo">[Desarrollar el agravio con citas legales y jurisprudenciales]</span></p>
<h3>Tercer agravio: Monto de condena</h3>
<p><span class="campo">[Si se apela el quantum, desarrollar aquí]</span></p>
<h2>III. JURISPRUDENCIA</h2>
<p><span class="campo">[Citar fallos relevantes de Cámara y/o CSJN]</span></p>
<h2>IV. PETITORIO</h2>
<p>Se eleve la causa a la Cámara de Apelaciones; se revoque/modifique la resolución apelada; con costas de ambas instancias.</p>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA]</span></p>
`),
  },

  /* ══ LABORAL ══ */

  p5: {
    ext: 'csv', mime: 'text/csv',
    content: csv(
      ['LIQUIDACIÓN FINAL DE HABERES - DESPIDO SIN CAUSA','','',''],
      [
        ['Empleado:','[APELLIDO Y NOMBRE]','',''],
        ['CUIL:','[XX-XXXXXXXX-X]','',''],
        ['Empleador:','[RAZÓN SOCIAL]','',''],
        ['CUIT:','[XX-XXXXXXXX-X]','',''],
        ['Fecha ingreso:','[DD/MM/AAAA]','',''],
        ['Fecha egreso:','[DD/MM/AAAA]','',''],
        ['Antigüedad (años):','0','',''],
        ['Remuneración bruta mensual:','0','',''],
        ['Mejor remuneración mensual normal y habitual:','0','',''],
        ['','','',''],
        ['RUBROS INDEMNIZATORIOS','Cálculo','Importe ($)',''],
        ['Indemnización art. 245 LCT','Mejor rem. x antigüedad','0',''],
        ['Preaviso art. 231 LCT (1 mes)','Remuneración mensual','0',''],
        ['Integración mes de despido','Días restantes del mes','0',''],
        ['SAC sobre preaviso','Preaviso / 12','0',''],
        ['SAC proporcional','Rem. x días / 365','0',''],
        ['Vacaciones proporcionales','Según art. 150 LCT','0',''],
        ['SAC sobre vacaciones','Vacaciones / 12','0',''],
        ['','','',''],
        ['SUBTOTAL RUBROS INDEMNIZATORIOS','','0',''],
        ['','','',''],
        ['HABERES ADEUDADOS DEL MES EN CURSO','Días trabajados','0',''],
        ['','','',''],
        ['TOTAL BRUTO A PERCIBIR','','0',''],
        ['Retenciones previsionales (17%)','','0',''],
        ['TOTAL NETO A PERCIBIR','','0',''],
        ['','','',''],
        ['NOTAS','','',''],
        ['Art. 245 LCT:','1 mes por año o fracción > 3 meses. Tope CCT','',''],
        ['Art. 232 LCT:','Preaviso 1 mes (< 5 años antigüedad)','',''],
        ['Elaborado por:','[NOMBRE ABOGADO/A]','Fecha:',HOY],
      ]
    ),
  },

  p6: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('DEMANDA LABORAL POR DESPIDO SIN CAUSA', `
<p class="centro"><strong>Señor Juez del Trabajo:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE Y APELLIDO]</span>, DNI Nº <span class="campo">[DNI]</span>, CUIL <span class="campo">[CUIL]</span>, con domicilio real en <span class="campo">[DOMICILIO]</span>, constituyendo domicilio procesal en <span class="campo">[DOMICILIO PROCESAL]</span>, con el patrocinio letrado del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, Mat. Nº <span class="campo">[MATRÍCULA]</span>, a V.S. respetuosamente me presento y digo:</p>
</div>
<h2>I. OBJETO</h2>
<p>Promuevo formal demanda laboral contra <span class="campo">[EMPRESA/EMPLEADOR]</span>, CUIT <span class="campo">[CUIT]</span>, con domicilio en <span class="campo">[DOMICILIO]</span>, por la suma de <strong>$<span class="campo">[MONTO TOTAL]</span></strong>, en concepto de los rubros que a continuación se detallan, con más intereses, actualización y costas.</p>
<h2>II. RELACIÓN LABORAL</h2>
<p>Con fecha <span class="campo">[FECHA INGRESO]</span> comencé a prestar servicios para la demandada en el cargo de <span class="campo">[CARGO/CATEGORÍA]</span>, cumpliendo una jornada de <span class="campo">[HORAS]</span> horas semanales, percibiendo una remuneración mensual de <strong>$<span class="campo">[SALARIO]</span></strong>.</p>
<h2>III. DESPIDO</h2>
<p>Con fecha <span class="campo">[FECHA DESPIDO]</span>, la demandada procedió a notificarme el despido sin expresión de causa alguna, en violación de lo dispuesto por el art. 245 de la LCT.</p>
<h2>IV. RUBROS RECLAMADOS</h2>
<table>
  <tr><th>Rubro</th><th class="numero">Monto ($)</th></tr>
  <tr><td>Indemnización art. 245 LCT</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Preaviso art. 232 LCT</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Integración mes de despido</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>SAC proporcional</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Vacaciones proporcionales</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Haberes adeudados</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Multa art. 80 LCT</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><td>Multa art. 132 bis LCT</td><td class="numero"><span class="campo">[MONTO]</span></td></tr>
  <tr><th>TOTAL</th><th class="numero">$<span class="campo">[TOTAL]</span></th></tr>
</table>
<h2>V. DERECHO</h2>
<p>Arts. 14 bis CN; LCT Nº 20.744 y sus modificatorias, arts. 63, 80, 132 bis, 231, 232, 233, 245; Ley 24.013; CCT aplicable Nº <span class="campo">[N° CCT]</span>.</p>
<h2>VI. PETITORIO</h2>
<p>Se admita la demanda; se condene al pago de los rubros detallados; con intereses y costas.</p>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA ABOGADO/A]</span></p>
`),
  },

  p7: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('ACUERDO CONCILIATORIO - SECLO', `
<p class="centro"><strong>MINISTERIO DE TRABAJO, EMPLEO Y SEGURIDAD SOCIAL</strong><br/>
<strong>SERVICIO DE CONCILIACIÓN LABORAL OBLIGATORIA</strong></p>
<p class="centro">Acta de Acuerdo Nº <span class="campo">[N° ACTA]</span></p>
<div class="bloque">
  <p>En la Ciudad de <span class="campo">[CIUDAD]</span>, a los <span class="campo">[DÍAS]</span> días del mes de <span class="campo">[MES]</span> de <span class="campo">[AÑO]</span>, ante el Conciliador Laboral Dr./Dra. <span class="campo">[NOMBRE CONCILIADOR]</span>, comparecen:</p>
  <p><strong>RECLAMANTE:</strong> <span class="campo">[NOMBRE]</span>, DNI <span class="campo">[DNI]</span>, con el patrocinio del Dr./Dra. <span class="campo">[ABOGADO ACTOR]</span>.</p>
  <p><strong>RECLAMADA:</strong> <span class="campo">[EMPRESA]</span>, CUIT <span class="campo">[CUIT]</span>, representada por <span class="campo">[NOMBRE REPRESENTANTE]</span>, con el patrocinio del Dr./Dra. <span class="campo">[ABOGADO DEMANDADO]</span>.</p>
</div>
<h2>ACUERDO</h2>
<p>Las partes, libre y voluntariamente, acuerdan poner fin al presente conflicto laboral en los siguientes términos:</p>
<p><strong>PRIMERO:</strong> La empresa <span class="campo">[EMPRESA]</span> abonará al Sr./Sra. <span class="campo">[EMPLEADO]</span> la suma total de <strong>PESOS <span class="campo">[MONTO EN LETRAS]</span> ($<span class="campo">[MONTO]</span>)</strong>, en concepto de liquidación final y acuerdo conciliatorio, sin reconocimiento de hechos ni derechos.</p>
<p><strong>SEGUNDO:</strong> Dicha suma será abonada de la siguiente manera:</p>
<p style="margin-left:20pt">- <strong>1er cuota:</strong> $<span class="campo">[MONTO]</span> al momento de la homologación.</p>
<p style="margin-left:20pt">- <strong>2da cuota:</strong> $<span class="campo">[MONTO]</span> a los 30 días de la homologación.</p>
<p style="margin-left:20pt">- <strong>3ra cuota:</strong> $<span class="campo">[MONTO]</span> a los 60 días de la homologación.</p>
<p><strong>TERCERO:</strong> El reclamante otorga al pago del monto convenido el carácter de cancelatorio y liberatorio de todo reclamo laboral emergente de la relación habida entre las partes, renunciando expresamente a cualquier acción judicial o extrajudicial presente o futura vinculada a dicha relación.</p>
<p><strong>CUARTO:</strong> En caso de incumplimiento de cualquiera de las cuotas acordadas, la totalidad del saldo adeudado se tornará exigible de pleno derecho, con más los intereses de la tasa activa del BNA.</p>
<p><strong>QUINTO:</strong> Los honorarios profesionales serán abonados por cada parte a su letrado patrocinante.</p>
<h2>CONFORMIDAD</h2>
<br/>
<table style="border:none"><tr style="border:none">
  <td style="border:none;text-align:center;width:50%">___________________________<br/>RECLAMANTE<br/><span class="campo">[NOMBRE]</span></td>
  <td style="border:none;text-align:center;width:50%">___________________________<br/>REPRESENTANTE EMPRESA<br/><span class="campo">[NOMBRE]</span></td>
</tr></table>
`),
  },

  p8: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('TELEGRAMA DE DESPIDO INDIRECTO - ART. 246 LCT', `
<p class="centro"><strong>MODELO DE TELEGRAMA COLACIONADO</strong></p>
<div class="bloque">
  <p><strong>DESTINATARIO:</strong> <span class="campo">[NOMBRE EMPLEADOR / RAZÓN SOCIAL]</span><br/>
  <strong>DOMICILIO:</strong> <span class="campo">[DOMICILIO REAL O LABORAL DEL EMPLEADOR]</span></p>
</div>
<br/>
<p>Ante la/s injuria/s que describe/n a continuación, y que hace/n imposible la continuación del vínculo laboral, colócolo/a en mora intimándolo/a a que en el plazo de <strong>48 (cuarenta y ocho) horas</strong> proceda a:</p>
<p><span class="campo">[Ejemplo de injurias - seleccionar y completar las que correspondan:]</span></p>
<p>□ Abonar haberes del mes de <span class="campo">[MES/AÑO]</span> adeudados desde el <span class="campo">[FECHA]</span>.<br/>
□ Registrar correctamente la relación laboral iniciada el <span class="campo">[FECHA REAL DE INGRESO]</span>.<br/>
□ Abonar las horas extras correspondientes al período <span class="campo">[PERÍODO]</span>.<br/>
□ Cesar en el comportamiento discriminatorio/acosante descripto en telegrama previo de fecha <span class="campo">[FECHA]</span>.<br/>
□ Restablecer las condiciones de trabajo alteradas unilateralmente en fecha <span class="campo">[FECHA]</span>.</p>
<p>En caso de no obtener respuesta favorable dentro del plazo indicado, me consideraré en situación de <strong>DESPIDO INDIRECTO</strong> (art. 246 LCT), exigiéndole el pago de los rubros previstos en los arts. 231, 232, 233 y 245 de la Ley de Contrato de Trabajo, SAC proporcional, vacaciones proporcionales y demás créditos adeudados.</p>
<p>Todo bajo apercibimiento de iniciar las acciones legales pertinentes ante la justicia laboral competente, con más las multas previstas en los arts. 9 y 10 de la ley 24.013, art. 132 bis LCT y art. 80 LCT.</p>
<p>Queda Ud. debidamente notificado/a.</p>
<br/>
<p><span class="campo">[CIUDAD]</span>, <span class="campo">[FECHA]</span></p>
<br/>
<p>___________________________________<br/>
<span class="campo">[NOMBRE Y APELLIDO TRABAJADOR/A]</span><br/>
DNI: <span class="campo">[DNI]</span><br/>
CUIL: <span class="campo">[CUIL]</span></p>
<br/>
<p style="font-size:10pt;color:#666"><em>Nota: Este telegrama debe enviarse vía Correo Argentino como "Telegrama Laboral" (gratuito para el trabajador según Ley 23.789) o como telegrama colacionado.</em></p>
`),
  },

  /* ══ FAMILIA ══ */

  p9: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('CONVENIO REGULADOR DE CUOTA ALIMENTARIA', `
<p class="centro"><strong>Señor/a Juez/a de Familia:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE ALIMENTANTE]</span>, DNI <span class="campo">[DNI]</span>, y <span class="campo">[NOMBRE ALIMENTADO/REPRESENTANTE]</span>, DNI <span class="campo">[DNI]</span>, en representación del menor <span class="campo">[NOMBRE DEL MENOR]</span>, DNI <span class="campo">[DNI]</span>, en los autos "<span class="campo">[CARÁTULA]</span>", con el patrocinio del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, a V.S. decimos:</p>
</div>
<h2>I. OBJETO</h2>
<p>Venimos a someter a la homologación de V.S. el siguiente convenio sobre alimentos, en los términos del art. 658 y ss. del CCCN.</p>
<h2>II. ACUERDO</h2>
<p><strong>PRIMERO — Cuota alimentaria:</strong> El/la Sr./Sra. <span class="campo">[ALIMENTANTE]</span> se compromete a abonar en concepto de cuota alimentaria a favor del/la menor <span class="campo">[NOMBRE MENOR]</span>, la suma mensual de <strong>PESOS <span class="campo">[MONTO EN LETRAS]</span> ($<span class="campo">[MONTO]</span>)</strong>, equivalente al <span class="campo">[%]</span>% del SMVM vigente a la fecha de cada pago.</p>
<p><strong>SEGUNDO — Forma de pago:</strong> La cuota será abonada dentro de los primeros <span class="campo">[N° DÍAS]</span> días de cada mes, mediante depósito/transferencia en la cuenta CBU <span class="campo">[CBU]</span> del/la progenitor/a conviviente, o de la forma que las partes acuerden.</p>
<p><strong>TERCERO — Actualización:</strong> La cuota alimentaria se actualizará automáticamente cada <span class="campo">[PERÍODO]</span> en función de la variación del <span class="campo">[ÍNDICE: IPC / SMVM / salario del alimentante]</span>.</p>
<p><strong>CUARTO — Gastos extraordinarios:</strong> Los gastos extraordinarios de salud, educación y demás imprevistos serán compartidos por ambos progenitores en partes <span class="campo">[iguales / proporcionales a sus ingresos]</span>, previa consulta y acuerdo.</p>
<p><strong>QUINTO — Incumplimiento:</strong> Ante la falta de pago de dos cuotas consecutivas o tres alternadas, el progenitor alimentado podrá solicitar el embargo de los haberes del alimentante.</p>
<p><strong>SEXTO — Cuidado personal y régimen de comunicación:</strong> <span class="campo">[Completar si se acuerda también en este convenio]</span>.</p>
<h2>III. PETITORIO</h2>
<p>Solicitan a V.S. homologar el presente convenio en los términos del art. 375 CCCN, por estimarlo conveniente a los intereses del menor involucrado.</p>
<br/>
<table style="border:none"><tr style="border:none">
  <td style="border:none;text-align:center;width:50%">___________________________<br/>ALIMENTANTE<br/><span class="campo">[NOMBRE]</span></td>
  <td style="border:none;text-align:center;width:50%">___________________________<br/>PROGENITOR/A CONVIVIENTE<br/><span class="campo">[NOMBRE]</span></td>
</tr></table>
`),
  },

  p10: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('ACUERDO DE DIVORCIO VINCULAR - PRESENTACIÓN CONJUNTA', `
<p class="centro"><strong>Señor/a Juez/a de Familia:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE CÓNYUGE 1]</span>, DNI <span class="campo">[DNI]</span>, y <span class="campo">[NOMBRE CÓNYUGE 2]</span>, DNI <span class="campo">[DNI]</span>, en los autos sobre DIVORCIO VINCULAR, con los patrocinios letrados de los Dres./Dras. <span class="campo">[ABOGADO/A 1]</span> y <span class="campo">[ABOGADO/A 2]</span>, a V.S. decimos:</p>
</div>
<h2>I. PRESENTACIÓN CONJUNTA</h2>
<p>Que de común acuerdo y conforme lo previsto por el art. 437 del CCCN, venimos a solicitar el DIVORCIO VINCULAR de nuestro matrimonio, celebrado en fecha <span class="campo">[FECHA MATRIMONIO]</span> ante el Registro Civil de <span class="campo">[LUGAR]</span>, Acta Nº <span class="campo">[N° ACTA]</span>.</p>
<h2>II. CONVENIO REGULADOR (Art. 439 CCCN)</h2>
<h3>A) Atribución del hogar conyugal</h3>
<p><span class="campo">[Quién queda en el hogar, condiciones y plazo]</span></p>
<h3>B) Distribución de bienes</h3>
<table>
  <tr><th>Bien</th><th>Descripción</th><th>Adjudicado a</th></tr>
  <tr><td>Inmueble</td><td><span class="campo">[Domicilio, matrícula]</span></td><td><span class="campo">[Cónyuge]</span></td></tr>
  <tr><td>Vehículo</td><td><span class="campo">[Marca, modelo, dominio]</span></td><td><span class="campo">[Cónyuge]</span></td></tr>
  <tr><td>Cuentas bancarias</td><td><span class="campo">[Banco, Nº cuenta]</span></td><td><span class="campo">[Cónyuge]</span></td></tr>
</table>
<h3>C) Alimentos entre cónyuges</h3>
<p><span class="campo">[Las partes renuncian recíprocamente a alimentos / se fija cuota de $X por N meses]</span></p>
<h3>D) Cuidado personal de los hijos</h3>
<p><span class="campo">[Cuidado personal compartido / unilateral. Domicilio habitual]</span></p>
<h3>E) Cuota alimentaria para los hijos</h3>
<p><span class="campo">[Monto, forma de pago, actualización]</span></p>
<h3>F) Régimen de comunicación</h3>
<p><span class="campo">[Días y horarios de visita del progenitor no conviviente]</span></p>
<h2>III. PETITORIO</h2>
<p>Solicitan decretar el divorcio vincular de los presentantes y homologar el convenio regulador.</p>
<br/>
<table style="border:none"><tr style="border:none">
  <td style="border:none;text-align:center;width:50%">___________________________<br/><span class="campo">[CÓNYUGE 1]</span></td>
  <td style="border:none;text-align:center;width:50%">___________________________<br/><span class="campo">[CÓNYUGE 2]</span></td>
</tr></table>
`),
  },

  p11: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('DENUNCIA POR VIOLENCIA FAMILIAR Y SOLICITUD DE MEDIDAS CAUTELARES', `
<p class="centro"><strong>Señor/a Juez/a de Familia / Guardia Judicial:</strong></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE Y APELLIDO]</span>, DNI Nº <span class="campo">[DNI]</span>, <span class="campo">[EDAD]</span> años, domicilio real en <span class="campo">[DOMICILIO]</span>, constituyendo domicilio procesal en <span class="campo">[DOMICILIO PROCESAL]</span>, con el patrocinio del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, a V.S. respetuosamente me presento y digo:</p>
</div>
<h2>I. OBJETO</h2>
<p>Vengo a formular DENUNCIA POR VIOLENCIA FAMILIAR en los términos de la Ley 26.485 y solicitar con CARÁCTER URGENTE las medidas cautelares de protección que se detallan, contra <span class="campo">[NOMBRE DENUNCIADO/A]</span>, DNI <span class="campo">[DNI]</span>, con último domicilio conocido en <span class="campo">[DOMICILIO]</span>.</p>
<h2>II. HECHOS</h2>
<p>Que con fecha <span class="campo">[FECHA O PERÍODO]</span>, el/la Sr./Sra. <span class="campo">[DENUNCIADO/A]</span>, quien es mi <span class="campo">[vínculo: ex pareja / cónyuge / conviviente / familiar]</span>, llevó a cabo los siguientes actos de violencia:</p>
<div class="bloque">
  <p><span class="campo">[Descripción detallada, cronológica y objetiva de los hechos. Incluir: fecha, lugar, tipo de violencia (física/psicológica/económica/sexual), testigos si los hay, lesiones sufridas]</span></p>
</div>
<p>Dicha situación se enmarca en un <span class="campo">[patrón de violencia / episodio aislado]</span> que se viene repitiendo desde <span class="campo">[FECHA]</span>.</p>
<h2>III. MEDIDAS CAUTELARES SOLICITADAS</h2>
<p>En virtud de lo dispuesto por el art. 26 de la Ley 26.485, solicito con carácter urgente:</p>
<p>☐ <strong>Exclusión del hogar</strong> del denunciado/a del domicilio sito en <span class="campo">[DOMICILIO]</span>.<br/>
☐ <strong>Prohibición de acercamiento</strong> a la denunciante, su domicilio, lugar de trabajo y/o estudio, por una distancia no menor a <span class="campo">[N° METROS]</span> metros.<br/>
☐ <strong>Prohibición de contacto</strong> por cualquier medio (teléfono, redes sociales, mensajería, etc.).<br/>
☐ <strong>Restitución de efectos personales</strong>.<br/>
☐ <strong>Botón antipánico</strong>.<br/>
☐ <strong>Otras:</strong> <span class="campo">[Especificar]</span>.</p>
<h2>IV. DERECHO</h2>
<p>Arts. 3, 16, 26, 27 y cc. Ley 26.485; art. 706 CCCN; arts. 177 y ss. CPCC; Convención Belém do Pará.</p>
<h2>V. PETITORIO</h2>
<p>Se tenga por formulada la denuncia; se dispongan las medidas cautelares solicitadas en forma INMEDIATA; se cite al denunciado a audiencia; se resguarde mi identidad y domicilio real.</p>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA DENUNCIANTE]</span></p>
`),
  },

  p12: {
    ext: 'csv', mime: 'text/csv',
    content: csv(
      ['INVENTARIO DE BIENES GANANCIALES','','',''],
      [
        ['Matrimonio:','[NOMBRE CÓNYUGE 1] - [NOMBRE CÓNYUGE 2]','',''],
        ['Fecha matrimonio:','[DD/MM/AAAA]','',''],
        ['Fecha separación/divorcio:','[DD/MM/AAAA]','',''],
        ['','','',''],
        ['BIENES INMUEBLES','','',''],
        ['Descripción','Domicilio / Matrícula','Valuación Fiscal ($)','Valor Mercado ($)'],
        ['Inmueble 1','','0','0'],
        ['Inmueble 2','','0','0'],
        ['','','',''],
        ['VEHÍCULOS','','',''],
        ['Descripción','Dominio / Año','Valor ($)','Adjudicado a'],
        ['Vehículo 1','','0',''],
        ['','','',''],
        ['CUENTAS BANCARIAS Y INVERSIONES','','',''],
        ['Banco / Entidad','Tipo de cuenta','Saldo ($)','Titular'],
        ['','','0',''],
        ['','','',''],
        ['BIENES MUEBLES REGISTRABLES','','',''],
        ['Descripción','Características','Valor ($)','Adjudicado a'],
        ['','','0',''],
        ['','','',''],
        ['DEUDAS Y PASIVOS','','',''],
        ['Concepto','Acreedor','Saldo Deudor ($)','Responsable'],
        ['','','0',''],
        ['','','',''],
        ['RESUMEN','','',''],
        ['Total activo ganancial','','0',''],
        ['Total pasivo','','0',''],
        ['Patrimonio neto','','0',''],
        ['50% correspondiente a cada cónyuge','','0',''],
        ['','','',''],
        ['Elaborado por:','[NOMBRE ABOGADO/A]','Fecha:',HOY],
      ]
    ),
  },

  /* ══ COMERCIAL ══ */

  p13: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('SOLICITUD DE CONCURSO PREVENTIVO', `
<p class="centro"><strong>Señor Juez en lo Comercial:</strong></p>
<div class="bloque">
  <p><span class="campo">[RAZÓN SOCIAL]</span>, CUIT <span class="campo">[CUIT]</span>, representada en este acto por <span class="campo">[NOMBRE REPRESENTANTE]</span>, en su carácter de <span class="campo">[CARGO: socio gerente / presidente / apoderado]</span>, con domicilio real en <span class="campo">[DOMICILIO]</span>, constituyendo domicilio procesal en <span class="campo">[DOMICILIO PROCESAL]</span>, con el patrocinio letrado del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, Mat. Nº <span class="campo">[MATRÍCULA]</span>, respetuosamente me presento y digo:</p>
</div>
<h2>I. OBJETO</h2>
<p>Que en legal forma me presento a solicitar la apertura de CONCURSO PREVENTIVO de acreedores en los términos del art. 5 y cc. de la Ley 24.522 de Concursos y Quiebras, ante la situación de cesación de pagos que atraviesa mi representada.</p>
<h2>II. DOMICILIO Y DATOS DEL DEUDOR</h2>
<p>Razón social: <span class="campo">[RAZÓN SOCIAL]</span> | Tipo societario: <span class="campo">[SRL/SA/etc.]</span><br/>
CUIT: <span class="campo">[CUIT]</span> | IIBB: <span class="campo">[N° IIBB]</span><br/>
Domicilio legal: <span class="campo">[DOMICILIO]</span> | Inscripción IGJ/RPC: <span class="campo">[N°]</span></p>
<h2>III. EXPLICACIÓN DE LA SITUACIÓN</h2>
<p><span class="campo">[Descripción de las causas de la cesación de pagos: crisis del sector, pandemia, pérdida de contratos, etc. Ser preciso y documentable]</span></p>
<h2>IV. ESTADO DEL ACTIVO Y PASIVO</h2>
<table>
  <tr><th colspan="2">ACTIVO</th><th colspan="2">PASIVO</th></tr>
  <tr><td>Bienes inmuebles</td><td>$<span class="campo">[MONTO]</span></td><td>Acreedores quirografarios</td><td>$<span class="campo">[MONTO]</span></td></tr>
  <tr><td>Bienes muebles</td><td>$<span class="campo">[MONTO]</span></td><td>Acreedores privilegiados</td><td>$<span class="campo">[MONTO]</span></td></tr>
  <tr><td>Créditos</td><td>$<span class="campo">[MONTO]</span></td><td>Deudas laborales</td><td>$<span class="campo">[MONTO]</span></td></tr>
  <tr><td>Mercadería</td><td>$<span class="campo">[MONTO]</span></td><td>Deudas impositivas</td><td>$<span class="campo">[MONTO]</span></td></tr>
  <tr><th>TOTAL ACTIVO</th><th>$<span class="campo">[TOTAL]</span></th><th>TOTAL PASIVO</th><th>$<span class="campo">[TOTAL]</span></th></tr>
</table>
<h2>V. NÓMINA DE ACREEDORES</h2>
<p>Se acompaña planilla con la nómina completa de acreedores, sus domicilios, montos y causas de los créditos (art. 11 inc. 5 LCQ).</p>
<h2>VI. DOCUMENTACIÓN ADJUNTA</h2>
<p>□ Estados contables de los últimos 3 ejercicios<br/>
□ Memoria del último ejercicio<br/>
□ Nómina de empleados<br/>
□ Libros societarios<br/>
□ Contratos vigentes<br/>
□ Declaraciones juradas AFIP/ARBA</p>
<h2>VII. PETITORIO</h2>
<p>Se tenga por presentada la solicitud de concurso preventivo; se disponga la apertura del concurso en los términos del art. 14 LCQ; se designe síndico; se fije período de exclusividad.</p>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA REPRESENTANTE]</span></p>
`),
  },

  p14: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('VERIFICACIÓN DE CRÉDITOS - INSINUACIÓN AL PASIVO', `
<p class="centro"><strong>Sr./Sra. Síndico/a:</strong></p>
<p>Autos: "<span class="campo">[CARÁTULA DEL CONCURSO]</span>" | Juzgado: <span class="campo">[JUZGADO]</span> | Expte. Nº <span class="campo">[N° EXPTE]</span></p>
<div class="bloque">
  <p><span class="campo">[NOMBRE ACREEDOR]</span>, CUIT/DNI <span class="campo">[CUIT/DNI]</span>, domicilio en <span class="campo">[DOMICILIO]</span>, patrocinio del Dr./Dra. <span class="campo">[ABOGADO/A]</span>, se presenta a insinuar su crédito al pasivo concursal:</p>
</div>
<h2>I. CRÉDITO INSINUADO</h2>
<table>
  <tr><th>Concepto</th><th class="numero">Monto ($)</th><th>Categoría</th></tr>
  <tr><td>Capital adeudado</td><td class="numero"><span class="campo">[MONTO]</span></td><td>Quirografario</td></tr>
  <tr><td>Intereses hasta presentación concursal</td><td class="numero"><span class="campo">[MONTO]</span></td><td>Quirografario</td></tr>
  <tr><th colspan="1"><strong>TOTAL INSINUADO</strong></th><th class="numero"><strong>$<span class="campo">[TOTAL]</span></strong></th><th></th></tr>
</table>
<h2>II. CAUSA DEL CRÉDITO</h2>
<p>El crédito insinuado tiene origen en <span class="campo">[facturas impagas / préstamo / alquiler / sentencia judicial / etc.]</span>, conforme la documentación que se acompaña.</p>
<h2>III. DOCUMENTACIÓN RESPALDATORIA</h2>
<p>□ Facturas Nros. <span class="campo">[NÚMEROS]</span><br/>
□ Contratos de <span class="campo">[TIPO]</span><br/>
□ Remitos / recibos de entrega<br/>
□ Correspondencia con el deudor<br/>
□ <span class="campo">[Otros documentos]</span></p>
<h2>IV. PRIVILEGIO INVOCADO</h2>
<p>☐ El crédito es QUIROGRAFARIO, sin privilegio especial ni general.<br/>
☐ El crédito goza de PRIVILEGIO ESPECIAL sobre: <span class="campo">[bien específico]</span>.<br/>
☐ El crédito goza de PRIVILEGIO GENERAL conforme art. <span class="campo">[N° ART]</span> LCQ.</p>
<h2>V. PETITORIO</h2>
<p>Se tenga por insinuado el crédito detallado; se lo incluya en la categoría indicada; se lo verifique oportunamente.</p>
<p style="margin-top:60pt">___________________________________<br/><span class="campo">[FIRMA ACREEDOR / ABOGADO/A]</span></p>
`),
  },

  p15: {
    ext: 'csv', mime: 'text/csv',
    content: csv(
      ['PLANILLA DE PASIVO CONCURSAL','','','',''],
      [
        ['Concursada:','[RAZÓN SOCIAL]','CUIT:','[CUIT]',''],
        ['Fecha presentación:',HOY,'Juzgado:','[JUZGADO]',''],
        ['','','','',''],
        ['N°','Acreedor','CUIT/DNI','Concepto','Capital ($)','Intereses ($)','Total ($)','Privilegio','Estado'],
        ['1','','','','0','0','0','Quirografario','Insinuado'],
        ['2','','','','0','0','0','Quirografario','Insinuado'],
        ['3','','','','0','0','0','Privilegiado','Insinuado'],
        ['4','','','','0','0','0','Laboral','Insinuado'],
        ['5','','','','0','0','0','Quirografario',''],
        ['','','','','','','','',''],
        ['TOTALES','','','','0','0','0','',''],
        ['','','','','','','','',''],
        ['RESUMEN POR CATEGORÍA','','','','','','','',''],
        ['Categoría','','','','','','Total ($)','',''],
        ['Acreedores quirografarios','','','','','','0','',''],
        ['Acreedores privilegiados','','','','','','0','',''],
        ['Acreedores laborales','','','','','','0','',''],
        ['TOTAL PASIVO CONCURSAL','','','','','','0','',''],
        ['','','','','','','','',''],
        ['Síndico designado:','[NOMBRE]','','','','','','',''],
        ['Elaborado por:','[ABOGADO/A]','Fecha:',HOY,'','','','',''],
      ]
    ),
  },

  /* ══ GENERAL ══ */

  p16: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('PODER GENERAL JUDICIAL', `
<p class="centro"><strong>PODER GENERAL JUDICIAL</strong></p>
<p class="centro"><em>Para ser certificado ante Escribano Público</em></p>
<div class="bloque">
  <p>En la ciudad de <span class="campo">[CIUDAD]</span>, a los <span class="campo">[DÍAS]</span> días del mes de <span class="campo">[MES]</span> de <span class="campo">[AÑO]</span>, ante mí, <span class="campo">[NOMBRE ESCRIBANO/A]</span>, Escribano/a Público/a, Registro Nº <span class="campo">[N° REGISTRO]</span> de la ciudad de <span class="campo">[CIUDAD]</span>, <strong>COMPARECE:</strong> <span class="campo">[NOMBRE Y APELLIDO PODERDANTE]</span>, de nacionalidad <span class="campo">[NACIONALIDAD]</span>, de estado civil <span class="campo">[ESTADO CIVIL]</span>, de profesión <span class="campo">[PROFESIÓN]</span>, DNI Nº <span class="campo">[DNI]</span>, CUIT/CUIL <span class="campo">[CUIT]</span>, con domicilio real en <span class="campo">[DOMICILIO REAL]</span>, cuya identidad doy fe de conocer/acredita con el documento exhibido.</p>
</div>
<h2>OTORGAMIENTO</h2>
<p>Y DICE: Que por el presente instrumento, en la más amplia forma que en derecho corresponda, <strong>OTORGA PODER GENERAL JUDICIAL</strong> a favor del/la Dr./Dra. <span class="campo">[NOMBRE APODERADO/A]</span>, de nacionalidad <span class="campo">[NACIONALIDAD]</span>, DNI Nº <span class="campo">[DNI]</span>, con domicilio en <span class="campo">[DOMICILIO]</span>, Matrícula de Abogado/a Nº <span class="campo">[MATRÍCULA]</span>, para que en nombre y representación del/la poderdante pueda:</p>
<p><strong>1.</strong> Iniciar, contestar, continuar y desistir de demandas judiciales de todo tipo ante cualquier fuero, instancia y jurisdicción.</p>
<p><strong>2.</strong> Oponer y contestar excepciones, reconvenir, contestar reconvenciones.</p>
<p><strong>3.</strong> Ofrecer, producir y controlar pruebas; articular y contestar incidentes.</p>
<p><strong>4.</strong> Interponer y contestar toda clase de recursos ordinarios y extraordinarios, incluso ante la Corte Suprema de Justicia de la Nación.</p>
<p><strong>5.</strong> Celebrar y suscribir transacciones, conciliaciones y acuerdos, cobrar y percibir sumas de dinero.</p>
<p><strong>6.</strong> Solicitar y levantar medidas cautelares de toda clase.</p>
<p><strong>7.</strong> Actuar ante organismos administrativos, tribunales arbitrales y de mediación.</p>
<p><strong>8.</strong> Sustituir el presente poder total o parcialmente, reservándose la facultad de revocarlo.</p>
<p><strong>9.</strong> En general, realizar todos los actos procesales que el caso requiera con las más amplias facultades de representación.</p>
<p>El/la poderdante declara que este poder tendrá vigencia hasta su expresa revocación, de lo cual se tomará nota en el Registro correspondiente.</p>
<br/>
<table style="border:none"><tr style="border:none">
  <td style="border:none;text-align:center;width:50%">___________________________<br/>PODERDANTE<br/><span class="campo">[NOMBRE]</span><br/>DNI <span class="campo">[DNI]</span></td>
  <td style="border:none;text-align:center;width:50%">___________________________<br/>ESCRIBANO/A PÚBLICO/A<br/><span class="campo">[NOMBRE]</span><br/>Reg. Nº <span class="campo">[N° REGISTRO]</span></td>
</tr></table>
`),
  },

  p17: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('NOTA DE PRESENTACIÓN AL JUZGADO', `
<p style="text-align:right"><span class="campo">[CIUDAD]</span>, <span class="campo">[FECHA]</span></p>
<p><strong>Señor/a Secretario/a</strong><br/>
<span class="campo">[JUZGADO]</span> — Secretaría Nº <span class="campo">[N°]</span><br/>
S/D</p>
<p><strong>Ref.: Autos "<span class="campo">[CARÁTULA]</span>", Expte. Nº <span class="campo">[N° EXPTE]</span></strong></p>
<p>De mi mayor consideración:</p>
<p>Por medio de la presente, el/la abajo firmante, Dr./Dra. <span class="campo">[NOMBRE ABOGADO/A]</span>, en mi carácter de letrado/a patrocinante de la parte <span class="campo">[actora / demandada]</span> en los autos de referencia, me dirijo a Ud. a fin de:</p>
<div class="bloque">
  <p><span class="campo">[Seleccionar y completar según corresponda:]</span></p>
  <p>☐ <strong>Acompañar documentación</strong> solicitada por V.S. mediante providencia de fecha <span class="campo">[FECHA]</span>: <span class="campo">[descripción de los documentos]</span>.</p>
  <p>☐ <strong>Solicitar certificado / informe</strong> sobre: <span class="campo">[descripción de lo solicitado]</span>.</p>
  <p>☐ <strong>Notificarme</strong> de la resolución de fecha <span class="campo">[FECHA]</span>.</p>
  <p>☐ <strong>Retirar</strong> el expediente en préstamo por el término de ley.</p>
  <p>☐ <strong>Poner a disposición</strong> los fondos depositados en autos por la suma de $<span class="campo">[MONTO]</span>.</p>
  <p>☐ <strong>Otro:</strong> <span class="campo">[Descripción del objeto de la nota]</span>.</p>
</div>
<p>Sin otro particular, saludo a Ud. atentamente.</p>
<br/><br/>
<p>___________________________________<br/>
Dr./Dra. <span class="campo">[NOMBRE Y APELLIDO]</span><br/>
Abogado/a — Mat. Nº <span class="campo">[MATRÍCULA]</span><br/>
Tel.: <span class="campo">[TELÉFONO]</span><br/>
Email: <span class="campo">[EMAIL]</span></p>
`),
  },

  p18: {
    ext: 'doc', mime: 'application/msword',
    content: wordDoc('INFORME DE AVANCE DE CAUSA', `
<p style="text-align:right"><span class="campo">[CIUDAD]</span>, <span class="campo">[FECHA]</span></p>
<p><strong>INFORME DE ESTADO PROCESAL</strong></p>
<p><strong>Cliente:</strong> <span class="campo">[NOMBRE CLIENTE]</span><br/>
<strong>Causa:</strong> <span class="campo">[CARÁTULA]</span><br/>
<strong>Expediente Nº:</strong> <span class="campo">[N° EXPTE]</span><br/>
<strong>Juzgado:</strong> <span class="campo">[JUZGADO]</span><br/>
<strong>Fuero:</strong> <span class="campo">[FUERO]</span><br/>
<strong>Fecha inicio:</strong> <span class="campo">[FECHA]</span></p>
<h2>ESTADO ACTUAL</h2>
<div class="bloque">
  <p><strong>Etapa procesal actual:</strong> <span class="campo">[Ej: Período de prueba / Vista de causa / Sentencia pendiente / Ejecución]</span></p>
  <p><strong>Última actuación:</strong> <span class="campo">[Descripción de la última novedad procesal]</span></p>
  <p><strong>Fecha de la última actuación:</strong> <span class="campo">[FECHA]</span></p>
</div>
<h2>CRONOGRAMA DE ACTUACIONES</h2>
<table>
  <tr><th>Fecha</th><th>Actuación</th><th>Estado</th></tr>
  <tr><td><span class="campo">[FECHA]</span></td><td>Presentación de demanda</td><td>✓ Completado</td></tr>
  <tr><td><span class="campo">[FECHA]</span></td><td>Traslado al demandado</td><td>✓ Completado</td></tr>
  <tr><td><span class="campo">[FECHA]</span></td><td>Contestación de demanda</td><td>✓ Completado</td></tr>
  <tr><td><span class="campo">[FECHA]</span></td><td>Apertura a prueba</td><td>⏳ En curso</td></tr>
  <tr><td><span class="campo">[FECHA ESTIMADA]</span></td><td>Clausura de prueba</td><td>⏸ Pendiente</td></tr>
  <tr><td><span class="campo">[FECHA ESTIMADA]</span></td><td>Sentencia</td><td>⏸ Pendiente</td></tr>
</table>
<h2>PRÓXIMOS PASOS</h2>
<p><span class="campo">[Descripción de las próximas acciones a realizar: vencimientos, audiencias, presentaciones pendientes]</span></p>
<h2>OBSERVACIONES</h2>
<p><span class="campo">[Cualquier novedad relevante, propuesta de estrategia, o información adicional para el cliente]</span></p>
<br/>
<p>___________________________________<br/>
Dr./Dra. <span class="campo">[NOMBRE ABOGADO/A]</span><br/>
Mat. Nº <span class="campo">[MATRÍCULA]</span></p>
`),
  },

  p19: {
    ext: 'csv', mime: 'text/csv',
    content: csv(
      ['PRESUPUESTO DE HONORARIOS PROFESIONALES','','',''],
      [
        ['Estudio Jurídico:','[NOMBRE DEL ESTUDIO]','',''],
        ['Abogado/a:','[NOMBRE Y MATRÍCULA]','',''],
        ['Cliente:','[NOMBRE CLIENTE]','',''],
        ['Causa:','[DESCRIPCIÓN DEL CASO]','',''],
        ['Fecha:',HOY,'',''],
        ['','','',''],
        ['ETAPAS Y HONORARIOS','','',''],
        ['Etapa','Descripción','Honorario ($)','Observaciones'],
        ['1. Consulta inicial','Análisis del caso y asesoramiento','0',''],
        ['2. Inicio de causa','Redacción y presentación de demanda','0',''],
        ['3. Etapa probatoria','Ofrecimiento y producción de prueba','0',''],
        ['4. Alegatos y vista de causa','','0',''],
        ['5. Sentencia y ejecución','','0',''],
        ['6. Recursos (si corresponde)','Apelación / Casación','0','Por etapa adicional'],
        ['','','',''],
        ['GASTOS Y TASAS','','',''],
        ['Concepto','','Monto ($)',''],
        ['Tasa de justicia (3% del monto)','','0',''],
        ['Sellados y timbres','','0',''],
        ['Gastos de peritos','','0',''],
        ['Copias y certificaciones','','0',''],
        ['Gastos de notificaciones','','0',''],
        ['Otros gastos estimados','','0',''],
        ['TOTAL GASTOS','','0',''],
        ['','','',''],
        ['RESUMEN','','',''],
        ['Total honorarios','','0',''],
        ['Total gastos','','0',''],
        ['TOTAL PRESUPUESTO','','0',''],
        ['','','',''],
        ['FORMA DE PAGO','','',''],
        ['Anticipo (al inicio)','','0',''],
        ['Cuota 2 (al mes de iniciada)','','0',''],
        ['Honorario de éxito (% sobre lo obtenido)','','0%',''],
        ['','','',''],
        ['NOTAS','','',''],
        ['Los honorarios no incluyen IVA','','',''],
        ['Presupuesto válido por 30 días','','',''],
        ['Referencia: Ley 27.423 de Honorarios Profesionales','','',''],
      ]
    ),
  },

  p20: {
    ext: 'pdf', mime: 'text/html',
    content: wordDoc('CHECKLIST — INICIO DE CAUSA JUDICIAL', `
<p class="centro"><em>Completar antes de presentar la demanda</em></p>
<h2>1. DATOS DE LA CAUSA</h2>
<table>
  <tr><td><strong>Cliente:</strong></td><td><span class="campo">[NOMBRE]</span></td></tr>
  <tr><td><strong>Tipo de causa:</strong></td><td><span class="campo">[Civil / Laboral / Familia / Comercial]</span></td></tr>
  <tr><td><strong>Fuero:</strong></td><td><span class="campo">[FUERO]</span></td></tr>
  <tr><td><strong>Monto reclamado:</strong></td><td>$<span class="campo">[MONTO]</span></td></tr>
</table>
<h2>2. DOCUMENTACIÓN DEL CLIENTE</h2>
<p>☐ DNI / Pasaporte vigente<br/>
☐ CUIL / CUIT<br/>
☐ Domicilio real actualizado<br/>
☐ Domicilio constituido<br/>
☐ Teléfono y email de contacto<br/>
☐ Poder / autorización (si actúa representante)<br/>
☐ Estatuto y acta de designación (si es persona jurídica)</p>
<h2>3. DOCUMENTACIÓN DEL CASO</h2>
<p>☐ Contratos originales y copias<br/>
☐ Facturas y recibos<br/>
☐ Correspondencia (email, cartas documento, telegramas)<br/>
☐ Fotos / videos / capturas de pantalla<br/>
☐ Informes médicos / periciales previos<br/>
☐ Testigos identificados (nombre, DNI, domicilio)<br/>
☐ Actuaciones policiales o administrativas previas<br/>
☐ Sentencias o acuerdos previos relacionados</p>
<h2>4. VERIFICACIONES PREVIAS</h2>
<p>☐ Verificar prescripción del crédito<br/>
☐ Verificar jurisdicción y competencia<br/>
☐ Verificar fuero competente<br/>
☐ Verificar solvencia del demandado (inhibiciones, bienes)<br/>
☐ Agotar instancia previa (mediación obligatoria si corresponde)<br/>
☐ Verificar requisito de conciliación previa (laboral: SECLO)<br/>
☐ Verificar si hay fuero de atracción (concurso, sucesión)</p>
<h2>5. ANTES DE PRESENTAR</h2>
<p>☐ Revisar carátula y datos del demandado<br/>
☐ Verificar montos y cálculos<br/>
☐ Adjuntar toda la documental en orden<br/>
☐ Pagar tasa de justicia<br/>
☐ Consignar domicilio procesal<br/>
☐ Obtener cargo de presentación<br/>
☐ Registrar en sistema de gestión del estudio<br/>
☐ Notificar al cliente fecha de presentación</p>
<h2>6. POSTERIOR A LA PRESENTACIÓN</h2>
<p>☐ Verificar admisibilidad de la demanda<br/>
☐ Registrar número de expediente<br/>
☐ Configurar alertas de vencimientos<br/>
☐ Informar al cliente el número de expediente<br/>
☐ Coordinar notificación al demandado<br/>
☐ Archivar copia firmada del escrito</p>
<br/>
<p>___________________________________<br/>
Dr./Dra. <span class="campo">[ABOGADO/A]</span> | Fecha: <span class="campo">[FECHA]</span></p>
<p style="font-size:10pt;color:#888;text-align:center;margin-top:20pt"><em>Para guardar como PDF: Archivo → Imprimir → Guardar como PDF</em></p>
`),
  },
}

/* ─── Función pública de descarga ─── */
export function downloadPlanilla(p: Planilla): void {
  const tpl = templates[p.id]
  if (!tpl) return

  const isPdf = p.tipo === 'pdf'
  const blob  = new Blob([tpl.content], { type: tpl.mime + ';charset=utf-8' })
  const url   = URL.createObjectURL(blob)

  if (isPdf) {
    // Abrir en nueva pestaña para imprimir/guardar como PDF
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  } else {
    const a = document.createElement('a')
    a.href  = url
    a.download = `${p.nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').trim()}.${tpl.ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }
}
