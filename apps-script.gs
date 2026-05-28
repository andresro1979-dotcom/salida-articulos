// ============================================================
// GOOGLE APPS SCRIPT - Salida de Artículos
// ============================================================
// INSTRUCCIONES DE DESPLIEGUE (solo se hace una vez):
//
// 1. Abre el Google Sheet y ve a: Extensiones → Apps Script
// 2. Borra todo el contenido existente y pega este código
// 3. Guarda (Ctrl+S)
// 4. Clic en: Implementar → Nueva implementación
// 5. Tipo de implementación: Aplicación web
// 6. Ejecutar como: Yo (tu cuenta de Google)
// 7. Quién tiene acceso: Cualquier persona
// 8. Clic en "Implementar" → autoriza los permisos solicitados
// 9. Copia la URL del servicio web que aparece
// 10. Abre index.html en el navegador y pega esa URL en la configuración
//
// COLUMNAS QUE SE ESCRIBEN EN LA HOJA:
//   A: Fecha (YYYY-MM-DD)
//   B: Artículo (código QR)
//   C: Cantidad (número)
//   D: Solicitado por (nombre)
//   E: Timestamp (fecha y hora exacta del registro)
// ============================================================

const SPREADSHEET_ID = '1aGYlOOuspelZW0nQIJWJzGzSTl079HK_lCoMLJMc2Ng';
const SHEET_GID = 551448446;

function doGet(e) {
  try {
    const p = e.parameter;

    if (!p.fecha || !p.articulo || !p.cantidad || !p.solicitadoPor) {
      return jsonResponse({ status: 'error', message: 'Faltan campos requeridos' });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getSheetByGid(spreadsheet, SHEET_GID);

    if (!sheet) {
      return jsonResponse({ status: 'error', message: 'Hoja no encontrada (GID: ' + SHEET_GID + ')' });
    }

    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    sheet.appendRow([
      p.fecha,
      p.articulo,
      Number(p.cantidad),
      p.solicitadoPor,
      timestamp
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
