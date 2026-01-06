export default defineEventHandler(() => {
  // For now, return mock data since backend doesn't have FAQs endpoint
  return [
    {
      question: 'How do I get started with learning English?',
      answer: 'Start by creating an account and taking our placement test. Based on your results, we\'ll recommend the best course for your level. You can then browse our courses and start learning at your own pace.',
    },
    {
      question: 'What is included in the premium subscription?',
      answer: 'Premium subscription includes access to all courses, live classes with native speakers, personalized feedback, downloadable materials, and priority support. You also get certificates upon course completion.',
    },
    {
      question: 'Can I learn at my own pace?',
      answer: 'Yes! All our courses are self-paced. You can study whenever and wherever you want. However, we recommend a consistent study schedule for the best results.',
    },
    {
      question: 'Do you offer certificates?',
      answer: 'Yes, we provide certificates of completion for all courses. Premium members also receive verified certificates that can be shared on LinkedIn and added to your resume.',
    },
    {
      question: 'How can I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. No refunds are provided for partial months.',
    },
  ]
})
