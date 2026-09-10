import type { Catalog, Product } from "./types";

const L = (en: string, ar: string, fr: string, es: string) => ({ en, ar, fr, es });

const COMMON_FAQS = [
  {
    en: { q: "How do I receive the system?", a: "After you confirm name and email, we send vault instructions to that inbox." },
    ar: { q: "كيف توصلني الخزنة؟", a: "بعد الاسم والإيميل، توصلك التعليمات على نفس الإيميل." },
    fr: { q: "Comment je reçois le système ?", a: "Après nom et e-mail, les instructions du coffre arrivent dans cette boîte." },
    es: { q: "¿Cómo recibo el sistema?", a: "Tras nombre y email, enviamos las instrucciones del vault a esa bandeja." },
  },
  {
    en: { q: "Is this a PDF dump?", a: "No. Each SKU is a sequenced operating system with a start-here and a studio serial." },
    ar: { q: "هذا PDF مرمي؟", a: "لا. كل منتج نظام مرتّب، فيه start-here، وعليه رقم استوديو." },
    fr: { q: "C’est un dump de PDF ?", a: "Non. Chaque SKU est un système séquencé, avec un start-here et un numéro de studio." },
    es: { q: "¿Es un dump de PDFs?", a: "No. Cada SKU es un sistema secuenciado, con start-here y número de estudio." },
  },
  {
    en: { q: "Can I use this for a team?", a: "Personal license is for you. Duo is two people. No redistribution." },
    ar: { q: "أقدر أعطيه للفريق؟", a: "الرخصة الشخصية لك. الثنائية لشخصين. بدون إعادة نشر." },
    fr: { q: "Pour une équipe ?", a: "Licence perso = vous. Duo = deux personnes. Pas de redistribution." },
    es: { q: "¿Para un equipo?", a: "Licencia personal = tú. Dúo = dos personas. Sin redistribución." },
  },
  {
    en: { q: "Do you ship physical goods?", a: "No. Worldwide digital only." },
    ar: { q: "في شحن؟", a: "لا. رقمي لكل العالم." },
    fr: { q: "Livraison physique ?", a: "Non. 100 % numérique, monde entier." },
    es: { q: "¿Envío físico?", a: "No. Solo digital, en todo el mundo." },
  },
  {
    en: { q: "Why $19 if it’s premium?", a: "The door is $19. The house is the pair, the cart, the vault." },
    ar: { q: "ليش 19$ وهو فخم؟", a: "الباب 19$. الدار هي الثنائية والخزنة." },
    fr: { q: "Pourquoi 19 $ si c’est premium ?", a: "La porte est à 19 $. La maison, c’est le duo, le panier, le vault." },
    es: { q: "¿Por qué 19 $ si es premium?", a: "La puerta es 19 $. La casa es el dúo, el carrito, el vault." },
  },
  {
    en: { q: "Refunds?", a: "7 days if the vault files are wrong or won’t open." },
    ar: { q: "استرجاع؟", a: "7 أيام إذا الملفات غلط أو ما تنفتح." },
    fr: { q: "Remboursement ?", a: "7 jours si les fichiers du coffre sont faux ou ne s’ouvrent pas." },
    es: { q: "¿Reembolso?", a: "7 días si los archivos del vault están mal o no abren." },
  },
];

const GOVERNANCE_FAQS = [
  {
    en: { q: "Is this an EU AI Act certificate or legal advice?", a: "No. It is a fill-in operating pack: register, policy, training log, evidence tree, buyer one-pager. High-risk hiring, credit, or biometric engines still need counsel. We do not sell a stamp." },
    ar: { q: "هذا شهادة قانون الذكاء الأوروبي أو استشارة قانونية؟", a: "لا. هذه عدة تشغيل تتعبّى: سجل، سياسة، سجل تدريب، مجلد إثبات، ورقة للمشتري. ما نبيع ختم." },
    fr: { q: "C’est un certificat AI Act ou un avis juridique ?", a: "Non. C’est un pack à remplir. Pas un tampon. Les moteurs RH/crédit/biométrie à haut risque exigent un conseil." },
    es: { q: "¿Es un certificado de la AI Act o asesoría legal?", a: "No. Es un pack para rellenar. No vendemos un sello. Hiring/crédito/biometría de alto riesgo siguen necesitando abogado." },
  },
  {
    en: { q: "Who is the license for?", a: "One organisation, internal use. Duo is two organisations (HQ + entity, or you + one client you implement for). No resale." },
    ar: { q: "الرخصة لمن؟", a: "منظمة واحدة، استخدام داخلي. الثنائية = منظمتين. بدون إعادة بيع." },
    fr: { q: "Pour qui est la licence ?", a: "Une organisation, usage interne. Duo = deux organisations. Pas de revente." },
    es: { q: "¿Para quién es la licencia?", a: "Una organización, uso interno. Dúo = dos organizaciones. Sin reventa." },
  },
  {
    en: { q: "How fast can we use it?", a: "Ninety minutes to a usable internal pack if you follow START-HERE in order. One working day to a one-pager you can email a buyer." },
    ar: { q: "بسرعة نقدر نستخدمه؟", a: "90 دقيقة لحزمة داخلية إذا مشيت START-HERE. يوم عمل لورقة للمشتري." },
    fr: { q: "En combien de temps on l’installe ?", a: "90 minutes pour un pack interne. Un jour ouvré pour un one-pager acheteur." },
    es: { q: "¿En cuánto se instala?", a: "90 minutos para un pack interno. Un día laborable para un one-pager al comprador." },
  },
  {
    en: { q: "What if we already use ChatGPT unofficially?", a: "That is the default. The shadow-AI survey and register exist to list unofficial tools, classify data, and pause what must not see client or special data." },
    ar: { q: "إذا أصلاً نستخدم ChatGPT بدون إذن؟", a: "هذا الوضع الطبيعي. الاستبيان والسجل يعدّون الأدوات غير الرسمية ويصنفون البيانات." },
    fr: { q: "Et si ChatGPT est déjà utilisé en cachette ?", a: "C’est le cas par défaut. Le sondage et le registre listent les outils officieux." },
    es: { q: "¿Y si ya usamos ChatGPT extraoficialmente?", a: "Es el caso por defecto. La encuesta y el registro listan lo no oficial." },
  },
  {
    en: { q: "Why $297 instead of a $19 prompt pack?", a: "A prompt pack does not survive a buyer questionnaire. This is an evidence pack. Counsel memos often start near $1,500. A GRC seat is thousands a year. $297 is one organisation — not a fake strike price on a thin PDF." },
    ar: { q: "ليش 297$ مو باك برومبت بـ19$؟", a: "البرومبت ما ينفع قدام استبيان مشتري. مذكرة محامي غالباً تبدأ قرب 1500$. 297$ لمنظمة واحدة." },
    fr: { q: "Pourquoi 297 $ et pas un pack de prompts à 19 $ ?", a: "Un pack de prompts ne survit pas à un questionnaire acheteur. Un mémo d’avocat commence souvent vers 1 500 $." },
    es: { q: "¿Por qué 297 $ y no un pack de prompts a 19 $?", a: "Un pack de prompts no sobrevive un cuestionario. Un memo legal suele empezar cerca de 1.500 $." },
  },
  {
    en: { q: "How do I receive the files?", a: "After name and email, we open the vault for this SKU. Instant zip. Add hello@digi-world.online so the mail doesn’t die in spam." },
    ar: { q: "كيف توصلني الملفات؟", a: "بعد الاسم والإيميل نفتح الخزنة. ملف مضغوط فوري." },
    fr: { q: "Comment je reçois les fichiers ?", a: "Après nom et e-mail, le coffre de ce SKU s’ouvre. Zip instantané." },
    es: { q: "¿Cómo recibo los archivos?", a: "Tras nombre y email, abrimos el vault. Zip instantáneo." },
  },
  {
    en: { q: "Refunds?", a: "7 days if the zip is wrong or won’t open. We never sold a certificate, so ‘not compliant’ is not a refund reason." },
    ar: { q: "استرجاع؟", a: "7 أيام إذا الملف غلط أو ما ينفتح. ما بعنا شهادة." },
    fr: { q: "Remboursement ?", a: "7 jours si le zip est faux ou ne s’ouvre pas. Nous n’avons jamais vendu un certificat." },
    es: { q: "¿Reembolso?", a: "7 días si el zip está mal o no abre. Nunca vendimos un certificado." },
  },
];

function p(partial: Omit<Product, "license_pool" | "licenses_issued" | "drop_label" | "faq" | "images"> & { images?: string[]; faq?: Product["faq"]; license_pool?: number }): Product {
  const images = partial.images ?? [1, 2, 3, 4].map((n) => `/images/products/${partial.slug}/0${n}.png`);
  return {
    license_pool: 500,
    licenses_issued: 0,
    drop_label: "Drop 01 — 2026",
    faq: partial.faq ?? COMMON_FAQS,
    ...partial,
    images,
  };
}

export const FALLBACK_CATALOG: Catalog = {
  drop: "Drop 01 — 2026",
  currency: "USD",
  licenses_issued: 0,
  collections: [
    { slug: "creator-lab", sort: 1, image: "/images/collections/creator-lab.png", name: L("Creator Lab", "مختبر الصانع", "Creator Lab", "Creator Lab"), sub: L("Systems for people who publish.", "أنظمة للي ينشرون.", "Des systèmes pour ceux qui publient.", "Sistemas para quienes publican.") },
    { slug: "ai-command", sort: 2, image: "/images/collections/ai-command.png", name: L("AI Command", "قيادة الذكاء", "AI Command", "AI Command"), sub: L("Operate AI like staff.", "شغّل الذكاء كموظف.", "Faites travailler l’IA comme une équipe.", "Opera la IA como si fuera tu equipo.") },
    { slug: "wealth-os", sort: 3, image: "/images/collections/wealth.png", name: L("Wealth", "الثروة", "Riqueza", "Riqueza"), sub: L("Money and time as an operator.", "الفلوس والوقت بصيغة مشغّل.", "L’argent et le temps, en opérateur.", "Dinero y tiempo, como un operador.") },
    { slug: "glow-ritual", sort: 4, image: "/images/collections/glow.png", name: L("Glow Ritual", "طقوس التوهج", "Rituel Glow", "Ritual Glow"), sub: L("Private luxury rituals.", "طقوس خاصة، شكلها غالي.", "Des rituels privés, luxe calme.", "Rituales privados, lujo silencioso.") },
    { slug: "the-vault", sort: 5, image: "/images/collections/vault.png", name: L("The Vault", "الخزنة", "La Chambre forte", "La Bóveda"), sub: L("The whole house. One key.", "الدار كاملة. مفتاح واحد.", "Toute la maison. Une clé.", "Toda la casa. Una llave.") },
  ],
  reviews: [
    { product_sku: "DW-SYS-001", locale: "en", stars: 5, title: "Finally a system, not a file", body: "I stopped collecting PDFs. This has a start-here.", display_name: "James", city_country: "LON", source: "studio_preview", verified: true },
    { product_sku: "DW-SYS-004", locale: "ar", stars: 5, title: "الذكاء صار موظف", body: "وقفت سوالف عشوائية. عندي أدوار وإيقاع.", display_name: "سارة", city_country: "RUH", source: "studio_preview", verified: true },
    { product_sku: "DW-SYS-007", locale: "fr", stars: 5, title: "Plus de dimanche zéro", body: "Le rituel tient. Ce n’est pas un carnet mignon.", display_name: "Camille", city_country: "PAR", source: "studio_preview", verified: true },
    { product_sku: "DW-SYS-002", locale: "es", stars: 5, title: "Faceless que no parece barato", body: "Un sistema con cara de estudio.", display_name: "Lucía", city_country: "MAD", source: "studio_preview", verified: true },
    { product_sku: "DW-VAULT-001", locale: "en", stars: 5, title: "The house is the product", body: "The vault is the identity.", display_name: "Omar", city_country: "DXB", source: "studio_preview", verified: true },
    { product_sku: "DW-SYS-005", locale: "en", stars: 5, title: "The offer got simple", body: "Clarity closed.", display_name: "Nina", city_country: "BER", source: "studio_preview", verified: true },
    { product_sku: "DW-SYS-009", locale: "en", stars: 5, title: "The questionnaire stopped being a fire drill", body: "The job is not a certificate. The job is a dated register and a one-pager you can send. That is what this pack is.", display_name: "Studio brief", city_country: "Ops · 12–40 people", source: "studio_preview", verified: false },
    { product_sku: "DW-SYS-009", locale: "en", stars: 5, title: "Unofficial ChatGPT was the real inventory", body: "Seven tools nobody had approved. The survey found them. The paste rule is the only day-one rule that matters.", display_name: "Studio brief", city_country: "Agency · EU buyers", source: "studio_preview", verified: false },
    { product_sku: "DW-SYS-009", locale: "ar", stars: 5, title: "ورقة للمشتري بدل ذعر في سلاك", body: "ما نحتاج ختم. نحتاج سجل مؤرّخ وسياسة صفحة واحدة. هذا اللي في العدة.", display_name: "موجز الاستوديو", city_country: "تشغيل · 5–50", source: "studio_preview", verified: false },
    { product_sku: "DW-SYS-009", locale: "fr", stars: 5, title: "Pas un tampon. Un dossier.", body: "Owner, registre, formation datée, one-pager. C’est ce qu’un acheteur peut relire un vendredi.", display_name: "Brief studio", city_country: "PME · acheteurs UE", source: "studio_preview", verified: false },
    { product_sku: "DW-SYS-009", locale: "es", stars: 5, title: "El pack que se envía, no el PDF que se esconde", body: "Inventario, clase de datos, regla de pegado, log de formación. Eso sobrevive un cuestionario.", display_name: "Brief de estudio", city_country: "Pyme · 20 personas", source: "studio_preview", verified: false },
  ],
  products: [
    p({
      sku: "DW-SYS-009",
      slug: "ai-governance-kit",
      type: "system",
      serial: "DW-SYS-009",
      collection: "ai-command",
      price_cents: 29700,
      duo_price_cents: 44700,
      upsell_sku: "ai-operator",
      upsell_price_cents: 1100,
      cross_sell: ["ai-operator", "time-command"],
      license_pool: 200,
      faq: GOVERNANCE_FAQS,
      name: L("SMB AI Governance Kit", "عدة حوكمة الذكاء للشركات", "Kit de gouvernance IA PME", "Kit de gobernanza IA para pymes"),
      sub: L("The 90-minute pack for firms that already use ChatGPT — and have nothing to show a buyer, insurer, or board.", "عدة 90 دقيقة للشركات اللي تستخدم ChatGPT، وما عندها شيء تريه المشتري أو المؤمن أو المجلس.", "Le pack 90 minutes pour les PME qui utilisent déjà ChatGPT — et n’ont rien à montrer à un acheteur.", "El pack de 90 minutos para pymes que ya usan ChatGPT — y no tienen nada que mostrar a un comprador."),
      headline: L("Look like a company that governs AI. Not like a Slack thread.", "بان كشركة تحكم ذكاءها. مو كثريد ذعر.", "Ayez l’air d’une entreprise qui gouverne l’IA. Pas d’un fil Slack de panique.", "Parece una empresa que gobierna la IA. No un hilo de pánico en Slack."),
      description: L("When a buyer asks how you govern AI, most small companies invent answers in Slack. That stall costs deals. This kit is the register, the paste rule, the training log, and the one-pager you can send the same day. It is not legal advice and not an EU AI Act certificate. It is the evidence folder a 5–50 person company can actually fill in.\n\nYou appoint an owner. You survey unofficial tools. You classify every system by data class (none / internal / client / special). Staff get a one-page rule for what may never hit a consumer chatbot. Literacy is dated. If something leaks, you know who to call in the first hour.\n\nA first counsel memo often starts near $1,500. A GRC seat is thousands a year. This license is $297 for one organisation — the operating pack, not a stamp.", "لما المشتري يسأل كيف تحكمون الذكاء، أغلب الشركات الصغيرة تخترع جواب في سلاك. هذا التأخير يكلف صفقات. هذه العدة: السجل، قاعدة اللصق، سجل التدريب، وورقة ترسلها بنفس اليوم. ليست استشارة قانونية وليست شهادة قانون الذكاء الأوروبي. هي مجلد إثبات تقدر شركة من 5 إلى 50 تتعبّيه.\n\nتعيّنون مالك. تستكشفون الأدوات غير الرسمية. تصنّفون كل نظام حسب فئة البيانات. الموظفون عندهم قاعدة صفحة واحدة. التدريب مؤرّخ. إذا صار تسريب، تعرفون من تتصلون في الساعة الأولى.\n\nمذكرة محامي غالباً تبدأ قرب 1500$. منصة حوكمة بالآلاف سنوياً. الرخصة 297$ لمنظمة واحدة — عدة تشغيل، مو ختم.", "Quand un acheteur demande comment vous gouvernez l’IA, la plupart des PME inventent une réponse sur Slack. Ce retard tue des deals. Ce kit : registre, règle de collage, journal de formation, one-pager le jour même. Pas un avis juridique. Pas un certificat AI Act. Un dossier de preuves qu’une société de 5 à 50 personnes peut vraiment remplir.\n\nVous nommez un owner. Vous sondez les outils officieux. Vous classez chaque système. Une règle d’une page. Formation datée. Première heure d’incident claire.\n\nUn mémo d’avocat commence souvent vers 1 500 $. Licence 297 $ pour une organisation.", "Cuando un comprador pregunta cómo gobiernan la IA, la mayoría de pymes inventa respuestas en Slack. Ese retraso cuesta deals. Este kit es el registro, la regla de pegado, el log de formación y el one-pager del mismo día. No es asesoría legal ni un certificado de la AI Act.\n\nNombras owner. Encuestas herramientas no oficiales. Clasificas cada sistema. Regla de una página. Formación con fecha.\n\nUn memo legal suele empezar cerca de 1.500 $. Licencia 297 $ para una organización."),
      contents: L("AI Owner appointment + deputy + RACI\nShadow-AI staff survey (8 questions)\nAI system register + classify worksheet\nAcceptable use policy + human oversight\nVendor due diligence (10 questions + email)\nLiteracy deck, 10-question quiz (pass 8/10), attendance log\nTransparency copy for bots, ads, avatars\nIncident first-hour playbook + log\nHiring caution (default: no CV-ranking AI)\nQuarterly 30-minute review\nEvidence folder map\nBuyer one-pager you can export to PDF", "تعيين مالك الذكاء + نائب + RACI\nاستبيان الذكاء غير الرسمي (8 أسئلة)\nسجل الأنظمة + ورقة تصنيف\nسياسة استخدام مقبول + إشراف بشري\nفحص مورّد (10 أسئلة + إيميل)\nشريحة تدريب، اختبار 10 أسئلة (نجاح 8/10)، حضور\nنصوص إفصاح للبوتات والإعلانات\nخطة الساعة الأولى + سجل حوادث\nتحذير التوظيف (افتراضي: لا ترتيب سير ذاتية بالذكاء)\nمراجعة ربع سنوية 30 دقيقة\nخريطة مجلد الإثبات\nورقة المشتري للتصدير PDF", "Owner IA + adjoint + RACI\nSondage shadow AI (8 questions)\nRegistre + fiche de classification\nPolitique d’usage + supervision humaine\nDue diligence vendeur (10 questions + e-mail)\nDeck, quiz 10 questions (8/10), présence\nTextes de transparence\nPlaybook première heure + journal\nCaution recrutement\nRevue trimestrielle 30 min\nCarte des preuves\nOne-pager acheteur (PDF)", "Owner de IA + suplente + RACI\nEncuesta de shadow AI (8 preguntas)\nRegistro + hoja de clasificación\nPolítica de uso + supervisión humana\nDue diligence de vendor\nDeck, quiz 10 preguntas (8/10), asistencia\nCopy de transparencia\nPlaybook primera hora + log\nCautela de hiring\nRevisión trimestral 30 min\nMapa de evidencia\nOne-pager para el comprador (PDF)"),
    }),
    p({ sku: "DW-SYS-001", slug: "creator-os", type: "system", serial: "DW-SYS-001", collection: "creator-lab", price_cents: 1900, pair_sku: "hook-vault", pair_price_cents: 3400, upsell_sku: "faceless-studio", upsell_price_cents: 1100, cross_sell: ["hook-vault", "faceless-studio", "caption-machine"], name: L("Creator OS", "نظام الصانع", "Creator OS", "Creator OS"), sub: L("The content operating system for people who are done posting at random.", "نظام المحتوى للي تعب ينزل عشوائي.", "Le système d’exploitation du contenu.", "El sistema operativo de contenido."), headline: L("Post like a studio. Not like a mood.", "انشر كاستوديو. مو حسب مزاجك.", "Publiez comme un studio. Pas comme une humeur.", "Publica como un estudio. No como un mood."), description: L("Hooks, UGC frames, a 30-day filming map, caption OS.", "هوكس، إطارات UGC، خارطة تصوير 30 يوم.", "Hooks, cadres UGC, carte 30 jours.", "Hooks, marcos UGC, mapa 30 días."), contents: L("Hook OS · UGC frames · 30-day map · Caption OS", "نظام الهوكس · UGC · 30 يوم · كابشن", "Hook OS · UGC · 30 jours · captions", "Hook OS · UGC · 30 días · captions") }),
    p({ sku: "DW-SYS-002", slug: "faceless-studio", type: "system", serial: "DW-SYS-002", collection: "creator-lab", price_cents: 1900, pair_sku: "creator-os", pair_price_cents: 3400, upsell_sku: "hook-vault", upsell_price_cents: 1100, cross_sell: ["creator-os", "hook-vault", "ad-swipe"], name: L("Faceless Studio", "استوديو بدون وجه", "Faceless Studio", "Faceless Studio"), sub: L("Build a faceless channel without looking cheap.", "قناة بدون وجه، بس شكلها استوديو.", "Une chaîne faceless qui a encore l’air chère.", "Un canal faceless que sigue viéndose caro."), headline: L("A faceless brand that still looks expensive.", "قناة بدون وجه، وشكلها غالي.", "Une marque sans visage, encore luxueuse.", "Una marca sin rostro, todavía cara."), description: L("Niche picker, script engine, CapCut SOP.", "نيتش، سكربت، كاب كت.", "Niche, scripts, SOP CapCut.", "Nicho, scripts, SOP CapCut."), contents: L("Niche · Scripts · B-roll · CapCut · Cadence", "نيتش · سكربت · لقطات · كاب كت", "Niche · scripts · B-roll · CapCut", "Nicho · scripts · B-roll · CapCut") }),
    p({ sku: "DW-SYS-003", slug: "hook-vault", type: "system", serial: "DW-SYS-003", collection: "creator-lab", price_cents: 1900, pair_sku: "caption-machine", pair_price_cents: 2700, upsell_sku: "caption-machine", upsell_price_cents: 900, cross_sell: ["creator-os", "caption-machine"], name: L("Hook Vault", "خزنة الهوكس", "Hook Vault", "Hook Vault"), sub: L("1,200 hooks sorted by platform and emotion.", "1,200 هوك مصنّفة حسب المنصة والإحساس.", "1 200 hooks classés par plateforme et émotion.", "1.200 hooks por plataforma y emoción."), headline: L("Open with a line they can’t scroll past.", "ابدأ بجملة ما يقدرون يتجاوزونها.", "Ouvrez avec une phrase qu’on ne peut pas scroller.", "Abre con una línea que no pueden scrollear."), description: L("TikTok / Snap / Reels / YouTube hooks.", "هوكس تيك توك وسناب وريلز.", "Hooks TikTok / Snap / Reels.", "Hooks TikTok / Snap / Reels."), contents: L("1,200 hooks · Platform packs · AR + EN", "1200 هوك · حسب المنصة", "1 200 hooks · packs", "1.200 hooks · packs") }),
    p({ sku: "DW-SYS-004", slug: "ai-operator", type: "system", serial: "DW-SYS-004", collection: "ai-command", price_cents: 1900, pair_sku: "offer-engine", pair_price_cents: 3400, upsell_sku: "offer-engine", upsell_price_cents: 1100, cross_sell: ["offer-engine", "time-command"], name: L("AI Operator", "مشغّل الذكاء", "AI Operator", "AI Operator"), sub: L("Stop chatting. Start operating AI like staff.", "وقف سوالف مع الشات. شغّل الذكاء كأنه موظف.", "Arrêtez de discuter. Faites travailler l’IA comme du staff.", "Deja de chatear. Opera la IA como personal."), headline: L("Make AI behave like staff.", "خلّ الذكاء يشتغل كموظف.", "Faites se comporter l’IA comme une équipe.", "Haz que la IA se comporte como tu equipo."), description: L("Role briefs, quality gates, weekly cadence. Not 5000 prompts.", "أدوار، جودة، إيقاع. مو 5000 برومبت.", "Rôles, qualité, cadence. Pas 5000 prompts.", "Roles, calidad, cadencia. No 5000 prompts."), contents: L("Roles · Quality gates · Cadence · Agents", "أدوار · جودة · إيقاع · وكلاء", "Rôles · qualité · cadence", "Roles · calidad · cadencia") }),
    p({ sku: "DW-SYS-005", slug: "offer-engine", type: "system", serial: "DW-SYS-005", collection: "ai-command", price_cents: 1900, pair_sku: "ai-operator", pair_price_cents: 3400, upsell_sku: "ai-operator", upsell_price_cents: 1100, cross_sell: ["ai-operator", "creator-os"], name: L("Offer Engine", "محرّك العرض", "Offer Engine", "Offer Engine"), sub: L("Price, stack, and say the offer so people stop thinking about it.", "تسعّر، تركّب، وتقول العرض.", "Prix, stack, phrase d’offre.", "Precio, stack y frase de oferta."), headline: L("An offer so clear, “I’ll think about it” dies.", "عرض واضح، جملة “بفكر” تموت.", "Une offre si claire que “je vais réfléchir” meurt.", "Una oferta tan clara que “lo pienso” muere."), description: L("Offer architecture, ladders, objections, DM close.", "معمار العرض، سلالم، اعتراضات.", "Architecture d’offre, échelles, objections.", "Arquitectura de oferta, escaleras, objeciones."), contents: L("Architecture · Stack · Ladders · Close", "معمار · ستاك · أسعار · إغلاق", "Architecture · stack · close", "Arquitectura · stack · cierre") }),
    p({ sku: "DW-SYS-006", slug: "wealth-os", type: "system", serial: "DW-SYS-006", collection: "wealth-os", price_cents: 1900, pair_sku: "time-command", pair_price_cents: 3400, upsell_sku: "offer-engine", upsell_price_cents: 1100, cross_sell: ["offer-engine", "time-command"], name: L("Wealth OS", "نظام الثروة", "Wealth OS", "Wealth OS"), sub: L("See your money like an operator, not a panicked spreadsheet.", "فلوسك بصيغة مشغّل، مو إكسل خوف.", "Voir l’argent en opérateur.", "Ver tu dinero como operador."), headline: L("Know where your money actually goes.", "اعرف فلوسك رايحة وين.", "Sachez où va vraiment votre argent.", "Sabe a dónde se va tu dinero."), description: L("Income streams, spend OS, net-worth pulse, 90-day map.", "دخل، صرف، صافي، 90 يوم.", "Revenus, dépenses, 90 jours.", "Ingresos, gasto, 90 días."), contents: L("Income · Spend · Net worth · 90 days", "دخل · صرف · صافي · 90 يوم", "Revenus · dépenses · 90 jours", "Ingresos · gasto · 90 días") }),
    p({ sku: "DW-SYS-007", slug: "glow-ritual", type: "system", serial: "DW-SYS-007", collection: "glow-ritual", price_cents: 1900, pair_sku: "time-command", pair_price_cents: 3400, upsell_sku: "time-command", upsell_price_cents: 1100, cross_sell: ["time-command"], gender: "feminine", name: L("Glow Ritual", "طقوس التوهج", "Rituel Glow", "Ritual Glow"), sub: L("A private ritual so you stop restarting every Sunday.", "طقس خاص، عشان توقفين تبدأين من صفر كل أحد.", "Un rituel privé pour arrêter de tout recommencer le dimanche.", "Un ritual privado para dejar de reiniciar cada domingo."), headline: L("Become the woman who doesn’t restart.", "صيري اللي ما تبدأ من صفر.", "Devenez celle qui ne recommence plus.", "Conviértete en la que ya no reinicia."), description: L("AM/PM ritual, tracks, photo log, 21-day install.", "صباح ومساء، تتبع، 21 يوم.", "Rituel AM/PM, 21 jours.", "Ritual AM/PM, 21 días."), contents: L("AM/PM · Tracks · Photo log · 21 days", "صباح/مساء · تتبع · 21 يوم", "AM/PM · 21 jours", "AM/PM · 21 días") }),
    p({ sku: "DW-SYS-008", slug: "time-command", type: "system", serial: "DW-SYS-008", collection: "wealth-os", price_cents: 1900, pair_sku: "wealth-os", pair_price_cents: 3400, upsell_sku: "wealth-os", upsell_price_cents: 1100, cross_sell: ["wealth-os", "ai-operator"], name: L("Time Command", "قيادة الوقت", "Time Command", "Time Command"), sub: L("Attention OS for people whose calendar is lying to them.", "نظام انتباه للي أجندته تكذب عليه.", "OS attention pour ceux dont le calendrier ment.", "OS de atención para quien su calendario le miente."), headline: L("Take your hours back from your own phone.", "خذ ساعاتك من جوالك.", "Reprenez vos heures à votre téléphone.", "Recupera tus horas de tu propio teléfono."), description: L("Deep-work blocks, weekly command, shutdown ritual.", "بلوكات عمق، قيادة أسبوعية، إغلاق.", "Deep work, commande hebdo, shutdown.", "Deep work, mando semanal, cierre."), contents: L("Deep work · Weekly · Shutdown", "عمق · أسبوع · إغلاق", "Deep work · semaine", "Deep work · semana") }),
    p({ sku: "DW-ADD-001", slug: "caption-machine", type: "addon", collection: "creator-lab", price_cents: 1200, upsell_sku: "hook-vault", upsell_price_cents: 1100, cross_sell: ["hook-vault", "creator-os"], name: L("Caption Machine", "مكينة الكابشنز", "Caption Machine", "Caption Machine"), sub: L("Captions that hold the hook.", "كابشن يمسك الهوك.", "Des légendes qui tiennent le hook.", "Captions que sostienen el hook."), headline: L("Finish the first line.", "كمّل أول سطر.", "Finissez la première ligne.", "Termina la primera línea."), description: L("Platform caption OS.", "نظام كابشن.", "OS légendes.", "OS de captions."), contents: L("Frames · CTAs · Variants", "إطارات · CTA", "Cadres · CTA", "Marcos · CTA") }),
    p({ sku: "DW-ADD-002", slug: "ad-swipe", type: "addon", collection: "creator-lab", price_cents: 1200, upsell_sku: "faceless-studio", upsell_price_cents: 1100, cross_sell: ["faceless-studio", "offer-engine"], name: L("Ad Creative Swipe", "سوايپ الإعلان", "Ad Creative Swipe", "Ad Creative Swipe"), sub: L("Angles that already paid.", "زوايا دفعوا قبل.", "Des angles qui ont déjà payé.", "Ángulos que ya pagaron."), headline: L("Steal the structure, not the face.", "خذ البنية، مو الوجه.", "Volez la structure, pas le visage.", "Roba la estructura, no la cara."), description: L("Ad structures for Snap/TikTok.", "بنية إعلان لسناب وتيك توك.", "Structures pub Snap/TikTok.", "Estructuras Snap/TikTok."), contents: L("Hook · Body · Proof · CTA", "هوك · جسم · إثبات", "Hook · corps · preuve", "Hook · cuerpo · prueba") }),
    p({ sku: "DW-ADD-003", slug: "launch-sprint", type: "addon", collection: "ai-command", price_cents: 1200, upsell_sku: "offer-engine", upsell_price_cents: 1100, cross_sell: ["offer-engine", "creator-os"], name: L("30-Day Launch Sprint", "سباق الإطلاق 30 يوم", "Sprint 30 jours", "Sprint 30 días"), sub: L("Install the system in 30 days.", "تركّب النظام في 30 يوم.", "Installez le système en 30 jours.", "Instala el sistema en 30 días."), headline: L("A calendar that actually closes.", "تقويم يقفل شغل.", "Un calendrier qui clôture vraiment.", "Un calendario que sí cierra."), description: L("Day-by-day launch map.", "خارطة إطلاق يوم بيوم.", "Carte jour par jour.", "Mapa día a día."), contents: L("30-day map · Tasks · Gates", "30 يوم · مهام", "30 jours · tâches", "30 días · tareas") }),
    p({ sku: "DW-VAULT-001", slug: "the-vault", type: "vault", serial: "DW-VAULT-001", collection: "the-vault", price_cents: 9700, compare_cents: 18800, duo_price_cents: 14900, upsell_sku: null, upsell_price_cents: 6700, cross_sell: [], includes: ["DW-SYS-001", "DW-SYS-002", "DW-SYS-003", "DW-SYS-004", "DW-SYS-005", "DW-SYS-006", "DW-SYS-007", "DW-SYS-008", "DW-ADD-001", "DW-ADD-002", "DW-ADD-003"], name: L("The Digi World Vault", "خزنة Digi World", "Le Vault Digi World", "El Vault Digi World"), sub: L("All 8 systems + 3 add-ons. One key.", "كل الأنظمة والإضافات. مفتاح واحد.", "Les 8 systèmes + 3 add-ons. Une clé.", "Los 8 sistemas + 3 add-ons. Una llave."), headline: L("The house. Every system. One key.", "الدار كاملة. مفتاح واحد.", "La maison. Tous les systèmes. Une clé.", "La casa. Todos los sistemas. Una llave."), description: L("The complete Digi World house in one vault license.", "دار Digi World كاملة برخصة واحدة.", "Toute la maison Digi World.", "Toda la casa Digi World."), contents: L("8 systems · 3 add-ons · Instant vault", "8 أنظمة · 3 إضافات", "8 systèmes · 3 add-ons", "8 sistemas · 3 add-ons") }),
  ],
};
