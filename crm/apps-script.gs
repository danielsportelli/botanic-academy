// CRM Botanic Academy — Google Apps Script collegato al foglio "CRM Botanic Academy".
// Distribuzione: Estensioni > Apps Script > incolla questo codice > Distribuisci >
// Nuova distribuzione > tipo "App web" > Esegui come: Me > Chi ha accesso: Chiunque.
// Copia l'URL /exec e incollalo in CRM_ENDPOINT (test.html, js.js, experience.html).

const SHEET_ID = '1fKu5VgpErdLmWwTYKJKRUJQvgkyP4RTRKx47uLmmM-8';

// Evita che testi inseriti dagli utenti vengano interpretati come formule.
function clean_(v) {
  v = String(v || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ContentService.createTextOutput('ok'); // honeypot anti-bot
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sh.appendRow([
      new Date(),
      clean_(p.fonte),
      clean_(p.nome),
      clean_(p.email),
      clean_(p.telefono),
      clean_(p.interesse),
      clean_(p.note),
      'Nuovo'
    ]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
