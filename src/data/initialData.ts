import { ResumeData, JobApplication } from '../types';

export const initialResumes: ResumeData[] = [
  {
    id: 'res-1',
    title: 'Senior Product Designer - TechCorp',
    template: 'minimalist',
    lastEdited: 'Edited 2 minutes ago',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVH-ndMMNHC6UsjZ12eOfDwY6jqF1sNRNuOQsucV9EGB64bhWlnL9gSrweQR31YvAA_7W3e16RHQhbt6TEQVjMqgXOipETPm3HeFhlX_Lmg1tKa8FxPSeR4WQYy6bXYOzke7EeG6fuHSg-s-euWVjYGqPHd_Y5S4m-keqJzkQa8Ac2jh9E21DNBz6utiUOiCkEZNGufDtUf3gxymOQx9-OAJZ8RdNxV0LyhFS9NTiiW6SBCrHu_lp4',
    atsScore: 94,
    personalDetails: {
      firstName: 'Alex',
      lastName: 'Miller',
      jobTitle: 'Lead Product Designer',
      email: 'alex.miller@design.co',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'alexmiller.design',
      linkedin: 'linkedin.com/in/alexmiller-design'
    },
    summary: 'Senior Product Designer with 8+ years of experience specializing in enterprise software and complex data visualization. Proven track record of increasing user engagement by 40% through intuitive UX/UI solutions. Passionate about design systems and mentoring junior designers.',
    experience: [
      {
        id: 'exp-1',
        jobTitle: 'Lead Product Designer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        startDate: '2020-03',
        endDate: 'Present',
        isPresent: true,
        bullets: [
          'Spearheaded the redesign of the core analytics dashboard, resulting in a 40% increase in daily active users.',
          'Established and maintained a comprehensive design system used by 50+ engineers and designers.',
          'Managed a team of 3 junior designers, providing mentorship and regular design critiques.'
        ]
      },
      {
        id: 'exp-2',
        jobTitle: 'Senior UI Designer',
        company: 'Innovate Solutions',
        location: 'San Francisco, CA',
        startDate: '2017-01',
        endDate: '2020-02',
        isPresent: false,
        bullets: [
          'Designed end-to-end user flows for a new B2B SaaS product line from zero to 100k ARR.',
          'Collaborated closely with product managers to define feature requirements and MVP scope.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'BFA Interaction Design',
        institution: 'California College of the Arts',
        location: 'San Francisco, CA',
        startDate: '2013',
        endDate: '2017',
        highlights: 'Graduated with Honors. President of Design Student Council.'
      }
    ],
    skills: [
      'Figma',
      'Design Systems',
      'Prototyping',
      'User Research',
      'HTML/CSS',
      'Information Architecture',
      'Usability Testing'
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Enterprise Design Token Engine',
        description: 'Multi-brand scalable design token architecture with automated Figma API sync and React package publishing.',
        technologies: 'React, TypeScript, Figma Tokens, Tailwind CSS',
        githubUrl: 'github.com/alexmiller/design-tokens-engine',
        liveUrl: 'tokens.alexmiller.design'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'NN/g UX Master Certified',
        issuer: 'Nielsen Norman Group',
        issueDate: '2021',
        credentialUrl: 'nngroup.com/cert/uxm-9481'
      },
      {
        id: 'cert-2',
        name: 'Enterprise Design Thinking Practitioner',
        issuer: 'IBM',
        issueDate: '2020',
        credentialUrl: 'ibm.com/design/thinking'
      }
    ]
  },
  {
    id: 'res-2',
    title: 'Senior PM - Tech',
    template: 'executive',
    lastEdited: 'Edited 2 hours ago',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVH-ndMMNHC6UsjZ12eOfDwY6jqF1sNRNuOQsucV9EGB64bhWlnL9gSrweQR31YvAA_7W3e16RHQhbt6TEQVjMqgXOipETPm3HeFhlX_Lmg1tKa8FxPSeR4WQYy6bXYOzke7EeG6fuHSg-s-euWVjYGqPHd_Y5S4m-keqJzkQa8Ac2jh9E21DNBz6utiUOiCkEZNGufDtUf3gxymOQx9-OAJZ8RdNxV0LyhFS9NTiiW6SBCrHu_lp4',
    atsScore: 88,
    personalDetails: {
      firstName: 'Alex',
      lastName: 'Miller',
      jobTitle: 'Senior Product Manager',
      email: 'alex.miller@example.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexmiller'
    },
    summary: 'Results-driven Senior Product Manager with 6+ years driving product strategy, roadmap execution, and cross-functional team leadership. Delivered $12M ARR in growth by launching high-impact cloud automation tools.',
    experience: [
      {
        id: 'exp-201',
        jobTitle: 'Senior Product Manager',
        company: 'Stripe Ecosystem Partners',
        startDate: '2021-06',
        endDate: 'Present',
        isPresent: true,
        bullets: [
          'Led product roadmap for merchant onboarding, cutting drop-off rate by 22% and lifting conversion across 12 countries.',
          'Formulated data-driven KPI dashboards adopted by executive leadership to track weekly cohort health.',
          'Partnered with Engineering and GTM to launch 4 core features ahead of quarterly milestones.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-201',
        degree: 'BS in Computer Science & Business',
        institution: 'University of California, Berkeley',
        startDate: '2014',
        endDate: '2018',
        highlights: 'Magna Cum Laude'
      }
    ],
    skills: ['Product Strategy', 'Roadmapping', 'SQL', 'A/B Testing', 'Agile / Scrum', 'Data Analysis', 'Jira']
  },
  {
    id: 'res-3',
    title: 'Creative Director',
    template: 'creative',
    lastEdited: 'Edited 3 days ago',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqMtjjoemTToJtlDGzZnhLuMJ3Ajecwbw3D3SWbRCZzRlgfcM7qsRW4oDVdA89u3DbZX4k8bXsaD6vOSMt0mGMJa8rf1oTYfXMCUEPDqazsEMNfKbcJHnXsO8-Hni79Z_ePplmL0rzDSfQaMiR6rY_z7Z_-DSLf8HyA6r_zc-rmSpuEq1m4kI3SuS4cGxB3n1J4M2jpe6ZFfAKky-hoELsh29SMMv7ENWjTWjdrnqpYiGkai_8G5Nl',
    atsScore: 91,
    personalDetails: {
      firstName: 'Alex',
      lastName: 'Miller',
      jobTitle: 'Creative Director & Brand Lead',
      email: 'alex@creativestudio.design',
      phone: '+1 (555) 345-6789',
      location: 'San Francisco, CA',
      website: 'alexmiller.creative'
    },
    summary: 'Visionary Creative Director with a decade of leadership transforming brand identities for Fortune 500 companies and tech disruptors. Expert in experiential storytelling, 360 integrated campaigns, and team leadership.',
    experience: [
      {
        id: 'exp-301',
        jobTitle: 'Associate Creative Director',
        company: 'Global Media Arts',
        startDate: '2019-01',
        endDate: 'Present',
        isPresent: true,
        bullets: [
          'Directed multi-channel brand campaigns reaching 14M+ impressions globally, winning 2 Webby Awards.',
          'Orchestrated creative strategy for flagship client rebrands, resulting in 45% increase in brand recall.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-301',
        degree: 'Master of Fine Arts (MFA) in Graphic & Spatial Design',
        institution: 'Rhode Island School of Design (RISD)',
        startDate: '2015',
        endDate: '2017'
      }
    ],
    skills: ['Brand Identity', 'Art Direction', 'Motion Graphics', 'Figma', 'Typography', 'Creative Strategy']
  }
];

export const initialJobApplications: JobApplication[] = [
  {
    id: 'job-1',
    company: 'TechCorp Inc.',
    role: 'Lead Product Designer',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$175,000 - $195,000',
    dateApplied: '2026-08-20',
    status: 'Interviewing',
    resumeId: 'res-1',
    notes: 'Passed initial recruiter screen. Portfolio presentation scheduled for next Tuesday.'
  },
  {
    id: 'job-2',
    company: 'Stripe',
    role: 'Staff Product Designer - Platform',
    location: 'Remote',
    salary: '$190,000 - $220,000',
    dateApplied: '2026-08-22',
    status: 'Applied',
    resumeId: 'res-1',
    notes: 'Applied with customized Minimalist resume optimized for design systems & enterprise APIs.'
  },
  {
    id: 'job-3',
    company: 'InnovateDesign Labs',
    role: 'Head of Product Design',
    location: 'San Francisco, CA',
    salary: '$200,000 - $235,000',
    dateApplied: '2026-08-15',
    status: 'Offer',
    resumeId: 'res-3',
    notes: 'Received written offer! Reviewing equity package and bonus structure.'
  }
];
