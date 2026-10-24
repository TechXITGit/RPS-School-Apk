export const translations = {
  EN: {
    // Header & Brand
    header: {
      schoolCode: 'RPS',
      schoolName: 'Rudrapur Public School',
      motto: 'Building Bright Futures',
      notifications: 'Notifications',
      profile: 'Profile',
      cbseAffiliation: 'CBSE Affiliated • Senior Secondary',
    },

    // Bottom Navigation
    nav: {
      home: 'Home',
      admissions: 'Admission',
      faculty: 'Faculty',
      gallery: 'Gallery',
      about: 'About',
    },

    // Notification Modal
    notifications: {
      title: 'Notices & Circulars',
      subtitle: 'Official updates from RPS Academic & Admin Office',
      allTab: 'All Notices',
      academicTab: 'Academic',
      eventsTab: 'Events & Sports',
      markAllRead: 'Mark all as read',
      close: 'Close',
      items: [
        {
          id: '1',
          type: 'admission',
          title: 'Admission Open for Session 2026–27',
          desc: 'Online registrations and campus prospectuses are now available for Nursery through Class V (Grade 5).',
          time: '1 hour ago',
          isNew: true,
        },
        {
          id: '2',
          type: 'event',
          title: 'Annual Sports Meet 2025: Athlete Trials',
          desc: 'Inter-house football, athletic track trials, and badminton selections start this Thursday on the main turf.',
          time: '3 hours ago',
          isNew: true,
        },
        {
          id: '3',
          type: 'academic',
          title: 'Parent-Teacher Interaction (Grades VI–XII)',
          desc: 'Term-1 diagnostic progress reports will be shared with parents this Saturday, 9:00 AM – 1:30 PM.',
          time: 'Yesterday',
          isNew: false,
        },
        {
          id: '4',
          type: 'event',
          title: "Science & Innovation Fair 'Pratibha 2025'",
          desc: 'Atal Tinkering Lab project submissions for regional STEM exhibition close on 15th October.',
          time: '2 days ago',
          isNew: false,
        },
      ],
    },

    // Splash Screen
    splash: {
      schoolName: 'RUDRAPUR PUBLIC SCHOOL',
      tagline: 'Building Bright Futures • Est. 2024',
      loading: 'Loading school experience...',
      skip: 'Tap to Skip',
    },

    // Home Screen
    home: {
      tickerBadge: '📢 LATEST',
      tickerNotice: 'Admission Open 2026–27: Registrations live for Nursery to Class V!',
      heroBadge: '● ADMISSION OPEN 2026–27 (NURSERY – V)',
      heroTitle: 'Empowering minds, shaping the leaders of tomorrow.',
      heroSubtitle:
        'A legacy of holistic academic distinction, state-of-the-art STEM laboratories, and character-driven mentorship nestled in Rudrapur.',
      heroBtnAdmission: 'Admission Overview',
      heroBtnExplore: 'Explore Campus',

      stats: {
        passRate: '100%',
        passRateLabel: 'CBSE Pass',
        studentRatio: '15:1',
        studentRatioLabel: 'Student : Teacher',
        labsCount: '12+',
        labsCountLabel: 'Hi-Tech Labs',
      },

      quickGatewaysTitle: 'Quick Gateways',
      quickGatewaysSubtitle: 'Essential portals for parents & scholars',
      gateways: {
        admissions: {
          title: 'Admission',
          desc: 'Nursery to Class V criteria, deadlines & fee details.',
          cta: 'Explore',
        },
        parentDesk: {
          title: 'Parent Desk',
          desc: 'Real-time attendance, grades & fee dues.',
          cta: 'Sign In',
        },
        mentors: {
          title: 'Mentors',
          desc: 'Meet dedicated subject leads & counselors.',
          cta: 'Directory',
        },
        galleries: {
          title: 'Galleries',
          desc: 'Art ateliers, sports meets & life on campus.',
          cta: 'View All',
        },
      },

      experienceTitle: 'Experience RPS',
      experienceSubtitle: 'World-Class Infrastructure',
      carousel: [
        {
          id: '1',
          tag: 'Classrooms',
          title: 'Smart Interactive Rooms',
          desc: 'Equipped with 4K touch displays and audio systems for dynamic visual learning.',
        },
        {
          id: '2',
          tag: 'Innovation',
          title: 'Advanced Science & STEM',
          desc: 'Robotics suites, maker corners, and high-spec analytical equipment.',
        },
        {
          id: '3',
          tag: 'Knowledge Hub',
          title: 'Central Digital Library',
          desc: '15,000+ academic volumes, e-journal terminals, and quiet study alcoves.',
        },
        {
          id: '4',
          tag: 'Cultural Wing',
          title: 'Annual Cultural Fest',
          desc: 'Grand amphitheater productions celebrating theatre, music, and art.',
        },
      ],

      whyChooseTitle: 'Why Choose RPS?',
      whyChooseSubtitle: 'Excellence in every dimension of education',
      pillars: [
        {
          id: '1',
          tag: 'Academics',
          title: 'Academic Rigor & STEM Excellence',
          desc: 'Carefully structured CBSE curriculum enhanced by experiential robotics, coding electives, and regular analytical mentorship to prime scholars for Olympiads and competitive entrances.',
        },
        {
          id: '2',
          tag: 'Athletics',
          title: 'Holistic Sports & Physical Development',
          desc: 'World-standard synthetic turf, floodlit basketball arenas, cricket pitches, and certified NIS athletic coaches training champions in endurance and team spirit.',
        },
        {
          id: '3',
          tag: 'Character',
          title: 'Values-Based Leadership & Empathy',
          desc: 'Instilling ethical integrity, mutual respect, community service, and environmental stewardship to nurture responsible, global citizens.',
        },
      ],

      needGuidanceTitle: 'Need Guidance?',
      needGuidanceSub: 'Talk to Our Admissions Counselors',
      callNow: 'Call Now',
    },

    // Gallery Screen
    gallery: {
      tag: 'CAMPUS CHRONICLES',
      title: 'Life at Rudrapur Public School',
      subtitle:
        'Explore our vibrant campus, state-of-the-art facilities, athletic triumphs, and cultural celebrations.',
      categories: {
        all: 'All Photos',
        campus: 'Campus & Labs',
        sports: 'Athletics & Sports',
        cultural: 'Cultural Fests',
        stem: 'Innovations & STEM',
        arts: 'Library & Arts',
      },
      featuredBadge: 'Featured Album',
      featuredPhotosSuffix: 'Photos',
      featuredTitle: 'Annual Founders Day & Cultural Extravaganza 2024',
      featuredSubtitle:
        'A kaleidoscope of classical dance, symphonic drama & student talent',
      featuredLocation: 'School Main Amphitheatre',
      featuredDate: 'Nov 2024',
      momentsHeader: 'Moments & Spaces',
      albumsBadge: 'Albums',
      tapToInspect: 'Tap photo to inspect',
      cards: {
        card1: {
          tag: 'STEM',
          title: 'Robotics & AI Innovation Lab',
          subtitle: 'Students coding autonomous rovers and IoT sensor arrays',
          location: 'Tinkering Lab Wing B',
          date: 'Oct 2024',
          desc: 'Indian school students in smart lab coats collaborating over modular autonomous robotics kits with breadboards, soldering equipment, and laptops glowing with code on wooden workbenches.',
        },
        card2: {
          tag: 'Sports',
          title: 'Inter-School Football Championship',
          subtitle: 'RPS Greens lift the regional trophy after thrilling shootout',
          location: 'School Main Grounds',
          date: 'Nov 2024',
          desc: 'High school soccer team in green and white athletic jerseys passionately lifting a golden championship trophy on a manicured grass athletic field under golden hour sunlight.',
        },
        card3: {
          tag: 'Academics',
          title: 'Advanced Chemistry Laboratory',
          subtitle: 'Hands-on acid-base titration and analytical testing',
          location: 'Science Block 2nd Floor',
          date: 'Sep 2024',
          desc: 'Secondary school students wearing protective safety goggles carefully observing vibrant color change reactions in glass beakers and burettes during titration in a pristine, bright chemistry laboratory.',
        },
        card4: {
          tag: 'Campus',
          title: 'Central Reading & Digital Lounge',
          subtitle: 'Quiet study bays, Kindle pods & archival collection',
          location: 'Heritage Wing Library',
          date: 'Aug 2024',
          desc: 'Sunlit double-height school library with warm oak bookshelves reaching toward vaulted skylights, cozy ergonomic reading alcoves, and students reading peacefully in comfortable emerald green armchairs.',
        },
        card5: {
          tag: 'Cultural',
          title: 'Vocal Music & Classical Dance',
          subtitle: 'Kathak mudras and Hindustani classical rehearsals',
          location: 'Performing Arts Studio',
          date: 'Oct 2024',
          desc: 'Art students and young vocalists in a polished wooden dance studio adorned with brass ghungroo bells and classical instruments like tanpura and sitar.',
        },
        card6: {
          tag: 'Environment',
          title: 'Green Campus Initiative',
          subtitle: 'Botanical propagation, composting & organic farming',
          location: 'Eco-Park South Quad',
          date: 'Nov 2024',
          desc: 'Students tending to medicinal herbs, hydroponic vertical planters, and young saplings in a high-tech glass educational greenhouse. Lush green foliage and gentle misting systems.',
        },
        card7: {
          tag: 'Inauguration',
          title: 'Official School Inauguration Ceremony',
          subtitle: 'Grand opening led by Hon. MLC Dr. Ratanpal Singh',
          location: 'Kashipuram Campus, Rudrapur (Deoria)',
          date: 'Apr 2024',
          desc: 'Historic founding moments of Rudrapur Public School at Kashipuram Colony, Deoria. Hon. Member of Legislative Council Dr. Ratanpal Singh inaugurated the school by ribbon cutting in the presence of the school management and esteemed regional dignitaries.',
        },
      },
      ctaTitle: 'Experience RPS in Person',
      ctaSubtitle: 'Guided tours daily between 9:00 AM – 2:30 PM',
      ctaButton: 'Book a Guided Campus Visit',
      lightboxPhoto: 'Photo',
      lightboxOf: 'of',
      lightboxPrev: 'Previous',
      lightboxNext: 'Next',
    },

    // About Us Screen
    about: {
      badge: 'ABOUT OUR INSTITUTION',
      heroTitle: 'Inspiring Excellence, Fostering Innovation',
      heroSubtitle:
        'Established in 2024, Rudrapur Public School is committed to cultivating intellectual curiosity, resilience, and ethical leadership in a premier CBSE campus setting.',
      heritageTag: 'Our Heritage • Est. 2024',
      cbseBadge: 'CBSE Affiliated • Senior Secondary',
      principalTitle: "Principal's Welcome Desk",
      principalName: 'Dr. Ananya Sharma',
      principalRole: 'Principal, M.Sc., B.Ed., Ph.D. • Gold Medalist',
      principalExcerpt:
        '“At Rudrapur Public School, education is not merely the transmission of facts, but the ignition of creative passion and enduring character...”',
      principalFull:
        '“At Rudrapur Public School, education is not merely the transmission of facts, but the ignition of creative passion and enduring character. We believe every child arrives with unique brilliance waiting to be uncovered.\n\nOur campus brings together world-class scientific infrastructure, deeply empathetic mentors, and a value-first learning culture. Whether your child is conducting automated rover experiments in our Atal Tinkering Lab, mastering classical dance in our arts atelier, or scoring winning goals on our sports turf, we nurture both their ambition and their humanity.\n\nI invite parents to partner with us in shaping confident, empathetic, and future-ready global leaders.”',
      readFull: 'Read Full Message',
      readLess: 'Read Less',
      tabs: {
        vision: 'Vision & Mission',
        values: 'Core Values',
        infrastructure: 'Campus Facilities',
      },
      visionTitle: 'Our Vision & Purpose',
      visionQuote:
        '“To be a beacon of educational excellence that nurtures enlightened, curious, and socially conscious leaders capable of making a profound difference in the world.”',
      missionPillarsTitle: 'Four Mission Pillars',
      missionPillars: [
        {
          title: 'Academic Excellence',
          desc: 'Rigorous CBSE curriculum, analytical inquiry, and personalized academic scaffolds that inspire mastery.',
        },
        {
          title: 'Holistic Growth',
          desc: 'Balancing cognitive rigor with emotional resilience, physical endurance, and creative artistic expression.',
        },
        {
          title: 'Innovation & STEM',
          desc: 'Hands-on robotics, Atal Tinkering Labs, algorithmic reasoning, and real-world scientific experimentation.',
        },
        {
          title: 'Character & Values',
          desc: 'Rooted firmly in empathy, honesty, discipline, and dedicated service to the nation and society.',
        },
      ],
      valuesTitle: 'Core Values that Guide Us',
      values: [
        { title: 'Integrity', desc: 'Uncompromising ethical leadership & honesty.' },
        { title: 'Respect', desc: 'Embracing diversity and universal human dignity.' },
        { title: 'Curiosity', desc: 'Nurturing the drive to question and discover.' },
        { title: 'Excellence', desc: 'Pursuing personal, athletic and academic mastery.' },
        { title: 'Empathy', desc: 'Compassionate support for peers & community.' },
        { title: 'Innovation', desc: 'Creative courage in ideas and problem solving.' },
      ],
      facilitiesTitle: 'Campus Infrastructure',
      facilities: [
        {
          title: 'Smart Interactive Classrooms',
          desc: 'Ergonomically designed, climate-regulated learning suites equipped with high-resolution digital collaborative displays.',
          tag: 'Academics',
        },
        {
          title: 'Advanced Science & Tinkering Labs',
          desc: 'Comprehensive Physics, Chemistry, and Biology suites paired with Atal Tinkering Lab for early robotics and micro-electronics.',
          tag: 'Innovation',
        },
        {
          title: 'Central Curated Library',
          desc: 'Quiet contemplation zones and collaborative study pods featuring over 15,000 physical volumes, scientific journals, and global e-library access.',
          tag: 'Knowledge',
        },
        {
          title: 'Sports Complex & Academies',
          desc: 'Multi-sport floodlit turf, cricket pitch, badminton and basketball courts coached by certified NIS sports instructors.',
          tag: 'Athletics',
        },
        {
          title: 'Open-Air Amphitheatre & Arts Center',
          desc: 'Dedicated spaces for Indian classical and western music, theatrical drama, elocution debates, and grand celebratory annual festivals.',
          tag: 'Culture',
        },
      ],
      connectTitle: 'Connect with RPS Desk',
      connectSubtitle: 'Campus Visit Hours: Mon – Sat • 8:30 AM – 3:30 PM',
      callBtn: 'Call Office',
      emailBtn: 'Email Us',
      admissionsBtn: 'Explore Admissions',
    },

    // Admission Screen
    admission: {
      badge: 'ADMISSION OVERVIEW 2026–27 (NURSERY – V)',
      title: 'Admission Open 2026–27',
      subtitle:
        'Join the Rudrapur Public School family. Explore our transparent, student-centered admission process for Nursery through Class V.',
      liveBadge: '● Session 2026–27 Registrations Live (Nursery – V)',
      welcomeTitle: 'Welcome Note from the Admission Desk',
      welcomeLetter:
        '“Dear Parents,\n\nChoosing the right educational institution is one of the most consequential decisions you will make for your child. At Rudrapur Public School, we view admission not as an elimination test, but as a mutual familiarization dialogue.\n\nOur aim is to understand each learner’s unique curiosities, temperament, and aspirations, ensuring they step into an environment where they feel seen, valued, and intellectually stimulated from day one.\n\nWe warmly invite you to visit our campus, observe our laboratories, and meet our academic leadership.”\n\n— Admission Director, Rudrapur Public School',
      stepsTitle: 'Four Simple Steps to Join RPS',
      stepsSubtitle: 'A structured, parent-friendly enrollment roadmap',
      steps: [
        {
          step: '01',
          title: 'Collect Prospectus',
          desc: 'Obtain the official information dossier from campus or review digital guidelines.',
        },
        {
          step: '02',
          title: 'Campus Interaction',
          desc: 'Participate in a welcoming dialogue with our faculty and academic counselors.',
        },
        {
          step: '03',
          title: 'Document Verification',
          desc: 'Submit attested certificates and academic transcripts at the Admission Desk.',
        },
        {
          step: '04',
          title: 'Enrollment & Welcome',
          desc: 'Complete fee formalities and receive the official student welcome kit.',
        },
      ],
      ageTableTitle: 'Class-wise Age Guidelines (Nursery – V)',
      ageTableSubtitle: 'As of 31st March 2026 in accordance with CBSE norms',
      gradeHeader: 'Class / Wing',
      ageHeader: 'Age Benchmark',
      criteriaHeader: 'Evaluation / Readiness Criteria',
      ageRules: [
        {
          grade: 'Nursery',
          age: '3+ Years',
          criteria: 'Child must be 3 years of age by 31st March 2026. Interactive play session & gentle observation only.',
        },
        {
          grade: 'Lower Kindergarten (LKG)',
          age: '4+ Years',
          criteria: 'Child must be 4+ by 31st March 2026. Foundational motor skills, shape recognition & verbal dialogue.',
        },
        {
          grade: 'Upper Kindergarten (UKG)',
          age: '5+ Years',
          criteria: 'Child must be 5+ by 31st March 2026. Early phonics, alphabet familiarity and pre-writing interaction.',
        },
        {
          grade: 'Junior Primary (Classes I & II)',
          age: '6+ to 7+ Years',
          criteria: 'Age-appropriate readiness, foundational literacy, basic numeracy review, and previous school report.',
        },
        {
          grade: 'Senior Primary (Classes III, IV & V)',
          age: '8+ to 10+ Years',
          criteria: 'Marksheet of previous class, transfer certificate (TC), and informal foundational learning review.',
        },
      ],
      datesTitle: 'Important Dates & Key Milestones',
      datesSubtitle: 'Plan your admission journey with clarity',
      dates: [
        {
          phase: 'Phase 1: Online & Campus Registrations Open',
          date: '15th September 2026 onwards',
          status: 'Ongoing',
        },
        {
          phase: 'Phase 2: Parent & Child Familiarization Sessions',
          date: 'Every Saturday & Sunday (By appointment)',
          status: 'Active',
        },
        {
          phase: 'Phase 3: Document Verification & Seat Confirmation',
          date: 'Within 5 working days of interaction',
          status: 'Scheduled',
        },
        {
          phase: 'Phase 4: Orientation & Academic Session Commencement',
          date: 'First week of April 2027',
          status: 'Upcoming',
        },
      ],
      docsTitle: 'Required Documents Checklist',
      docsSubtitle: 'Keep original copies ready for physical verification',
      docs: [
        'Official Birth Certificate issued by Municipal Corporation or authorized registrar.',
        'Previous school report cards/mark sheets for the last 2 academic years (Class I upwards).',
        'Original Transfer Certificate (TC) countersigned by CBSE or concerned education board.',
        '4 recent passport-size colored photographs of the candidate with white background.',
        '2 passport-size photographs of each parent / legal guardian.',
        'Self-attested photocopy of Aadhaar card of the child and parents as proof of identity & residence.',
      ],
      helplineTitle: 'Admission Helpline & Office Desk',
      helplineSub: 'Our admission coordinators are available Monday through Saturday',
      callHelpline: 'Call Helpline',
      emailHelpline: 'Email Admission Desk',
      officeHours: 'Visiting Hours: 9:00 AM – 3:30 PM (Mon–Sat)',
    },

    // Faculty Screen
    faculty: {
      badge: 'MEET OUR MENTORS',
      title: 'Our Dedicated Faculty',
      subtitle:
        'Passionate educators, Ph.D. scholars, and certified mentors inspiring young minds across sciences, arts, and athletics.',
      searchPlaceholder: 'Search faculty by name, subject, role...',
      deptAll: 'All',
      deptSenior: 'Senior Wing',
      deptStem: 'STEM & Labs',
      deptAthletics: 'Athletics',
      deptArts: 'Arts & Humanities',
      expLabel: 'Exp',
      connectBtn: 'Book Guidance',
      members: [
        {
          id: '1',
          name: 'Dr. Ananya Sharma',
          role: 'Senior Mathematics Faculty & Principal',
          qual: 'M.Sc., B.Ed., Ph.D. • Gold Medalist',
          exp: '8+ Years Exp',
          reg: 'CBSE Regd. Mentor #MTH-4402',
          status: 'Available Today',
          quote: 'Passionate educator focused on building mathematical intuition, analytical thinking, and problem-solving joy.',
        },
        {
          id: '2',
          name: 'Vikramaditya Rawat',
          role: 'Physics & Atal Innovation Lead',
          qual: 'M.Sc. Physics (IIT Roorkee)',
          exp: '10+ Years Exp',
          reg: 'Robotics & STEM Specialist',
          status: 'In Tinkering Lab',
          quote: 'Inspiring hands-on physics experimentation and preparing scholars for national science Olympiads.',
        },
        {
          id: '3',
          name: 'Meenakshi Sundaram',
          role: 'Head of English & Dramatic Arts',
          qual: 'M.A. Literature (Delhi Univ)',
          exp: '12+ Years Exp',
          reg: 'MUN & Debating Coach',
          status: 'Available Today',
          quote: 'Fostering expressive articulation, critical literary analysis, and empathetic cross-cultural worldviews.',
        },
        {
          id: '4',
          name: 'Coach Rajeshwar Negi',
          role: 'Director of Physical Education',
          qual: 'M.P.Ed., NIS Certified Athletics Coach',
          exp: '14+ Years Exp',
          reg: 'National Athletics Gold Medalist',
          status: 'On Main Turf',
          quote: 'Cultivating stamina, team resilience, sportsmanship, and tactical athletic excellence across all sports.',
        },
        {
          id: '5',
          name: 'Dr. Priya Sen',
          role: 'Senior Chemistry Faculty',
          qual: 'Ph.D. Applied Chemistry',
          exp: '7+ Years Exp',
          reg: 'Eco-Club Faculty Advisor',
          status: 'Available Today',
          quote: 'Transforming complex chemical mechanisms into intuitive, hands-on laboratory experiences.',
        },
        {
          id: '6',
          name: 'Amit Joshi',
          role: 'Head of Computer Science & AI',
          qual: 'M.Tech CSE, B.Tech IT',
          exp: '9+ Years Exp',
          reg: 'Machine Learning & Python Mentor',
          status: 'In AI Innovation Lab',
          quote: 'Empowering future technologists through structured algorithmic problem solving and ethical AI creation.',
        },
      ],
    },

    // Profile Modal (Guest User)
    profileModal: {
      guestTitle: 'Guest User',
      guestRole: 'Prospective Parent / Visitor',
      badge: 'Guest Session',
      schoolName: 'Rudrapur Public School',
      welcomeTitle: 'Welcome to RPS',
      welcomeMsg: 'You are currently logged in as a Guest User. You have complete access to explore our 2026–27 academic curriculum, world-class faculty, modern campus infrastructure, and photo gallery.',
      affiliationTitle: 'Affiliation & Accreditation',
      affiliationVal: 'CBSE Affiliated (Senior Secondary), New Delhi',
      sessionTitle: 'Current Academic Session',
      sessionVal: '2026–2027 Admission Open (Nursery – V)',
      campusTitle: 'Main Campus',
      exploreAdmissionBtn: 'Apply for Admission',
      exploreAdmissionSession: '2026–27',
      exploreAdmissionClasses: 'Nursery – Class V',
      closeBtn: 'Close',
    },
  },

  HI: {
    // Header & Brand
    header: {
      schoolCode: 'आरपीएस',
      schoolName: 'रुद्रपुर पब्लिक स्कूल',
      motto: 'उज्ज्वल भविष्य का निर्माण',
      notifications: 'सूचनाएं',
      profile: 'प्रोफ़ाइल',
      cbseAffiliation: 'सीबीएसई संबद्ध • उच्च माध्यमिक',
    },

    // Bottom Navigation
    nav: {
      home: 'होम',
      admissions: 'प्रवेश',
      faculty: 'संकाय',
      gallery: 'गैलरी',
      about: 'परिचय',
    },

    // Notification Modal
    notifications: {
      title: 'सूचनाएं एवं परिपत्र',
      subtitle: 'आरपीएस अकादमिक एवं प्रशासनिक कार्यालय से आधिकारिक अपडेट',
      allTab: 'सभी सूचनाएं',
      academicTab: 'अकादमिक',
      eventsTab: 'खेल एवं कार्यक्रम',
      markAllRead: 'सभी पढ़ी हुई चिह्नित करें',
      close: 'बंद करें',
      items: [
        {
          id: '1',
          type: 'admission',
          title: 'सत्र 2026–27 हेतु प्रवेश प्रारंभ',
          desc: 'नर्सरी से कक्षा 5वीं तक ऑनलाइन पंजीकरण एवं प्रॉस्पेक्टस परिसर में उपलब्ध हैं।',
          time: '1 घंटा पहले',
          isNew: true,
        },
        {
          id: '2',
          type: 'event',
          title: 'वार्षिक खेलकूद प्रतियोगिता 2025: चयन ट्रायल',
          desc: 'इंटर-हाउस फुटबॉल, एथलेटिक्स और बैडमिंटन चयन गुरुवार से मुख्य मैदान पर प्रारंभ होंगे।',
          time: '3 घंटे पहले',
          isNew: true,
        },
        {
          id: '3',
          type: 'academic',
          title: 'अभिभावक-शिक्षक संवाद (नर्सरी–5वीं)',
          desc: 'प्रथम सत्र की प्रगति रिपोर्ट इस शनिवार सुबह 9:00 बजे से दोपहर 1:30 बजे तक साझा की जाएगी।',
          time: 'कल',
          isNew: false,
        },
        {
          id: '4',
          type: 'event',
          title: "विज्ञान एवं नवाचार मेला 'प्रतिभा 2025'",
          desc: 'अटल टिंकरिंग लैब प्रोजेक्ट्स जमा करने की अंतिम तिथि 15 अक्टूबर है।',
          time: '2 दिन पहले',
          isNew: false,
        },
      ],
    },

    // Splash Screen
    splash: {
      schoolName: 'रुद्रपुर पब्लिक स्कूल',
      tagline: 'उज्ज्वल भविष्य का निर्माण • स्था. 2024',
      loading: 'विद्यालय अनुभव लोड हो रहा है...',
      skip: 'छोड़ें',
    },

    // Home Screen
    home: {
      tickerBadge: '📢 नवीनतम',
      tickerNotice: 'प्रवेश सत्र 2026–27: नर्सरी से 5वीं कक्षा तक ऑनलाइन पंजीकरण जारी!',
      heroBadge: '● प्रवेश प्रारंभ 2026–27 (नर्सरी – 5वीं)',
      heroTitle: 'सशक्त विचार, उज्ज्वल कल के नेतृत्व का निर्माण।',
      heroSubtitle:
        'रुद्रपुर में स्थित समग्र अकादमिक उत्कृष्टता, आधुनिक स्टेम प्रयोगशालाओं और संस्कारयुक्त मार्गदर्शन का प्रतिष्ठित केंद्र।',
      heroBtnAdmission: 'प्रवेश विवरण',
      heroBtnExplore: 'परिसर दर्शन',

      stats: {
        passRate: '100%',
        passRateLabel: 'सीबीएसई परिणाम',
        studentRatio: '15:1',
        studentRatioLabel: 'छात्र : शिक्षक',
        labsCount: '12+',
        labsCountLabel: 'आधुनिक लैब्स',
      },

      quickGatewaysTitle: 'त्वरित सेवाएं',
      quickGatewaysSubtitle: 'अभिभावकों व छात्रों हेतु प्रमुख पोर्टल',
      gateways: {
        admissions: {
          title: 'प्रवेश',
          desc: 'नर्सरी से 5वीं कक्षा की पात्रता, तिथियां एवं शुल्क विवरण।',
          cta: 'देखें',
        },
        parentDesk: {
          title: 'अभिभावक कक्ष',
          desc: 'दैनिक उपस्थिति, अंक तालिका एवं शुल्क स्थिति।',
          cta: 'लॉग इन',
        },
        mentors: {
          title: 'शिक्षक दल',
          desc: 'हमारे अनुभवी विषय प्रमुखों व मार्गदर्शकों से मिलें।',
          cta: 'सूची देखें',
        },
        galleries: {
          title: 'गैलरी',
          desc: 'कला कार्यशालाएं, खेलकूद एवं परिसर की झलकियां।',
          cta: 'सभी देखें',
        },
      },

      experienceTitle: 'आरपीएस अनुभव',
      experienceSubtitle: 'विश्वस्तरीय सुविधाएं व परिसर',
      carousel: [
        {
          id: '1',
          tag: 'कक्षाएं',
          title: 'स्मार्ट इंटरएक्टिव क्लासरूम',
          desc: '4K टच डिस्प्ले और उन्नत ऑडियो सिस्टम युक्त आधुनिक डिजिटल शिक्षण कक्ष।',
        },
        {
          id: '2',
          tag: 'नवाचार',
          title: 'उन्नत विज्ञान एवं स्टेम लैब',
          desc: 'रोबोटिक्स सुइट्स, टिंकरिंग लैब और उच्च-स्तरीय विश्लेषणात्मक उपकरण।',
        },
        {
          id: '3',
          tag: 'ज्ञान केंद्र',
          title: 'केंद्रीय डिजिटल पुस्तकालय',
          desc: '15,000+ पुस्तकें, ई-जर्नल टर्मिनल्स और शांत अध्ययन क्षेत्र।',
        },
        {
          id: '4',
          tag: 'सांस्कृतिक मंच',
          title: 'वार्षिक सांस्कृतिक उत्सव',
          desc: 'नाट्य कला, शास्त्रीय संगीत और प्रतिभा प्रदर्शन हेतु भव्य एम्फीथिएटर।',
        },
      ],

      whyChooseTitle: 'आरपीएस क्यों चुनें?',
      whyChooseSubtitle: 'शिक्षा के प्रत्येक आयाम में उत्कृष्टता',
      pillars: [
        {
          id: '1',
          tag: 'अकादमिक',
          title: 'अकादमिक गुणवत्ता एवं स्टेम उत्कृष्टता',
          desc: 'अनुभवी शिक्षकों द्वारा सीबीएसई पाठ्यक्रम, प्रायोगिक रोबोटिक्स, कोडिंग और नियमित मार्गदर्शन द्वारा विद्यार्थियों को ओलंपियाड हेतु तैयार करना।',
        },
        {
          id: '2',
          tag: 'खेलकूद',
          title: 'समग्र खेल एवं शारीरिक विकास',
          desc: 'अंतरराष्ट्रीय मानक सिंथेटिक टर्फ, फ्लडलाइट बास्केटबॉल कोर्ट, क्रिकेट पिच और एनआईएस प्रमाणित कोचों द्वारा प्रशिक्षण।',
        },
        {
          id: '3',
          tag: 'संस्कार',
          title: 'मूल्य-आधारित नेतृत्व एवं संवेदनशीलता',
          desc: 'विद्यार्थियों में नैतिक सत्यनिष्ठा, पारस्परिक सम्मान, समाज सेवा और पर्यावरण संरक्षण की भावना का विकास।',
        },
      ],

      needGuidanceTitle: 'मार्गदर्शन चाहिए?',
      needGuidanceSub: 'हमारे प्रवेश सलाहकारों से सीधी बात करें',
      callNow: 'कॉल करें',
    },

    // Gallery Screen
    gallery: {
      tag: 'परिसर की झलकियां',
      title: 'रुद्रपुर पब्लिक स्कूल में जीवन',
      subtitle:
        'हमारे जीवंत परिसर, आधुनिक सुविधाओं, खेलकूद उपलब्धियों और सांस्कृतिक उत्सवों का अवलोकन करें।',
      categories: {
        all: 'सभी फोटो',
        campus: 'परिसर एवं लैब्स',
        sports: 'खेलकूद',
        cultural: 'सांस्कृतिक उत्सव',
        stem: 'नवाचार एवं स्टेम',
        arts: 'पुस्तकालय व कला',
      },
      featuredBadge: 'विशेष एल्बम',
      featuredPhotosSuffix: 'फोटो',
      featuredTitle: 'वार्षिक स्थापना दिवस एवं सांस्कृतिक महोत्सव 2024',
      featuredSubtitle:
        'शास्त्रीय नृत्य, संवादात्मक नाटक एवं छात्र प्रतिभा का मनोरम संगम',
      featuredLocation: 'मुख्य एम्फीथिएटर',
      featuredDate: 'नवंबर 2024',
      momentsHeader: 'स्मृतियां एवं परिसर',
      albumsBadge: 'एल्बम',
      tapToInspect: 'बड़ा देखने हेतु फोटो छुएं',
      cards: {
        card1: {
          tag: 'स्टेम',
          title: 'रोबोटिक्स एवं एआई इनोवेशन लैब',
          subtitle: 'स्वायत्त रोवर एवं आईओटी सेंसर कोड करते विद्यार्थी',
          location: 'टिंकरिंग लैब विंग बी',
          date: 'अक्टूबर 2024',
          desc: 'लैब कोट पहने विद्यार्थी ब्रेडबोर्ड, सोल्डरिंग उपकरण व लैपटॉप पर स्वायत्त रोबोटिक्स किट तैयार करते हुए।',
        },
        card2: {
          tag: 'खेलकूद',
          title: 'अंतर-विद्यालय फुटबॉल चैम्पियनशिप',
          subtitle: 'रोमांचक पेनल्टी शूटआउट के बाद आरपीएस ग्रीन्स ने जीती ट्रॉफी',
          location: 'मुख्य खेल मैदान',
          date: 'नवंबर 2024',
          desc: 'हरी और सफेद जर्सी में हाई स्कूल टीम सुनहरी धूप में गर्व से स्वर्ण ट्रॉफी लहराते हुए।',
        },
        card3: {
          tag: 'अकादमिक',
          title: 'उन्नत रसायन विज्ञान प्रयोगशाला',
          subtitle: 'एसिड-बेस अनुमापन और विश्लेषणात्मक रासायनिक परीक्षण',
          location: 'साइंस ब्लॉक द्वितीय तल',
          date: 'सितंबर 2024',
          desc: 'सुरक्षा चश्मे पहने माध्यमिक विद्यार्थी कांच के बीकरों में रंग परिवर्तन का अवलोकन करते हुए।',
        },
        card4: {
          tag: 'परिसर',
          title: 'केंद्रीय वाचनालय एवं डिजिटल लाउंज',
          subtitle: 'शांत अध्ययन केबिन, किंडल पॉड्स एवं ऐतिहासिक संग्रह',
          location: 'हेरिटेज विंग लाइब्रेरी',
          date: 'अगस्त 2024',
          desc: 'रोशनदान से आती धूप, ओक की अलमारियों और हरे आरामदायक आर्मचेयर में शांत अध्ययन करते विद्यार्थी।',
        },
        card5: {
          tag: 'सांस्कृतिक',
          title: 'शास्त्रीय संगीत एवं कथक नृत्य',
          subtitle: 'कथक मुद्राओं और हिंदुस्तानी शास्त्रीय संगीत का रियाज',
          location: 'कला केंद्र स्टूडियो',
          date: 'अक्टूबर 2024',
          desc: 'घुंघरू, तानपुरा और सितार से सजे लकड़ी के नृत्य स्टूडियो में कलात्मक मुद्राओं का अभ्यास।',
        },
        card6: {
          tag: 'पर्यावरण',
          title: 'हरित परिसर पहल व वनस्पति वाटिका',
          subtitle: 'औषधीय पौधे, जैविक खाद निर्माण एवं पर्यावरण संरक्षण',
          location: 'इको-पार्क साउथ क्वाड',
          date: 'नवंबर 2024',
          desc: 'हाई-टेक ग्लास ग्रीनहाउस में औषधीय जड़ी-बूटियों और वर्टिकल हाइड्रोपोनिक्स की देखभाल करते छात्र।',
        },
        card7: {
          tag: 'भव्य शुभारंभ',
          title: 'रुद्रपुर पब्लिक स्कूल का एमएलसी ने किया शुभारंभ',
          subtitle: 'माननीय विधान परिषद सदस्य डॉ. रतनपाल सिंह द्वारा फीता काटकर उद्घाटन',
          location: 'काशीपुरम कॉलोनी, रुद्रपुर (देवरिया)',
          date: 'अप्रैल 2024',
          desc: 'काशीपुरम कॉलोनी में रुद्रपुर पब्लिक स्कूल का विधान परिषद सदस्य डॉक्टर रतनपाल सिंह ने फीता काटकर शुभारंभ किया। इस अवसर पर उन्होंने आधुनिक शिक्षा के विस्तार पर बल दिया। प्रबंध समिति के ई. करण कुमार, क्षेत्रीय उपाध्यक्ष छोटे लाल निगम, मोती लाल निगम एवं बेचन निगम द्वारा मुख्य अतिथि का स्वागत किया गया।',
        },
      },
      ctaTitle: 'आरपीएस को स्वयं अनुभव करें',
      ctaSubtitle: 'प्रतिदिन सुबह 9:00 से दोपहर 2:30 बजे तक निर्देशित भ्रमण',
      ctaButton: 'कैंपस भ्रमण बुक करें',
      lightboxPhoto: 'फोटो',
      lightboxOf: 'कुल',
      lightboxPrev: 'पिछला',
      lightboxNext: 'अगला',
    },

    // About Us Screen
    about: {
      badge: 'हमारी संस्था के बारे में',
      heroTitle: 'उत्कृष्टता की प्रेरणा, नवाचार का पोषण',
      heroSubtitle:
        'वर्ष 2024 में स्थापित, रुद्रपुर पब्लिक स्कूल एक प्रमुख सीबीएसई परिसर में बौद्धिक जिज्ञासा, धैर्य और नैतिक नेतृत्व विकसित करने हेतु संकल्पित है।',
      heritageTag: 'हमारी धरोहर • स्था. 2024',
      cbseBadge: 'सीबीएसई संबद्ध • उच्च माध्यमिक',
      principalTitle: 'प्रधानाचार्य का स्वागत संदेश',
      principalName: 'डॉ. अनन्या शर्मा',
      principalRole: 'प्रधानाचार्य, एम.एससी., बी.एड., पीएच.डी. • स्वर्ण पदक विजेता',
      principalExcerpt:
        '“रुद्रपुर पब्लिक स्कूल में शिक्षा केवल तथ्यों का ज्ञान नहीं, बल्कि रचनात्मक प्रतिभा और सुदृढ़ चरित्र का निर्माण है...”',
      principalFull:
        '“रुद्रपुर पब्लिक स्कूल में शिक्षा केवल तथ्यों का ज्ञान नहीं, बल्कि रचनात्मक प्रतिभा और सुदृढ़ चरित्र का निर्माण है। हमारा दृढ़ विश्वास है कि प्रत्येक बच्चा अद्वितीय क्षमताओं के साथ आता है, जिसे संवारना हमारा कर्तव्य है।\n\nहमारा परिसर विश्वस्तरीय वैज्ञानिक सुविधाओं, अत्यंत संवेदनशील शिक्षकों और संस्कारयुक्त शिक्षण संस्कृति का संगम है। चाहे आपका बच्चा अटल टिंकरिंग लैब में रोबोटिक्स परीक्षण कर रहा हो, कला केंद्र में शास्त्रीय नृत्य सीख रहा हो, या खेल मैदान पर विजयी गोल कर रहा हो, हम उनके सपनों और व्यक्तित्व दोनों को संवारते हैं।\n\nमैं सभी अभिभावकों को एक उज्ज्वल और सक्षम भविष्य के निर्माण में हमारे साथ जुड़ने के लिए सादर आमंत्रित करती हूँ।”',
      readFull: 'पूरा संदेश पढ़ें',
      readLess: 'कम पढ़ें',
      tabs: {
        vision: 'दृष्टिकोण एवं लक्ष्य',
        values: 'मूल मूल्य',
        infrastructure: 'परिसर सुविधाएं',
      },
      visionTitle: 'हमारा दृष्टिकोण व उद्देश्य',
      visionQuote:
        '“शैक्षणिक उत्कृष्टता का एक ऐसा केंद्र बनना जो प्रबुद्ध, जिज्ञासु और संवेदनशील नागरिकों का निर्माण करे जो विश्व में सकारात्मक बदलाव ला सकें।”',
      missionPillarsTitle: 'चार प्रमुख मिशन स्तंभ',
      missionPillars: [
        {
          title: 'अकादमिक उत्कृष्टता',
          desc: 'गहन सीबीएसई पाठ्यक्रम, विश्लेषणात्मक सोच और व्यक्तिगत मार्गदर्शन जो पूर्ण निपुणता प्रेरित करे।',
        },
        {
          title: 'समग्र विकास',
          desc: 'बौद्धिक क्षमता के साथ-साथ भावनात्मक संतुलन, शारीरिक सहनशक्ति और कलात्मक अभिव्यक्ति का सामंजस्य।',
        },
        {
          title: 'नवाचार एवं स्टेम',
          desc: 'व्यावहारिक रोबोटिक्स, अटल टिंकरिंग लैब, कोडिंग और वास्तविक वैज्ञानिक प्रयोगों का अनुभव।',
        },
        {
          title: 'चरित्र एवं संस्कार',
          desc: 'सहानुभूति, ईमानदारी, अनुशासन और राष्ट्र व समाज के प्रति समर्पित सेवा भाव में दृढ़ निष्ठा।',
        },
      ],
      valuesTitle: 'हमारे मार्गदर्शक मूल मूल्य',
      values: [
        { title: 'सत्यनिष्ठा', desc: 'नैतिक नेतृत्व, अटूट ईमानदारी और विश्वसनीयता।' },
        { title: 'सम्मान', desc: 'विविधता का आदर और मानवीय गरिमा की रक्षा।' },
        { title: 'जिज्ञासा', desc: 'प्रश्न पूछने और निरंतर सीखने की ललक।' },
        { title: 'उत्कृष्टता', desc: 'व्यक्तिगत, खेल और अकादमिक शिखर का प्रयास।' },
        { title: 'सहानुभूति', desc: 'साथियों व समाज के प्रति करुणा और सहयोग।' },
        { title: 'नवाचार', desc: 'समस्या समाधान में रचनात्मक विचार और साहस।' },
      ],
      facilitiesTitle: 'विश्वस्तरीय परिसर सुविधाएं',
      facilities: [
        {
          title: 'स्मार्ट इंटरएक्टिव कक्षाएं',
          desc: 'उच्च-रिजॉल्यूशन डिजिटल डिस्प्ले और वातानुकूलित आरामदायक आधुनिक अध्ययन कक्ष।',
          tag: 'अकादमिक',
        },
        {
          title: 'उन्नत विज्ञान एवं टिंकरिंग लैब्स',
          desc: 'भौतिक, रसायन और जीव विज्ञान प्रयोगशालाएं तथा रोबोटिक्स हेतु अटल टिंकरिंग लैब।',
          tag: 'नवाचार',
        },
        {
          title: 'केंद्रीय डिजिटल पुस्तकालय',
          desc: '15,000 से अधिक पुस्तकें, अंतरराष्ट्रीय जर्नल और शांत अध्ययन जोन।',
          tag: 'ज्ञान',
        },
        {
          title: 'स्पोर्ट्स कॉम्प्लेक्स एवं मैदान',
          desc: 'सिंथेटिक टर्फ, क्रिकेट पिच, बास्केटबॉल और बैडमिंटन कोर्ट अनुभवी कोचों के साथ।',
          tag: 'खेलकूद',
        },
        {
          title: 'ओपन-एयर एम्फीथिएटर व कला केंद्र',
          desc: 'भारतीय शास्त्रीय व पाश्चात्य संगीत, नाटक, वाद-विवाद एवं वार्षिक उत्सवों हेतु समर्पित मंच।',
          tag: 'संस्कृति',
        },
      ],
      connectTitle: 'आरपीएस कार्यालय से संपर्क करें',
      connectSubtitle: 'भ्रमण समय: सोमवार से शनिवार • सुबह 8:30 से दोपहर 3:30 बजे तक',
      callBtn: 'कार्यालय कॉल करें',
      emailBtn: 'ईमेल भेजें',
      admissionsBtn: 'प्रवेश विवरण देखें',
    },

    // Admission Screen
    admission: {
      badge: 'प्रवेश विवरण 2026–27 (नर्सरी – 5वीं)',
      title: 'प्रवेश सत्र 2026–27 प्रारंभ',
      subtitle:
        'रुद्रपुर पब्लिक स्कूल परिवार का हिस्सा बनें। नर्सरी से 5वीं कक्षा तक हमारी पारदर्शी और छात्र-हितैषी प्रवेश प्रक्रिया की जानकारी प्राप्त करें।',
      liveBadge: '● सत्र 2026–27 ऑनलाइन पंजीकरण जारी (नर्सरी – 5वीं)',
      welcomeTitle: 'प्रवेश निदेशक का स्वागत संदेश',
      welcomeLetter:
        '“आदरणीय अभिभावकगण,\n\nसही शिक्षण संस्थान का चयन आपके बच्चे के भविष्य के लिए सबसे महत्वपूर्ण निर्णयों में से एक है। रुद्रपुर पब्लिक स्कूल में, हम प्रवेश को किसी छंटनी परीक्षा के रूप में नहीं, बल्कि एक आत्मीय परिचय संवाद के रूप में देखते हैं।\n\nहमारा उद्देश्य प्रत्येक बच्चे की व्यक्तिगत रुचियों, स्वभाव और क्षमताओं को समझना है, जिससे वे पहले दिन से ही एक ऐसे वातावरण में कदम रखें जहां वे सुरक्षित, सम्मानित और प्रेरित महसूस करें।\n\nहम आपको हमारे परिसर में पधारने, प्रयोगशालाओं को देखने और हमारे शिक्षकों से मिलने का सादर निमंत्रण देते हैं।”\n\n— प्रवेश निदेशक, रुद्रपुर पब्लिक स्कूल',
      stepsTitle: 'प्रवेश के चार सरल चरण',
      stepsSubtitle: 'अभिभावकों के लिए एक सहज एवं स्पष्ट प्रवेश प्रक्रिया',
      steps: [
        {
          step: '01',
          title: 'प्रॉस्पेक्टस प्राप्त करें',
          desc: 'विद्यालय परिसर से विवरण पुस्तिका प्राप्त करें अथवा ऑनलाइन दिशानिर्देश देखें।',
        },
        {
          step: '02',
          title: 'परिसर संवाद',
          desc: 'हमारे शिक्षकों और काउंसलर्स के साथ एक सौहार्दपूर्ण परिचय सत्र में भाग लें।',
        },
        {
          step: '03',
          title: 'दस्तावेज सत्यापन',
          desc: 'प्रवेश कार्यालय में सत्यापित प्रमाण पत्र और पूर्व शैक्षणिक रिकॉर्ड जमा करें।',
        },
        {
          step: '04',
          title: 'नामांकन व स्वागत',
          desc: 'प्रवेश औपचारिकताएं पूर्ण कर छात्र स्वागत किट प्राप्त करें।',
        },
      ],
      ageTableTitle: 'कक्षावार आयु दिशानिर्देश (नर्सरी – 5वीं)',
      ageTableSubtitle: '31 मार्च 2026 के अनुसार सीबीएसई मानकों के अनुरूप',
      gradeHeader: 'कक्षा / वर्ग',
      ageHeader: 'न्यूनतम आयु',
      criteriaHeader: 'मूल्यांकन / तत्परता मानदंड',
      ageRules: [
        {
          grade: 'नर्सरी',
          age: '3+ वर्ष',
          criteria: '31 मार्च 2026 तक 3 वर्ष पूर्ण। केवल अनौपचारिक खेल-आधारित अवलोकन व संवाद।',
        },
        {
          grade: 'लोअर किंडरगार्टन (LKG)',
          age: '4+ वर्ष',
          criteria: '31 मार्च 2026 तक 4+ वर्ष। बुनियादी मौखिक संवाद, रंग व आकृतियों की प्रारंभिक समझ।',
        },
        {
          grade: 'अपर किंडरगार्टन (UKG)',
          age: '5+ वर्ष',
          criteria: '31 मार्च 2026 तक 5+ वर्ष। अक्षर ज्ञान, प्रारंभिक ध्वनियां और लिखने की तैयारी।',
        },
        {
          grade: 'कक्षा 1 एवं 2 (जूनियर प्राइमरी)',
          age: '6+ से 7+ वर्ष',
          criteria: 'आयु अनुरूप तत्परता, सामान्य पढ़ने व अंकगणित की मूलभूत समझ एवं पूर्व स्कूल प्रगति पत्र।',
        },
        {
          grade: 'कक्षा 3, 4 एवं 5 (सीनियर प्राइमरी)',
          age: '8+ से 10+ वर्ष',
          criteria: 'पिछली कक्षा की अंकतालिका, स्थानांतरण प्रमाण पत्र (TC) तथा मूलभूत साक्षरता व अंकज्ञान की समीक्षा।',
        },
      ],
      datesTitle: 'महत्वपूर्ण तिथियां व चरण',
      datesSubtitle: 'अपनी प्रवेश योजना को सुगमता से निर्धारित करें',
      dates: [
        {
          phase: 'चरण 1: ऑनलाइन एवं परिसर पंजीकरण प्रारंभ',
          date: '15 सितंबर 2026 से निरंतर',
          status: 'जारी है',
        },
        {
          phase: 'चरण 2: अभिभावक व छात्र परिचय सत्र',
          date: 'प्रत्येक शनिवार एवं रविवार (नियुक्ति द्वारा)',
          status: 'सक्रिय',
        },
        {
          phase: 'चरण 3: दस्तावेज सत्यापन एवं सीट पुष्टि',
          date: 'संवाद के 5 कार्य दिवसों के भीतर',
          status: 'प्रक्रियाधीन',
        },
        {
          phase: 'चरण 4: दीक्षांत एवं नए शैक्षणिक सत्र का शुभारंभ',
          date: 'अप्रैल 2027 का प्रथम सप्ताह',
          status: 'आगामी',
        },
      ],
      docsTitle: 'आवश्यक दस्तावेजों की सूची',
      docsSubtitle: 'सत्यापन हेतु मूल प्रतियां अवश्य साथ लाएं',
      docs: [
        'नगर निगम या सक्षम अधिकारी द्वारा जारी अधिकृत जन्म प्रमाण पत्र।',
        'विगत 2 शैक्षणिक वर्षों की प्रगति रिपोर्ट / अंकतालिका (कक्षा 1 से ऊपर)।',
        'सीबीएसई या संबंधित शिक्षा बोर्ड द्वारा हस्ताक्षरित मूल स्थानांतरण प्रमाण पत्र (TC)।',
        'छात्र की 4 हालिया पासपोर्ट आकार की रंगीन तस्वीरें (सफेद पृष्ठभूमि)।',
        'माता-पिता / अभिभावक की 2-2 पासपोर्ट आकार की तस्वीरें।',
        'पहचान और निवास प्रमाण हेतु छात्र एवं माता-पिता के आधार कार्ड की स्व-सत्यापित प्रति।',
      ],
      helplineTitle: 'प्रवेश सहायता केंद्र एवं कार्यालय',
      helplineSub: 'हमारे प्रवेश समन्वयक सोमवार से शनिवार उपलब्ध हैं',
      callHelpline: 'हेल्पलाइन कॉल करें',
      emailHelpline: 'प्रवेश ईमेल भेजें',
      officeHours: 'भ्रमण समय: सुबह 9:00 से दोपहर 3:30 बजे (सोम–शनि)',
    },

    // Faculty Screen
    faculty: {
      badge: 'मार्गदर्शक मंडल',
      title: 'हमारे समर्पित शिक्षक',
      subtitle:
        'विज्ञान, कला और खेलकूद में युवा मस्तिष्कों को प्रेरित करते अनुभवी शिक्षक, पीएचडी विद्वान और राष्ट्रीय स्तर के कोच।',
      searchPlaceholder: 'नाम, विषय या पद द्वारा शिक्षक खोजें...',
      deptAll: 'सभी',
      deptSenior: 'वरिष्ठ संकाय',
      deptStem: 'स्टेम एवं लैब्स',
      deptAthletics: 'खेलकूद',
      deptArts: 'कला व मानविकी',
      expLabel: 'अनुभव',
      connectBtn: 'परामर्श बुक करें',
      members: [
        {
          id: '1',
          name: 'डॉ. अनन्या शर्मा',
          role: 'वरिष्ठ गणित संकाय एवं प्रधानाचार्य',
          qual: 'एम.एससी., बी.एड., पीएचडी • स्वर्ण पदक विजेता',
          exp: '8+ वर्ष अनुभव',
          reg: 'सीबीएसई पंजीकृत मेंटर #MTH-4402',
          status: 'आज उपलब्ध',
          quote: 'गणितीय अंतर्दृष्टि, विश्लेषणात्मक चिंतन और समस्या समाधान में रुचि विकसित करने हेतु समर्पित।',
        },
        {
          id: '2',
          name: 'विक्रमादित्य रावत',
          role: 'भौतिक विज्ञान एवं अटल नवाचार प्रमुख',
          qual: 'एम.एससी. भौतिकी (आईआईटी रुड़की)',
          exp: '10+ वर्ष अनुभव',
          reg: 'रोबोटिक्स एवं स्टेम विशेषज्ञ',
          status: 'टिंकरिंग लैब में',
          quote: 'प्रायोगिक भौतिकी और राष्ट्रीय विज्ञान ओलंपियाड हेतु विद्यार्थियों को तैयार करने में निष्ठावान।',
        },
        {
          id: '3',
          name: 'मीनाक्षी सुंदरम',
          role: 'अंग्रेजी एवं नाट्य कला विभाग प्रमुख',
          qual: 'एम.ए. साहित्य (दिल्ली विश्वविद्यालय)',
          exp: '12+ वर्ष अनुभव',
          reg: 'एमयूएन एवं वाद-विवाद कोच',
          status: 'आज उपलब्ध',
          quote: 'अभिव्यक्ति कौशल, गंभीर साहित्यिक विश्लेषण और संवेदनशील वैश्विक दृष्टिकोण का विकास।',
        },
        {
          id: '4',
          name: 'कोच राजेश्वर नेगी',
          role: 'शारीरिक शिक्षा निदेशक',
          qual: 'एम.पी.एड., एनआईएस प्रमाणित एथलेटिक्स कोच',
          exp: '14+ वर्ष अनुभव',
          reg: 'राष्ट्रीय एथलेटिक्स स्वर्ण पदक विजेता',
          status: 'मुख्य मैदान पर',
          quote: 'सभी खेलों में शारीरिक सहनशक्ति, टीम भावना और खेल कौशल की उत्कृष्टता का निर्माण।',
        },
        {
          id: '5',
          name: 'डॉ. प्रिया सेन',
          role: 'वरिष्ठ रसायन विज्ञान संकाय',
          qual: 'पीएचडी अनुप्रयुक्त रसायन',
          exp: '7+ वर्ष अनुभव',
          reg: 'इको-क्लब संकाय सलाहकार',
          status: 'आज उपलब्ध',
          quote: 'जटिल रासायनिक सिद्धांतों को सहज, प्रायोगिक प्रयोगशाला अनुभवों में परिवर्तित करना।',
        },
        {
          id: '6',
          name: 'अमित जोशी',
          role: 'कंप्यूटर साइंस एवं एआई प्रमुख',
          qual: 'एम.टेक सीएसई, बी.टेक आईटी',
          exp: '9+ वर्ष अनुभव',
          reg: 'मशीन लर्निंग व पायथन मेंटर',
          status: 'एआई इनोवेशन लैब में',
          quote: 'संरचित एल्गोरिदम और नैतिक कृत्रिम बुद्धिमत्ता (AI) के माध्यम से भावी तकनीक विशेषज्ञों का निर्माण।',
        },
      ],
    },

    // Profile Modal (Guest User)
    profileModal: {
      guestTitle: 'अतिथि उपयोगकर्ता (Guest User)',
      guestRole: 'अभिभावक / आगंतुक',
      badge: 'अतिथि सत्र',
      schoolName: 'रुद्रपुर पब्लिक स्कूल',
      welcomeTitle: 'आरपीएस में आपका स्वागत है',
      welcomeMsg: 'आप वर्तमान में अतिथि उपयोगकर्ता के रूप में लॉग इन हैं। आपको हमारे 2026–27 शैक्षणिक पाठ्यक्रम, उत्कृष्ट संकाय, आधुनिक परिसर सुविधाओं और फोटो गैलरी को देखने की पूर्ण सुविधा प्राप्त है।',
      affiliationTitle: 'संबद्धता एवं मान्यता',
      affiliationVal: 'सीबीएसई संबद्ध (उच्च माध्यमिक), नई दिल्ली',
      sessionTitle: 'वर्तमान शैक्षणिक सत्र',
      sessionVal: '2026–2027 प्रवेश प्रारंभ (नर्सरी – 5वीं)',
      campusTitle: 'मुख्य परिसर',
      exploreAdmissionBtn: 'प्रवेश हेतु आवेदन करें',
      exploreAdmissionSession: '2026–27',
      exploreAdmissionClasses: 'नर्सरी – 5वीं',
      closeBtn: 'बंद करें',
    },
  },
};
