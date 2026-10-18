// CRM Botanic Academy — Google Apps Script collegato al foglio "CRM Botanic Academy".
// Distribuzione: Estensioni > Apps Script > incolla questo codice > Distribuisci >
// Nuova distribuzione > tipo "App web" > Esegui come: Me > Chi ha accesso: Chiunque.
// Copia l'URL /exec e incollalo in CRM_ENDPOINT (test.html, js.js, experience.html).
//
// AGGIORNARE UNO SCRIPT GIÀ PUBBLICATO (senza cambiare l'indirizzo /exec):
// Distribuisci > Gestisci deployment > icona matita > Versione: "Nuova versione" > Esegui il deployment.
// NON usare "Nuova distribuzione": creerebbe un indirizzo diverso e le pagine smetterebbero di salvare i contatti.
//
// Protezioni antispam (lato server, perché l'indirizzo /exec è visibile nel codice delle pagine):
// 1. campo trappola "website" (se compilato, la richiesta è ignorata);
// 2. email valida e nome presente, con lunghezze limitate;
// 3. "fonte" solo tra quelle usate dalle pagine (se aggiungi un modulo con una fonte nuova, aggiungila a FONTI);
// 4. niente indirizzi web nel nome e al massimo uno nelle note;
// 5. la stessa email non viene registrata due volte in 10 minuti;
// 6. al massimo 40 contatti all'ora in totale.

const SHEET_ID = '1fKu5VgpErdLmWwTYKJKRUJQvgkyP4RTRKx47uLmmM-8';
const FONTI = ['Experience', 'Quiz', 'Form contatti'];
const MAX_ALL_ORA = 40;
const SECONDI_DOPPIONE = 600;

// Evita che testi inseriti dagli utenti vengano interpretati come formule.
function clean_(v) {
  v = String(v || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function ok_() { return ContentService.createTextOutput('ok'); }

function valido_(p) {
  const email = String(p.email || '').trim();
  const nome = String(p.nome || '').trim();
  const note = String(p.note || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return false;
  if (!nome || nome.length > 80) return false;
  if (FONTI.indexOf(String(p.fonte || '').trim()) === -1) return false;
  if (/https?:\/\/|www\./i.test(nome)) return false;
  if ((note.match(/https?:\/\/|www\./gi) || []).length > 1) return false;
  return true;
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return ok_();          // trappola anti-bot: finge di aver salvato
  if (!valido_(p)) return ok_();        // richiesta non valida: ignorata in silenzio

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const cache = CacheService.getScriptCache();
    const chiaveEmail = 'em:' + String(p.email).trim().toLowerCase();
    if (cache.get(chiaveEmail)) return ok_();                              // doppione recente
    const ora = Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
    const chiaveOra = 'n:' + ora;
    const n = Number(cache.get(chiaveOra) || 0);
    if (n >= MAX_ALL_ORA) return ok_();                                    // troppi contatti in questa ora
    cache.put(chiaveEmail, '1', SECONDI_DOPPIONE);
    cache.put(chiaveOra, String(n + 1), 4000);

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
  return ok_();
}
