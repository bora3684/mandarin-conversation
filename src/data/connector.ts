import type { Phrase } from '../types'

export const goals = [
  'Travel more confidently',
  'Connect with someone important to me or my family',
  'Use Chinese for school or work',
  'Enjoy Chinese media and culture',
  'Learn for fun',
]

export const situations = [
  'Meeting someone new',
  'At a family gathering',
  'On a trip together',
  'During an everyday catch-up',
]

export const levels = [
  { number: 1, title: 'Make a good first impression', description: 'Greet someone warmly and begin a conversation.' },
  { number: 2, title: 'Introduce yourself', description: 'Share a little about yourself.' },
  { number: 3, title: 'Join in over food or tea', description: 'Feel at ease around the table.' },
  { number: 4, title: 'Keep the conversation going', description: 'Ask and respond with confidence.' },
  { number: 5, title: 'Have the conversation', description: 'Bring everything together.' },
]

// Curated core curriculum. Custom phrase requests are outside this prototype.
export const phrases: Phrase[] = [
  {
    id: 'hello', chinese: '你好！', pinyin: 'Nǐ hǎo!', english: 'Hello!',
    note: 'A simple, friendly greeting when you meet someone.',
    situation: 'You meet someone for the first time. Greet them.',
    chunks: [{ chinese: '你', pinyin: 'nǐ', meaning: 'you' }, { chinese: '好', pinyin: 'hǎo', meaning: 'good' }],
  },
  {
    id: 'nice-to-meet-you', chinese: '很高兴认识你。', pinyin: 'Hěn gāoxìng rènshi nǐ.', english: 'It’s nice to meet you.',
    note: 'Say this after you have exchanged names or been introduced.',
    situation: 'Someone has just introduced themselves. Respond warmly.',
    chunks: [
      { chinese: '很高兴', pinyin: 'hěn gāoxìng', meaning: 'very glad' },
      { chinese: '认识', pinyin: 'rènshi', meaning: 'to meet / know' },
      { chinese: '你', pinyin: 'nǐ', meaning: 'you' },
    ],
  },
  {
    id: 'your-name', chinese: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', english: 'What’s your name?',
    note: 'A natural question to ask when you are getting acquainted.',
    situation: 'You have greeted someone. Ask for their name.',
    chunks: [
      { chinese: '你', pinyin: 'nǐ', meaning: 'you' },
      { chinese: '叫', pinyin: 'jiào', meaning: 'are called' },
      { chinese: '什么名字', pinyin: 'shénme míngzi', meaning: 'what name' },
    ],
  },
]
