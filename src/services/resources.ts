// Mock data for resources
const mockResources = [
  {
    id: '1',
    title: 'Additional Mathematics Formula Sheet',
    description: 'Complete formula reference for Add Math topics',
    type: 'pdf',
    url: '/resources/formula-sheet.pdf'
  },
  {
    id: '2',
    title: 'Calculus Practice Problems',
    description: 'Collection of practice problems with solutions',
    type: 'pdf',
    url: '/resources/calculus-practice.pdf'
  },
  {
    id: '3',
    title: 'Functions and Graphs Tutorial',
    description: 'Video tutorial explaining key concepts',
    type: 'video',
    url: '/resources/functions-tutorial.mp4'
  }
];

export async function fetchResources() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResources);
    }, 1000);
  });
}

export async function downloadResourceFile(url: string): Promise<Blob> {
  // In a real application, this would make an actual API call
  // For now, we'll simulate a PDF download
  const dummyPdfContent = new Uint8Array([37, 80, 68, 70]); // PDF magic numbers
  return new Blob([dummyPdfContent], { type: 'application/pdf' });
}