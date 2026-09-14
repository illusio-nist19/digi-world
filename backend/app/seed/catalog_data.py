from __future__ import annotations

T = dict[str, str]


def t(en: str, ar: str, fr: str, es: str) -> T:
    return {"en": en, "ar": ar, "fr": fr, "es": es}


COLLECTIONS = [
    {
        "slug": "creator-lab",
        "sort": 1,
        "image": "/images/collections/creator-lab.png",
        "name": t("Creator Lab", "مختبر الصانع", "Creator Lab", "Creator Lab"),
        "sub": t(
            "Systems for people who publish.",
            "أنظمة للي ينشرون.",
            "Des systèmes pour ceux qui publient.",
            "Sistemas para quienes publican.",
        ),
    },
    {
        "slug": "ai-command",
        "sort": 2,
        "image": "/images/collections/ai-command.png",
        "name": t("AI Command", "قيادة الذكاء", "AI Command", "AI Command"),
        "sub": t(
            "Operate AI like staff.",
            "شغّل الذكاء كموظف.",
            "Faites travailler l’IA comme une équipe.",
            "Opera la IA como si fuera tu equipo.",
        ),
    },
    {
        "slug": "wealth-os",
        "sort": 3,
        "image": "/images/collections/wealth.png",
        "name": t("Wealth", "الثروة", "Riqueza", "Riqueza"),
        "sub": t(
            "Money and time as an operator.",
            "الفلوس والوقت بصيغة مشغّل.",
            "L’argent et le temps, en opérateur.",
            "Dinero y tiempo, como un operador.",
        ),
    },
    {
        "slug": "glow-ritual",
        "sort": 4,
        "image": "/images/collections/glow.png",
        "name": t("Glow Ritual", "طقوس التوهج", "Rituel Glow", "Ritual Glow"),
        "sub": t(
            "Private luxury rituals.",
            "طقوس خاصة، شكلها غالي.",
            "Des rituels privés, luxe calme.",
            "Rituales privados, lujo silencioso.",
        ),
    },
    {
        "slug": "the-vault",
        "sort": 5,
        "image": "/images/collections/vault.png",
        "name": t("The Vault", "الخزنة", "La Chambre forte", "La Bóveda"),
        "sub": t(
            "The whole house. One key.",
            "الدار كاملة. مفتاح واحد.",
            "Toute la maison. Une clé.",
            "Toda la casa. Una llave.",
        ),
    },
]


def imgs(slug: str) -> list[str]:
    return [f"/images/products/{slug}/0{i}.png" for i in range(1, 5)]


def faq_block(en_q: str, en_a: str, ar_q: str, ar_a: str, fr_q: str, fr_a: str, es_q: str, es_a: str) -> dict:
    return {
        "en": {"q": en_q, "a": en_a},
        "ar": {"q": ar_q, "a": ar_a},
        "fr": {"q": fr_q, "a": fr_a},
        "es": {"q": es_q, "a": es_a},
    }


PHOTO_FAQS = [
    faq_block(
        "Is this a Notion template I duplicate in one click?",
        "It is a studio operating system: Notion schema, Google Sheets CSVs, a local calculator, SOPs, questionnaires, emails, and a welcome packet. START-HERE is 90 minutes. Not an empty aesthetic dashboard.",
        "هذا قالب نوشن ينسخ بضغطة؟",
        "نظام تشغيل للاستوديو: نوشن، جداول، حاسبة، إجراءات، استبيانات، إيميلات، باقة ترحيب. 90 دقيقة. مو لوحة شكل.",
        "C’est un template Notion en un clic ?",
        "Un OS de studio : Notion, CSV, calculateur, SOP, questionnaires, e-mails. 90 minutes. Pas un dashboard vide.",
        "¿Es una plantilla de Notion de un clic?",
        "Un sistema de estudio: Notion, CSV, calculadora, SOPs, emails. 90 minutos. No un tablero vacío.",
    ),
    faq_block(
        "Do I have to use Notion?",
        "No. Sheets and Notion are both first-class. Copy the CSVs into Google Sheets, or build the board from the Notion schema. Do not rebuild the databases before you set prices.",
        "لازم نوشن؟",
        "لا. الشيتس والنوشن الاثنين أساس. انسخ الـCSV أو ابنِ اللوحة من مخطط نوشن. لا تبني قواعد فاضية قبل الأسعار.",
        "Je dois utiliser Notion ?",
        "Non. Sheets et Notion sont au même niveau. Copiez les CSV, ou construisez le board. Ne reconstruisez pas les bases avant les prix.",
        "¿Tengo que usar Notion?",
        "No. Sheets y Notion van a la par. Copia los CSV o arma el tablero. No reconstruyas bases vacías antes de los precios.",
    ),
    faq_block(
        "Is this a lawyer-drafted contract or a lighting course?",
        "Neither. You get operating checklists, a retainer gate, and a service-agreement skeleton. Counsel in your country reviews the actual agreement. There is no posing or flash lesson in the zip.",
        "هذا عقد محامي أو دورة إضاءة؟",
        "ولا هذا ولا هذا. قوائم تشغيل، بوابة عربون، هيكل اتفاقية. المحامي عندك يراجع العقد. ما فيه درس بوز أو فلاش.",
        "C’est un contrat d’avocat ou un cours lumière ?",
        "Ni l’un ni l’autre. Checklists, acompte, squelette d’accord. Votre conseil relit le contrat. Pas de cours de pose.",
        "¿Es un contrato de abogado o un curso de luz?",
        "Ninguno. Listas de operación, anticipo, esqueleto de acuerdo. Tu abogado revisa el contrato. No hay clase de pose.",
    ),
    faq_block(
        "What is the difference from the Etsy pack?",
        "Etsy is the $49 cousin: inquiry desk, Notion/Sheets, HTML OS. This site zip is the full studio vault — serial DW-SYS-010, duo seats, production and money SOPs, calculator, welcome packet. We do not dump the vault on Etsy.",
        "وش الفرق عن باقة إتسي؟",
        "إتسي ابن عم بـ49$: مكتب استفسار، نوشن/شيتس، نظام HTML. هنا الخزنة كاملة — رقم DW-SYS-010، مقعدين، إنتاج ومال، حاسبة، باقة ترحيب. ما نرمي الخزنة على إتسي.",
        "Quelle différence avec Etsy ?",
        "Etsy est le cousin à 49 $ : inquiry, Notion/Sheets, OS HTML. Ici, le vault complet — serial DW-SYS-010, duo, SOP production et argent. On ne brade pas le vault sur Etsy.",
        "¿Qué cambia frente a Etsy?",
        "Etsy es el primo a 49 $: inquiry, Notion/Sheets, OS HTML. Aquí está el vault completo — serial DW-SYS-010, dúo, SOPs de producción y dinero. No tiramos el vault en Etsy.",
    ),
    faq_block(
        "How many seats? Can I resell it?",
        "One studio is $129. Two seats (you + second shooter or partner) is $199. Personal install only. No redistribution, no Etsy dump of this zip.",
        "كم مقعد؟ أقدر أبيعه؟",
        "استوديو واحد 129$. مقعدين (أنت + مصور ثاني أو شريك) 199$. تركيب شخصي. بدون إعادة نشر، وبدون رمي هذا الزيب على إتسي.",
        "Combien de sièges ? Je peux le revendre ?",
        "Un studio = 129 $. Deux sièges = 199 $. Install perso. Pas de redistribution, pas de dump Etsy de ce zip.",
        "¿Cuántos asientos? ¿Puedo revenderlo?",
        "Un estudio = 129 $. Dos asientos = 199 $. Instalación personal. Sin reventa ni dump en Etsy de este zip.",
    ),
    faq_block(
        "How do I get the files? Refund?",
        "After name and email, the thank-you page has the zip. We also email that inbox. 7-day replacement if the zip is corrupt or will not open. We never sold a certificate.",
        "كيف يوصلني الملف؟ استرجاع؟",
        "بعد الاسم والإيميل، صفحة الشكر فيها الزيب. ونراسل نفس الإيميل. استبدال 7 أيام إذا الملف خربان أو ما ينفتح. ما بعنا شهادة.",
        "Comment je reçois les fichiers ? Remboursement ?",
        "Après nom et e-mail, la page merci a le zip. 7 jours si le zip est corrompu. On n’a jamais vendu un certificat.",
        "¿Cómo recibo los archivos? ¿Reembolso?",
        "Tras nombre y email, la página de gracias tiene el zip. 7 días si el zip está mal o no abre. Nunca vendimos un certificado.",
    ),
]


PRODUCTS = [
    {
        "sku": "DW-SYS-010",
        "slug": "photographer-os",
        "collection": "creator-lab",
        "type": "system",
        "serial": "DW-SYS-010",
        "price_cents": 12900,
        "duo_price_cents": 19900,
        "cross_sell": [],
        "license_pool": 250,
        "sort": 0,
        "name": t(
            "Photographer Client Studio",
            "استوديو عملاء المصور",
            "Studio client photographe",
            "Estudio de clientes para fotógrafos",
        ),
        "headline": t(
            "A Saturday is inventory. Stop leaking it.",
            "السبت مخزون. وقف تسرّبه.",
            "Un samedi est un stock. Arrêtez de le brader.",
            "Un sábado es inventario. Deja de regalarlo.",
        ),
        "sub": t(
            "The 90-minute desk for wedding and commercial photographers who leak jobs in DMs and hours in ‘unlimited’ galleries.",
            "مكتب 90 دقيقة لمصوري الأعراس والتجاري اللي يضيّعون الشغل في الخاص والساعات في معارض «بدون حد».",
            "Le bureau 90 minutes pour photographes mariage et commercial qui perdent les jobs en DM et les heures en galeries « illimitées ».",
            "El escritorio de 90 minutos para fotógrafos de boda y comercial que pierden trabajos en DMs y horas en galerías «ilimitadas».",
        ),
        "description": t(
            "This is the operating system of a photography studio that books, shoots, delivers, and collects.\n\nGeneric freelancer CRMs fail photographers because a wedding is not a logo project. Dates are inventory. Saturdays are finite. Usage rights are where commercial profit lives.\n\nInstall in order: true-hourly math → rate card → board → 15-minute inquiry → retainer gate → 15-minute formals → revision cap → paid-in-full gallery → invoices. Sheets and Notion are both first-class. The local calculator shows a bad package before you send it.",
            "هذا نظام تشغيل استوديو تصوير يحجز، يصور، يسلّم، ويحصّل.\n\nقوالب الفريلانسر العامة تفشل المصور لأن العرس مو مشروع لوقو. التواريخ مخزون. السبت محدود. حقوق الاستخدام هي ربح التجاري.\n\nركّب بالترتيب: الساعة الحقيقية → التسعيرة → اللوحة → رد 15 دقيقة → بوابة العربون → الفورمالز → حد التعديل → المعرض بعد السداد → الفواتير. الشيتس والنوشن الاثنين أساس.",
            "C’est l’OS d’un studio qui réserve, shoot, livre et encaisse.\n\nUn CRM freelance générique rate le photographe : un mariage n’est pas un logo. Les samedis sont un stock. Les droits d’usage font le profit commercial.\n\nInstaller dans l’ordre : tarif horaire réel → grille → board → réponse 15 min → acompte → formelles → plafond de retouches → galerie soldée → factures.",
            "Es el sistema de un estudio que reserva, dispara, entrega y cobra.\n\nUn CRM genérico de freelance falla: una boda no es un logo. Los sábados son inventario. Los derechos de uso son el margen comercial.\n\nInstala en orden: tarifa real → lista → tablero → respuesta 15 min → anticipo → formales → tope de revisiones → galería pagada → facturas.",
        ),
        "contents": t(
            "START-HERE (90 min)\nStudio math + Monday rhythm + Notion schema\n15-minute inquiry, qualifier, objections\nPackages, usage rights, rate CSV + local calculator\nBooking SOP, questionnaires, 15-min formals, retainer gate\nWedding-day production, shot lists, second shooter\nGallery, revision cap, raws, prints\nInvoices, chase scripts, money log\nSheets boards + welcome packet + emails",
            "ابدأ من هنا (90 د)\nحساب الاستوديو + إيقاع الاثنين + مخطط نوشن\nرد 15 دقيقة، تصفية، اعتراضات\nباقات، استخدام، CSV تسعيرة + حاسبة\nحجز، استبيانات، فورمالز، عربون\nإنتاج يوم العرس، لقطات، مصور ثاني\nمعرض، حد تعديل، ملفات خام، طباعة\nفواتير، ملاحقة، سجل مال\nلوحات شيتس + باقة ترحيب + إيميلات",
            "START-HERE (90 min)\nMath studio + lundi + schéma Notion\nInquiry 15 min, filtre, objections\nOffres, usage, CSV tarifs + calculateur\nBooking, questionnaires, formelles, acompte\nJour J, listes de plans, second shooter\nGalerie, plafond retouches, RAW, tirages\nFactures, relances, journal\nBoards Sheets + welcome + e-mails",
            "START-HERE (90 min)\nCuentas del estudio + lunes + esquema Notion\nInquiry 15 min, filtro, objeciones\nPaquetes, uso, CSV de tarifas + calculadora\nReserva, cuestionarios, formales, anticipo\nDía de boda, listas, segundo disparador\nGalería, tope de revisiones, RAW, copias\nFacturas, cobro, registro\nTableros Sheets + bienvenida + emails",
        ),
        "images": imgs("photographer-os"),
        "faq": PHOTO_FAQS,
    },
]

REVIEWS = [
    {
        "product_sku": "DW-SYS-010",
        "locale": "en",
        "stars": 5,
        "title": "Saturdays were being given away",
        "body": "Built against a wedding studio that quoted ‘it depends’ in DMs and then worked a 12-hour Saturday at portrait-session money. The kit treats the date as inventory before the inquiry is answered.",
        "display_name": "Studio brief",
        "city_country": "Wedding desk",
        "source": "studio_preview",
    },
    {
        "product_sku": "DW-SYS-010",
        "locale": "en",
        "stars": 5,
        "title": "Gallery opened before the balance",
        "body": "Commercial jobs leaked when the preview link went live and the invoice sat. Retainer gate + paid-in-full gallery is the rule the pack is written around — not a prettier CRM skin.",
        "display_name": "Studio brief",
        "city_country": "Brand / commercial",
        "source": "studio_preview",
    },
    {
        "product_sku": "DW-SYS-010",
        "locale": "en",
        "stars": 5,
        "title": "Unlimited revisions is not a package",
        "body": "Two rounds on the preview set, extra rounds priced, ‘make it more magical’ sent back to frame numbers. That is the leak this desk was designed to close.",
        "display_name": "Studio brief",
        "city_country": "Portrait + wedding",
        "source": "studio_preview",
    },
    {
        "product_sku": "DW-SYS-010",
        "locale": "ar",
        "stars": 5,
        "title": "السبت كان يتوزّع مجان",
        "body": "مبني ضد استوديو أعراس يرد «حسب» في الخاص ويشتغل 12 ساعة بفلوس جلسة بورتريه. التاريخ مخزون قبل ما ينرد الاستفسار.",
        "display_name": "موجز استوديو",
        "city_country": "مكتب أعراس",
        "source": "studio_preview",
    },
    {
        "product_sku": "DW-SYS-010",
        "locale": "fr",
        "stars": 5,
        "title": "La galerie partait avant le solde",
        "body": "Jobs commercial fuitaient dès le lien preview. L’acompte et la galerie soldée sont la règle — pas un CRM joli.",
        "display_name": "Brief studio",
        "city_country": "Brand / commercial",
        "source": "studio_preview",
    },
    {
        "product_sku": "DW-SYS-010",
        "locale": "es",
        "stars": 5,
        "title": "Revisiones ilimitadas no es un paquete",
        "body": "Dos rondas en el preview, extras con precio, «más mágico» vuelve a números de frame. Esa fuga es la que cierra el escritorio.",
        "display_name": "Brief de estudio",
        "city_country": "Retrato + boda",
        "source": "studio_preview",
    },
]
