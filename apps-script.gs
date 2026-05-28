const SPREADSHEET_ID = '1aGYlOOuspelZW0nQIJWJzGzSTl079HK_lCoMLJMc2Ng';
const SHEET_GID = 551448446;

function doGet(e) {
  try {
    const p = e.parameter;

    // Acepta tanto nombres nuevos como los anteriores
    const codigo      = p.codigo      || p.articulo      || '';
    const solicitante = p.solicitante || p.solicitadoPor || '';
    const cantidad    = Number(p.cantidad) || 0;

    if (!p.fecha || !codigo || !cantidad || !solicitante) {
      return jsonResponse({ status: 'error', message: 'Faltan campos requeridos' });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet       = getSheetByGid(spreadsheet, SHEET_GID);

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Hoja no encontrada' });
    }

    // Buscar el último saldo del mismo código (columna D=índice 3, J=índice 9)
    const filas = sheet.getDataRange().getValues();
    let ultimoSaldo = 0;
    for (let i = filas.length - 1; i >= 1; i--) {
      if (String(filas[i][3]) === codigo && filas[i][9] !== '') {
        ultimoSaldo = Number(filas[i][9]) || 0;
        break;
      }
    }
    const nuevoSaldo = ultimoSaldo - cantidad;

    sheet.appendRow([
      '',            // A: empresa_id
      p.fecha,       // B: fecha
      'salida',      // C: tipo
      codigo,        // D: codigo
      '',            // E: articulo (descripción)
      cantidad,      // F: cantidad
      '',            // G: nro_doc
      solicitante,   // H: solicitante
      p.motivo || '',// I: motivo
      nuevoSaldo     // J: saldo_resultante
    ]);

    return jsonResponse({ status: 'ok', message: 'Salida registrada correctamente' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function getSheetByGid(spreadsheet, gid) {
  const sheets = spreadsheet.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === Number(gid)) return sheets[i];
  }
  return null;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
