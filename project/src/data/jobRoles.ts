import { JobRole } from '../types';

export const jobRoles: JobRole[] = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Statistics', 'Data Visualization', 'R']
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Engineering',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Git', 'SQL', 'API Development', 'Testing', 'Agile', 'TypeScript', 'AWS']
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Product',
    requiredSkills: ['Product Strategy', 'User Research', 'Analytics', 'Roadmapping', 'Agile', 'Wireframing', 'A/B Testing', 'Stakeholder Management', 'SQL', 'Figma']
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    requiredSkills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems', 'Usability Testing', 'HTML/CSS', 'Interaction Design', 'Visual Design']
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Specialist',
    category: 'Marketing',
    requiredSkills: ['Google Analytics', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC', 'Conversion Optimization', 'Marketing Automation', 'A/B Testing']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Engineering',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python', 'Git', 'Monitoring', 'CI/CD']
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    category: 'Business',
    requiredSkills: ['SQL', 'Excel', 'Data Analysis', 'Requirements Gathering', 'Process Mapping', 'Stakeholder Management', 'Documentation', 'Agile', 'Power BI', 'Project Management']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    requiredSkills: ['Network Security', 'SIEM', 'Penetration Testing', 'Risk Assessment', 'Incident Response', 'Compliance', 'Firewalls', 'Encryption', 'Vulnerability Assessment', 'Security Frameworks']
  }
];