export default defineEventHandler(() => {
  // For now, return mock data since backend doesn't have careers endpoint
  return [
    {
      title: 'Senior English Teacher',
      department: 'Education',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead curriculum development and teach advanced English courses to help students achieve their learning goals.',
      requirements: [
        'Bachelor\'s degree in English, Education, or related field',
        '5+ years of teaching experience',
        'Native or near-native English proficiency',
        'Strong communication and presentation skills',
      ],
      responsibilities: [
        'Develop and deliver engaging English courses',
        'Create comprehensive curriculum materials',
        'Mentor junior teachers and provide feedback',
        'Track student progress and adjust teaching methods',
      ],
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Hanoi, Vietnam',
      type: 'Full-time',
      description: 'Build amazing user experiences with Vue.js and Nuxt to create the best learning platform.',
      requirements: [
        '3+ years of experience with Vue.js/Nuxt.js',
        'Strong TypeScript and JavaScript knowledge',
        'Experience with responsive design and UI/UX principles',
        'Familiarity with modern build tools and Git',
      ],
      responsibilities: [
        'Develop and maintain frontend applications',
        'Collaborate with designers and backend developers',
        'Write clean, maintainable, and testable code',
        'Optimize applications for maximum speed and scalability',
      ],
    },
    {
      title: 'Content Creator',
      department: 'Content',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create engaging educational content and videos that inspire learners around the world.',
      requirements: [
        '2+ years of content creation experience',
        'Excellent writing and communication skills',
        'Proficiency with video editing tools',
        'Understanding of SEO and content marketing',
      ],
      responsibilities: [
        'Create educational videos and written content',
        'Develop engaging lesson materials',
        'Collaborate with the education team',
        'Analyze content performance and optimize strategies',
      ],
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      description: 'Develop and execute marketing strategies to grow our platform and reach more learners.',
      requirements: [
        '3+ years of digital marketing experience',
        'Strong understanding of SEO, SEM, and social media',
        'Experience with marketing analytics tools',
        'Excellent project management skills',
      ],
      responsibilities: [
        'Plan and execute marketing campaigns',
        'Manage social media channels',
        'Analyze campaign performance and ROI',
        'Collaborate with content and design teams',
      ],
    },
  ]
})
