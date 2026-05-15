import type { Ritual, Service, ServiceAudience, Therapist, Package } from './types';

export const rituals: Ritual[] = [
  {
    id: 'atelier',
    title: 'The',
    titleItalic: 'Atelier',
    tagline: 'Hair',
    description:
      'Precision cuts, colour artistry, and transformative styling rituals for every texture and story.',
    longDescription:
      "The Atelier is where precision meets artistry. Every cut begins with study — of your face, your texture, the way light lives in your hair — and unfolds through slow, deliberate work at the chair. Our colourists are trained in the Parisian and Japanese traditions, where restraint and dimension matter more than dramatic change.\n\nWhether you're here for a signature cut, a subtle shift in colour, or a full transformation before your wedding day, the process remains unhurried. You're invited to arrive twenty minutes early for tea in the salon's library before your appointment begins.",
    philosophy: 'Slow craft, considered hands.',
    faqs: [
      {
        q: 'How should I arrive for a colour appointment?',
        a: 'We ask that you come with dry, unwashed hair. Any recent chemical treatments, gloss, or at-home colour should be mentioned at booking so we can plan accordingly.',
      },
      {
        q: 'How often should I return for a cut?',
        a: 'For most clients, every six to eight weeks preserves the shape. Precision bobs and fringes benefit from trims every four weeks.',
      },
      {
        q: 'Do you offer consultations before booking?',
        a: 'Yes — complimentary fifteen-minute consultations are available for colour corrections, bridal styling, and any first visit to the Atelier.',
      },
      {
        q: 'Can I bring reference images?',
        a: 'Absolutely. References help the conversation, though your therapist will guide you toward what your hair and face shape will hold best.',
      },
    ],
    image: '/assets/Images/H-03.png',
  },
  {
    id: 'alchemic-aesthetics',
    title: 'Alchemic',
    titleItalic: 'Aesthetics',
    tagline: 'Nails',
    description:
      'Nail artistry elevated to ceremony — each visit a meditation in precision and colour.',
    longDescription:
      "Alchemic Aesthetics treats nail work as ceremony — small, precise, repeated gestures that add up to something lasting. Our nail rituals begin with attention to the cuticle, the nail bed, the shape of the hand; only then does colour enter the conversation.\n\nWhether it's a single glossed coat or architectural nail art that takes ninety minutes, the care is the same. Tools are sterilised between every client. Products are selected for health as much as for pigment.",
    philosophy: 'Small gestures, lasting craft.',
    faqs: [
      {
        q: 'How do you remove gel polish safely?',
        a: 'We use gentle soak-off — no drilling at the nail plate. Expect ten extra minutes if you arrive with previous gel.',
      },
      {
        q: 'Are your products free of harsh chemicals?',
        a: 'Our polishes are free of the common ten plus formaldehyde and toluene. We can share the full list on request.',
      },
      {
        q: 'How long does gel last?',
        a: 'Two to three weeks on average. Growth, not chipping, is usually the reason to return.',
      },
      {
        q: 'Can I bring reference art?',
        a: 'Please — references help, and our artists can adapt a reference to suit your nail length and shape.',
      },
    ],
    image: '/assets/Images/H-06.png',
  },
  {
    id: 'somatic-recovery',
    title: 'Somatic',
    titleItalic: 'Recovery',
    tagline: 'Massage & Body',
    description:
      'Deep tissue restoration, somatic release, and full-body renewal guided by trained therapists.',
    longDescription:
      'Somatic Recovery is rooted in a simple observation: the nervous system holds as much as the body does. Our therapists are trained across modalities — Swedish, deep tissue, lymphatic drainage, and somatic release — and they read what your body brings into the room.\n\nThe first five minutes are always the same: a long exhale, grounded presence, the sense that you are safe to let go. From there, pressure is negotiated, not assumed. Some visits are restorative; some are the kind that ask more of you. Both are welcome here.',
    philosophy: 'Return to the body, slowly.',
    faqs: [
      {
        q: "What if I'm in real pain, not just tight?",
        a: "Tell us at booking — we'll allocate a therapist trained in the appropriate modality and adjust the duration if needed. For clinical pain, we can recommend a physician first.",
      },
      {
        q: 'Is prenatal massage safe?',
        a: 'Yes, from the second trimester onward. We use supported positioning and gentler technique throughout.',
      },
      {
        q: 'How hard should pressure be?',
        a: 'As hard as you ask. Feedback during the session is welcome — this is collaborative.',
      },
      {
        q: 'What about after the session?',
        a: 'Drink water. Rest if you can. Avoid strenuous exercise for a few hours.',
      },
    ],
    image: '/assets/Images/H-05.png',
  },
  {
    id: 'solar-vitality',
    title: 'Solar',
    titleItalic: 'Vitality',
    tagline: 'Skin & Facial',
    description:
      'Luminous skin journeys that marry ancient botanical wisdom with modern dermal science.',
    longDescription:
      'Solar Vitality draws its name from the warmth that radiant skin carries — the kind that starts from within and rises through the surface. Our facial protocols marry two lineages: the botanical wisdom of the Gulf and the Mediterranean, where frankincense, rose, and neroli have tended skin for millennia; and the clinical precision of modern dermal science.\n\nEvery treatment begins with skin analysis under professional light and a conversation about what your skin is being asked to do this season. Expect hands-on massage, quiet technology where it helps, and time — the unhurried kind that lets ingredients actually work.',
    philosophy: 'Light is the first medicine.',
    faqs: [
      {
        q: 'Is this safe for sensitive or reactive skin?',
        a: 'Yes. We adapt every protocol to your barrier on the day. Let your therapist know about any recent reactions, retinoids, or prescription actives.',
      },
      {
        q: 'Can I have a facial while pregnant?',
        a: 'Most of our facials are pregnancy-safe. We avoid retinoids, salicylic acid, and deep lymphatic work in the first trimester. Mention your stage at booking.',
      },
      {
        q: 'How often should I return?',
        a: 'Most skin benefits from a facial every four to six weeks — aligned to the skin cell cycle.',
      },
      {
        q: 'Will I have downtime?',
        a: 'None of our facials produce meaningful downtime. You may leave slightly flushed; makeup is fine the same evening.',
      },
    ],
    image: '/assets/Images/H-04.png',
  },
  {
    id: 'velvet-smooth',
    title: 'Velvet',
    titleItalic: 'Smooth',
    tagline: 'Waxing',
    description:
      'Gentle, precise hair removal rituals — calibrated waxes, careful technique, skin care at every step.',
    longDescription:
      "Velvet Smooth is waxing reframed as care. Our therapists are trained in both hard and soft wax, and they choose the formulation to match the area, the skin, and the hair — not the other way around. Every room is set up fresh for each client, and pre- and post-care is part of the ritual, not an afterthought.\n\nExpect a quiet room, warmed wax at the correct temperature, unhurried technique, and a calming balm at the close. We work with clients through every stage — first-time, long-term, sensitive skin, post-laser, and in-between.",
    philosophy: 'Careful hands, calmer skin.',
    faqs: [
      {
        q: 'How long should hair be before waxing?',
        a: 'About a quarter inch — roughly two weeks of growth after shaving. Shorter hair may not lift cleanly.',
      },
      {
        q: 'Is it safe for sensitive skin?',
        a: 'Yes. We adjust wax temperature and formulation to the area and skin type, and we always finish with a calming balm.',
      },
      {
        q: 'How often should I return?',
        a: 'Every three to six weeks depending on the area and growth cycle. Regularity makes each visit easier on the skin.',
      },
      {
        q: 'Can I wax while using retinoids?',
        a: 'We ask you to pause retinoids for at least three days before and after your appointment to avoid skin lifting.',
      },
    ],
    image: '/assets/Images/H-01.png',
  },
  {
    id: 'body-renewal',
    title: 'Body',
    titleItalic: 'Renewal',
    tagline: 'Makeup',
    description:
      'Makeup artistry that lets the skin stay skin — luminous, lived-in, and suited to the day you are having.',
    longDescription:
      'Body Renewal is our makeup studio — built around the idea that the best makeup looks like skin doing well, not skin covered up. Our artists work in layered light: sheer base, targeted concealing, a warmed cheek, a defined eye that reads from two metres and from across a dinner table.\n\nWe keep the kit clean-formula where it matters, pigment-rich where it needs to be, and tailored to the lighting of your day. First visits begin with a short conversation: where you are going, how you want to be seen, what you wear at home and what you borrow for events.',
    philosophy: 'Skin, kept skin.',
    faqs: [
      {
        q: 'Do I need a trial before my wedding day?',
        a: 'Yes. We book a full trial two to three weeks before the event so we can finalise the look and note every product for the day.',
      },
      {
        q: 'What should I bring to my first appointment?',
        a: 'Come with clean skin. If you have a reference image, bring it — it helps the conversation. Your own lashes, if you prefer a specific style.',
      },
      {
        q: 'How long does the makeup last?',
        a: 'A properly prepped base holds eight to ten hours. For events longer than that, we brief you on small touch-ups.',
      },
      {
        q: 'Can you travel to my venue?',
        a: 'Yes — for bridal and editorial bookings we travel within the Gulf. Please enquire at least four weeks in advance.',
      },
    ],
    image: '/assets/Images/H-12.png',
  },
  {
    id: 'longevity-lab',
    title: 'The Longevity',
    titleItalic: 'Lab',
    tagline: 'Wellness',
    description:
      'Science-led protocols and next-generation aesthetics for those invested in long-term vitality.',
    longDescription:
      "The Longevity Lab is the clinical floor of Mastercuts. This is where biomarkers, IV drips, cryotherapy, and functional aesthetics live — protocols built for people thinking in years, not in days. Every first visit begins with a consultation: the story of your sleep, your stress, your labs, your intentions.\n\nFrom there, we design a rhythm. Some clients come monthly; others treat the Lab as a seasonal reset. We do not sell what we don't believe in, and we don't chase trends. The brief here is measurable, patient, and quiet.",
    philosophy: 'Measured, patient, informed.',
    faqs: [
      {
        q: 'Do I need a consultation before my first IV?',
        a: 'Yes. Our medical team reviews your health history and current medications before any intravenous protocol.',
      },
      {
        q: 'How do I prepare for a biomarker panel?',
        a: 'Fast for eight to twelve hours before your visit. Water is fine. Bring a list of any supplements you take.',
      },
      {
        q: 'Is cryotherapy safe for everyone?',
        a: "There are contraindications — cardiovascular conditions, Raynaud's, certain skin conditions, pregnancy. We screen at booking.",
      },
      {
        q: 'Who is the Lab for?',
        a: 'People actively invested in long-term vitality — pre-event recovery, athletic performance, post-illness rehabilitation, or simply a desire to understand your own biology more deeply.',
      },
    ],
    image: '/assets/Images/H-07.png',
  },
];

export const services: Service[] = [
  // The Atelier
  {
    id: 'atelier-signature-cut',
    ritualId: 'atelier',
    name: 'Signature Cut & Style',
    description: 'A precise cut tailored to your face shape, finished with a hand-blown silhouette.',
    highlights: [
      'Studied to your face & texture',
      'Dry-wet-dry cutting method',
      'Natural-bristle finish you can recreate',
    ],
    detail:
      "Every Signature Cut begins with a slow consultation: how you wear your hair on a normal Tuesday, what you wish it did, what you have stopped trying to make it do. Your therapist studies the way the hair falls, the cowlicks, the natural part. The cut is built from there — not from a reference, but from your hair's own logic.\n\nWashing happens at a reclined basin with a long scalp massage. The cut is dry, then wet, then dry again — a layered approach that catches what each state reveals. We finish with a hand-blown silhouette using only natural-bristle brushes. You leave knowing how to recreate it.",
    durationMin: 60,
    price: 350,
    image: '/assets/Images/H-03.png',
    audience: 'unisex',
  },
  {
    id: 'atelier-colour-transformation',
    ritualId: 'atelier',
    name: 'Colour Transformation',
    description: 'Full balayage, correction, or dimensional colour by a senior colourist.',
    highlights: [
      'Dimensional base, highlights & lowlights',
      'Complimentary consultation included',
      'Glossing treatment at close',
    ],
    detail:
      'Colour at the Atelier is treated as architecture. Our senior colourists work in dimensional layers — base, mid-tones, highlights, ribbon-thin lowlights — so the result reads as light on hair, not pigment on hair. A complimentary consultation precedes every booking so we can plan the visit, the products, and the timing honestly.\n\nExpect three to four hours in the chair. Tea, books, and a working table with charging are part of the room. We finish with a glossing treatment to seal the cuticle and a personalised home-care brief.',
    durationMin: 180,
    price: 1100,
    image: '/assets/Images/H-08.png',
    audience: 'ladies',
    requiresConsultation: true,
  },
  {
    id: 'atelier-deep-conditioning',
    ritualId: 'atelier',
    name: 'Deep Conditioning Treatment',
    description: 'Restorative bond-building masque, scalp massage, and silk blow-dry.',
    highlights: [
      'Bond-building masque under steam',
      '30-minute scalp massage',
      'Ionic silk-wrap blow-dry',
    ],
    detail:
      'A restorative ritual for hair under stress — heat-styled, sun-bleached, over-coloured, or just tired. We begin with a clarifying wash, follow with a bond-building masque applied in sections under steam, and close with a thirty-minute scalp massage that lingers at the temples and the base of the skull.\n\nThe blow-dry uses ionic technology and silk wraps around a cool finish. Most clients leave with hair that catches light differently for the next two weeks.',
    durationMin: 45,
    price: 280,
    image: '/assets/Images/H-09.png',
    audience: 'unisex',
  },
  {
    id: 'atelier-bridal-design',
    ritualId: 'atelier',
    name: 'Bridal Hair Design',
    description: 'Pre-wedding consultation, trial session, and bridal-day styling.',
    highlights: [
      'Three-visit relationship with Bridal Director',
      'Trial 2–3 weeks before your day',
      'Travels for Gulf destination weddings',
    ],
    detail:
      "Bridal hair at Ra is a three-visit relationship. The first is a long consultation with our Bridal Director — we look at your dress, your venue, your veil if you have one, and the shape of your jaw under the kind of light your photographer will be working with. The second is a full trial, two to three weeks before the day. The third is the day itself.\n\nWe travel for destination weddings across the Gulf. Anything we do at trial, we recreate with precision on the day — there are no surprises in a Ra bridal chair.",
    durationMin: 120,
    price: 1400,
    image: '/assets/Images/H-10.png',
    audience: 'ladies',
    requiresConsultation: true,
  },

  // Solar Vitality
  {
    id: 'solar-glow-facial',
    ritualId: 'solar-vitality',
    name: 'Ra Glow Facial',
    description: 'Signature multi-step facial with botanical serums and lymphatic massage.',
    highlights: [
      'Botanical base with clinical-grade actives',
      'Sculpting lymphatic face & neck massage',
      'Choose 60, 75 or 90-minute variant',
    ],
    detail:
      'The Ra Glow is our signature facial — the one that defines the room. A double cleanse, a gentle enzymatic exfoliation, an extraction phase only if your skin needs it, a sculpting lymphatic massage of face and neck, a cooling masque, and a layered serum protocol. Botanical, with clinical-grade actives where they earn their place.\n\nDuration is flexible — choose 60, 75, or 90 minutes depending on how much time you can give. The 90-minute variant adds an extended scalp and shoulder ritual.',
    durationMin: 60,
    price: 540,
    image: '/assets/Images/H-04.png',
    audience: 'unisex',
    variants: [
      { id: '60', label: '60 minutes', durationMin: 60, price: 540 },
      { id: '75', label: '75 minutes', durationMin: 75, price: 650 },
      { id: '90', label: '90 minutes', durationMin: 90, price: 760 },
    ],
  },
  {
    id: 'solar-vitamin-c',
    ritualId: 'solar-vitality',
    name: 'Vitamin C Brightening',
    description: 'Targets dullness and pigmentation with a high-potency vitamin C protocol.',
    highlights: [
      'Stable L-ascorbic acid serums',
      'Targets pigmentation and dullness',
      'Visible change over 3–4 sessions',
    ],
    detail:
      'Sun damage in this part of the world is cumulative and quiet — by the time you notice it, it has been there for years. Our Vitamin C Brightening protocol layers stable l-ascorbic acid serums under a vitamin C masque, with gentle exfoliation to lift surface dullness.\n\nYou will see a brightening effect immediately. The structural pigment work happens with consistency — most clients see visible change after three to four sessions over six weeks.',
    durationMin: 60,
    price: 480,
    image: '/assets/Images/H-11.png',
    audience: 'unisex',
  },
  {
    id: 'solar-led-therapy',
    ritualId: 'solar-vitality',
    name: 'LED Light Therapy',
    description: 'Medical-grade LED session to calm, firm, and accelerate skin renewal.',
    highlights: [
      'Red, blue & near-infrared panels',
      '45 quiet minutes under light',
      'Layers well with other facials',
    ],
    detail:
      'Medical-grade LED with multi-wavelength panels — red light for collagen and circulation, blue light for breakouts, near-infrared for deep repair. The session itself is forty-five quiet minutes under the lights with eye protection and a calming ambient track.\n\nLED layers well with our other facials. Many clients book it as an add-on after a more active treatment to accelerate calm-down. There is no downtime; you can apply makeup the same day.',
    durationMin: 45,
    price: 380,
    image: '/assets/Images/H-12.png',
    audience: 'unisex',
  },
  {
    id: 'solar-hydration-infusion',
    ritualId: 'solar-vitality',
    name: 'Hydration Infusion',
    description: 'Deep hyaluronic replenishment for dehydrated and sensitised skin.',
    highlights: [
      'Multi-weight hyaluronic layers',
      'Safe for reactive, barrier-stressed skin',
      'Travel, AC & post-procedure rescue',
    ],
    detail:
      'Built for skin that drinks and asks for more — long-haul travel, air-conditioned offices, retinoid recovery, post-procedure care. We layer multiple molecular weights of hyaluronic acid with marine peptides under a cool jelly masque.\n\nThe protocol is suitable for the most reactive skin. We avoid all actives during this session — the brief is repair and replenishment, nothing else.',
    durationMin: 60,
    price: 520,
    image: '/assets/Images/H-01.png',
    audience: 'unisex',
  },

  // Somatic Recovery
  {
    id: 'somatic-signature-massage',
    ritualId: 'somatic-recovery',
    name: 'Ra Signature Massage',
    description: 'Full-body bespoke massage blending Swedish, deep tissue, and aromatherapy.',
    highlights: [
      'Blends Swedish, deep tissue & lymphatic',
      'Pressure negotiated, never assumed',
      'Built fresh to what your body brings',
    ],
    detail:
      "Our signature massage blends modalities the way a good chef blends a stock. Swedish for warming the tissue, deep tissue for the parts that hold tension, lymphatic for circulation, aromatherapy for the nervous system. Each session is built fresh — you tell us where you are holding it, and we go there.\n\nChoose the duration that suits your day. Sixty minutes gives a focused full-body pass. Ninety adds depth and a longer scalp ritual. One-twenty includes a short rest period at the end so the body can integrate.",
    durationMin: 60,
    price: 450,
    image: '/assets/Images/H-05.png',
    audience: 'unisex',
    location: 'both',
    variants: [
      { id: '60', label: '60 minutes', durationMin: 60, price: 450 },
      { id: '90', label: '90 minutes', durationMin: 90, price: 580 },
      { id: '120', label: '120 minutes', durationMin: 120, price: 720 },
    ],
  },
  {
    id: 'somatic-hot-stone',
    ritualId: 'somatic-recovery',
    name: 'Hot Stone Ceremony',
    description: 'Heated basalt stones release deep muscular tension and restore balance.',
    highlights: [
      'Heated basalt for deep tension release',
      'Reaches where hands alone cannot',
      'Leaves muscles softer, slower',
    ],
    detail:
      'Heated basalt stones glide along the long muscles of the back, the IT bands, the shoulders. The heat does what hands cannot — it reaches deeper, faster, and persuades the tissue to soften.\n\nChoose 60 minutes for a focused upper-body session, or 75 for full coverage including legs and feet.',
    durationMin: 60,
    price: 460,
    image: '/assets/Images/H-02.png',
    audience: 'unisex',
    location: 'both',
    variants: [
      { id: '60', label: '60 minutes', durationMin: 60, price: 460 },
      { id: '75', label: '75 minutes', durationMin: 75, price: 520 },
    ],
  },
  {
    id: 'somatic-lymphatic',
    ritualId: 'somatic-recovery',
    name: 'Lymphatic Drainage',
    description: 'Gentle rhythmic technique to de-puff, detoxify, and support circulation.',
    highlights: [
      'Immediate de-puffing of face & ankles',
      'Pre-event and post-flight rescue',
      'Gentler than most clients expect',
    ],
    detail:
      'A specialist modality — light, repetitive, almost choreographic. Lymphatic drainage moves fluid through the lymph chains using pressure that is much lighter than most clients expect. The effect is immediate de-puffing, especially around the face, neck, and ankles.\n\nWell-suited to pre-event preparation, post-flight recovery, and post-surgical rehabilitation under physician guidance.',
    durationMin: 60,
    price: 450,
    image: '/assets/Images/H-06.png',
    audience: 'unisex',
    location: 'both',
  },
  {
    id: 'somatic-prenatal',
    ritualId: 'somatic-recovery',
    name: 'Prenatal Wellness',
    description: 'Safe, nurturing massage for every stage of pregnancy.',
    highlights: [
      'Second & third trimester support',
      'Side-lying positioning with cushioning',
      'Focuses lower back, hips & feet',
    ],
    detail:
      'Our prenatal sessions are reserved for clients in the second and third trimesters. We use side-lying positions with cushioning, gentler pressure, and careful avoidance of contraindicated points.\n\nThe focus is the lower back, hips, feet, and the kind of tension that pregnancy concentrates in the upper shoulders. Sessions can be deeply restful — many clients fall asleep.',
    durationMin: 60,
    price: 420,
    image: '/assets/Images/H-07.png',
    audience: 'ladies',
    location: 'both',
  },

  // Alchemic Aesthetics
  {
    id: 'alchemic-gel-manicure',
    ritualId: 'alchemic-aesthetics',
    name: 'Gel Manicure',
    description: 'Long-wear gel manicure with cuticle ritual and hand massage.',
    highlights: [
      'Cuticle-first, soak-off method',
      'Clean-formula gels, no toxic ten',
      '2–3 weeks of high-shine wear',
    ],
    detail:
      "A precise gel manicure begins with the cuticle, not the nail plate. We push, never cut, and we soak rather than drill. The shaping is done by hand. Two coats of gel, cured under low-heat LED, finished with a high-shine top coat that holds for two to three weeks.\n\nWe carry a curated palette of clean-formula gels — every polish in the room is free of the most common ten compounds plus formaldehyde and toluene.",
    durationMin: 60,
    price: 220,
    image: '/assets/Images/H-06.png',
    audience: 'unisex',
    location: 'both',
  },
  {
    id: 'alchemic-luxury-pedicure',
    ritualId: 'alchemic-aesthetics',
    name: 'Luxury Pedicure',
    description: 'Foot soak, exfoliation, callus care, and polish with a calf massage.',
    highlights: [
      'Mineral-salt soak in a copper basin',
      'Hand-tool callus care, no electric files',
      'Warming calf & foot massage',
    ],
    detail:
      'Begins with a long mineral-salt foot soak in a copper basin, followed by exfoliation, gentle callus care with hand tools (no electric files), and meticulous nail and cuticle work. Closes with a calf and foot massage using a warming oil blend, and your choice of regular or gel polish.\n\nThe whole experience is unhurried — most clients book it as the kind of break the day was missing.',
    durationMin: 75,
    price: 280,
    image: '/assets/Images/H-08.png',
    audience: 'unisex',
    location: 'both',
  },
  {
    id: 'alchemic-nail-art',
    ritualId: 'alchemic-aesthetics',
    name: 'Nail Art & Design',
    description: 'Bespoke hand-painted or encapsulated nail art by a resident artist.',
    highlights: [
      'Hand-painted by a resident artist',
      'Adapts references to your nail shape',
      'Encapsulated & fine-line detail',
    ],
    detail:
      "Our resident nail artists work with hand-painted detail, encapsulated florals, fine line work, chrome, and the kind of subtle texture that reads as art when you look closely. Bring a reference if you have one — we will adapt it to your nail length, shape, and the art's place on the hand.\n\nAllow ninety minutes for full sets; longer for elaborate concepts. Worth booking ahead.",
    durationMin: 90,
    price: 360,
    image: '/assets/Images/H-09.png',
    audience: 'ladies',
    location: 'both',
  },
  {
    id: 'alchemic-paraffin',
    ritualId: 'alchemic-aesthetics',
    name: 'Paraffin Treatment',
    description: 'Warm paraffin wax therapy for deeply softened hands or feet.',
    highlights: [
      'Deeply softens dehydrated skin',
      'Warm wax & cotton-mitt wraps',
      'Pairs beautifully with a mani or pedi',
    ],
    detail:
      'A warming, deeply softening treatment for hands or feet — thirty quiet minutes wrapped in warmed paraffin and cotton mitts. Best paired with a manicure or pedicure as an add-on, or booked alone after a long flight.\n\nThe results are most dramatic on dehydrated skin or hands that have been working hard.',
    durationMin: 30,
    price: 180,
    image: '/assets/Images/H-10.png',
    audience: 'unisex',
    location: 'both',
  },

  // The Longevity Lab
  {
    id: 'longevity-iv-drip',
    ritualId: 'longevity-lab',
    name: 'IV Drip Therapy',
    description: 'Tailored vitamin and antioxidant infusion administered by a medical team.',
    highlights: [
      'Formulated by in-house medical team',
      'Private, comfortable infusion suite',
      'Medical consultation on first visit',
    ],
    detail:
      'Our IV protocols are formulated by an in-house medical team and administered in a private, comfortable suite. The most common formulations are immune support, recovery and rehydration, performance and energy, and a brightening glow blend rich in glutathione.\n\nA medical consultation precedes every first IV — we review history, current medications, and goals before recommending a protocol.',
    durationMin: 45,
    price: 750,
    image: '/assets/Images/H-07.png',
    audience: 'unisex',
    requiresConsultation: true,
  },
  {
    id: 'longevity-cryotherapy',
    ritualId: 'longevity-lab',
    name: 'Cryotherapy',
    description: 'Whole-body cold exposure to support recovery, mood, and inflammation.',
    highlights: [
      'Three-minute whole-body session',
      'Supports recovery, mood & circulation',
      'Full screening for contraindications',
    ],
    detail:
      'Three minutes in a whole-body cryo chamber at minus 110°C. The session itself is brief — the work happens in the hours after, as the body responds with a controlled inflammatory cascade that supports recovery, mood, and circulation.\n\nWe screen for contraindications at booking. Not suitable in pregnancy, with cardiovascular conditions, or with certain skin disorders.',
    durationMin: 15,
    price: 320,
    image: '/assets/Images/H-11.png',
    audience: 'unisex',
  },
  {
    id: 'longevity-biomarker',
    ritualId: 'longevity-lab',
    name: 'Biomarker Assessment',
    description: 'Comprehensive blood panel and lifestyle review with a longevity specialist.',
    highlights: [
      'Full metabolic & hormonal panel',
      '30-min review with longevity specialist',
      'Written plan with actionable priorities',
    ],
    detail:
      'A comprehensive panel — metabolic, hormonal, inflammatory, micronutrient, and lipid markers — combined with a thirty-minute consultation with our longevity specialist. The output is a clear written report with a small set of priorities you can actually act on.\n\nFast for eight to twelve hours before your visit. Water is fine. Bring a list of supplements and medications.',
    durationMin: 30,
    price: 850,
    image: '/assets/Images/H-12.png',
    audience: 'unisex',
    requiresConsultation: true,
  },
  {
    id: 'longevity-anti-ageing-facial',
    ritualId: 'longevity-lab',
    name: 'Anti-Ageing Facial',
    description: 'Peptide-rich protocol with microcurrent lift and sculpting massage.',
    highlights: [
      'Microcurrent lift with peptide serums',
      'Sculpting deep-structure massage',
      'Red-light LED finish',
    ],
    detail:
      'A clinical facial built around microcurrent — the gentle electrical stimulation of facial muscles for a visible lifting effect. Combined with a peptide-rich serum protocol, sculpting massage of the deeper facial structures, and a red-light LED finish.\n\nThe lift is immediate but builds with consistency. Most clients book a series of six over six weeks for the strongest results, then maintain monthly.',
    durationMin: 75,
    price: 950,
    image: '/assets/Images/H-04.png',
    audience: 'unisex',
  },

  // Velvet Smooth
  {
    id: 'velvet-full-leg',
    ritualId: 'velvet-smooth',
    name: 'Full Leg Wax',
    description: 'Complete leg waxing with warm wax and calming post-care balm.',
    highlights: [
      'Low-temperature warm wax',
      'Cooling aloe-chamomile finish',
      'Worked methodically, section by section',
    ],
    detail:
      'A full-leg ritual from ankle to thigh. We use a low-temperature warm wax for even lift and minimal redness, finished with a cooling aloe-and-chamomile balm to calm the skin.\n\nAllow sixty minutes for your first visit — the sections are worked methodically, with short pauses for hydration and skin checks. Regular clients find subsequent visits move a little faster as the hair cycle softens.',
    durationMin: 60,
    price: 220,
    image: '/assets/Images/H-01.png',
    audience: 'ladies',
  },
  {
    id: 'velvet-brazilian',
    ritualId: 'velvet-smooth',
    name: 'Brazilian Wax',
    description: 'Precise, hygienic intimate waxing by a specialist therapist.',
    highlights: [
      'Performed in a private suite',
      'Hard wax for sensitive-area comfort',
      'Aftercare brief on first visit',
    ],
    detail:
      'A specialist service performed in a private suite by a senior therapist trained specifically in intimate waxing. We use hard wax, which grips the hair and releases the skin, for the most comfortable finish possible in a sensitive area.\n\nFirst visits include a short consultation on aftercare, ingrown prevention, and the rhythm that will keep each subsequent visit gentler on the skin.',
    durationMin: 45,
    price: 260,
    image: '/assets/Images/H-02.png',
    audience: 'ladies',
  },
  {
    id: 'velvet-underarm',
    ritualId: 'velvet-smooth',
    name: 'Underarm Wax',
    description: 'Quick, precise underarm waxing with skin-calming finish.',
    highlights: [
      'In-and-out in twenty minutes',
      'Hard wax for a comfortable lift',
      'Cooling balm to settle skin',
    ],
    detail:
      'A fast, precise service — in and out in twenty minutes. We use hard wax for the most comfortable lift, and finish with a calming balm that helps the skin settle quickly. Best booked at the end of a longer visit or on its own as a quick reset.',
    durationMin: 20,
    price: 90,
    image: '/assets/Images/H-09.png',
    audience: 'unisex',
  },
  {
    id: 'velvet-mens-back-chest',
    ritualId: 'velvet-smooth',
    name: "Men's Back & Chest Wax",
    description: 'Thorough back and chest waxing in a private suite.',
    highlights: [
      'Private suite, male therapist on request',
      'Hard & soft wax chosen by area',
      'Cooling balm finish',
    ],
    detail:
      'A dedicated session for the back and chest, performed in a private suite by a male therapist where requested. We work in sections with hard wax for the densest areas and soft wax for the softer planes, finishing with a cooling balm.\n\nAllow forty-five minutes. First visits may take a little longer while we read the growth pattern and plan the rhythm for future appointments.',
    durationMin: 45,
    price: 320,
    image: '/assets/Images/H-10.png',
    audience: 'gentlemen',
  },
  {
    id: 'velvet-threading-brows',
    ritualId: 'velvet-smooth',
    name: 'Eyebrow Threading',
    description: 'Precise brow shaping using ancient cotton-thread technique.',
    highlights: [
      'Cotton thread, no wax or pulling',
      'Reads the brow’s natural arch',
      'Gentle on sensitive skin',
    ],
    detail:
      'A heritage technique that uses a twisted cotton thread to lift each hair from the root, line by line. The shaping reads your natural arch and the angle of the bone beneath, lifting strays and refining the line without the heat or pull of wax.\n\nQuick, precise, and ideal for sensitive skin. Available at the salon and at home.',
    durationMin: 20,
    price: 60,
    image: '/assets/Images/H-06.png',
    audience: 'ladies',
    location: 'both',
  },
  {
    id: 'velvet-threading-lip',
    ritualId: 'velvet-smooth',
    name: 'Upper Lip Threading',
    description: 'Fast, precise upper-lip hair removal by thread.',
    highlights: [
      'Under ten minutes',
      'No heat, no chemicals',
      'Calming aloe finish',
    ],
    detail:
      'A short, precise service to lift fine upper-lip hair using cotton thread. Closes with a calming aloe touch. Pairs naturally with an eyebrow thread or a manicure.',
    durationMin: 10,
    price: 30,
    image: '/assets/Images/H-07.png',
    audience: 'ladies',
    location: 'both',
  },
  {
    id: 'velvet-threading-face',
    ritualId: 'velvet-smooth',
    name: 'Full Face Threading',
    description: 'Complete facial hair removal — cheeks, chin, brows, lip.',
    highlights: [
      'Brows, lip, chin, cheeks & sideburns',
      'Even, glow-revealing finish',
      'Followed by a cooling rosewater mist',
    ],
    detail:
      'A full-face threading session covering brows, upper lip, chin, cheeks, and sideburns. The result is a more even skin tone and a finish that catches light cleanly under makeup or on bare skin.\n\nWe close with a cooling rosewater mist. Allow thirty minutes.',
    durationMin: 30,
    price: 120,
    image: '/assets/Images/H-08.png',
    audience: 'ladies',
    location: 'both',
  },

  // Body Renewal
  {
    id: 'renewal-day-makeup',
    ritualId: 'body-renewal',
    name: 'Day Makeup',
    description: 'A luminous, lived-in look tailored to your day and your light.',
    highlights: [
      "Tailored to your day's lighting",
      'Clean-formula base, pigment where needed',
      'Photographed so you can recreate at home',
    ],
    detail:
      'A sixty-minute session for an everyday-beautiful finish — light base, warmed cheek, softly defined eye, groomed brow, a lip that suits the day. We begin with a short conversation about where you are going, and tailor the look to the lighting you will be in.\n\nClean-formula base by default, pigment-rich finish on request. We photograph the final look from two angles so you can recreate key steps at home.',
    durationMin: 60,
    price: 280,
    image: '/assets/Images/H-12.png',
    audience: 'ladies',
  },
  {
    id: 'renewal-bridal-makeup',
    ritualId: 'body-renewal',
    name: 'Bridal Makeup',
    description: 'Pre-wedding trial and bridal-day makeup by a senior artist.',
    highlights: [
      'Two-visit relationship: trial + day',
      'Senior artist on every booking',
      'Travels for Gulf destination weddings',
    ],
    detail:
      'Bridal makeup at Ra is a two-visit relationship. The first is a full trial, two to three weeks before the wedding, where we design the look against your dress, veil, and skin on the day. The second is the morning of the wedding itself — every product from the trial is recreated, step for step, under the light you will actually be in.\n\nWe travel for destination weddings across the Gulf. Every booking is with our senior artist; no hand-off on the day.',
    durationMin: 120,
    price: 900,
    image: '/assets/Images/H-10.png',
    audience: 'ladies',
    requiresConsultation: true,
  },
  {
    id: 'renewal-editorial',
    ritualId: 'body-renewal',
    name: 'Editorial & Event',
    description: 'Camera-ready makeup for shoots, events, and occasions.',
    highlights: [
      'Sculptural for camera & galas',
      'Contour, pigment & lash work',
      'Holds under event-length lighting',
    ],
    detail:
      'A ninety-minute session for stronger, more sculptural looks — editorial shoots, events, galas, moments where the camera will matter. We work with contour and highlight, pigment intensity, lash work, and bolder lip choices.\n\nClients often bring a brief or reference board. We read it with you, then propose the version that will hold under your lighting.',
    durationMin: 90,
    price: 550,
    image: '/assets/Images/H-08.png',
    audience: 'ladies',
  },
  {
    id: 'renewal-grooming-brows',
    ritualId: 'body-renewal',
    name: 'Brow Grooming & Tint',
    description: 'Precise shaping with optional tint, for soft or defined brows.',
    highlights: [
      'Mapped to your face shape',
      'Wax + tweezer shaping',
      'Optional tint for soft definition',
    ],
    detail:
      'A thirty-minute session focused on the brow — mapped to your face, shaped with wax and tweezers, and finished with an optional tint for a soft or more defined finish. The shape is the priority; tint is only added where it reads naturally.',
    durationMin: 30,
    price: 120,
    image: '/assets/Images/H-11.png',
    audience: 'unisex',
  },
];

export const therapists: Therapist[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    title: 'Master Therapist',
    ritualIds: ['atelier'],
    languages: ['English'],
    image: '/assets/Images/headshot_1.png',
    bio: "A London-trained master therapist known for editorial cuts and dimensional colour. Sarah's work lives in the quiet precision of a perfect fringe, a weightless long layer, a colour that looks like it was always yours. Fifteen years at the chair have taught her that listening is half the job.",
  },
  {
    id: 'david-cortez',
    name: 'David Cortez',
    title: 'Senior Colorist',
    ritualIds: ['atelier'],
    languages: ['English', 'Spanish'],
    image: '/assets/Images/headshot_2.png',
    bio: "A colourist's colourist. Twenty years spent reading hair at root level mean that David takes on the corrections others won't, with the patient temperament the work requires. Fluent in English and Spanish, trained in New York and Barcelona.",
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    title: 'Wellness Director',
    ritualIds: ['somatic-recovery', 'solar-vitality'],
    languages: ['English', 'Russian'],
    image: '/assets/Images/headshot_3.png',
    bio: 'Wellness Director at Ra, with a practice that spans hair, scalp, and somatic massage. Elena moves between the facial bed and the massage room with rare fluency, and her first-visit consultations set the tone for everything downstream.',
  },
  {
    id: 'layla-al-mansoori',
    name: 'Layla Al-Mansoori',
    title: 'Skin Therapist',
    ritualIds: ['solar-vitality'],
    languages: ['Arabic', 'English'],
    image: '/assets/Images/H-01.png',
    bio: "A facialist specialising in sensitive and reactive skin, with deep training in the Arabic-botanical tradition. Layla's facials are quiet, deliberate, and built around a principle she repeats often: do less, but do it well.",
  },
  {
    id: 'maya-patel',
    name: 'Maya Patel',
    title: 'Lead Nail Artist',
    ritualIds: ['alchemic-aesthetics'],
    languages: ['English', 'Hindi'],
    image: '/assets/Images/H-02.png',
    bio: "Ra's lead nail artist, celebrated for editorial nail art and the kind of gel work that lasts. Maya's background is in fine art — it shows in the steadiness of her hand and in the way she composes colour on a nail as she would a small canvas.",
  },
  {
    id: 'zoe-tanaka',
    name: 'Zoe Tanaka',
    title: 'Massage Therapist',
    ritualIds: ['somatic-recovery'],
    languages: ['English', 'Japanese'],
    image: '/assets/Images/H-09.png',
    bio: 'A massage therapist whose practice blends shiatsu, lymphatic drainage, and prenatal expertise. Zoe reads the body the way a musician reads a score — attentive to rhythm, pressure, and what the room is asking for.',
  },
  {
    id: 'julien-laurent',
    name: 'Julien Laurent',
    title: 'Colour Specialist',
    ritualIds: ['atelier'],
    languages: ['French', 'English'],
    image: '/assets/Images/H-10.png',
    bio: 'Parisian-trained, known for balayage that grows out beautifully and colour that looks like sunlight, not product. Julien sees colour as architecture — something you return to, not something that asks to be corrected.',
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    title: 'Longevity Specialist',
    ritualIds: ['longevity-lab'],
    languages: ['English'],
    image: '/assets/Images/H-11.png',
    bio: "A medical aesthetician with a background in functional medicine, Amara holds the clinical floor of the Longevity Lab. Her consultations are long, specific, and anchored in labs. Nothing is prescribed here that isn't justified.",
  },
  {
    id: 'nina-volkov',
    name: 'Nina Volkov',
    title: 'Bridal Director',
    ritualIds: ['atelier', 'alchemic-aesthetics', 'body-renewal'],
    languages: ['English', 'Russian'],
    image: '/assets/Images/H-12.png',
    bio: "Ra's Bridal Director. Nina has styled brides across the Gulf for destination weddings from Mykonos to Muscat, and her trial sessions are legendary for their calm. What she delivers on the day looks effortless. The work behind it is not.",
  },
  {
    id: 'farah-haddad',
    name: 'Farah Haddad',
    title: 'Waxing Specialist',
    ritualIds: ['velvet-smooth'],
    languages: ['English', 'Arabic'],
    image: '/assets/Images/H-01.png',
    bio: "A senior waxing therapist with a decade of practice across sensitive, first-time, and post-laser skin. Farah's approach is quiet and unhurried — she prepares the skin carefully, chooses the wax to match the area, and her rooms are known for how calm they feel.",
  },
  {
    id: 'marcus-hale',
    name: 'Marcus Hale',
    title: "Men's Grooming Specialist",
    ritualIds: ['velvet-smooth'],
    languages: ['English'],
    image: '/assets/Images/H-10.png',
    bio: "A dedicated men's grooming specialist trained across body waxing, beard sculpting, and grooming rituals. Marcus works from a private suite and his clients return for the mix of precision, discretion, and care that defines the room.",
  },
  {
    id: 'isabelle-moreau',
    name: 'Isabelle Moreau',
    title: 'Lead Makeup Artist',
    ritualIds: ['body-renewal'],
    languages: ['French', 'English'],
    image: '/assets/Images/H-12.png',
    bio: "Ra's lead makeup artist, trained in Paris and London, with an editorial sensibility that keeps the skin looking like skin. Isabelle's bridal trials are patient, specific, and built around the way light will actually fall on the day.",
  },
];

export const packages: Package[] = [
  {
    id: 'bridal-day',
    name: 'The Bridal Bloom',
    tagline: 'A full-day ceremony for the bride',
    category: 'Life Moment',
    description:
      'A bespoke bridal journey designed to illuminate, restore, and celebrate the bride in the days before her day.',
    longDescription:
      'The Bridal Bloom is the ceremony before the ceremony — a full day reserved for the bride, built around the idea that calm travels through the aisle more reliably than anything else we can offer. Your morning begins in the private suite with tea and a breathing ritual. From there, the day unfolds at the unhurried pace your wedding week will not.\n\nThe journey weaves together four of our most precise rituals: bridal hair design with our Bridal Director, a luminous Ra Glow facial to prepare the skin for the lights of your day, and a complete mani-pedi ritual in the clean-formula room. The sequencing matters — we schedule each service with rest between, so by the time you leave, you carry both the work and the stillness with you.',
    philosophy: 'The ceremony before the ceremony.',
    image: '/assets/Images/H-10.png',
    serviceIds: [
      'atelier-bridal-design',
      'solar-glow-facial',
      'alchemic-luxury-pedicure',
      'alchemic-gel-manicure',
    ],
    savings: 15,
  },
  {
    id: 'recovery-reset',
    name: 'Soul Sunday',
    tagline: 'Restore, rehydrate, release',
    category: 'Half-Day Retreat',
    description:
      'A full morning of restoration — beginning with signature massage and ending with deep hydration.',
    longDescription:
      'Soul Sunday is built for the kind of week that asks too much. A full morning reserved for doing less: a long signature massage that reads the week out of your shoulders, followed by LED light therapy to calm what the week inflamed, closing with a hydration facial that gives the skin back what air-conditioning and screens have taken.\n\nThe pacing is deliberate. A short rest in the suite between services, tea between rooms, and a close that leaves you slower than when you arrived. Most clients book this the Sunday before a difficult Monday.',
    philosophy: 'Slower out than in.',
    image: '/assets/Images/H-08.png',
    serviceIds: ['somatic-signature-massage', 'solar-led-therapy', 'solar-hydration-infusion'],
    savings: 10,
  },
  {
    id: 'longevity-immersion',
    name: 'The Longevity Immersion',
    tagline: 'A clinical deep-dive into vitality',
    category: 'Clinical Journey',
    description:
      'IV drip therapy, cryotherapy, and a full biomarker assessment in a single, clinical visit.',
    longDescription:
      'The Longevity Immersion is the clinical floor of Mastercuts in a single sitting. A biomarker panel taken first, reviewed with our longevity specialist. A tailored IV protocol drawn from your goals. A cryotherapy session to close. The visit is long — three hours of clinical attention — and the output is quiet: a written plan, a starting set of numbers, and a recommendation you can actually act on.\n\nThis is for people thinking in years, not days. Best suited to a first visit when you want measurable ground under your next quarter.',
    philosophy: 'Measured, patient, informed.',
    image: '/assets/Images/H-07.png',
    serviceIds: ['longevity-iv-drip', 'longevity-cryotherapy', 'longevity-biomarker'],
    savings: 12,
  },
  {
    id: 'full-ra',
    name: 'The Khaleeji Heritage Journey',
    tagline: 'A half-day of Mastercuts, end to end',
    category: 'Cultural Ritual',
    description:
      'Inspired by the ancient beauty customs of the Gulf — a Ra signature from hair to skin to touch.',
    longDescription:
      "The Khaleeji Heritage Journey draws on the region's oldest beauty rituals — oud, saffron, black seed, rose — and threads them through four of our signature rooms. A signature cut and style, a deep hydration facial scented with Gulf botanicals, a gel manicure in a heritage palette, and a restorative massage with warm oil.\n\nThe four rooms are sequenced so the day flows as a single arc: sensory attention at every hand-off, tea in between, and a calm that builds through the afternoon.",
    philosophy: 'Heritage, carefully kept.',
    image: '/assets/Images/H-09.png',
    serviceIds: [
      'atelier-signature-cut',
      'solar-hydration-infusion',
      'alchemic-gel-manicure',
      'somatic-signature-massage',
    ],
    savings: 15,
  },
  {
    id: 'colour-and-glow',
    name: 'Colour & Glow',
    tagline: 'Radiance from root to skin',
    category: 'Radiance Journey',
    description:
      'Colour transformation, a brightening facial, and a bond-building conditioning ritual in one arc.',
    longDescription:
      "Colour & Glow is for a season when you want light — in the hair and in the skin. A dimensional colour transformation with one of our senior colourists lays the base. A Vitamin C brightening facial follows, to meet the hair's new read of light. A bond-building conditioning ritual closes the day so the colour holds and the cuticle stays sealed.\n\nThe three rituals are calibrated to each other — the facial avoids the roots while the colour sets, the conditioning ritual sits last so the blow-out is fresh when you leave.",
    philosophy: 'Light meets light.',
    image: '/assets/Images/H-08.png',
    serviceIds: [
      'atelier-colour-transformation',
      'solar-vitamin-c',
      'atelier-deep-conditioning',
    ],
    savings: 12,
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getRitual(id: string): Ritual | undefined {
  return rituals.find((r) => r.id === id);
}

export function getTherapist(id: string): Therapist | undefined {
  return therapists.find((s) => s.id === id);
}

export function getTherapistsForRitual(ritualId: string): Therapist[] {
  return therapists.filter((s) => s.ritualIds.includes(ritualId as never));
}

export function getServicesForRitual(
  ritualId: string,
  audience?: ServiceAudience,
): Service[] {
  return services.filter((s) => {
    if (s.ritualId !== ritualId) return false;
    if (!audience || audience === 'unisex') return true;
    return s.audience === audience || s.audience === 'unisex';
  });
}

// Returns services eligible for at-home booking, filtered by audience.
// At-home services are limited to Nails, Massage, and Threading per current
// transition-period operations.
export function getAtHomeServices(audience?: ServiceAudience): Service[] {
  return services.filter((s) => {
    const loc = s.location ?? 'salon';
    if (loc === 'salon') return false;
    if (!audience || audience === 'unisex') return true;
    return s.audience === audience || s.audience === 'unisex';
  });
}

export function getPackagesForRitual(ritualId: string): Package[] {
  const ritualServiceIds = new Set(
    services.filter((s) => s.ritualId === ritualId).map((s) => s.id)
  );
  return packages.filter((p) => p.serviceIds.some((id) => ritualServiceIds.has(id)));
}

// Journeys are packages in the richer, storytelling framing.
export const journeys = packages;

export function getJourney(id: string): Package | undefined {
  return packages.find((p) => p.id === id);
}

export interface JourneyTotals {
  totalDuration: number;
  totalPriceFull: number;
  totalPriceDiscounted: number;
  savingsAed: number;
}

export function getFrequentlyAddedSuggestions(cartServiceIds: string[], limit = 6): Service[] {
  if (cartServiceIds.length === 0) return [];

  // Collect ritual IDs of items in cart
  const cartRitualIds = new Set<string>();
  const cartIdSet = new Set(cartServiceIds);
  for (const id of cartServiceIds) {
    const svc = getService(id);
    if (svc) cartRitualIds.add(svc.ritualId);
  }

  // Gather candidates: services from the same rituals, not already in cart
  const sameRitual: Service[] = [];
  const crossRitual: Service[] = [];

  for (const svc of services) {
    if (cartIdSet.has(svc.id)) continue;
    if (cartRitualIds.has(svc.ritualId)) {
      sameRitual.push(svc);
    } else {
      crossRitual.push(svc);
    }
  }

  // Mix: prioritize same-ritual services, then add cross-ritual for variety
  const result: Service[] = [];
  for (const svc of sameRitual) {
    if (result.length >= limit) break;
    result.push(svc);
  }
  for (const svc of crossRitual) {
    if (result.length >= limit) break;
    result.push(svc);
  }

  return result;
}

export function getJourneyTotals(journey: Package): JourneyTotals {
  const resolved = journey.serviceIds.map(getService).filter(Boolean) as Service[];
  const totalDuration = resolved.reduce((s, svc) => s + svc.durationMin, 0);
  const totalPriceFull = resolved.reduce((s, svc) => s + svc.price, 0);
  const totalPriceDiscounted = Math.round(totalPriceFull * (1 - journey.savings / 100));
  return {
    totalDuration,
    totalPriceFull,
    totalPriceDiscounted,
    savingsAed: totalPriceFull - totalPriceDiscounted,
  };
}
