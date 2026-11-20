/* ============================================================
   NEOM — CONFIGURAÇÃO (edite só este bloco)
   ============================================================ */
const CONFIG = {
  // Seu WhatsApp com DDI + DDD, só números. Ex.: "5511999999999"
  whatsapp: "5583994054176",

  // Links de checkout da Kiwify: um por plano (categoria → nível). Todos os botões "contratar" levam a eles.
  checkout: {
    landing: {
      "Básico": "https://pay.kiwify.com.br/msgce7q",
      "Médio": "https://pay.kiwify.com.br/LLJ77gR",
      "Premium": "https://pay.kiwify.com.br/ruf0ckp",
    },
    institucional: {
      "Básico": "https://pay.kiwify.com.br/s87LFHi",
      "Médio": "https://pay.kiwify.com.br/DMxFnTX",
      "Premium": "https://pay.kiwify.com.br/b7JM5aD",
    },
    catalogo: {
      "Básico": "https://pay.kiwify.com.br/7kh7g51",
      "Médio": "https://pay.kiwify.com.br/DqxtIa7",
      "Premium": "https://pay.kiwify.com.br/OC8vSC5",
    },
  },
};
/* ============================================================ */

const PLANOS = {
  landing: {
    nome: "Landing Page",
    preco: 329, // "a partir de" (nível Básico)
    porque: "Você tem uma oferta clara e precisa de uma página única, direta, feita para transformar visitantes em contatos e vendas.",
  },
  institucional: {
    nome: "Site Institucional",
    preco: 997,
    porque: "Seu negócio precisa de presença e credibilidade: um site com várias páginas para apresentar a empresa, os serviços e os canais de contato.",
  },
  catalogo: {
    nome: "Site de Catálogo",
    preco: 1997,
    porque: "Você tem vários produtos para mostrar. Um catálogo organizado por categorias deixa o cliente navegar, escolher e pedir.",
  },
};

const params = new URLSearchParams(location.search);
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const fmt = (n) => n.toLocaleString("pt-BR");
document.documentElement.classList.add("js");

/* ============================================================
   EFEITOS VISUAIS
   ============================================================ */

/* ---------- Partículas neon de fundo ---------- */
const mouse = { x: -999, y: -999 };
addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

if (!REDUCED) {
  const c = document.createElement("canvas");
  c.className = "bg-fx";
  c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  const ctx = c.getContext("2d");
  let w, h, pts = [];
  const dpr = Math.min(devicePixelRatio || 1, 2);

  const size = () => {
    // no celular, a barra de endereço muda só a altura ao rolar: aí as partículas são mantidas
    const recria = innerWidth !== w;
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!recria) return;
    const n = Math.round(Math.min(70, (w * h) / 22000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.6,
    }));
  };
  size();
  addEventListener("resize", size);

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) { p.x += (dx / d) * 0.9; p.y += (dy / d) * 0.9; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(200,255,26,${0.16 * (1 - d / 130)})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
      if (dm < 170) {
        ctx.strokeStyle = `rgba(200,255,26,${0.45 * (1 - dm / 170)})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    ctx.fillStyle = "#c8ff1a";
    ctx.shadowColor = "#c8ff1a";
    ctx.shadowBlur = 10;
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  };
  // começa depois do carregamento, para não disputar a CPU com a primeira pintura; entra com um fade
  c.style.opacity = "0";
  c.style.transition = "opacity 1.2s ease";
  const comecar = () => { requestAnimationFrame(tick); requestAnimationFrame(() => { c.style.opacity = "1"; }); };
  if (document.readyState === "complete") comecar(); else addEventListener("load", comecar, { once: true });
}

/* ---------- Luz que segue o cursor ---------- */
if (FINE && !REDUCED) {
  const g = document.createElement("div");
  g.className = "cursor-glow";
  document.body.prepend(g);
  let gx = innerWidth / 2, gy = innerHeight / 2, rodando = false;
  // só anima enquanto a luz ainda não alcançou o cursor; parada, não gasta processamento
  const move = () => {
    gx += (mouse.x - gx) * 0.12; gy += (mouse.y - gy) * 0.12;
    g.style.transform = `translate(${gx}px, ${gy}px)`;
    if (Math.abs(mouse.x - gx) + Math.abs(mouse.y - gy) > 0.5) requestAnimationFrame(move);
    else rodando = false;
  };
  addEventListener("pointermove", () => { if (!rodando) { rodando = true; requestAnimationFrame(move); } }, { passive: true });
}

/* ---------- Menu do celular ---------- */
{
  const nav = document.querySelector(".nav");
  const botao = nav && nav.querySelector(".menu-btn");
  if (botao) {
    const menu = document.getElementById("menu");
    const abrir = (sim) => {
      nav.classList.toggle("aberto", sim);
      botao.setAttribute("aria-expanded", sim);
    };
    botao.addEventListener("click", () => {
      const sim = botao.getAttribute("aria-expanded") !== "true";
      abrir(sim);
      if (sim) menu.querySelector("a").focus();
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("aberto")) { abrir(false); botao.focus(); }
    });
    // clicar fora ou levar o foco para fora fecha o menu
    document.addEventListener("click", (e) => { if (nav.classList.contains("aberto") && !nav.contains(e.target)) abrir(false); });
    nav.addEventListener("focusout", (e) => { if (e.relatedTarget && !nav.contains(e.relatedTarget)) abrir(false); });
    matchMedia("(min-width: 721px)").addEventListener("change", (m) => { if (m.matches) abrir(false); });
  }
}

/* ---------- Barra de progresso neon da rolagem ---------- */
{
  const bar = document.createElement("div");
  bar.className = "scroll-bar";
  document.body.prepend(bar);
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", upd, { passive: true });
  requestAnimationFrame(upd); // no próximo quadro, para não forçar um layout extra durante o carregamento
}

/* ---------- Revelar elementos ao rolar ---------- */
{
  const alvos = document.querySelectorAll(
    ".mock-wrap, .cta-box .hero-actions, .erro .hero-actions, .sec-head, " +
    ".card, .cta-box, .faq details, .stat, .tl, .passos li, .form-grid > div, .erro .wrap > *, .marquee"
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  alvos.forEach((el) => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", Math.min(i, 6) * 0.09 + "s");
    el.classList.add("reveal");
    io.observe(el);
  });
}

/* ---------- Inclinação 3D + holofote nos cards ---------- */
if (FINE && !REDUCED) {
  document.querySelectorAll(".card:not(form), .mock").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", (px - 0.5) * 9 + "deg");
      el.style.setProperty("--rx", (0.5 - py) * 9 + "deg");
      el.style.setProperty("--mx", px * 100 + "%");
      el.style.setProperty("--my", py * 100 + "%");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  /* Botões magnéticos */
  document.querySelectorAll(".btn").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--tx", (e.clientX - r.left - r.width / 2) * 0.18 + "px");
      b.style.setProperty("--ty", (e.clientY - r.top - r.height / 2) * 0.25 + "px");
    });
    b.addEventListener("pointerleave", () => {
      b.style.setProperty("--tx", "0px");
      b.style.setProperty("--ty", "0px");
    });
  });
}

/* ---------- Texto que se digita sozinho ---------- */
document.querySelectorAll("[data-words]").forEach((el) => {
  const words = el.dataset.words.split("|");
  if (REDUCED) { el.textContent = words[0]; return; }
  const txt = document.createElement("span");
  const caret = document.createElement("span");
  caret.className = "caret";
  el.textContent = "";
  el.append(txt, caret);
  let w = 0, i = 0, del = false;
  const step = () => {
    const word = words[w];
    i += del ? -1 : 1;
    txt.textContent = word.slice(0, i);
    let t = del ? 35 : 75;
    if (!del && i === word.length) { del = true; t = 1700; }
    else if (del && i === 0) { del = false; w = (w + 1) % words.length; t = 350; }
    setTimeout(step, t);
  };
  setTimeout(step, 700);
});

/* ---------- Contadores ---------- */
const countUp = (el, to, ms = 1400) => {
  if (REDUCED) { el.textContent = fmt(to); return; }
  const t0 = performance.now();
  const f = (t) => {
    const k = Math.min((t - t0) / ms, 1);
    el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
  // garantia: se o navegador pausar a animação (aba em segundo plano), o valor final aparece mesmo assim
  setTimeout(() => { el.textContent = fmt(to); }, ms + 150);
};
{
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { countUp(e.target, +e.target.dataset.count); io.unobserve(e.target); }
  }), { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
}

/* ---------- Confete neon ---------- */
const burst = (x, y, n = 110) => {
  if (REDUCED) return;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100";
  c.setAttribute("aria-hidden", "true");
  c.width = innerWidth; c.height = innerHeight;
  document.body.append(c);
  const ctx = c.getContext("2d");
  const cores = ["#c8ff1a", "#c8ff1a", "#e4ff8a", "#ffffff"];
  const ps = Array.from({ length: n }, () => {
    const a = Math.random() * 6.2832, v = Math.random() * 11 + 4;
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, s: Math.random() * 6 + 3, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: cores[(Math.random() * cores.length) | 0], life: 1 };
  });
  const f = () => {
    ctx.clearRect(0, 0, c.width, c.height);
    let vivo = false;
    for (const p of ps) {
      p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.012;
      if (p.life <= 0) continue;
      vivo = true;
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    if (vivo) requestAnimationFrame(f); else c.remove();
  };
  f();
};

/* ---------- Transição suave entre páginas ---------- */
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
  e.preventDefault();
  document.body.classList.add("leaving");
  setTimeout(() => { location.href = a.href; }, REDUCED ? 0 : 230);
});
addEventListener("pageshow", () => document.body.classList.remove("leaving"));

/* ---------- Botão "Fale conosco": abre direto o WhatsApp ---------- */
document.querySelectorAll("a[data-whats]").forEach((a) => {
  if (!CONFIG.whatsapp) return; // sem número configurado, o botão leva à página de contato
  a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Olá, NEOM! Vim pelo site e gostaria de falar com vocês.");
});

/* ---------- Quiz "Qual o site ideal para mim?" ---------- */
const quizEl = document.getElementById("quiz");
if (quizEl) {
  const PERGUNTAS = [
    {
      q: "Qual é o principal objetivo do seu site?",
      o: [
        ["Vender ou divulgar uma oferta específica", "landing"],
        ["Apresentar minha empresa e passar credibilidade", "institucional"],
        ["Mostrar todos os meus produtos para o cliente escolher", "catalogo"],
      ],
    },
    {
      q: "Quantos produtos ou serviços você oferece?",
      o: [
        ["Um só, ou um carro-chefe", "landing"],
        ["Alguns serviços diferentes", "institucional"],
        ["Muitos produtos, com fotos e preços", "catalogo"],
      ],
    },
    {
      q: "Como você imagina o conteúdo do site?",
      o: [
        ["Uma página só, direto ao ponto", "landing"],
        ["Várias páginas: início, sobre, serviços, contato", "institucional"],
        ["Páginas de produtos organizadas por categoria", "catalogo"],
      ],
    },
    {
      q: "De onde vêm a maioria dos seus clientes?",
      o: [
        ["Anúncios e redes sociais", "landing"],
        ["Indicações e buscas no Google", "institucional"],
        ["Clientes que gostam de ver e comparar opções antes de pedir", "catalogo"],
      ],
    },
    {
      q: "Em que momento está o seu negócio?",
      o: [
        ["Começando ou lançando algo novo", "landing"],
        ["Já funciona e precisa de uma presença profissional", "institucional"],
        ["Tenho variedade de produtos e quero expor tudo online", "catalogo"],
      ],
    },
  ];

  const respostas = [];
  const N = PERGUNTAS.length;
  let idx = 0, travado = false, final = 0, timer = 0;

  quizEl.innerHTML = `
    <div class="progress" role="progressbar" aria-label="Progresso do teste" aria-valuemin="0" aria-valuemax="${N}" aria-valuenow="0"><i></i></div>
    <p class="quiz-count" aria-live="polite"></p>
    <div class="q-view"><div class="q-track">
      ${PERGUNTAS.map((p, k) => `
        <div class="q-slide" data-k="${k}"><div class="q-block">
          <h2 tabindex="-1">${p.q}</h2>
          <div class="opcoes">
            ${p.o.map((op, i) => `<button class="opcao" type="button" data-v="${op[1]}"><span class="letra">${"ABC"[i]}</span>${op[0]}</button>`).join("")}
          </div>
          ${k > 0 ? '<button class="quiz-voltar" type="button" data-act="voltar">← Voltar</button>' : ""}
        </div></div>`).join("")}
      <div class="q-slide" data-k="${N}"><div class="q-block resultado" id="q-resultado"></div></div>
    </div></div>`;

  const view = quizEl.querySelector(".q-view");
  const track = quizEl.querySelector(".q-track");
  const slides = [...quizEl.querySelectorAll(".q-slide")];
  const progresso = quizEl.querySelector(".progress");
  const bar = progresso.querySelector("i");
  const count = quizEl.querySelector(".quiz-count");

  // a altura inclui a folga (padding) do contêiner, que deixa o brilho neon aparecer
  const ajusta = () => {
    const cs = getComputedStyle(view);
    view.style.height = slides[idx].offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + "px";
  };

  // Desliza a trilha para o bloco n, como um scroll automático para o lado
  // focar = true quando a troca vem de uma ação da pessoa: o foco vai para o título do novo bloco,
  // em vez de se perder no botão que acabou de ficar inerte
  const ir = (n, focar = false) => {
    idx = n;
    track.style.transform = `translateX(${-n * 100}%)`;
    slides.forEach((s, k) => { s.classList.toggle("active", k === n); s.inert = k !== n; });
    bar.style.width = (Math.min(n, N) / N) * 100 + "%";
    progresso.setAttribute("aria-valuenow", Math.min(n, N));
    count.textContent = n < N ? `Pergunta ${n + 1} de ${N}` : "Resultado";
    ajusta();
    if (focar) slides[n].querySelector("h2").focus({ preventScroll: true });
    clearTimeout(timer);
    if (n === N) {
      timer = setTimeout(() => {
        countUp(quizEl.querySelector("[data-final]"), final, 1100);
        const r = slides[N].getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + Math.min(r.height / 2, 200));
      }, REDUCED ? 0 : 750);
    }
  };

  const resultado = () => {
    const pontos = { landing: 0, institucional: 0, catalogo: 0 };
    respostas.forEach((r) => pontos[r]++);
    const max = Math.max(...Object.values(pontos));
    const empatados = Object.keys(pontos).filter((k) => pontos[k] === max);
    // Em caso de empate, vale a resposta da primeira pergunta (o objetivo principal)
    const id = empatados.includes(respostas[0]) ? respostas[0] : empatados[0];
    const pl = PLANOS[id];
    const link = "planos.html?cat=" + id; // leva direto para a aba desta categoria
    final = pl.preco;
    quizEl.querySelector("#q-resultado").innerHTML = `
      <span class="tag">Seu site ideal</span>
      <h2 tabindex="-1"><span class="sr-only">Seu site ideal: </span><span class="lime">${pl.nome}</span></h2>
      <p>${pl.porque}</p>
      <p class="preco-nota" style="margin:22px 0 0">a partir de</p>
      <div class="preco" style="margin-top:2px"><small>R$</small><span data-final>0</span></div>
      <div class="hero-actions">
        <a class="btn btn-lime" href="${link}">Ver os planos de ${pl.nome}</a>
        <a class="btn btn-ghost" href="planos.html">Ver todas as categorias</a>
      </div>
      <button class="quiz-voltar" type="button" data-act="refazer">Refazer o teste</button>`;
  };

  quizEl.addEventListener("click", (e) => {
    const op = e.target.closest(".opcao");
    if (op) {
      if (travado) return;
      const k = +op.closest(".q-slide").dataset.k;
      travado = true;
      op.parentElement.querySelectorAll(".opcao").forEach((o) => o.classList.toggle("sel", o === op));
      respostas[k] = op.dataset.v;
      // pausa curta para ver a escolha, depois o bloco passa para o lado
      setTimeout(() => {
        if (k === N - 1) resultado();
        ir(k + 1, true);
        travado = false;
      }, REDUCED ? 0 : 420);
      return;
    }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.dataset.act === "voltar") ir(idx - 1, true);
    if (b.dataset.act === "refazer") {
      respostas.length = 0;
      quizEl.querySelectorAll(".opcao.sel").forEach((o) => o.classList.remove("sel"));
      ir(0, true);
    }
  });

  addEventListener("resize", ajusta);
  document.fonts && document.fonts.ready.then(ajusta);
  ir(0);
}

/* ---------- Página de obrigado / contato ---------- */
const form = document.getElementById("form-contato");
if (form) {
  // Vindo da Kiwify (sem parâmetro) = modo "obrigado". Vindo do site (?contato=plano) = modo "contato".
  const modo = params.has("contato") ? "contato" : "obrigado";
  document.querySelectorAll("[data-modo]").forEach((el) => {
    el.hidden = el.dataset.modo !== modo;
  });
  const plano = params.get("contato");
  if (plano && PLANOS[plano]) form.plano.value = PLANOS[plano].nome;
  const nivel = params.get("nivel");
  if (nivel && [...form.nivel.options].some((o) => o.value === nivel)) form.nivel.value = nivel;

  // Telefone: máscara (00) 00000-0000 e validação com DDD (10 ou 11 dígitos)
  const tel = form.telefone;
  const telErro = document.getElementById("telefone-erro");
  const mascara = (v) => {
    const d = v.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };
  const telValido = () => /^\d{10,11}$/.test(tel.value.replace(/\D/g, ""));
  const marcaTel = (erro) => {
    if (erro) tel.setAttribute("aria-invalid", "true"); else tel.removeAttribute("aria-invalid");
    telErro.hidden = !erro;
  };
  tel.addEventListener("input", () => {
    tel.value = mascara(tel.value);
    if (tel.hasAttribute("aria-invalid") && telValido()) marcaTel(false);
  });
  tel.addEventListener("blur", () => { if (tel.value) marcaTel(!telValido()); });

  if (modo === "obrigado") {
    setTimeout(() => {
      const ck = document.querySelector(".check");
      if (!ck) return;
      const r = ck.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 140);
    }, 700);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!telValido()) { marcaTel(true); tel.focus(); return; }
    const d = new FormData(form);
    const linhas = [
      modo === "obrigado" ? "Olá, NEOM! Acabei de comprar meu site." : "Olá, NEOM! Quero um site.",
      "",
      "*Nome:* " + d.get("nome"),
      "*WhatsApp:* " + d.get("telefone"),
      "*E-mail:* " + d.get("email"),
      "*Negócio:* " + d.get("negocio"),
      "*Plano:* " + d.get("plano") + (d.get("nivel") ? " — " + d.get("nivel") : ""),
    ];
    if (d.get("mensagem")) linhas.push("", "*Sobre o projeto:* " + d.get("mensagem"));
    const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(linhas.join("\n"));
    const r = form.querySelector("button[type=submit]").getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 70);
    // se o navegador bloquear a nova aba, abre o WhatsApp na própria aba para a mensagem não se perder
    const aba = window.open(url, "_blank");
    if (aba) aba.opener = null; else location.href = url;
    document.getElementById("form-nota").textContent =
      "Abrimos o WhatsApp com sua mensagem pronta. É só enviar por lá.";
  });
}

/* ---------- Como funciona (computador): cards grandes cruzando a tela na diagonal ao rolar ---------- */
{
  const box = document.getElementById("diag");
  if (box && !REDUCED && matchMedia("(min-width: 900px)").matches) {
    const sticky = box.querySelector(".diag-sticky");
    const cards = [...box.querySelectorAll(".diag-card")];
    const linha = box.querySelector(".diag-line");
    const num = box.querySelector(".diag-count b");
    const nav = document.querySelector(".nav");
    const N = cards.length, G = 1; // G = distância (em "passos") entre um card e o próximo
    let Dx = 480, Dy = 300;
    box.classList.add("diag-on");

    const measure = () => {
      const dw = Math.min(560, innerWidth * 0.42);
      box.style.setProperty("--dw", dw + "px");
      box.style.setProperty("--dh", "auto");
      const dh = Math.max(...cards.map((c) => c.offsetHeight));
      box.style.setProperty("--dh", dh + "px");
      Dx = dw * 0.92; Dy = dh * 0.88; // deslocamento por passo: define a diagonal
      linha.style.transform = `translate(-50%, -50%) rotate(${(Math.atan2(Dy, Dx) * 180 / Math.PI).toFixed(2)}deg)`;
    };

    const topo = () => scrollY + box.getBoundingClientRect().top - nav.offsetHeight;
    const update = () => {
      const bruto = Math.max(0, Math.min(1, (scrollY - topo()) / (box.offsetHeight - sticky.offsetHeight)));
      const p = Math.max(0, Math.min(1, (bruto - 0.06) / 0.88)); // pequena pausa no início e no fim
      const S = (N - 1) * G;
      let ativo = 0, melhor = Infinity;
      cards.forEach((c, i) => {
        const off = i * G - p * S;           // 0 = centro; positivo = chegando (baixo-direita); negativo = já passou (cima-esquerda)
        const a = Math.abs(off);
        const esc = 1 - Math.min(a, 1.4) * 0.13;
        c.style.transform = `translate(${(off * Dx).toFixed(1)}px, ${(off * Dy).toFixed(1)}px) scale(${esc.toFixed(3)}) rotate(${(-off * 2.2).toFixed(2)}deg)`;
        c.style.opacity = Math.max(0, 1 - Math.max(0, a - 0.35) * 0.72).toFixed(2);
        c.style.zIndex = 20 - Math.round(a * 6);
        c.style.pointerEvents = a < 0.6 ? "auto" : "none";
        c.classList.toggle("ativo", a < 0.5);
        if (a < melhor) { melhor = a; ativo = i; }
      });
      num.textContent = "0" + (ativo + 1);
    };

    measure(); update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", () => { if (innerWidth < 900) { location.reload(); return; } measure(); update(); });
    addEventListener("load", () => { measure(); update(); });
  }
}

/* ============================================================
   PLANOS E PREÇOS — fonte única dos 9 planos (cards, comparativo e WhatsApp)
   ============================================================ */
const PRECOS = {
  landing: {
    nome: "Landing Page",
    intro: "Uma página única, direta e pensada para transformar visitantes em contatos.",
    planos: [
      {
        nivel: "Básico", preco: 329, titulo: "Presença objetiva",
        ideal: "Quem está começando e precisa de uma página profissional no ar.",
        cta: "Começar meu site",
        itens: ["Página única com até 5 seções", "Layout profissional com as suas cores e logo", "Adaptada para celular, tablet e computador", "Botão de WhatsApp em destaque", "Título e descrição configurados para o Google", "1 rodada de ajustes"],
      },
      {
        nivel: "Médio", preco: 597, titulo: "Feita para converter",
        ideal: "Quem anuncia e quer transformar visitas em contatos.",
        cta: "Quero este plano",
        itens: ["Até 8 seções", "Design personalizado para a sua marca", "Animações suaves de entrada", "Formulário de contato", "Seções de depoimentos e perguntas frequentes", "Integração com Google Analytics", "2 rodadas de ajustes"],
      },
      {
        nivel: "Premium", preco: 897, titulo: "Experiência exclusiva",
        ideal: "Marcas que querem se destacar com um design único.",
        cta: "Solicitar meu projeto",
        itens: ["Até 12 seções", "Design exclusivo, criado do zero", "Animações e interações avançadas", "Integração com o Pixel da Meta para anúncios", "Otimização avançada de velocidade", "3 rodadas de ajustes"],
      },
    ],
    comparar: [
      ["Seções na página", ["Até 5", "Até 8", "Até 12"]],
      ["Design", ["Profissional", "Personalizado", "Exclusivo"]],
      ["Adaptada para celular", [true, true, true]],
      ["Botão de WhatsApp", [true, true, true]],
      ["Configuração para o Google", [true, true, true]],
      ["Formulário de contato", [false, true, true]],
      ["Depoimentos e perguntas frequentes", [false, true, true]],
      ["Animações", [false, "Suaves", "Avançadas"]],
      ["Google Analytics", [false, true, true]],
      ["Pixel da Meta", [false, false, true]],
      ["Otimização avançada de velocidade", [false, false, true]],
      ["Rodadas de ajustes", ["1", "2", "3"]],
    ],
  },
  institucional: {
    nome: "Site Institucional",
    intro: "Várias páginas para apresentar a empresa, os serviços e passar credibilidade.",
    planos: [
      {
        nivel: "Básico", preco: 997, titulo: "O essencial da empresa",
        ideal: "Empresas que precisam de um site institucional objetivo.",
        cta: "Começar meu site",
        itens: ["Até 4 páginas: início, sobre, serviços e contato", "Layout profissional com as suas cores e logo", "Adaptado para celular, tablet e computador", "Formulário de contato e botão de WhatsApp", "Mapa com a localização da empresa", "SEO básico em todas as páginas", "1 rodada de ajustes"],
      },
      {
        nivel: "Médio", preco: 1497, titulo: "Credibilidade completa",
        ideal: "Empresas que querem apresentar cada serviço em detalhes.",
        cta: "Quero este plano",
        itens: ["Até 7 páginas", "Design personalizado para a sua marca", "Página individual para cada serviço", "Galeria de fotos ou portfólio", "Seção de depoimentos de clientes", "Integração com Google Analytics", "2 rodadas de ajustes"],
      },
      {
        nivel: "Premium", preco: 1897, titulo: "Presença de referência",
        ideal: "Empresas que querem um site à altura das maiores do seu mercado.",
        cta: "Solicitar meu projeto",
        itens: ["Até 10 páginas", "Design exclusivo, criado do zero", "Animações e interações avançadas", "Portfólio com filtros por categoria", "Página de perguntas frequentes", "Integração com o Pixel da Meta", "3 rodadas de ajustes"],
      },
    ],
    comparar: [
      ["Páginas", ["Até 4", "Até 7", "Até 10"]],
      ["Design", ["Profissional", "Personalizado", "Exclusivo"]],
      ["Adaptado para celular", [true, true, true]],
      ["Formulário e botão de WhatsApp", [true, true, true]],
      ["Mapa de localização", [true, true, true]],
      ["SEO em todas as páginas", [true, true, true]],
      ["Página para cada serviço", [false, true, true]],
      ["Galeria ou portfólio", [false, "Galeria", "Com filtros"]],
      ["Depoimentos de clientes", [false, true, true]],
      ["Perguntas frequentes", [false, false, true]],
      ["Animações avançadas", [false, false, true]],
      ["Google Analytics", [false, true, true]],
      ["Pixel da Meta", [false, false, true]],
      ["Rodadas de ajustes", ["1", "2", "3"]],
    ],
  },
  catalogo: {
    nome: "Site de Catálogo",
    intro: "Seus produtos organizados, fáceis de encontrar e prontos para o cliente pedir.",
    planos: [
      {
        nivel: "Básico", preco: 1997, titulo: "Catálogo enxuto",
        ideal: "Lojas com poucos produtos que vendem pelo WhatsApp.",
        cta: "Começar meu site",
        itens: ["Até 30 produtos cadastrados", "Organização por categorias", "Página individual para cada produto", "Pedido pelo WhatsApp com o produto já na mensagem", "Layout profissional com as suas cores e logo", "Adaptado para celular, tablet e computador", "1 rodada de ajustes"],
      },
      {
        nivel: "Médio", preco: 2397, titulo: "Catálogo profissional",
        ideal: "Lojas com mais produtos, que precisam de busca e filtros.",
        cta: "Quero este plano",
        itens: ["Até 80 produtos cadastrados", "Design personalizado para a sua marca", "Busca de produtos", "Filtros por categoria e faixa de preço", "Galeria com várias fotos por produto", "Produtos em destaque na página inicial", "2 rodadas de ajustes"],
      },
      {
        nivel: "Premium", preco: 2799, titulo: "Catálogo completo",
        ideal: "Lojas com muitos produtos, variações e pedidos maiores.",
        cta: "Solicitar meu projeto",
        itens: ["Até 150 produtos cadastrados", "Design exclusivo, criado do zero", "Lista de pedido: o cliente junta vários produtos e envia tudo numa única mensagem", "Variações de produto (tamanho, cor, modelo)", "Selos de promoção e novidade", "3 rodadas de ajustes"],
      },
    ],
    comparar: [
      ["Produtos cadastrados", ["Até 30", "Até 80", "Até 150"]],
      ["Design", ["Profissional", "Personalizado", "Exclusivo"]],
      ["Categorias", [true, true, true]],
      ["Página de cada produto", [true, true, true]],
      ["Pedido pelo WhatsApp", ["Por produto", "Por produto", "Lista com vários"]],
      ["Adaptado para celular", [true, true, true]],
      ["Busca de produtos", [false, true, true]],
      ["Filtros por categoria e preço", [false, true, true]],
      ["Várias fotos por produto", [false, true, true]],
      ["Destaques na página inicial", [false, true, true]],
      ["Variações (tamanho, cor, modelo)", [false, false, true]],
      ["Selos de promoção e novidade", [false, false, true]],
      ["Rodadas de ajustes", ["1", "2", "3"]],
    ],
  },
};

// "1497" -> "1.497,00"
const fmtPreco = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Checkout da Kiwify do plano (a página de pagamento mostra o plano e o preço)
const linkPlano = (id, p) => CONFIG.checkout[id][p.nivel];

// WhatsApp com a categoria, o nível e o preço já na mensagem (para quem quer conversar antes de pagar)
const linkConversa = (cat, p) => {
  const msg = `Olá, NEOM! Tenho uma dúvida sobre o plano ${p.nivel} de ${cat.nome} (R$ ${fmtPreco(p.preco)}).`;
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
};

{
  const alvo = document.getElementById("precos");
  if (alvo) {
    const tabs = [...document.querySelectorAll(".cat-tab")];
    const ind = document.querySelector(".cat-ind");
    const intro = document.getElementById("cat-intro");
    const cmp = document.getElementById("comparar");
    const cmpTitulo = document.getElementById("cmp-titulo");
    let atual = null;

    const moveInd = () => {
      const on = tabs.find((t) => t.dataset.cat === atual);
      if (!on) return;
      ind.style.width = on.offsetWidth + "px";
      ind.style.transform = `translateX(${on.offsetLeft}px)`;
    };

    const celula = (v) =>
      v === true ? '<span class="sim"><span aria-hidden="true">✓</span><span class="sr-only">Incluído</span></span>'
      : v === false ? '<span class="nao"><span aria-hidden="true">—</span><span class="sr-only">Não incluído</span></span>'
      : v;

    const render = (id, animar) => {
      const cat = PRECOS[id];
      atual = id;
      tabs.forEach((t) => {
        const on = t.dataset.cat === id;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
      });
      alvo.setAttribute("aria-labelledby", "tab-" + id);
      moveInd();
      intro.textContent = cat.intro;
      const premium = cat.planos[2].preco;

      alvo.innerHTML = `<h2 class="sr-only">Planos de ${cat.nome}</h2>` + cat.planos.map((p, i) => {
        const medio = i === 1, prem = i === 2;
        const [inteiro, centavos] = fmtPreco(p.preco).split(",");
        return `
        <article class="tier${medio ? " destaque" : ""}">
          ${medio ? '<span class="tier-badge">Melhor custo-benefício</span>' : ""}
          ${prem ? '<span class="tier-badge sutil">Mais completo</span>' : ""}
          <p class="tier-nivel">${p.nivel}</p>
          <h3 class="tier-titulo">${p.titulo}</h3>
          <p class="tier-preco"><span class="sr-only">R$ ${fmtPreco(p.preco)}</span><small aria-hidden="true">R$</small><b aria-hidden="true">${inteiro}</b><span aria-hidden="true">,${centavos}</span></p>
          <p class="tier-pag">pagamento único</p>
          ${medio ? `<p class="tier-ancora">R$ ${fmt(premium - p.preco)} a menos que o Premium</p>` : ""}
          <p class="tier-ideal"><strong>Ideal para</strong> ${p.ideal}</p>
          <a class="btn ${medio ? "btn-lime" : prem ? "btn-white" : "btn-ghost"} btn-block" href="${linkPlano(id, p)}" rel="noopener" aria-label="${p.cta}: plano ${p.nivel} de ${cat.nome}, R$ ${fmtPreco(p.preco)} (pagamento pela Kiwify)">${p.cta}</a>
          <a class="tier-duvida" href="${linkConversa(cat, p)}" target="_blank" rel="noopener" aria-label="Tirar dúvidas pelo WhatsApp: plano ${p.nivel} de ${cat.nome} (abre em nova aba)">Tirar dúvidas pelo WhatsApp</a>
          <p class="tier-mais">${i === 0 ? "O que está incluído:" : `Tudo do ${cat.planos[i - 1].nivel}, e mais:`}</p>
          <ul>${p.itens.map((t) => `<li>${t}</li>`).join("")}</ul>
        </article>`;
      }).join("");

      cmpTitulo.textContent = `Compare os planos de ${cat.nome}`;
      cmp.innerHTML = `
        <table class="cmp">
          <caption class="sr-only">Comparativo dos planos de ${cat.nome}</caption>
          <thead><tr>
            <th scope="col">Recurso</th>
            ${cat.planos.map((p, i) => `<th scope="col"${i === 1 ? ' class="col-m"' : ""}>${p.nivel} <small>R$ ${fmt(p.preco)}</small></th>`).join("")}
          </tr></thead>
          <tbody>
            ${cat.comparar.map(([nome, vals]) => `<tr><th scope="row">${nome}</th>${vals.map((v, i) => `<td${i === 1 ? ' class="col-m"' : ""}>${celula(v)}</td>`).join("")}</tr>`).join("")}
          </tbody>
          <tfoot><tr><td><span class="sr-only">Contratar</span></td>
            ${cat.planos.map((p, i) => `<td${i === 1 ? ' class="col-m"' : ""}><a class="cmp-cta" href="${linkPlano(id, p)}" rel="noopener" aria-label="${i === 1 ? "Quero este" : "Escolher"}: plano ${p.nivel} de ${cat.nome} (pagamento pela Kiwify)">${i === 1 ? "Quero este" : "Escolher"}</a></td>`).join("")}
          </tr></tfoot>
        </table>`;

      if (animar && !REDUCED) {
        alvo.classList.remove("troca");
        void alvo.offsetWidth; // reinicia a animação
        alvo.classList.add("troca");
      }
    };

    const escolher = (id, animar = true) => {
      if (!PRECOS[id] || id === atual) return;
      render(id, animar);
      history.replaceState(null, "", "?cat=" + id);
    };

    tabs.forEach((t) => t.addEventListener("click", () => escolher(t.dataset.cat)));
    // setas do teclado entre as abas
    document.querySelector(".cat-tabs").addEventListener("keydown", (e) => {
      const i = tabs.findIndex((t) => t.dataset.cat === atual);
      const alvoIdx = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (alvoIdx === undefined) return;
      e.preventDefault();
      const n = tabs[(alvoIdx + tabs.length) % tabs.length];
      escolher(n.dataset.cat);
      n.focus();
    });

    const inicial = params.get("cat") || location.hash.slice(1);
    render(PRECOS[inicial] ? inicial : "landing", true);
    addEventListener("resize", moveInd);
    if (document.fonts) document.fonts.ready.then(moveInd);
  }
}
