require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./src/models/user.model");
const ProfessionalProfile = require("./src/models/professionalProfile.model");

const profileData = {
    "arjun.sharma@example.com": {
        headline: "Full Stack Developer & Product Builder",
        about:
            "Full stack developer passionate about turning ideas into useful digital products. I enjoy building scalable applications, working with modern JavaScript technologies and solving real-world problems through technology.",
        currentRole: "Full Stack Developer",
        currentCompany: "TechNova Labs",
        industry: "Information Technology",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "JavaScript", level: "Advanced" },
            { name: "TypeScript", level: "Intermediate" },
            { name: "React", level: "Advanced" },
            { name: "Next.js", level: "Advanced" },
            { name: "Node.js", level: "Advanced" },
            { name: "Express.js", level: "Advanced" },
            { name: "MongoDB", level: "Advanced" },
            { name: "REST APIs", level: "Advanced" },
            { name: "Git", level: "Advanced" },
        ],

        experience: [
            {
                company: "TechNova Labs",
                role: "Full Stack Developer",
                location: "Delhi",
                startDate: new Date("2024-06-01"),
                endDate: null,
                description:
                    "Building full stack web applications, REST APIs and scalable backend services while collaborating with product and design teams.",
            },
            {
                company: "CodeCraft Solutions",
                role: "Software Developer Intern",
                location: "Delhi",
                startDate: new Date("2023-07-01"),
                endDate: new Date("2024-05-31"),
                description:
                    "Worked on React applications, Node.js APIs and MongoDB-based systems.",
            },
        ],

        education: [
            {
                institution: "Delhi Technological University",
                degree: "B.Tech",
                fieldOfStudy: "Computer Science",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2024-05-01"),
                description:
                    "Focused on software development, databases, algorithms and web technologies.",
            },
        ],

        projects: [
            {
                title: "LaunchHub",
                description:
                    "A platform that helps founders validate ideas, discover collaborators and manage early-stage product development.",
                technologies: ["Next.js", "Node.js", "MongoDB", "Socket.IO"],
                projectUrl: "https://example.com/launchhub",
                githubUrl: "https://github.com/arjunsharma/launchhub",
            },
            {
                title: "TeamFlow",
                description:
                    "Collaborative project management application designed for distributed startup teams.",
                technologies: ["React", "Express.js", "MongoDB"],
                projectUrl: "https://example.com/teamflow",
                githubUrl: "https://github.com/arjunsharma/teamflow",
            },
        ],

        certifications: [
            {
                name: "MongoDB Developer Certification",
                issuingOrganization: "MongoDB",
                issueDate: new Date("2024-03-15"),
                credentialId: "MDB-ARJUN-2403",
                credentialUrl: "https://example.com/certificates/mongodb",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/arjunsharma",
            github: "https://github.com/arjunsharma",
            portfolio: "https://arjunsharma.dev",
            twitter: "https://twitter.com/arjunsharma",
        },
    },

    "priya.mehta@example.com": {
        headline: "UI/UX Designer & Product Design Specialist",
        about:
            "UI/UX designer focused on creating intuitive, accessible and visually polished digital experiences. I enjoy combining research, design thinking and visual systems to solve product problems.",
        currentRole: "UI/UX Designer",
        currentCompany: "PixelCraft Studio",
        industry: "Design & Technology",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "UI Design", level: "Advanced" },
            { name: "UX Design", level: "Advanced" },
            { name: "Figma", level: "Advanced" },
            { name: "Prototyping", level: "Advanced" },
            { name: "Wireframing", level: "Advanced" },
            { name: "Design Systems", level: "Intermediate" },
            { name: "User Research", level: "Intermediate" },
            { name: "Interaction Design", level: "Advanced" },
        ],

        experience: [
            {
                company: "PixelCraft Studio",
                role: "UI/UX Designer",
                location: "Gurgaon",
                startDate: new Date("2023-07-01"),
                endDate: null,
                description:
                    "Designing web and mobile products, creating design systems and collaborating with developers to deliver polished user experiences.",
            },
            {
                company: "DesignNest",
                role: "Design Intern",
                location: "Gurgaon",
                startDate: new Date("2022-06-01"),
                endDate: new Date("2023-06-30"),
                description:
                    "Created wireframes, prototypes and visual designs for consumer applications.",
            },
        ],

        education: [
            {
                institution: "National Institute of Design",
                degree: "Bachelor of Design",
                fieldOfStudy: "Communication Design",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Studied visual communication, interaction design and user-centered design.",
            },
        ],

        projects: [
            {
                title: "Finly",
                description:
                    "Personal finance dashboard designed to make expense tracking and financial planning simple.",
                technologies: ["Figma", "Prototyping", "Design Systems"],
                projectUrl: "https://example.com/finly",
                githubUrl: "",
            },
            {
                title: "CareConnect",
                description:
                    "Mobile healthcare experience focused on accessibility and simplified appointment booking.",
                technologies: ["Figma", "UX Research", "UI Design"],
                projectUrl: "https://example.com/careconnect",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Google UX Design Certificate",
                issuingOrganization: "Google",
                issueDate: new Date("2023-09-10"),
                credentialId: "GOOGLE-UX-PRIYA",
                credentialUrl: "https://example.com/certificates/google-ux",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/priyamehta",
            github: "",
            portfolio: "https://priyamehta.design",
            twitter: "https://twitter.com/priyamehta",
        },
    },

    "rohan.kapoor@example.com": {
        headline: "Product Strategist & Business Growth Professional",
        about:
            "Product strategist passionate about understanding customers, identifying market opportunities and transforming complex business problems into focused product strategies.",
        currentRole: "Product Strategist",
        currentCompany: "GrowthWorks",
        industry: "Product & Strategy",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Product Strategy", level: "Advanced" },
            { name: "Market Research", level: "Advanced" },
            { name: "Business Analysis", level: "Advanced" },
            { name: "Product Management", level: "Intermediate" },
            { name: "Growth Strategy", level: "Advanced" },
            { name: "Competitive Analysis", level: "Advanced" },
            { name: "Analytics", level: "Intermediate" },
        ],

        experience: [
            {
                company: "GrowthWorks",
                role: "Product Strategist",
                location: "Noida",
                startDate: new Date("2022-07-01"),
                endDate: null,
                description:
                    "Working with product teams to identify opportunities, define roadmaps and improve user adoption.",
            },
            {
                company: "MarketBridge",
                role: "Business Analyst",
                location: "Noida",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2022-06-30"),
                description:
                    "Conducted market research and analyzed business performance to support strategic decisions.",
            },
        ],

        education: [
            {
                institution: "Indian Institute of Management",
                degree: "MBA",
                fieldOfStudy: "Strategy",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2022-05-01"),
                description:
                    "Focused on business strategy, product management and market analysis.",
            },
        ],

        projects: [
            {
                title: "MarketLens",
                description:
                    "Market intelligence framework for evaluating emerging product opportunities.",
                technologies: ["Market Research", "Analytics", "Strategy"],
                projectUrl: "https://example.com/marketlens",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Product Management Certificate",
                issuingOrganization: "Product School",
                issueDate: new Date("2023-02-20"),
                credentialId: "PS-ROHAN-2023",
                credentialUrl: "https://example.com/certificates/product",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/rohankapoor",
            github: "",
            portfolio: "https://rohanportfolio.example.com",
            twitter: "https://twitter.com/rohankapoor",
        },
    },

    "ananya.verma@example.com": {
        headline: "Content Creator & Digital Storyteller",
        about:
            "Creative storyteller who enjoys building communities through meaningful content, experiments and authentic digital experiences.",
        currentRole: "Content Creator",
        currentCompany: "CreatorHouse",
        industry: "Media & Content",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Content Creation", level: "Advanced" },
            { name: "Storytelling", level: "Advanced" },
            { name: "Social Media", level: "Advanced" },
            { name: "Video Editing", level: "Intermediate" },
            { name: "Personal Branding", level: "Advanced" },
            { name: "Content Strategy", level: "Advanced" },
            { name: "Photography", level: "Intermediate" },
        ],

        experience: [
            {
                company: "CreatorHouse",
                role: "Content Creator",
                location: "Bangalore",
                startDate: new Date("2023-08-01"),
                endDate: null,
                description:
                    "Creating digital content, managing social campaigns and developing creator-focused strategies.",
            },
        ],

        education: [
            {
                institution: "Christ University",
                degree: "Bachelor of Arts",
                fieldOfStudy: "Media Studies",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Studied media production, communication and digital storytelling.",
            },
        ],

        projects: [
            {
                title: "Creator Diaries",
                description:
                    "Digital content series exploring creativity, productivity and modern digital careers.",
                technologies: ["Content Strategy", "Video", "Storytelling"],
                projectUrl: "https://example.com/creator-diaries",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Digital Marketing Fundamentals",
                issuingOrganization: "Google",
                issueDate: new Date("2023-11-05"),
                credentialId: "GOOGLE-DM-ANANYA",
                credentialUrl: "https://example.com/certificates/digital-marketing",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/ananyaverma",
            github: "",
            portfolio: "https://ananyaverma.example.com",
            twitter: "https://twitter.com/ananyaverma",
        },
    },

    "kabir.singh@example.com": {
        headline: "Startup Leader & Operations Builder",
        about:
            "Startup-minded leader focused on building high-performing teams, improving operations and turning ambitious ideas into measurable outcomes.",
        currentRole: "Operations Lead",
        currentCompany: "ScaleUp Technologies",
        industry: "Technology",
        experienceLevel: "Senior",

        skills: [
            { name: "Leadership", level: "Advanced" },
            { name: "Team Building", level: "Advanced" },
            { name: "Operations", level: "Advanced" },
            { name: "Business Strategy", level: "Advanced" },
            { name: "Project Management", level: "Advanced" },
            { name: "Communication", level: "Advanced" },
            { name: "Decision Making", level: "Advanced" },
        ],

        experience: [
            {
                company: "ScaleUp Technologies",
                role: "Operations Lead",
                location: "Mumbai",
                startDate: new Date("2022-01-01"),
                endDate: null,
                description:
                    "Leading cross-functional teams and improving operational processes across multiple business functions.",
            },
            {
                company: "LaunchLabs",
                role: "Project Manager",
                location: "Mumbai",
                startDate: new Date("2020-06-01"),
                endDate: new Date("2021-12-31"),
                description:
                    "Managed product launches and coordinated engineering, design and business teams.",
            },
        ],

        education: [
            {
                institution: "University of Mumbai",
                degree: "BBA",
                fieldOfStudy: "Business Administration",
                startDate: new Date("2017-07-01"),
                endDate: new Date("2020-05-01"),
                description:
                    "Focused on business management, operations and organizational behavior.",
            },
        ],

        projects: [
            {
                title: "OpsFlow",
                description:
                    "Internal operations platform designed to streamline startup team workflows.",
                technologies: ["Product Management", "Operations"],
                projectUrl: "https://example.com/opsflow",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Certified ScrumMaster",
                issuingOrganization: "Scrum Alliance",
                issueDate: new Date("2022-08-15"),
                credentialId: "CSM-KABIR-2022",
                credentialUrl: "https://example.com/certificates/csm",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/kabirsingh",
            github: "",
            portfolio: "https://kabirsingh.example.com",
            twitter: "https://twitter.com/kabirsingh",
        },
    },

    "sneha.joshi@example.com": {
        headline: "UX Researcher & Data-Driven Problem Solver",
        about:
            "UX researcher interested in understanding human behavior, validating assumptions and turning research insights into better products.",
        currentRole: "UX Researcher",
        currentCompany: "Insight Labs",
        industry: "Research & Technology",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "UX Research", level: "Advanced" },
            { name: "User Interviews", level: "Advanced" },
            { name: "Usability Testing", level: "Advanced" },
            { name: "Data Analysis", level: "Intermediate" },
            { name: "Survey Design", level: "Advanced" },
            { name: "Research", level: "Advanced" },
            { name: "Product Discovery", level: "Advanced" },
        ],

        experience: [
            {
                company: "Insight Labs",
                role: "UX Researcher",
                location: "Pune",
                startDate: new Date("2023-02-01"),
                endDate: null,
                description:
                    "Conducting user research and usability studies to help product teams make evidence-based decisions.",
            },
        ],

        education: [
            {
                institution: "Savitribai Phule Pune University",
                degree: "M.Sc.",
                fieldOfStudy: "Psychology",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2022-05-01"),
                description:
                    "Focused on behavioral research, cognitive psychology and research methodologies.",
            },
        ],

        projects: [
            {
                title: "UserPulse",
                description:
                    "Research framework for identifying user pain points and product opportunities.",
                technologies: ["User Research", "Analytics", "Surveys"],
                projectUrl: "https://example.com/userpulse",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "UX Research Fundamentals",
                issuingOrganization: "Interaction Design Foundation",
                issueDate: new Date("2023-06-10"),
                credentialId: "IDF-SNEHA-2023",
                credentialUrl: "https://example.com/certificates/ux",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/snehajoshi",
            github: "",
            portfolio: "https://snehajoshi.example.com",
            twitter: "https://twitter.com/snehajoshi",
        },
    },

    "aditya.malhotra@example.com": {
        headline: "Software Engineer & SaaS Builder",
        about:
            "Software engineer passionate about building SaaS products, backend systems and developer-friendly tools with a focus on performance and maintainability.",
        currentRole: "Software Engineer",
        currentCompany: "CloudStack",
        industry: "Software Development",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "JavaScript", level: "Advanced" },
            { name: "React", level: "Advanced" },
            { name: "Node.js", level: "Advanced" },
            { name: "Express.js", level: "Advanced" },
            { name: "MongoDB", level: "Advanced" },
            { name: "Docker", level: "Intermediate" },
            { name: "REST APIs", level: "Advanced" },
            { name: "System Design", level: "Intermediate" },
        ],

        experience: [
            {
                company: "CloudStack",
                role: "Software Engineer",
                location: "Delhi",
                startDate: new Date("2023-07-01"),
                endDate: null,
                description:
                    "Developing SaaS applications and backend services with a focus on reliability and performance.",
            },
            {
                company: "DevCore",
                role: "Software Developer Intern",
                location: "Delhi",
                startDate: new Date("2022-06-01"),
                endDate: new Date("2023-06-30"),
                description:
                    "Developed React interfaces and REST APIs for internal business applications.",
            },
        ],

        education: [
            {
                institution: "Manipal Institute of Technology",
                degree: "B.Tech",
                fieldOfStudy: "Computer Science",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Studied software engineering, databases, algorithms and distributed systems.",
            },
        ],

        projects: [
            {
                title: "DeployMate",
                description:
                    "Developer platform simplifying application deployment workflows.",
                technologies: ["Node.js", "Docker", "MongoDB"],
                projectUrl: "https://example.com/deploymate",
                githubUrl: "https://github.com/adityamalhotra/deploymate",
            },
            {
                title: "CodeBoard",
                description:
                    "Developer dashboard for monitoring projects and deployment activity.",
                technologies: ["React", "Node.js", "MongoDB"],
                projectUrl: "https://example.com/codeboard",
                githubUrl: "https://github.com/adityamalhotra/codeboard",
            },
        ],

        certifications: [
            {
                name: "AWS Cloud Practitioner",
                issuingOrganization: "Amazon Web Services",
                issueDate: new Date("2024-01-20"),
                credentialId: "AWS-ADITYA-2024",
                credentialUrl: "https://example.com/certificates/aws",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/adityamalhotra",
            github: "https://github.com/adityamalhotra",
            portfolio: "https://adityamalhotra.dev",
            twitter: "https://twitter.com/adityamalhotra",
        },
    },

    "ishita.rao@example.com": {
        headline: "Creative Technologist & Digital Creator",
        about:
            "Creative professional exploring the intersection of technology, storytelling and digital content. I enjoy experimenting with new formats and building engaging online experiences.",
        currentRole: "Creative Producer",
        currentCompany: "Creative Labs",
        industry: "Media & Technology",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Content Creation", level: "Advanced" },
            { name: "Creative Direction", level: "Advanced" },
            { name: "Video Editing", level: "Intermediate" },
            { name: "Social Media", level: "Advanced" },
            { name: "Storytelling", level: "Advanced" },
            { name: "Photography", level: "Intermediate" },
            { name: "Branding", level: "Advanced" },
        ],

        experience: [
            {
                company: "Creative Labs",
                role: "Creative Producer",
                location: "Hyderabad",
                startDate: new Date("2023-05-01"),
                endDate: null,
                description:
                    "Developing creative campaigns and digital content for technology and lifestyle brands.",
            },
        ],

        education: [
            {
                institution: "St. Xavier's College",
                degree: "Bachelor of Mass Media",
                fieldOfStudy: "Mass Communication",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Focused on digital media, communication and creative production.",
            },
        ],

        projects: [
            {
                title: "FutureFrames",
                description:
                    "Digital storytelling project exploring emerging technology and modern culture.",
                technologies: ["Video", "Storytelling", "Creative Direction"],
                projectUrl: "https://example.com/futureframes",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Meta Social Media Marketing",
                issuingOrganization: "Meta",
                issueDate: new Date("2024-02-12"),
                credentialId: "META-ISHITA-2024",
                credentialUrl: "https://example.com/certificates/meta",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/ishitarao",
            github: "",
            portfolio: "https://ishitarao.example.com",
            twitter: "https://twitter.com/ishitarao",
        },
    },

    "vivek.bansal@example.com": {
        headline: "Business Strategist & Growth Consultant",
        about:
            "Business strategist helping teams identify growth opportunities, understand markets and build sustainable business models through structured analysis.",
        currentRole: "Business Consultant",
        currentCompany: "StrategyWorks",
        industry: "Consulting",
        experienceLevel: "Senior",

        skills: [
            { name: "Business Strategy", level: "Advanced" },
            { name: "Growth Strategy", level: "Advanced" },
            { name: "Market Research", level: "Advanced" },
            { name: "Analytics", level: "Advanced" },
            { name: "Consulting", level: "Advanced" },
            { name: "Business Development", level: "Advanced" },
            { name: "Product Strategy", level: "Intermediate" },
        ],

        experience: [
            {
                company: "StrategyWorks",
                role: "Business Consultant",
                location: "Chandigarh",
                startDate: new Date("2021-07-01"),
                endDate: null,
                description:
                    "Helping startups and growing companies develop market, growth and business strategies.",
            },
        ],

        education: [
            {
                institution: "Chandigarh University",
                degree: "MBA",
                fieldOfStudy: "Business Strategy",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2021-05-01"),
                description:
                    "Focused on strategic management, business analytics and entrepreneurship.",
            },
        ],

        projects: [
            {
                title: "GrowthMap",
                description:
                    "Growth planning framework for early-stage startups.",
                technologies: ["Strategy", "Analytics", "Market Research"],
                projectUrl: "https://example.com/growthmap",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Business Analytics Professional",
                issuingOrganization: "IBM",
                issueDate: new Date("2022-10-05"),
                credentialId: "IBM-VIVEK-2022",
                credentialUrl: "https://example.com/certificates/ibm",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/vivekbansal",
            github: "",
            portfolio: "https://vivekbansal.example.com",
            twitter: "https://twitter.com/vivekbansal",
        },
    },

    "meera.nair@example.com": {
        headline: "Product Designer & Visual Design Specialist",
        about:
            "Product designer focused on creating elegant interfaces and meaningful user experiences for modern digital products. I care deeply about visual consistency and usability.",
        currentRole: "Product Designer",
        currentCompany: "DesignLab",
        industry: "Design & Technology",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Product Design", level: "Advanced" },
            { name: "UI Design", level: "Advanced" },
            { name: "UX Design", level: "Advanced" },
            { name: "Figma", level: "Advanced" },
            { name: "Visual Design", level: "Advanced" },
            { name: "Design Systems", level: "Intermediate" },
            { name: "Typography", level: "Advanced" },
        ],

        experience: [
            {
                company: "DesignLab",
                role: "Product Designer",
                location: "Kochi",
                startDate: new Date("2022-08-01"),
                endDate: null,
                description:
                    "Designing product experiences from early concepts to production-ready interfaces.",
            },
        ],

        education: [
            {
                institution: "National Institute of Fashion Technology",
                degree: "Bachelor of Design",
                fieldOfStudy: "Communication Design",
                startDate: new Date("2018-07-01"),
                endDate: new Date("2022-05-01"),
                description:
                    "Studied visual communication, design principles and digital product design.",
            },
        ],

        projects: [
            {
                title: "FlowPay",
                description:
                    "Simple and accessible payment experience for modern users.",
                technologies: ["Figma", "UI Design", "UX Design"],
                projectUrl: "https://example.com/flowpay",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Professional Product Design",
                issuingOrganization: "Interaction Design Foundation",
                issueDate: new Date("2023-04-20"),
                credentialId: "IDF-MEERA-2023",
                credentialUrl: "https://example.com/certificates/product-design",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/meeranair",
            github: "",
            portfolio: "https://meeranair.design",
            twitter: "https://twitter.com/meeranair",
        },
    },

    "rahul.khanna@example.com": {
        headline: "Founder & Business Leader",
        about:
            "Entrepreneur focused on building teams, creating scalable businesses and solving meaningful customer problems. Passionate about startups, strategy and execution.",
        currentRole: "Founder",
        currentCompany: "BuildWorks",
        industry: "Technology & Entrepreneurship",
        experienceLevel: "Senior",

        skills: [
            { name: "Leadership", level: "Advanced" },
            { name: "Entrepreneurship", level: "Advanced" },
            { name: "Business Strategy", level: "Advanced" },
            { name: "Fundraising", level: "Intermediate" },
            { name: "Operations", level: "Advanced" },
            { name: "Team Building", level: "Advanced" },
            { name: "Networking", level: "Advanced" },
        ],

        experience: [
            {
                company: "BuildWorks",
                role: "Founder",
                location: "Jaipur",
                startDate: new Date("2021-04-01"),
                endDate: null,
                description:
                    "Building a technology-driven business while leading product, operations and growth.",
            },
            {
                company: "BusinessHub",
                role: "Business Development Manager",
                location: "Jaipur",
                startDate: new Date("2019-06-01"),
                endDate: new Date("2021-03-31"),
                description:
                    "Managed partnerships and business development initiatives.",
            },
        ],

        education: [
            {
                institution: "University of Rajasthan",
                degree: "B.Com",
                fieldOfStudy: "Commerce",
                startDate: new Date("2016-07-01"),
                endDate: new Date("2019-05-01"),
                description:
                    "Studied accounting, business management and entrepreneurship.",
            },
        ],

        projects: [
            {
                title: "BuildWorks",
                description:
                    "Productivity platform designed for small and growing teams.",
                technologies: ["Product Strategy", "SaaS", "Business"],
                projectUrl: "https://example.com/buildworks",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Startup Entrepreneurship Program",
                issuingOrganization: "Y Combinator",
                issueDate: new Date("2023-05-15"),
                credentialId: "YC-RAHUL-2023",
                credentialUrl: "https://example.com/certificates/startup",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/rahulkhanna",
            github: "",
            portfolio: "https://rahulkhanna.example.com",
            twitter: "https://twitter.com/rahulkhanna",
        },
    },

    "kavya.iyer@example.com": {
        headline: "Market Research Analyst & Data Researcher",
        about:
            "Research enthusiast focused on discovering patterns, understanding markets and transforming data into actionable insights for better decisions.",
        currentRole: "Research Analyst",
        currentCompany: "DataSense",
        industry: "Research & Analytics",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Market Research", level: "Advanced" },
            { name: "Data Analysis", level: "Advanced" },
            { name: "SQL", level: "Intermediate" },
            { name: "Statistics", level: "Advanced" },
            { name: "Competitive Analysis", level: "Advanced" },
            { name: "Research", level: "Advanced" },
            { name: "Excel", level: "Advanced" },
        ],

        experience: [
            {
                company: "DataSense",
                role: "Research Analyst",
                location: "Chennai",
                startDate: new Date("2022-08-01"),
                endDate: null,
                description:
                    "Analyzing market data and preparing research insights for business and product teams.",
            },
        ],

        education: [
            {
                institution: "Anna University",
                degree: "M.Sc.",
                fieldOfStudy: "Statistics",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2022-05-01"),
                description:
                    "Focused on statistical analysis, research methodologies and data interpretation.",
            },
        ],

        projects: [
            {
                title: "MarketPulse",
                description:
                    "Research dashboard for tracking market trends and competitor activity.",
                technologies: ["SQL", "Analytics", "Research"],
                projectUrl: "https://example.com/marketpulse",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Google Data Analytics",
                issuingOrganization: "Google",
                issueDate: new Date("2023-01-12"),
                credentialId: "GOOGLE-KAVYA-2023",
                credentialUrl: "https://example.com/certificates/data",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/kavyaiyer",
            github: "",
            portfolio: "https://kavyaiyer.example.com",
            twitter: "https://twitter.com/kavyaiyer",
        },
    },

    "manav.gupta@example.com": {
        headline: "Backend Engineer & API Developer",
        about:
            "Backend developer who enjoys designing reliable APIs, working with databases and building systems that are secure, maintainable and ready to scale.",
        currentRole: "Backend Engineer",
        currentCompany: "BackendWorks",
        industry: "Software Development",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Node.js", level: "Advanced" },
            { name: "Express.js", level: "Advanced" },
            { name: "MongoDB", level: "Advanced" },
            { name: "MySQL", level: "Intermediate" },
            { name: "REST APIs", level: "Advanced" },
            { name: "JWT", level: "Advanced" },
            { name: "Docker", level: "Intermediate" },
            { name: "Redis", level: "Intermediate" },
        ],

        experience: [
            {
                company: "BackendWorks",
                role: "Backend Engineer",
                location: "Lucknow",
                startDate: new Date("2023-06-01"),
                endDate: null,
                description:
                    "Building REST APIs, authentication systems and database-driven backend services.",
            },
            {
                company: "ServerStack",
                role: "Backend Developer Intern",
                location: "Lucknow",
                startDate: new Date("2022-07-01"),
                endDate: new Date("2023-05-31"),
                description:
                    "Worked on Node.js services and MongoDB data models.",
            },
        ],

        education: [
            {
                institution: "Amity University",
                degree: "B.Tech",
                fieldOfStudy: "Computer Science",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Focused on backend engineering, databases and software development.",
            },
        ],

        projects: [
            {
                title: "APIForge",
                description:
                    "Reusable backend starter kit for building secure REST APIs.",
                technologies: ["Node.js", "Express", "MongoDB", "JWT"],
                projectUrl: "https://example.com/apiforge",
                githubUrl: "https://github.com/manavgupta/apiforge",
            },
            {
                title: "ChatCore",
                description:
                    "Real-time messaging backend supporting conversations and notifications.",
                technologies: ["Node.js", "Socket.IO", "MongoDB"],
                projectUrl: "https://example.com/chatcore",
                githubUrl: "https://github.com/manavgupta/chatcore",
            },
        ],

        certifications: [
            {
                name: "Node.js Application Developer",
                issuingOrganization: "OpenJS Foundation",
                issueDate: new Date("2024-02-10"),
                credentialId: "NODE-MANAV-2024",
                credentialUrl: "https://example.com/certificates/node",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/manavgupta",
            github: "https://github.com/manavgupta",
            portfolio: "https://manavgupta.dev",
            twitter: "https://twitter.com/manavgupta",
        },
    },

    "aditi.kapoor@example.com": {
        headline: "Product Strategy & Growth Professional",
        about:
            "Product-focused strategist interested in customer behavior, growth experiments and building products that solve genuine customer needs.",
        currentRole: "Product Associate",
        currentCompany: "ProductLab",
        industry: "Product Management",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Product Strategy", level: "Advanced" },
            { name: "Growth", level: "Advanced" },
            { name: "Market Research", level: "Advanced" },
            { name: "Product Management", level: "Intermediate" },
            { name: "Analytics", level: "Intermediate" },
            { name: "Customer Discovery", level: "Advanced" },
        ],

        experience: [
            {
                company: "ProductLab",
                role: "Product Associate",
                location: "Mumbai",
                startDate: new Date("2022-07-01"),
                endDate: null,
                description:
                    "Supporting product discovery, roadmap planning and growth initiatives.",
            },
        ],

        education: [
            {
                institution: "NMIMS",
                degree: "MBA",
                fieldOfStudy: "Marketing",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2022-05-01"),
                description:
                    "Focused on product marketing, consumer behavior and growth strategy.",
            },
        ],

        projects: [
            {
                title: "GrowthBoard",
                description:
                    "Experiment tracking system for product and growth teams.",
                technologies: ["Product Strategy", "Analytics", "Growth"],
                projectUrl: "https://example.com/growthboard",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Product Management Foundations",
                issuingOrganization: "Product School",
                issueDate: new Date("2023-03-15"),
                credentialId: "PS-ADITI-2023",
                credentialUrl: "https://example.com/certificates/product",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/aditakapoor",
            github: "",
            portfolio: "https://aditakapoor.example.com",
            twitter: "https://twitter.com/aditakapoor",
        },
    },

    "yash.thakur@example.com": {
        headline: "Full Stack Developer & Startup Enthusiast",
        about:
            "Developer who loves building products from scratch and experimenting with modern web technologies. Interested in startups, developer tools and product engineering.",
        currentRole: "Full Stack Developer",
        currentCompany: "CodeCraft",
        industry: "Software Development",
        experienceLevel: "Junior",

        skills: [
            { name: "React", level: "Advanced" },
            { name: "Next.js", level: "Intermediate" },
            { name: "Node.js", level: "Advanced" },
            { name: "Express.js", level: "Advanced" },
            { name: "MongoDB", level: "Advanced" },
            { name: "TypeScript", level: "Intermediate" },
            { name: "Tailwind CSS", level: "Advanced" },
            { name: "Git", level: "Advanced" },
        ],

        experience: [
            {
                company: "CodeCraft",
                role: "Full Stack Developer",
                location: "Dehradun",
                startDate: new Date("2024-07-01"),
                endDate: null,
                description:
                    "Developing modern web applications and reusable backend services.",
            },
        ],

        education: [
            {
                institution: "Graphic Era University",
                degree: "B.Tech",
                fieldOfStudy: "Computer Science",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2024-05-01"),
                description:
                    "Studied software engineering, web development and databases.",
            },
        ],

        projects: [
            {
                title: "TaskPilot",
                description:
                    "Collaborative project management application for distributed teams.",
                technologies: ["Next.js", "Node.js", "MongoDB"],
                projectUrl: "https://example.com/taskpilot",
                githubUrl: "https://github.com/yashthakur/taskpilot",
            },
            {
                title: "DevConnect",
                description:
                    "Platform for developers to discover projects and collaborate.",
                technologies: ["React", "Express", "MongoDB"],
                projectUrl: "https://example.com/devconnect",
                githubUrl: "https://github.com/yashthakur/devconnect",
            },
        ],

        certifications: [
            {
                name: "JavaScript Algorithms and Data Structures",
                issuingOrganization: "freeCodeCamp",
                issueDate: new Date("2024-04-10"),
                credentialId: "FCC-YASH-2024",
                credentialUrl: "https://example.com/certificates/javascript",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/yashthakur",
            github: "https://github.com/yashthakur",
            portfolio: "https://yashthakur.dev",
            twitter: "https://twitter.com/yashthakur",
        },
    },

    "simran.kaur@example.com": {
        headline: "Digital Creator & Community Builder",
        about:
            "Digital creator passionate about storytelling, community building and creating content that sparks meaningful conversations.",
        currentRole: "Community Manager",
        currentCompany: "SocialSphere",
        industry: "Media & Community",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Content Creation", level: "Advanced" },
            { name: "Community Building", level: "Advanced" },
            { name: "Social Media", level: "Advanced" },
            { name: "Storytelling", level: "Advanced" },
            { name: "Brand Strategy", level: "Intermediate" },
            { name: "Video Editing", level: "Intermediate" },
        ],

        experience: [
            {
                company: "SocialSphere",
                role: "Community Manager",
                location: "Amritsar",
                startDate: new Date("2023-06-01"),
                endDate: null,
                description:
                    "Building online communities and creating content strategies for growing digital brands.",
            },
        ],

        education: [
            {
                institution: "Amity University",
                degree: "BA",
                fieldOfStudy: "Mass Communication",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Focused on communication, digital media and content production.",
            },
        ],

        projects: [
            {
                title: "CreatorCircle",
                description:
                    "Community for independent creators to collaborate and share opportunities.",
                technologies: ["Community", "Content", "Social Media"],
                projectUrl: "https://example.com/creatorcircle",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Community Management Certificate",
                issuingOrganization: "Meta",
                issueDate: new Date("2023-09-12"),
                credentialId: "META-SIMRAN-2023",
                credentialUrl: "https://example.com/certificates/community",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/simrankaur",
            github: "",
            portfolio: "https://simrankaur.example.com",
            twitter: "https://twitter.com/simrankaur",
        },
    },

    "nikhil.sethi@example.com": {
        headline: "Engineering Manager & Technology Leader",
        about:
            "Technology leader focused on engineering culture, scalable systems and helping teams deliver high-quality products consistently.",
        currentRole: "Engineering Manager",
        currentCompany: "TechScale",
        industry: "Software & Technology",
        experienceLevel: "Senior",

        skills: [
            { name: "Engineering Leadership", level: "Advanced" },
            { name: "System Design", level: "Advanced" },
            { name: "Team Management", level: "Advanced" },
            { name: "Node.js", level: "Advanced" },
            { name: "Cloud Computing", level: "Intermediate" },
            { name: "Architecture", level: "Advanced" },
            { name: "Agile", level: "Advanced" },
            { name: "Mentoring", level: "Advanced" },
        ],

        experience: [
            {
                company: "TechScale",
                role: "Engineering Manager",
                location: "Gurgaon",
                startDate: new Date("2021-08-01"),
                endDate: null,
                description:
                    "Leading engineering teams and driving technical architecture and delivery.",
            },
            {
                company: "CloudWorks",
                role: "Senior Software Engineer",
                location: "Gurgaon",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2021-07-31"),
                description:
                    "Designed backend services and mentored junior developers.",
            },
        ],

        education: [
            {
                institution: "BITS Pilani",
                degree: "B.E.",
                fieldOfStudy: "Computer Science",
                startDate: new Date("2015-07-01"),
                endDate: new Date("2019-05-01"),
                description:
                    "Focused on computer science, distributed systems and software engineering.",
            },
        ],

        projects: [
            {
                title: "PlatformX",
                description:
                    "Scalable internal platform supporting multiple engineering teams.",
                technologies: ["Node.js", "Cloud", "Architecture"],
                projectUrl: "https://example.com/platformx",
                githubUrl: "https://github.com/nikhilsethi/platformx",
            },
        ],

        certifications: [
            {
                name: "AWS Solutions Architect",
                issuingOrganization: "Amazon Web Services",
                issueDate: new Date("2022-05-20"),
                credentialId: "AWS-NIKHIL-2022",
                credentialUrl: "https://example.com/certificates/aws",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/nikhilsethi",
            github: "https://github.com/nikhilsethi",
            portfolio: "https://nikhilsethi.dev",
            twitter: "https://twitter.com/nikhilsethi",
        },
    },

    "tanya.agarwal@example.com": {
        headline: "Product & Visual Designer",
        about:
            "Designer passionate about creating clean interfaces, thoughtful interactions and strong visual identities for digital products.",
        currentRole: "Product Designer",
        currentCompany: "Studio North",
        industry: "Design",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Product Design", level: "Advanced" },
            { name: "UI Design", level: "Advanced" },
            { name: "UX Design", level: "Advanced" },
            { name: "Figma", level: "Advanced" },
            { name: "Branding", level: "Advanced" },
            { name: "Visual Design", level: "Advanced" },
            { name: "Prototyping", level: "Advanced" },
        ],

        experience: [
            {
                company: "Studio North",
                role: "Product Designer",
                location: "Bangalore",
                startDate: new Date("2023-06-01"),
                endDate: null,
                description:
                    "Designing digital products and visual systems for early-stage startups.",
            },
        ],

        education: [
            {
                institution: "Srishti Institute of Art",
                degree: "Bachelor of Design",
                fieldOfStudy: "Product Design",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2023-05-01"),
                description:
                    "Studied product design, interaction design and visual communication.",
            },
        ],

        projects: [
            {
                title: "Mono",
                description:
                    "Minimal productivity application focused on distraction-free workflows.",
                technologies: ["Figma", "UI/UX", "Design Systems"],
                projectUrl: "https://example.com/mono",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Advanced Figma Design",
                issuingOrganization: "Figma",
                issueDate: new Date("2023-10-15"),
                credentialId: "FIGMA-TANYA-2023",
                credentialUrl: "https://example.com/certificates/figma",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/tanyaagarwal",
            github: "",
            portfolio: "https://tanyaagarwal.design",
            twitter: "https://twitter.com/tanyaagarwal",
        },
    },

    "siddharth.jain@example.com": {
        headline: "Business Analyst & Strategic Thinker",
        about:
            "Business professional who enjoys solving complex problems through research, analysis and structured thinking.",
        currentRole: "Business Analyst",
        currentCompany: "ConsultPro",
        industry: "Business Consulting",
        experienceLevel: "Senior",

        skills: [
            { name: "Business Analysis", level: "Advanced" },
            { name: "Strategy", level: "Advanced" },
            { name: "Market Research", level: "Advanced" },
            { name: "SQL", level: "Intermediate" },
            { name: "Analytics", level: "Advanced" },
            { name: "Consulting", level: "Advanced" },
            { name: "Financial Analysis", level: "Intermediate" },
        ],

        experience: [
            {
                company: "ConsultPro",
                role: "Business Analyst",
                location: "Ahmedabad",
                startDate: new Date("2021-08-01"),
                endDate: null,
                description:
                    "Analyzing business performance and helping teams identify strategic opportunities.",
            },
        ],

        education: [
            {
                institution: "Gujarat University",
                degree: "MBA",
                fieldOfStudy: "Finance",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2021-05-01"),
                description:
                    "Focused on financial analysis, strategy and business management.",
            },
        ],

        projects: [
            {
                title: "InsightBoard",
                description:
                    "Business intelligence dashboard for tracking company performance.",
                technologies: ["SQL", "Analytics", "Strategy"],
                projectUrl: "https://example.com/insightboard",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Business Analysis Professional",
                issuingOrganization: "IIBA",
                issueDate: new Date("2022-11-10"),
                credentialId: "IIBA-SID-2022",
                credentialUrl: "https://example.com/certificates/iiba",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/siddharthjain",
            github: "",
            portfolio: "https://siddharthjain.example.com",
            twitter: "https://twitter.com/siddharthjain",
        },
    },

    "naina.arora@example.com": {
        headline: "Content Strategist & Creative Professional",
        about:
            "Creative professional passionate about storytelling, content strategy and building memorable digital experiences for modern audiences.",
        currentRole: "Content Strategist",
        currentCompany: "BrandStory",
        industry: "Marketing & Media",
        experienceLevel: "Mid-Level",

        skills: [
            { name: "Content Strategy", level: "Advanced" },
            { name: "Storytelling", level: "Advanced" },
            { name: "Social Media", level: "Advanced" },
            { name: "Copywriting", level: "Advanced" },
            { name: "Branding", level: "Intermediate" },
            { name: "Creative Direction", level: "Advanced" },
            { name: "Community Building", level: "Intermediate" },
        ],

        experience: [
            {
                company: "BrandStory",
                role: "Content Strategist",
                location: "Delhi",
                startDate: new Date("2022-07-01"),
                endDate: null,
                description:
                    "Creating content strategies and campaigns for modern consumer brands.",
            },
            {
                company: "MediaWorks",
                role: "Content Writer",
                location: "Delhi",
                startDate: new Date("2020-07-01"),
                endDate: new Date("2022-06-30"),
                description:
                    "Created long-form articles, social media campaigns and brand content.",
            },
        ],

        education: [
            {
                institution: "University of Delhi",
                degree: "BA",
                fieldOfStudy: "English",
                startDate: new Date("2019-07-01"),
                endDate: new Date("2022-05-01"),
                description:
                    "Focused on literature, communication and creative writing.",
            },
        ],

        projects: [
            {
                title: "StoryLab",
                description:
                    "Content platform exploring modern storytelling formats and digital culture.",
                technologies: ["Content Strategy", "Copywriting", "Social Media"],
                projectUrl: "https://example.com/storylab",
                githubUrl: "",
            },
        ],

        certifications: [
            {
                name: "Content Marketing Certification",
                issuingOrganization: "HubSpot",
                issueDate: new Date("2023-01-20"),
                credentialId: "HUBSPOT-NAINA-2023",
                credentialUrl: "https://example.com/certificates/content",
            },
        ],

        socialLinks: {
            linkedin: "https://linkedin.com/in/nainaarora",
            github: "",
            portfolio: "https://nainaarora.example.com",
            twitter: "https://twitter.com/nainaarora",
        },
    },
};

const seedProfessionalProfiles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const emails = Object.keys(profileData);

        const users = await User.find({
            email: { $in: emails },
        }).select("_id name email");

        if (!users.length) {
            throw new Error(
                "No users found. Please run your user seed first."
            );
        }

        console.log(`Found ${users.length} users`);

        const userIds = users.map((user) => user._id);

        // Existing profiles of these users remove kar do
        await ProfessionalProfile.deleteMany({
            user: { $in: userIds },
        });

        const profileDocuments = [];

        for (const user of users) {
            const data = profileData[user.email];

            if (!data) {
                console.log(
                    `⚠️ Profile data not found for ${user.email}`
                );
                continue;
            }

            profileDocuments.push({
                user: user._id,
                ...data,
            });
        }

        const createdProfiles =
            await ProfessionalProfile.insertMany(
                profileDocuments
            );

        console.log(
            `\n✅ ${createdProfiles.length} professional profiles created`
        );

        console.log("\n📋 Profiles:");

        createdProfiles.forEach((profile) => {
            const user = users.find(
                (u) =>
                    u._id.toString() ===
                    profile.user.toString()
            );

            console.log(
                `✓ ${user.name} → ${profile.currentRole} @ ${profile.currentCompany}`
            );
        });

        await mongoose.disconnect();

        console.log(
            "\n🌱 Professional profile seeding completed successfully!"
        );
    } catch (error) {
        console.error(
            "\n❌ Professional profile seeding failed:"
        );

        console.error(error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedProfessionalProfiles();