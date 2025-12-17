// Define the scores for each project (Key = Project ID)
export const projectScores: Record<string, Record<string, number>> = {
  'p1': { // AgriSense IoT (Overall ~3)
    'Technology': 3,
    'Product': 4,
    'Market Research': 3,
    'Organisation': 4,
    'Target Market': 3
  },
  'p2': { // MediDrone (Overall ~5)
    'Technology': 5,
    'Product': 6,
    'Market Research': 5,
    'Organisation': 5,
    'Target Market': 6
  }
};

// Define the axes/categories for the chart
export const categories = [
  'Technology', 
  'Product', 
  'Market Research', 
  'Organisation', 
  'Target Market'
];