import type { LinkedInProfile } from "./types";

export const linkedinData: LinkedInProfile[] = [
  {
    id: "0",
    firstName: "Valentin",
    lastName: "RAMEAU",
    headline:
      "I am a software engineer with 7 years of experience, currently on an E-7 visa. Although I work in web tech, I’m most passionate about C and spend my free time developing games for the PlayStation Vita.",
    profilePicture:
      "https://media.licdn.com/dms/image/v2/C5103AQENJJ05Ce8PkQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1567861238009?e=1769644800&v=beta&t=n0H_5qOwqKhMtIDKgGn5WucGs-iOiJGMRhf9zE7UyJ8",
    vanityName: "valentin-rameau-3a1404112",
    locale: "en_US",
    positions: [
      {
        title: "Software Engineer",
        companyName: "빅인사이트그룹",
        companyUrl: "https://biginsight.co/",
        companyLogo: "https://www.biginsite.com/logo.png",
        startDate: "2023-07-01",
        endDate: null,
        isCurrent: true,
        description: `https://biginsight.co

Develop the https://contentsmarket.co platform and the Matrix Consulting System.

What is ContentsMarket? It is a Campaign-Led Marketplace for SNS-optimized assets.

Features:

Marketplace & Transactions
- Asset Exchange: Purchase and sale of SNS-ready images and videos.
- Auction Flow: Placing and receiving bids for exclusive content.
- Cart & Checkout: Persistent cart with time-limited item reservation and payment handling.
Content Request Board
- Request Management: Admins and agencies post content briefs with defined budgets and deadlines.
- Submission Workflow: Creators submit content directly to requests, enabling a structured supply-and-demand process.
Payments & Wallet
- Wallet System: Management of charge points and reward points within a unified wallet.
- Reporting: Visibility into sales status, profits, and transaction history.
- Creator Payouts: Revenue breakdowns and withdrawal processing.

What is the MATRIX Consulting System? The MATRIX Consulting System is a roadmap that visualizes a brand's growth strategy to enhance execution. By segmenting target customers into stages, the system supports data-driven, customized growth optimized for each specific stage.

Features:

- Consulting purchasing flow integration with payment gateways (PortOne) or ContentsMarket point wallet.
- Event-driven architecture for instant consulting report initialization upon purchase.
- Integrated Customer Survey questionnaire to capture detailed user personas.
- High-throughput blog generation engine leveraging LLMs for blog generation.
- Dynamic Persona Injection for tone-appropriate blog generation.
- Multi-Embedding Vector Search for mood-based image retrieval and automated context-aware insertion into generated blogs.

Tech Stack:
- Core: Next.js (App Router), TypeScript, Tailwind CSS
- Data: MySQL w/ Drizzle ORM (Type-safe database interactions!), Milvus
- State: React Query & TRPC
- Services: AWS (Lambda, SES, S3), Firebase, PortOne`,
        location: "Seoul, South Korea",
        locationType: "office",
        skills: [
          "Next.js",
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
        ],
        images: [],
      },
      {
        title: "Front-end Software Engineer, Software architect",
        companyName: "Socrate",
        companyUrl: null,
        companyLogo:
          "https://media.licdn.com/dms/image/v2/D4E0BAQGJR7M-6EpG9A/company-logo_100_100/B4EZqhUAFvHEAQ-/0/1763642966983/socrate_syrona_logo?e=1769644800&v=beta&t=dFC9z6UyOYlOW85DNyPReB6oXAJt_V98F8cNlVcujAU",
        startDate: "2021-06-01",
        endDate: "2023-06-01",
        isCurrent: false,
        description: `I develop the mobile application and the website of a social network focused on knowledge sharing named "Socrate".

https://www.socrate.education/


The application has the following features:

- A Post feed and comments
- A messenger
- A store to sell online courses and tickets for events
- A course creator where the user is able to add chapters, text, images, and videos to his course.
- A profile where the user can see all his purchases, his followers, and the people he follows.

The mobile application and the website have the same code base and are developed using Ionic and Angular. Having a single code base drastically reduced the time needed to implement a feature on all platforms.

All the real-time features (like the Messenger) are implemented using FeathersJs, a wrapper for ExpressJs and SocketIo. 

Payment is implemented using Mangopay.
Video streaming is implemented using Vimeo. 
E2e tests are implemented using Cypress.


While developing this application I:

- Define the code architecture and design by using the clean code and SOLID principles to improve the maintainability and scalability of the codebase.

- Implement new features in collaboration with other developers

- Use the Scrum framework to manage project tasks, timelines, and deliverables

- Participate in code reviews, and testing to ensure that the software meet the requirements and is free of bugs`,
        location: "Lille, Hauts-de-France, France",
        locationType: "remote",
        skills: [
          "Scrum",
          "SOLID Design Principles",
          "Cypress.io",
          "Angular",
          "Ionic Framework",
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/C562DAQGQqs3a9jp1-Q/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1674833364015?e=1768824000&v=beta&t=eQEJ7GZB2HYFITR5V9hXZ4gfDmBDHVcxA7yl4wqiS6E",
          "https://media.licdn.com/dms/image/v2/C562DAQH4QEQ3YI52QA/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1674833331950?e=1768824000&v=beta&t=PmbORlJhYmIqs6n-15P6Tt3g01IEDGECNwbt_h8agYA",
          "https://media.licdn.com/dms/image/v2/C562DAQGCaI6n6IV1QA/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1674833121953?e=1768824000&v=beta&t=2CGLVGra311jlRCRSYQqvcb4cVpRHZrm0s6Ha8g9QyY",
          "https://media.licdn.com/dms/image/v2/C562DAQEPEU0R6vPYyA/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1674832088165?e=1768824000&v=beta&t=ybyKhlT8RZWSnYwqsdt5kdEcSgVdZ8xFrWZ9pQFvso0",
          "https://media.licdn.com/dms/image/v2/C562DAQGfVlWJuOdkRw/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1674831936686?e=1768824000&v=beta&t=OxUpubP4HgixNqdOYs197qIpKhbRYvsjanmIVGJfE-M",
          "https://media.licdn.com/dms/image/v2/C562DAQFsNyXyEvrpng/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1674831899759?e=1768824000&v=beta&t=jq0hOBW3uZXVMzFC5mTFhZNErhJVBjkOstvmiEQIcHY",
          "https://media.licdn.com/dms/image/v2/C562DAQGcQ8JsIYVblw/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1674831859522?e=1768824000&v=beta&t=cixb-sL9DXL_mhcQDIdhD57Xkh1y0GMDA3IrUHCw0V4",
          "https://media.licdn.com/dms/image/v2/C562DAQFP6Pmy6lOWcQ/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1674831777721?e=1768824000&v=beta&t=4PW67c7dsOfEztnonTRt2_4_asbh2i14xYOSywl-h9E",
        ],
      },
      {
        title: "Front-end Software Engineer",
        companyName: "Socrate",
        companyUrl: null,
        companyLogo:
          "https://media.licdn.com/dms/image/v2/D4E0BAQGJR7M-6EpG9A/company-logo_100_100/B4EZqhUAFvHEAQ-/0/1763642966983/socrate_syrona_logo?e=1769644800&v=beta&t=dFC9z6UyOYlOW85DNyPReB6oXAJt_V98F8cNlVcujAU",
        startDate: "2020-03-01",
        endDate: "2021-05-01",
        description: `I develop with my other teammates the mobile application and the website of a social network called Socrate by following the code architecture and code design defined by the CTO

stack: 

-	front-end:	Angular/Ionic
-	back-end:	FeathersJs, MongoDb`,
        isCurrent: false,
        location: "Roubaix, Hauts-de-France, France",
        locationType: "remote",
        images: null,
        skills: [
          "Scrum",
          "SOLID Design Principles",
          "Cypress.io",
          "Angular",
          "Ionic Framework",
        ],
      },
      {
        title: "Software Engineer",
        companyName: "ACENSI",
        companyUrl: "",
        companyLogo:
          "https://media.licdn.com/dms/image/v2/D4E0BAQFp5qmxNHR6AA/company-logo_100_100/B4EZXcLnS4G0AQ-/0/1743155787309/acensi_logo?e=1769644800&v=beta&t=y8NcfhvfunzWDazf2wbpP8YY9ZjQcFi59xvXDVvLdd0",
        startDate: "2019-09-01",
        endDate: "2020-02-01",
        description: `I prepared to be a consultant focused on investment banking but left early.
- learned the TDD method
- learned about the concept of software craftsmanship - learned about code design (design patterns)
- developed a real-time market risk analysis platform using Asp.net Core and MS SQL`,
        isCurrent: false,
        location: "Région de Paris, France",
        locationType: "office",
        images: null,
        skills: [
          "HTML5",
          "ASP.NET",
          "Programming",
          "Entity Framework",
          "Software craftmanship",
          "Scrum",
          "SQL",
          "Feuilles de style en cascade (CSS)",
          "Object-Oriented Programming (OOP)",
          "SOLID Design Principles",
          "C#",
          "Travail d’équipe",
        ],
      },
      {
        title: "Software Engineer",
        companyName: "Witivio",
        companyUrl: null,
        companyLogo: null,
        startDate: "2018-04-01",
        endDate: "2018-08-01",
        description:
          "Witivio 365 is a design and monitoring platform for ready- to-use chatbots fully running on Azure (Azure Functions, Cosmos DB(relational/non-relational mode), MS Bot Framework). I worked on the dashboard, on the statistics aggregation, and made improvements to chatbots.",
        isCurrent: false,
        location: "Région de Lyon, France",
        locationType: "office",
        images: null,
        skills: [
          "HTML5",
          "ASP.NET",
          "Programming",
          "Scrum",
          "Feuilles de style en cascade (CSS)",
          "Object-Oriented Programming (OOP)",
          "C#",
          "Travail d’équipe",
        ],
      },
      {
        title: "Software Engineer",
        companyName: "Linkpart",
        companyUrl: null,
        companyLogo: null,
        startDate: "2017-09-01",
        endDate: "2018-03-01",
        description:
          "I worked at LinkPart 2 days a week and went to my university the other days. I worked mainly on a PHP Symfony backend and a bootstrap front-end.",
        isCurrent: false,
        location: "Région de Lyon, France",
        locationType: "office",
        images: null,
        skills: ["HTML5", "Programming", "PHP", "Symfony", "jQuery"],
      },
      {
        title: "System Administrator/ Software engineer",
        companyName: "Corden Pharma - A Full-Service CDMO",
        companyUrl: "https://www.cordenpharma.com/",
        companyLogo:
          "https://media.licdn.com/dms/image/v2/D4E0BAQGC7uGfMSdWJw/company-logo_100_100/company-logo_100_100/0/1701871858158/corden_pharma_gmbh_logo?e=1769644800&v=beta&t=SdG8uQokK3xWTP1SIXJIq4BHzfL-J_JCB2Bu6yX8_x8",
        startDate: "2016-11-01",
        endDate: "2016-12-01",
        description: `Manage the network infrastructure Maintenance of the different computers.
HelpDesk 
Creation of a WordPress site as well as a theme, and various add-ins.
Debugging of the label printer software in "FingerPrint" so that it works on new models
Realization of a Ruby script to automate document classification.
Debugging of a printing script for the manufacturing methods in VB`,
        isCurrent: false,
        location: "Chenôve, Bourgogne-Franche-Comté, France",
        locationType: "office",
        images: null,
        skills: ["Programming", "Ruby"],
      },
    ],
    educations: [
      {
        schoolName: "중앙대학교 한국어 언어교육원",
        schoolUrl: "https://korean.cau.ac.kr/",
        schoolLogo: "https://korean.cau.ac.kr/images/logo.png",
        degree: "Bachelor of Science in Computer Science",
        fieldOfStudy: "Korean Language Program ",
        startYear: 2022,
        startMonth: 12,
        endYear: null,
        endMonth: null,
        grade: "Level 3 to 5",
        images: null,
      },
      {
        schoolName: "EPITECH - European Institute of Technology",
        schoolUrl: "https://www.epitech.eu/",
        schoolLogo: "https://www.epitech.eu/images/logo.png",
        degree:
          "Master's degree (Master 2), Epitech Expert in Information Technologies credential",
        fieldOfStudy: "IT, Software engineering",
        startYear: 2018,
        startMonth: null,
        endYear: 2020,
        endMonth: null,
        grade: null,
        images: null,
      },
      {
        schoolName: "중앙대학교",
        schoolUrl: "https://www.efrei.fr/",
        schoolLogo: "https://www.efrei.fr/images/logo.png",
        degree: "Bachelor of Science in Computer Science",
        fieldOfStudy: "Computer Science",
        startYear: 2013,
        startMonth: 9,
        endYear: 2016,
        endMonth: 6,
        grade: null,
        images: null,
      },
      {
        schoolName: "St Joseph Dijon",
        schoolUrl: "https://www.stjosephdijon.fr/",
        schoolLogo: "https://www.stjosephdijon.fr/images/logo.png",
        degree:
          "baccalauréat STI2D SIN (sciences de l'information et du numérique)",
        fieldOfStudy: "Computer Science",
        startYear: 2012,
        startMonth: null,
        endYear: 2015,
        endMonth: null,
        grade: null,
        images: null,
      },
      {
        schoolName: "St Joseph Dijon",
        schoolUrl: "https://www.stjosephdijon.fr/",
        schoolLogo: "https://www.stjosephdijon.fr/images/logo.png",
        degree: "Brevet d'initiation aéronautique",
        fieldOfStudy: "Ingénierie aéronautique",
        startYear: 2012,
        startMonth: null,
        endYear: 2013,
        endMonth: null,
        grade: "Brevet d'initiation aéronautique",
        images: null,
      },
    ],
    diplomas: [
      {
        name: "한국어능력시험 (TOPIK), 5급, 203점 (듣기: 74점, 쓰기: 53점, 읽기: 76점)",
        issuingOrganization: "국립국제교육원",
        issuedDate: "2023-05-14",
        expirationDate: "2025-06-21",
        CredentialID: "문서확인번호 : 0717-0731-4579-0867",
        images: [
          {
            url: "https://media.licdn.com/dms/image/v2/D562DAQHLdpKMThCUdA/profile-treasury-image-shrink_1280_1280/B56ZugzvYPHEAQ-/0/1767929477948?e=1768834800&v=beta&t=0EeeuH2QkhT5iXCopyXjAaw4MWyCtYoXuEHbBOLbjzA",
            name: "certificate",
          },
        ],
      },
    ],
    languages: [
      {
        language: "Korean",
        proficiency: "Professional working proficiency",
      },
      {
        language: "English",
        proficiency: "Professional working proficiency",
      },
      {
        language: "French",
        proficiency: "Native or bilingual proficiency",
      },
    ],
    skills: [],
  },
];
