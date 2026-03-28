// ── Anno dinamico ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── Nav background on scroll ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(8,12,11,0.98)';
    nav.style.borderBottom = '1px solid rgba(196,163,90,0.12)';
  } else {
    nav.style.background = '';
    nav.style.borderBottom = '';
  }
});

// ── Blocco tasto destro ──
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

// ── Nav mobile ──
function toggleNav() {
  const menu = document.getElementById('navLinks');
  const nav = document.querySelector('nav');
  const isOpen = menu.classList.toggle('open');
  nav.classList.toggle('nav-open');
  if (isOpen) {
    document.body.appendChild(menu);
    const closeBtn = document.createElement('button');
    closeBtn.id = 'navCloseBtn';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Chiudi menu');
    closeBtn.style.cssText = 'position:fixed;top:1.2rem;right:1.5rem;z-index:10001;background:none;border:none;color:var(--cream);font-size:1.4rem;cursor:pointer;padding:8px;';
    closeBtn.onclick = closeNav;
    document.body.appendChild(closeBtn);
  } else {
    nav.appendChild(menu);
    const closeBtn = document.getElementById('navCloseBtn');
    if (closeBtn) closeBtn.remove();
  }
}
function closeNav() {
  const menu = document.getElementById('navLinks');
  const nav = document.querySelector('nav');
  menu.classList.remove('open');
  nav.classList.remove('nav-open');
  if (menu.parentElement === document.body) nav.appendChild(menu);
  const closeBtn = document.getElementById('navCloseBtn');
  if (closeBtn) closeBtn.remove();
}

// ── Scroll reveal ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Popup conferma form ──
function openPopup() { document.getElementById('popupOverlay').classList.add('active'); }
function closePopup() { document.getElementById('popupOverlay').classList.remove('active'); }
document.getElementById('popupOverlay').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

// ── Calendario popup ──
const CALENDARI = {
  corso1: {
    title: 'Calendario',
    lezioni: [
      ['Lez. 1','Mar 14 Aprile'],['Lez. 2','Gio 16 Aprile'],
      ['Lez. 3','Mar 21 Aprile'],['Lez. 4','Gio 23 Aprile'],
      ['Lez. 5','Mar 28 Aprile'],['Lez. 6','Gio 30 Maggio'],
      ['Lez. 7','Mar 5 Maggio'],['Lez. 8','Gio 7 Maggio'],
      ['Lez. 9','Mar 12 Maggio'],['Esame','Gio 14 Maggio'],
    ]
  },
  corso2: {
    title: 'Calendario',
    lezioni: [
      ['Lez. 1','Mar 19 Maggio'],['Lez. 2','Gio 21 Maggio'],
      ['Lez. 3','Mar 26 Maggio'],['Lez. 4','Gio 28 Maggio'],
      ['Lez. 5','Mar 2 Giugno'],['Lez. 6','Gio 4 Giugno'],
      ['Lez. 7','Mar 9 Giugno'],['Lez. 8','Gio 11 Giugno'],
      ['Lez. 9','Mar 16 Giugno'],['Esame','Gio 18 Giugno'],
    ]
  },
  corso3: {
    title: 'Calendario',
    lezioni: [
      ['Lez. 1','Mar 7 Luglio'],['Lez. 2','Gio 9 Luglio'],
      ['Lez. 3','Mar 14 Luglio'],['Lez. 4','Gio 16 Luglio'],
      ['Lez. 5','Mar 21 Luglio'],['Lez. 6','Gio 23 Luglio'],
      ['Lez. 7','Mar 28 Luglio'],['Lez. 8','Gio 30 Luglio'],
      ['Lez. 9','Mar 4 Agosto'],['Esame','Gio 6 Agosto'],
    ]
  }
};

function openCal(id) {
  const cal = CALENDARI[id];
  document.getElementById('calTitle').textContent = cal.title;
  const grid = document.getElementById('calGrid');
  grid.innerHTML = cal.lezioni.map(([label, date]) => {
    const isExam = label === 'Esame';
    const col1 = `<span style="font-size:.63rem;letter-spacing:.15em;text-transform:uppercase;color:${isExam ? 'var(--gold)' : 'var(--cream-dim)'};">${label}</span>`;
    const col2 = `<span style="font-size:.85rem;color:${isExam ? 'var(--gold)' : 'var(--cream)'};">${date} · 19:00–22:00${isExam ? ' · Giudici esterni' : ''}</span>`;
    return col1 + col2;
  }).join('');
  document.getElementById('calPopup').classList.add('active');
}
function closeCal() { document.getElementById('calPopup').classList.remove('active'); }
document.getElementById('calPopup').addEventListener('click', function(e) {
  if (e.target === this) closeCal();
});

// ── Form validation ──
function clearErrors() { document.querySelectorAll('.form-error').forEach(e => e.remove()); }
function showError(id, msg) {
  clearErr(id);
  const el = document.getElementById(id);
  const err = document.createElement('span');
  err.className = 'form-error';
  err.textContent = msg;
  el.parentNode.appendChild(err);
  el.style.borderColor = 'rgba(200,80,80,.6)';
}
function clearErr(id) {
  const el = document.getElementById(id);
  if (el) { el.style.borderColor = ''; const e = el.parentNode.querySelector('.form-error'); if (e) e.remove(); }
}
['fname','femail','fphone','fmessage'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearErr(id));
});
async function submitForm() {
  let valid = true;
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const corso = document.getElementById('fcourse') ? document.getElementById('fcourse').value : '';
  const msg = document.getElementById('fmessage').value.trim();
  if (!name) { showError('fname', 'Il nome è obbligatorio'); valid = false; }
  if (!email || !email.includes('@')) { showError('femail', 'Inserisci un indirizzo email valido'); valid = false; }
  if (!phone) { showError('fphone', 'Il numero di telefono è obbligatorio'); valid = false; }
  if (!msg) { showError('fmessage', 'Il messaggio è obbligatorio'); valid = false; }
  if (!valid) return;

  const btn = document.querySelector('.form-submit button');
  if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso...'; }

  const templateParams = {
    from_name: name,
    from_email: email,
    phone: phone,
    corso: corso,
    message: msg,
    reply_to: email
  };

  try {
    // 1. Manda mail di notifica a te
    await emailjs.send('service_9ng26ch', 'template_0kfjauv', templateParams, 'KE_Ia3bkUgnIJah4n');

    // 2. Manda mail di conferma all'utente
    await emailjs.send('service_9ng26ch', 'template_jhabtnq', templateParams, 'KE_Ia3bkUgnIJah4n');

    // 3. Crea contatto su Systeme.io
    try {
      await fetch('https://api.systeme.io/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '9ivkdub27t5rpkw4erpp1uhhcj4bf3oo7d75kn6vrf7e8jpjka26e19by6dzs8n3'
        },
        body: JSON.stringify({
          email: email,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' ') || '',
          fields: [{ slug: 'phone_number', value: phone }],
          tags: [{ name: 'Form - da zero a barman in 30 ore' }]
        })
      });
    } catch(e) {
      console.warn('Systeme.io non raggiunto:', e);
    }

    // 4. Mostra popup e svuota form
    openPopup();
    document.getElementById('fname').value = '';
    document.getElementById('femail').value = '';
    document.getElementById('fphone').value = '';
    document.getElementById('fmessage').value = '';

  } catch(err) {
    console.error('Errore invio:', err);
    alert('Errore durante l\'invio. Riprova o scrivici direttamente a info@botanicacademy.it');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Invia messaggio'; }
  }
}

// ── Chatbot FAQ ──
const FAQ = {
  "qual è il prezzo?": "Il corso ha un prezzo standard di €690. Per i primi 5 iscritti di ogni edizione è disponibile un'offerta di lancio a €490. Le date e i prezzi sono visibili nella sezione 'Corsi in partenza' qui sopra.",
  "serve esperienza?": "No, il corso parte da zero. Non importa se non hai mai toccato uno shaker: si parte dalle basi e si arriva alle tecniche professionali. L'unica cosa che serve è voglia di imparare.",
  "dove si svolge?": "Il corso si svolge nella nostra aula dedicata in Corso Europa 27, ad Arcene (BG) — sopra il locale Botanic Fusion & Cocktail. L'aula è allestita con bancone principale, bottigliera, attrezzature professionali e postazioni individuali per ogni corsista.",
  "quando si parte?": "Le prossime edizioni sono: Corso 1 dal 14 Aprile, Corso 2 dal 19 Maggio, Corso 3 dal 7 Luglio. Il corso parte al raggiungimento di minimo 5 iscritti. Per le date precise di ogni lezione clicca 'Vedi calendario completo' sulle card.",
  "che attestato rilasciate?": "Al termine del corso viene rilasciato un attestato di frequenza ufficiale che certifica tutte le competenze, le tecniche e le nozioni apprese durante il percorso.",
  "come funziona l'esame?": "L'ultima lezione è dedicata all'esame finale con giudici esterni. Prevede una parte scritta e una pratica, su tutti gli argomenti del corso. In caso di esito non positivo, puoi ripeterlo gratuitamente.",
  "posso lavorare dopo?": "Sì, il corso è pensato per renderti operativo subito. Potrai lavorare in cocktail bar, discoteche, eventi, beach club, hotel. Offriamo anche supporto per stage e segnalazioni lavorative tramite la nostra rete di contatti.",
  "cosa è incluso?": "Nel prezzo è incluso tutto: uso delle attrezzature professionali, ingredienti reali per le prove pratiche, dispensa, block notes, penna, esame finale e attestato. Non devi portare nulla.",
  "quante persone ci sono?": "Il corso è a numero chiuso: massimo 10 partecipanti per edizione. Questo garantisce attenzione personalizzata da parte del docente e un apprendimento più efficace.",
  "usate ingredienti veri?": "Assolutamente sì. Da noi i cocktail si preparano con ingredienti veri — si assaggiano, si capisce come devono essere e come si presentano. Niente acqua colorata. Solo per le esercitazioni di tecnica pura utilizziamo l'acqua, ma tutti i 70+ cocktail del programma si fanno davvero.",
  "che metodi di pagamento accettate?": "Accettiamo pagamento in contanti, bonifico bancario e PayPal. Con PayPal hai anche la possibilità di pagare in 3 rate senza interessi, direttamente dalla piattaforma.",
  "il certificato ha valore?": "Domanda giusta e frequente. Il nostro attestato certifica ufficialmente la frequenza del corso e le competenze acquisite — ed è questo che i datori di lavoro nel settore riconoscono. È bene sapere che nessuna scuola privata in Italia rilascia certificati 'riconosciuti' in senso legale: quel tipo di riconoscimento riguarda gli enti accreditati dalla Regione per corsi con fondi pubblici. Chi usa il termine 'certificato riconosciuto' spesso lo fa in modo ambiguo. Quello che conta davvero è la qualità della formazione ricevuta e l'esperienza pratica acquisita — elementi che il nostro percorso garantisce pienamente."
};

function appendMsg(role, text) {
  const c = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = `msg ${role}`;
  const icon = role === 'bot'
    ? '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  d.innerHTML = `<div class="msg-av">${icon}</div><div class="msg-bubble">${text}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function showTyping() {
  const c = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg bot'; d.id = 'typing';
  d.innerHTML = '<div class="msg-av"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div class="typing-row" style="display:flex"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}
function removeTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

function sendFAQ(btn) {
  const question = btn.textContent.trim();
  appendMsg('user', question);
  showTyping();
  setTimeout(() => {
    removeTyping();
    const qLow = question.toLowerCase();
    let answer = null;
    for (const [key, val] of Object.entries(FAQ)) {
      if (qLow.includes(key.replace('?','').trim()) || key.includes(qLow.replace('?','').trim())) { answer = val; break; }
    }
    if (!answer) answer = "Per questa domanda contattaci direttamente tramite il form qui sotto, ti risponderemo subito!";
    appendMsg('bot', answer);
  }, 500);
}
