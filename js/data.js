/* =====================================================================
   Smart Reading Buddy — SITE DATA
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to update the website.
   Every page reads its content from here.

   Placeholder conventions
   - "PASTE_DRIVE_LINK_HERE"  → any Drive link not added yet.
                                Items with this link show as "Pending"
                                automatically, and their button is disabled.
   - "TBA"                    → dates, marks, names or numbers not known yet.
   - Image paths that don't exist yet show a neat placeholder instead.
     For photos/screenshots, .jpg, .webp and .png are all tried
     automatically, so either format works.
   ===================================================================== */

window.SITE_DATA = {

  /* ------------------------------------------------------------------ */
  /* GENERAL                                                            */
  /* ------------------------------------------------------------------ */
  site: {
    title: "Smart Reading Buddy",
    shortName: "SRB",
    officialTitle: "A Multisensory Assistive System & Buddy Device for Sinhala–English Dyslexia Intervention",
    projectId: "R26-IT-069",
    panel: "IT-P05",
    university: "Sri Lanka Institute of Information Technology (SLIIT)",
    faculty: "Faculty of Computing",
    degree: "BSc (Hons) in Information Technology",
    year: "2026",
    abstract:
      "Smart Reading Buddy (SRB) is a multisensory Sinhala–English literacy solution that helps children with reading and writing difficulties, including dyslexia. It combines a Flutter mobile app with four learning components, progress data for parents, and a low-cost Buddy hardware device that gives supportive audio, light and vibration feedback. It works fully offline and is a learning aid, not a diagnostic tool.",
    vision:
      "A supportive learning tool that lets children practise literacy regularly, receive instant non-shaming feedback, and turns every interaction into useful progress data.",
    ctaText: "Explore the Research",
    ctaLink: "domain.html",
    // YouTube video ID or full YouTube link
    youtubeId: "WUhJvQL3cks",
    logo: "assets/images/logo.png",          // full logo with text (home hero)
    logoIcon: "assets/images/logo-icon.png"  // robot only (navbar, footer)
  },

  /* ------------------------------------------------------------------ */
  /* KEY STATS (Home)                                                   */
  /* ------------------------------------------------------------------ */
  stats: [
    { value: "86.09%", label: "EduPlay model accuracy",        note: "30-tree Random Forest, on-device" },
    { value: "93.37%", label: "Handwriting CNN test accuracy", note: "" },
    { value: "95",     label: "Character classes",             note: "43 Sinhala + 52 English" },
    { value: "5,225",  label: "Handwriting samples",           note: "" },
    { value: "100%",   label: "Offline core",                  note: "" }
  ],

  /* ------------------------------------------------------------------ */
  /* KEY FEATURES (Home) — taken from the Project Charter               */
  /* ------------------------------------------------------------------ */
  highlights: [
    { icon: "wifiOff", title: "Fully offline",           text: "The core learning experience runs on the device without an internet connection." },
    { icon: "globe",   title: "Sinhala–English",         text: "Bilingual reading, writing and pronunciation practice." },
    { icon: "volume",  title: "Buddy device feedback",   text: "A low-cost Buddy device gives supportive audio, light and vibration feedback over BLE." },
    { icon: "users",   title: "Progress for parents",    text: "Parents see progress and approve, disapprove or ignore EduPlay suggestions." },
    { icon: "heart",   title: "Non-shaming feedback",    text: "Instant, positive feedback with supportive, guided retries." },
    { icon: "shield",  title: "A learning aid",          text: "SRB supports practice; it is not a diagnostic or clinical tool." }
  ],

  /* ------------------------------------------------------------------ */
  /* RESEARCH COMPONENTS (Home cards + Domain tabs)                     */
  /* `details` is optional: add extra paragraphs here if you want more   */
  /* text in a component's tab.                                          */
  /* ------------------------------------------------------------------ */
  components: [
    {
      code: "C1",
      title: "EduPlay",
      icon: "gamepad",
      member: "Navodya W.P.D.N",
      itNumber: "IT22204370",
      summary: "Interactive activities with on-device Random Forest next-activity prediction under parent supervision.",
      features: [
        "Interactive learning activities",
        "Learning history",
        "On-device Random Forest next-activity prediction",
        "Parent approve / disapprove / ignore control"
      ],
      output: "Offline learning cycle and recommendation assignment record",
      heroChip: { label: "C1 EduPlay",       text: "86.09% model accuracy" },
      tags: ["Random Forest", "On-device", "Parent control"],
      details: []
    },
    {
      code: "C2",
      title: "Handwriting Recognition",
      icon: "pen",
      member: "Methsani M.M.M",
      itNumber: "IT22192646",
      summary: "Free-hand Sinhala and English character recognition with an on-device CNN.",
      features: [
        "Free-hand Sinhala / English character recognition",
        "CNN trained in TensorFlow / Keras",
        "On-device inference with TensorFlow Lite",
        "Attempt results and analytics"
      ],
      output: "Handwriting identification and learning progress",
      heroChip: { label: "C2 Handwriting",   text: "93.37% CNN accuracy" },
      tags: ["CNN", "TensorFlow Lite", "Sinhala & English"],
      details: []
    },
    {
      code: "C3",
      title: "Guided Timed Reading",
      icon: "clock",
      member: "Karannagoda I.U",
      itNumber: "IT22201300",
      summary: "Timed sentence reading against reference times, with repeated attempts and progress charts.",
      features: [
        "Sentence reading with a timer",
        "Reference expected times with configurable tolerance thresholds",
        "Repeated attempts",
        "Progress charts"
      ],
      output: "Reading fluency session record",
      heroChip: { label: "C3 Timed Reading", text: "WPM progress tracking" },
      tags: ["Timer", "Tolerance thresholds", "Progress charts"],
      details: []   // ← paste extra C3 detail here (one string per paragraph)
    },
    {
      code: "C4",
      title: "Pronunciation Verification",
      icon: "mic",
      member: "Abekoon I.L",
      itNumber: "IT22175670",
      summary: "MFCC + DTW comparison with reference audio, three-level feedback, VMG and PEPA.",
      features: [
        "MFCC + Dynamic Time Warping (DTW) comparison with reference audio",
        "OK / ALMOST / WRONG feedback",
        "Visual Mouth Guide (VMG)",
        "Multi-attempt guided retries",
        "Pronunciation Error Pattern Analysis (PEPA)"
      ],
      output: "Pronunciation judgment and error patterns",
      heroChip: { label: "C4 Pronunciation", text: "MFCC + DTW scoring" },
      tags: ["MFCC", "DTW", "VMG", "PEPA"],
      details: []   // ← paste extra C4 detail here (one string per paragraph)
    }
  ],

  /* ------------------------------------------------------------------ */
  /* APP SCREENSHOTS (Home) — .jpg / .webp / .png, max ~300 KB each.     */
  /* Keep the order C1–C4: the hero phone pairs slide 1 with C1, etc.    */
  /* ------------------------------------------------------------------ */
  screenshots: [
    { src: "assets/images/screenshots/eduplay.jpg",       alt: "EduPlay activity screen",               caption: "EduPlay" },
    { src: "assets/images/screenshots/handwriting.jpg",   alt: "Handwriting recognition practice screen", caption: "Handwriting" },
    { src: "assets/images/screenshots/timed-reading.jpg", alt: "Guided timed reading screen",           caption: "Timed Reading" },
    { src: "assets/images/screenshots/pronunciation.jpg", alt: "Pronunciation verification screen",     caption: "Pronunciation" }
  ],

  /* ------------------------------------------------------------------ */
  /* DOMAIN PAGE (from the Project Charter)                             */
  /* ------------------------------------------------------------------ */
  domain: {
    need: [
      "Lack of affordable assistive tools for Sinhala and English reading and writing.",
      "Need for personalised handwriting, reading and pronunciation practice.",
      "Need to understand a child's progress beyond single exercises.",
      "Need for an offline mode and affordable hardware."
    ],

    objectives: [
      { id: "O1", objective: "One cohesive Sinhala–English mobile learning system",          evidence: "Flutter integration and complete working example" },
      { id: "O2", objective: "Child-friendly independent handwriting practice",              evidence: "Offline handwriting recognition, instant feedback, attempt tracking" },
      { id: "O3", objective: "Guided reading fluency practice",                              evidence: "Reading time tracking, threshold criteria, repetition tracking" },
      { id: "O4", objective: "Pronunciation practice with increasing difficulty",            evidence: "Audio comparison, three feedback levels, error tracking" },
      { id: "O5", objective: "Suggest suitable next activities with parental supervision",  evidence: "Local activity suggestion and parent approve / disapprove / ignore" },
      { id: "O6", objective: "Feedback through the Buddy device",                            evidence: "Complete BLE command-to-feedback cycle demonstrated" },
      { id: "O7", objective: "Technical assessment and usability evaluation",                evidence: "Test report, limitations and ethics evidence" }
    ],

    scope: {
      in: [
        "Bilingual interactive literacy activities for primary learners",
        "Flutter interface with level selection, feedback and local progress",
        "EduPlay recommendation and parent decisions",
        "Free-hand character recognition",
        "Timed reading with repetition and trends",
        "Pronunciation with reference audio and guided retries",
        "Buddy audio / LED / vibration feedback",
        "Integration, offline processing and usability testing"
      ],
      out: [
        "Medical diagnosis or clinical intervention",
        "Any promise of curing dyslexia",
        "School-wide rollout or commercial production",
        "Mandatory cloud speech recognition",
        "Languages other than Sinhala and English",
        "Automatic teacher decisions or uncontrolled access to children's data"
      ]
    },

    // Integration concept flow. lane: "child" | "app" | "device"
    integration: [
      { label: "Child",                              icon: "user",       lane: "child" },
      { label: "Flutter app",                        icon: "smartphone", lane: "app" },
      { label: "Component activity",                 icon: "layers",     lane: "app" },
      { label: "Local performance record (SQLite)",  icon: "database",   lane: "app" },
      { label: "Parent view (progress + EduPlay approval)", icon: "users", lane: "app" },
      { label: "BLE command",                        icon: "bluetooth",  lane: "device" },
      { label: "ESP32 Buddy",                        icon: "cpu",        lane: "device" },
      { label: "Audio / light / vibration feedback", icon: "volume",     lane: "device" }
    ],
    // Optional architecture image (e.g. "assets/images/diagrams/architecture.webp"). Leave "" to hide.
    architectureDiagram: "",
    architectureAlt: "",

    technologies: [
      { name: "Flutter & Dart",                  role: "Mobile app",                                   icon: "smartphone" },
      { name: "SQLite",                          role: "Local records + packaged JSON / audio assets", icon: "database" },
      { name: "TensorFlow / Keras + TF Lite",    role: "Handwriting CNN, on-device inference",         icon: "cpu" },
      { name: "Scikit-learn Random Forest",      role: "EduPlay model, on-device Dart inference",      icon: "git" },
      { name: "MFCC + DTW",                      role: "Pronunciation comparison",                     icon: "activity" },
      { name: "BLE + ESP32",                     role: "Buddy device feedback",                        icon: "bluetooth" }
    ],

    successCriteria: [
      "A full session runs without internet.",
      "All four component flows are demonstrated with records.",
      "The Buddy gives correct feedback when connected, and the app still works when it is disconnected.",
      "Performance claims are backed by datasets, method and limitations.",
      "Parents see progress while the child's data stays private."
    ],

    ethics: [
      { icon: "checkCircle", text: "Institutional ethics approval" },
      { icon: "smile",       text: "Age-appropriate child assent, and withdrawal without penalty" },
      { icon: "user",        text: "Coded participants and minimal data" },
      { icon: "lock",        text: "Restricted data access" },
      { icon: "heart",       text: "Positive feedback only" },
      { icon: "mic",         text: "Pronunciation audio processed short-term and then deleted" }
    ],

    risks: [
      { risk: "Limited sample or school access",          mitigation: "Early approval, anonymised collection" },
      { risk: "Wrong speech comparisons",                 mitigation: "Representative test sets, calibration" },
      { risk: "Noise, device variety, connectivity",      mitigation: "Low-end device testing, offline operation, BLE reconnection" },
      { risk: "Component mismatch",                       mitigation: "Shared IDs, schemas, integration tests" },
      { risk: "Child frustration or wrong feedback",      mitigation: "Supportive retries, parent supervision, usability study" },
      { risk: "Data and consent",                         mitigation: "Data minimisation, access control, consent / assent" },
      { risk: "Budget or schedule overrun",               mitigation: "Focus on key features, review scope at milestones" }
    ],

    /* Optional sections — they only appear on the site when filled in.
       literature: [ { title: "...", text: "..." } ]
       gap: { caption: "...", systems: ["Work A", ..., "Smart Reading Buddy"],
              rows: [ { feature: "...", values: [true, false, "Partial", ...] } ] } */
    literature: [],
    gap: null
  },

  /* ------------------------------------------------------------------ */
  /* MILESTONES                                                         */
  /* ------------------------------------------------------------------ */
  // Project phases from the charter (shown as the first timeline)
  phases: [
    { name: "Initiation",       activity: "TBA", exit: "TBA" },
    { name: "Preparation",      activity: "TBA", exit: "TBA" },
    { name: "Component Builds", activity: "TBA", exit: "TBA" },
    { name: "Integration",      activity: "TBA", exit: "TBA" },
    { name: "Evaluation",       activity: "TBA", exit: "TBA" },
    { name: "Closure",          activity: "TBA", exit: "TBA" }
  ],

  // Assessments (shown sorted by date). status: "Completed" or "Upcoming". marks: "" hides the marks line.
  // feedback (optional): { text, image, imageAlt } — group-level panel feedback shown in the accordion.
  milestones: [
    { title: "Project Proposal",        date: "17 March 2026",     marks: "", status: "Completed", description: "Proposal presentation and documents, including the Project Charter and individual component proposals.",
      feedback: { text: "The panel approved the fully offline, on-device approach for all components. Pronunciation verification was noted as good, and the panel recommended handwriting recognition as an on-device component and asked the team to clarify how audio feedback fits into the reading activity." } },
    { title: "Progress Presentation 1", date: "12 May 2026",       marks: "", status: "Completed", description: "First progress review of the system and each component, presented to the panel.",
      feedback: { text: "Very good overall progress across the components." } },
    { title: "Progress Presentation 2", date: "2 September 2026",  marks: "", status: "Completed", description: "Second progress review of the integrated system and each component, presented to the panel.",
      feedback: { text: "Excellent progress for all four components. The panel recommended focusing on the research paper.",
                  image: "assets/images/feedback/pp2-feedback.png", imageAlt: "PP2 panel feedback sheet" } },
    { title: "Final Assessment",        date: "20 October 2026",   marks: "", status: "Completed", description: "Final demonstration of the complete system with the final theses and research paper." },
    { title: "Viva (including website viva)", date: "20 October 2026", marks: "", status: "Completed", description: "Individual viva where each member presents and defends their component." },
    { title: "Website Submission",      date: "11 October 2026",   marks: "", status: "Completed", description: "Research website presenting the project, milestones, documents, presentations and team." }
  ],

  /* ------------------------------------------------------------------ */
  /* DOCUMENTS — leave link as "PASTE_DRIVE_LINK_HERE" → Pending        */
  /* ------------------------------------------------------------------ */
  documents: [
    {
      group: "Project Charter",
      items: [
        { title: "Project Charter", icon: "flag", description: "Official charter: scope, objectives, phases, risks and ethics.", link: "https://drive.google.com/file/d/1rHOisjqROlh_6v3k6BTph_lSXczuXYXe/view?usp=sharing" }
      ]
    },
    {
      group: "Proposal Documents",
      // The main (group) proposal is shown as a large card; `children` are listed inside it.
      items: [
        {
          title: "Group Proposal — Smart Reading Buddy", icon: "book", featured: true,
          description: "Group proposal document covering all four components.",
          link: "https://drive.google.com/file/d/1n5ZOoR3lSA7RqFBWe70njEAAY0qrOm47/view?usp=sharing",
          children: [
            { title: "Navodya W.P.D.N",  subtitle: "IT22204370 · C1 EduPlay",                    link: "https://drive.google.com/file/d/1xxRNPBOt799dkd4T6hwfvuePCMa5CtjR/view?usp=sharing" },
            { title: "Methsani M.M.M",   subtitle: "IT22192646 · C2 Handwriting Recognition",    link: "https://drive.google.com/file/d/1-4lkN6vjYazCppTlGDELxbHJCuwa8iEr/view?usp=sharing" },
            { title: "Karannagoda I.U",  subtitle: "IT22201300 · C3 Guided Timed Reading",       link: "https://drive.google.com/file/d/1zOZnmZZyxnQ6BYol0Ihq_LTByAZqDbDc/view?usp=sharing" },
            { title: "Abekoon I.L",      subtitle: "IT22175670 · C4 Pronunciation Verification", link: "https://drive.google.com/file/d/19S6xoWfBrs0o2S_MHBDx6QMTHGClyzwg/view?usp=sharing" }
          ]
        }
      ]
    },
    {
      group: "Checklist Documents",
      items: [
        { title: "Checklist — Progress Presentation 1", icon: "clipboard", description: "Checklist submitted for PP1.", link: "PASTE_DRIVE_LINK_HERE" },
        { title: "Checklist — Progress Presentation 2", icon: "clipboard", description: "Checklist submitted for PP2.", link: "PASTE_DRIVE_LINK_HERE" }
      ]
    },
    {
      group: "Final Thesis",
      // No group thesis: this card has no link of its own and only groups the four individual theses.
      items: [
        {
          title: "Final Thesis — Smart Reading Buddy", icon: "book", featured: true,
          description: "Individual final theses for the four components of the system.",
          childrenLabel: "Individual theses", childLabel: "thesis",
          children: [
            { title: "Navodya W.P.D.N",  subtitle: "IT22204370 · C1 EduPlay",                    link: "https://drive.google.com/file/d/1vTWziva5mnF1D5Bp1Cvk0Fel_kioVb-X/view?usp=sharing" },
            { title: "Methsani M.M.M",   subtitle: "IT22192646 · C2 Handwriting Recognition",    link: "https://drive.google.com/file/d/1QcwteCQAGhp1DnSA4Cr5fboGE5kkN3N2/view?usp=sharing" },
            { title: "Karannagoda I.U",  subtitle: "IT22201300 · C3 Guided Timed Reading",       link: "https://drive.google.com/file/d/1qlvYTtV7-PyHNlvrlpoQld5zTyV1_tQQ/view?usp=sharing" },
            { title: "Abekoon I.L",      subtitle: "IT22175670 · C4 Pronunciation Verification", link: "https://drive.google.com/file/d/1ZqfhxWW0g5ixKkYG5my3Fwl6deUOFA-G/view?usp=sharing" }
          ]
        }
      ]
    },
    {
      group: "Research Paper",
      items: [
        { title: "Research Paper", icon: "award", description: "Research paper describing the system and its evaluation.", link: "PASTE_DRIVE_LINK_HERE" }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* PRESENTATIONS                                                      */
  /* ------------------------------------------------------------------ */
  presentations: [
    { title: "Proposal Presentation",   description: "Research need, objectives, scope and the four components.", date: "17 March 2026", link: "https://drive.google.com/file/d/1-xy1ZGmg7BQEj97mfd1zPAG6bvMj7guW/view" },
    { title: "Progress Presentation 1", description: "First progress review.",                                     date: "12 May 2026", link: "https://drive.google.com/file/d/1f9M761GK-Il9-oKGsVqFsTuIsnJNDT4u/view" },
    { title: "Progress Presentation 2", description: "Second progress review.",                                    date: "2 September 2026", link: "https://drive.google.com/file/d/1vW9WQ5F5lYsoCUeHmZMhRQ6xqz3XDodr/view" },
    { title: "Final Presentation",      description: "Final demonstration of the complete system.",               date: "20 October 2026", link: "PASTE_DRIVE_LINK_HERE" }
  ],

  /* ------------------------------------------------------------------ */
  /* TEAM — photos are shown as circles (.jpg or .webp both work)       */
  /* ------------------------------------------------------------------ */
  team: {
    // role: "Group Leader" for the leader, "Team Member" for everyone else.
    // Leave email / designation as "" if unknown — the line is hidden automatically.
    members: [
      { name: "Navodya W.P.D.N", itNumber: "IT22204370", component: "C1 · EduPlay",                    role: "Team Member", email: "", photo: "assets/images/team/member1.jpg" },
      { name: "Methsani M.M.M",  itNumber: "IT22192646", component: "C2 · Handwriting Recognition",    role: "Team Member", email: "", photo: "assets/images/team/member3.jpg" },
      { name: "Karannagoda I.U", itNumber: "IT22201300", component: "C3 · Guided Timed Reading",       role: "Team Member", email: "", photo: "assets/images/team/member2.jpg" },
      { name: "Abekoon I.L",     itNumber: "IT22175670", component: "C4 · Pronunciation Verification", role: "Team Member", email: "", photo: "assets/images/team/member4.jpg" }
    ],
    supervisors: [
      { role: "Supervisor",    name: "Prof. Anuradha Jayakody",  designation: "", email: "", photo: "assets/images/team/supervisor.jpg" },
      { role: "Co-Supervisor", name: "Mr. Uditha Dharmakeerthi", designation: "", email: "", photo: "assets/images/team/co-supervisor.jpg" }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* CONTACT                                                            */
  /* ------------------------------------------------------------------ */
  contact: {
    groupEmail: "imalkalakshitha485@gmail.com",
    phone: "+94 75 475 8117",        // how the number is displayed
    phoneLink: "tel:+94754758117",   // what the phone dials when tapped
    address: "Sri Lanka Institute of Information Technology, New Kandy Road, Malabe 10115, Sri Lanka",
    mapEmbed: "https://maps.google.com/maps?q=SLIIT%20Malabe%20Campus&z=16&output=embed",
    mapLink: "https://www.google.com/maps/search/?api=1&query=SLIIT+Malabe+Campus"
  }
};
