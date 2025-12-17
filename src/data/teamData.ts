export const teams = [
  {
    id: 't1',
    name: 'Product Engineering',
    lead: 'Sarah Jenkins',
    members: 6,
    workload: 85, // percentage
    expertise: ['React', 'Node.js', 'IoT Integration'],
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff'
  },
  {
    id: 't2',
    name: 'R&D / Innovation',
    lead: 'Dr. Arinze Okafor',
    members: 4,
    workload: 40,
    expertise: ['Material Science', 'Prototyping', 'Patents'],
    avatar: 'https://ui-avatars.com/api/?name=Arinze+Okafor&background=6D28D9&color=fff'
  },
  {
    id: 't3',
    name: 'Marketing & Sales',
    lead: 'Priya Mehta',
    members: 3,
    workload: 65,
    expertise: ['GTM Strategy', 'Digital Ads', 'Partnerships'],
    avatar: 'https://ui-avatars.com/api/?name=Priya+Mehta&background=BE185D&color=fff'
  }
];

export const initialTasks = [
  { id: 1, title: 'Finalize IoT Sensor Specs', team: 'Product Engineering', assignee: 'Sarah Jenkins', status: 'In Progress', priority: 'High', due: 'Oct 24' },
  { id: 2, title: 'Q3 Market Research Report', team: 'Marketing & Sales', assignee: 'Priya Mehta', status: 'Done', priority: 'Medium', due: 'Oct 20' },
  { id: 3, title: 'Drone Battery Stress Test', team: 'R&D / Innovation', assignee: 'Dr. Arinze', status: 'To Do', priority: 'High', due: 'Nov 01' },
];

export const members = [
  { id: 1, name: 'Sarah Jenkins', role: 'CTO', team: 'Product Engineering', status: 'Busy', skills: ['System Arch', 'Leadership'] },
  { id: 2, name: 'Mike Chen', role: 'Senior Dev', team: 'Product Engineering', status: 'Available', skills: ['React', 'Python'] },
  { id: 3, name: 'Dr. Arinze', role: 'Head of R&D', team: 'R&D', status: 'In Meeting', skills: ['Physics', 'Research'] },
];