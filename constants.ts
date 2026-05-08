import type { RawNode } from './types';

export const initialData: RawNode[] = [
  {
    id: 100,
    name: "P - Personal",
    description: "Ashford Timeline, Entertainment",
    type: "folder",
    parentId: null,
    category: "personal"
  },
  {
    id: 101,
    name: "Timeline",
    description: "Chronological Life Events",
    type: "folder",
    parentId: 100,
    category: "personal",
    icon: "clock"
  },
  {
    id: 102,
    name: "Ashford Point",
    description: "Historical significance and early life events",
    type: "folder",
    parentId: 101,
    category: "personal",
    icon: "map-pin"
  },
  {
    id: 103,
    name: "Childhood Home",
    description: "Memories and context",
    type: "file",
    parentId: 102,
    category: "personal"
  },
  {
    id: 104,
    name: "Entertainment",
    description: "Media and Leisure",
    type: "folder",
    parentId: 100,
    category: "personal",
    icon: "film"
  },
  {
    id: 105,
    name: "Netflix",
    description: "Shows and movies",
    type: "file",
    parentId: 104,
    category: "personal",
    icon: "monitor-play"
  },
  {
    id: 106,
    name: "Disney+",
    description: "Marvel, Star Wars, Pixar",
    type: "file",
    parentId: 104,
    category: "personal",
    icon: "popcorn"
  },
  {
    id: 107,
    name: "Contacts",
    description: "Network",
    type: "folder",
    parentId: 100,
    category: "personal",
    icon: "users"
  },

  {
    id: 200,
    name: "H - Health",
    description: "Threats, Medical Records, Wellness",
    type: "folder",
    parentId: null,
    category: "health"
  },
  {
    id: 201,
    name: "Threats",
    description: "Active health challenges to mitigate",
    type: "folder",
    parentId: 200,
    category: "health",
    icon: "alert-triangle"
  },
  {
    id: 202,
    name: "Back Pain",
    description: "Physical therapy and ergonomic tracking",
    type: "file",
    parentId: 201,
    category: "health",
    icon: "activity"
  },
  {
    id: 203,
    name: "ADHD Management",
    description: "Focus tools, routines, and medication tracking",
    type: "file",
    parentId: 201,
    category: "health",
    icon: "brain"
  },
  {
    id: 204,
    name: "Medical Records",
    description: "Doctors, Tests, Diagnoses",
    type: "folder",
    parentId: 200,
    category: "health",
    icon: "file-text"
  },
  {
    id: 205,
    name: "LabCorp Data",
    description: "Test results",
    type: "file",
    parentId: 204,
    category: "health",
    icon: "flask-conical"
  },

  {
    id: 300,
    name: "W - Work",
    description: "Career, Strategies, Portfolio",
    type: "folder",
    parentId: null,
    category: "work"
  },
  {
    id: 301,
    name: "Employers",
    description: "Previous and current roles",
    type: "folder",
    parentId: 300,
    category: "work",
    icon: "briefcase"
  },
  {
    id: 302,
    name: "R-Cubed",
    description: "Projects and performance data",
    type: "folder",
    parentId: 301,
    category: "work",
    icon: "building"
  },
  {
    id: 303,
    name: "Business Dev",
    description: "Sales Pipeline and GTM Strategy",
    type: "file",
    parentId: 302,
    category: "work",
    icon: "trending-up"
  },
  {
    id: 304,
    name: "Trulo Homes",
    description: "Locations and deliverables",
    type: "folder",
    parentId: 301,
    category: "work",
    icon: "home"
  },
  {
    id: 305,
    name: "Tools & Analytics",
    description: "Workspace operations",
    type: "folder",
    parentId: 300,
    category: "work",
    icon: "line-chart"
  },

  {
    id: 400,
    name: "P - Projects",
    description: "Dev Tools, NASA, Hackathons",
    type: "folder",
    parentId: null,
    category: "projects"
  },
  {
    id: 401,
    name: "Dev Tools",
    description: "Infrastructure and Repos",
    type: "folder",
    parentId: 400,
    category: "projects",
    icon: "terminal"
  },
  {
    id: 402,
    name: "GitHub",
    description: "Repositories and version control",
    type: "file",
    parentId: 401,
    category: "projects",
    icon: "github"
  },
  {
    id: 403,
    name: "Vercel",
    description: "Deployments and hostings",
    type: "file",
    parentId: 401,
    category: "projects",
    icon: "server"
  },
  {
    id: 404,
    name: "Python Scripts",
    description: "Automation and utilities",
    type: "file",
    parentId: 401,
    category: "projects",
    icon: "code"
  },
  {
    id: 405,
    name: "Hackathons",
    description: "Competition entries",
    type: "folder",
    parentId: 400,
    category: "projects",
    icon: "trophy"
  },
  {
    id: 406,
    name: "SpaceApps 2024",
    description: "NASA Challenge",
    type: "file",
    parentId: 405,
    category: "projects",
    icon: "rocket"
  }
];
