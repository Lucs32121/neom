/* ============================================================
   NEOM — CONFIGURAÇÃO (edite só este bloco)
   ============================================================ */
const CONFIG = {
  // Seu WhatsApp com DDI + DDD, só números. Ex.: "5511999999999"
  whatsapp: "5583994054176",

  // Links de checkout da Kiwify para cada plano.
  // Se algum ficar vazio, o botão daquele plano leva para a página de contato.
  checkout: {
    landing: "https://pay.kiwify.com.br/33Eo46c",
    institucional: "https://pay.kiwify.com.br/4EFHuvu",
    catalogo: "https://pay.kiwify.com.br/cTDUkET",
  },
};
/* ============================================================ */

const PLANOS = {
  landing: {
    nome: "Landing Page",
    preco: 227,
    porque: "Você tem uma oferta clara e precisa de uma página única, direta, feita para transformar visitantes em contatos e vendas.",
  },
  institucional: {
    nome: "Site Institucional",
    preco: 447,
    porque: "Seu negócio precisa de presença e credibilidade: um site com várias páginas para apresentar a empresa, os serviços e os canais de contato.",
  },
  catalogo: {
    nome: "Site de Catálogo",
    preco: 1229,
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
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
  tick();
}

/* ---------- Luz que segue o cursor ---------- */
if (FINE && !REDUCED) {
  const g = document.createElement("div");
  g.className = "cursor-glow";
  document.body.prepend(g);
  let gx = innerWidth / 2, gy = innerHeight / 2;
  const move = () => {
    gx += (mouse.x - gx) * 0.12; gy += (mouse.y - gy) * 0.12;
    g.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(move);
  };
  move();
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
  upd();
}

/* ---------- Revelar elementos ao rolar ---------- */
{
  const alvos = document.querySelectorAll(
    ".hero .tag, .hero h1, .hero .lead, .hero-actions, .mock-wrap, .sec-head, .page-head .tag, .page-head h1, .page-head .lead, " +
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

/* ---------- Cilindro de planos: a rolagem vertical gira os cards na horizontal ---------- */
{
  const sec = document.getElementById("cyl");
  if (sec && !REDUCED) {
    const sticky = sec.querySelector(".cyl-sticky");
    const stage = sec.querySelector(".cyl-stage");
    const cyl = sec.querySelector(".cyl");
    const items = [...sec.querySelectorAll(".cyl-item")];
    const dots = [...sec.querySelectorAll(".cyl-dot")];
    const ui = sec.querySelector(".cyl-ui");
    const nav = document.querySelector(".nav");
    const N = items.length, STEP = 40;
    let cw = 340, R = 544, target = 0, cur = 0;
    sec.classList.add("cyl-on");

    const measure = () => {
      cw = Math.min(340, innerWidth * 0.78);
      R = cw * 1.6;
      cyl.style.setProperty("--cw", cw + "px");
      cyl.style.setProperty("--ch", "auto");
      cyl.style.setProperty("--fit", 1);
      const ch = Math.max(...items.map((i) => i.offsetHeight));
      cyl.style.setProperty("--ch", ch + "px");
      const livre = sticky.clientHeight - ui.offsetHeight - 70;
      cyl.style.setProperty("--fit", Math.min(1, livre / ch));
      items.forEach((it, i) => { it.style.transform = `rotateY(${i * STEP}deg) translateZ(${R}px)`; });
    };

    const faixa = () => sec.offsetHeight - sticky.offsetHeight;
    const topo = () => scrollY + sec.getBoundingClientRect().top - nav.offsetHeight; // scrollY em que o cilindro começa a girar
    const ease = (f) => (f < 0.3 ? 0 : f > 0.7 ? 1 : ((s) => s * s * (3 - 2 * s))((f - 0.3) / 0.4)); // pausa em cada plano

    const update = () => {
      const p = Math.max(0, Math.min(1, (scrollY - topo()) / faixa()));
      const t = p * (N - 1), b = Math.min(Math.floor(t), N - 2);
      target = b + ease(t - b);
    };
    const irPara = (i, comportamento = "smooth") => {
      i = Math.max(0, Math.min(N - 1, i));
      scrollTo({ top: topo() + (i / (N - 1)) * faixa() + 1, behavior: comportamento });
    };

    const render = () => {
      cur += (target - cur) * 0.11;
      if (Math.abs(target - cur) < 0.001) cur = target;
      cyl.style.transform = `translateZ(${-R}px) rotateY(${-cur * STEP}deg)`;
      items.forEach((it, i) => {
        const d = Math.min(Math.abs(i - cur), 1);
        it.style.opacity = 1 - d * 0.62;
        it.style.pointerEvents = d < 0.5 ? "auto" : "none";
      });
      const ativo = Math.round(cur);
      dots.forEach((d, i) => d.classList.toggle("on", i === ativo));
      requestAnimationFrame(render);
    };

    measure(); update(); cur = target; render();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", () => { measure(); update(); });
    addEventListener("load", () => { measure(); update(); });

    dots.forEach((d) => d.addEventListener("click", () => irPara(+d.dataset.i)));
    sec.querySelectorAll(".cyl-arrow").forEach((a) => a.addEventListener("click", () => irPara(Math.round(target) + +a.dataset.dir)));
    addEventListener("keydown", (e) => {
      const r = sec.getBoundingClientRect();
      if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5 || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); irPara(Math.round(target) + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); irPara(Math.round(target) - 1); }
    });

    // gesto horizontal (trackpad) também gira
    sec.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); scrollBy({ top: e.deltaX, behavior: "instant" }); }
    }, { passive: false });

    // arrastar com mouse/dedo gira o cilindro
    let ini = null, arrastou = false;
    stage.addEventListener("pointerdown", (e) => { ini = { x: e.clientX, id: e.pointerId }; arrastou = false; });
    stage.addEventListener("pointermove", (e) => {
      if (!ini) return;
      const dx = e.clientX - ini.x;
      if (!arrastou && Math.abs(dx) > 8) { arrastou = true; stage.classList.add("drag"); stage.setPointerCapture(ini.id); }
      if (arrastou) {
        scrollBy({ top: -dx * (faixa() / (N - 1) / (cw * 0.9)), behavior: "instant" });
        ini.x = e.clientX;
      }
    });
    const fim = () => { ini = null; stage.classList.remove("drag"); };
    stage.addEventListener("pointerup", fim);
    stage.addEventListener("pointercancel", fim);
    stage.addEventListener("click", (e) => { if (arrastou) { e.preventDefault(); e.stopPropagation(); arrastou = false; } }, true);
  }
}

/* ============================================================
   FUNCIONALIDADES
   ============================================================ */

/* ---------- Botão "Fale conosco": abre direto o WhatsApp ---------- */
document.querySelectorAll("a[data-whats]").forEach((a) => {
  if (!CONFIG.whatsapp) return; // sem número configurado, o botão leva à página de contato
  a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Olá, NEOM! Vim pelo site e gostaria de falar com vocês.");
});

/* ---------- Botões de plano: checkout Kiwify ou contato ---------- */
document.querySelectorAll("a[data-plano]").forEach((a) => {
  const p = a.dataset.plano;
  a.href = CONFIG.checkout[p] || "obrigado.html?contato=" + p;
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
    <div class="progress" aria-hidden="true"><i></i></div>
    <p class="quiz-count" aria-live="polite"></p>
    <div class="q-view"><div class="q-track">
      ${PERGUNTAS.map((p, k) => `
        <div class="q-slide" data-k="${k}"><div class="q-block">
          <h2>${p.q}</h2>
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
  const bar = quizEl.querySelector(".progress i");
  const count = quizEl.querySelector(".quiz-count");

  // a altura inclui a folga (padding) do contêiner, que deixa o brilho neon aparecer
  const ajusta = () => {
    const cs = getComputedStyle(view);
    view.style.height = slides[idx].offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + "px";
  };

  // Desliza a trilha para o bloco n, como um scroll automático para o lado
  const ir = (n) => {
    idx = n;
    track.style.transform = `translateX(${-n * 100}%)`;
    slides.forEach((s, k) => { s.classList.toggle("active", k === n); s.inert = k !== n; });
    bar.style.width = (Math.min(n, N) / N) * 100 + "%";
    count.textContent = n < N ? `Pergunta ${n + 1} de ${N}` : "Resultado";
    ajusta();
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
    const link = CONFIG.checkout[id] || "obrigado.html?contato=" + id;
    final = pl.preco;
    quizEl.querySelector("#q-resultado").innerHTML = `
      <span class="tag">Seu site ideal</span>
      <h2><span class="lime">${pl.nome}</span></h2>
      <p>${pl.porque}</p>
      <div class="preco"><small>R$</small><span data-final>0</span></div>
      <div class="hero-actions">
        <a class="btn btn-lime" href="${link}">Quero esse site</a>
        <a class="btn btn-ghost" href="planos.html">Ver todos os planos</a>
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
        ir(k + 1);
        travado = false;
      }, REDUCED ? 0 : 420);
      return;
    }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.dataset.act === "voltar") ir(idx - 1);
    if (b.dataset.act === "refazer") {
      respostas.length = 0;
      quizEl.querySelectorAll(".opcao.sel").forEach((o) => o.classList.remove("sel"));
      ir(0);
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
    const d = new FormData(form);
    const linhas = [
      modo === "obrigado" ? "Olá, NEOM! Acabei de comprar meu site." : "Olá, NEOM! Quero um site.",
      "",
      "*Nome:* " + d.get("nome"),
      "*WhatsApp:* " + d.get("telefone"),
      "*E-mail:* " + d.get("email"),
      "*Negócio:* " + d.get("negocio"),
      "*Plano:* " + d.get("plano"),
    ];
    if (d.get("mensagem")) linhas.push("", "*Sobre o projeto:* " + d.get("mensagem"));
    const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(linhas.join("\n"));
    const r = form.querySelector("button[type=submit]").getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 70);
    window.open(url, "_blank", "noopener");
    document.getElementById("form-nota").textContent =
      "Abrimos o WhatsApp com sua mensagem pronta. É só enviar por lá.";
  });
}
