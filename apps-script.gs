// ============================================================
// GOOGLE APPS SCRIPT - Salida de Artículos
// ============================================================
// Si ya está desplegado, al cambiar el código debes hacer:
//   Implementar → Administrar implementaciones → Editar (lápiz)
//   → "Nueva versión" → Implementar
// ============================================================

const SPREADSHEET_ID = '1aGYlOOuspelZW0nQIJWJzGzSTl079HK_lCoMLJMc2Ng';
const SHEET_GID = 551448446;

// Columnas de la hoja Movimientos_Stock:
//   A: empresa_id  B: fecha  C: tipo  D: codigo  E: articulo
//   F: cantidad    G: nro_doc  H: solicitante  I: motivo  J: saldo_resultante

function doGet(e) {
  try {
    const p = e.parameter;

    if (!p.fecha || !p.codigo || !p.cantidad || !p.solicitante) {
      return jsonResponse({ status: 'error', message: 'Faltan campos requeridos' });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getSheetByGid(spreadsheet, SHEET_GID);

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Hoja no encontrada (GID: ' + SHEET_GID + ')' });
    }

    sheet.appendRow([
      '',                   // A: empresa_id (lo gestiona el sistema principal)
      p.fecha,              // B: fecha
      'salida',             // C: tipo (siempre "salida" en esta app)
      p.codigo,             // D: codigo (del QR)
      '',                   // E: articulo (descripción, queda vacío)
      Number(p.cantidad),   // F: cantidad
      '',                   // G: nro_doc
      p.solicitante,        // H: solicitante
      p.motivo || '',       // I: motivo (opcional)
      ''                    // J: saldo_resultante (calculado por el sistema)
    ]);

    return jsonResponse({ status: 'ok', message: 'Salida registrada correctamente' });

  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function getSheetByGid(spreadsheet, gid) {
  const sheets = spreadsheet.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === Number(gid)) {
      return sheets[i];
    }
  }
  return null;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
