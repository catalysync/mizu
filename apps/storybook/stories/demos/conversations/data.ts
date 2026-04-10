export interface Conversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
  status: 'open' | 'resolved' | 'snoozed';
  avatar: string;
}

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    preview: 'Hi, I need help with my subscription billing…',
    time: '2m',
    unread: true,
    status: 'open',
    avatar: 'SC',
  },
  {
    id: '2',
    name: 'James Okafor',
    preview: 'The export feature is giving me an error when…',
    time: '15m',
    unread: true,
    status: 'open',
    avatar: 'JO',
  },
  {
    id: '3',
    name: 'Priya Patel',
    preview: 'Thanks for the quick fix! Everything works now.',
    time: '1h',
    unread: false,
    status: 'resolved',
    avatar: 'PP',
  },
  {
    id: '4',
    name: 'Alex Kim',
    preview: 'Can I upgrade from the free plan to team?',
    time: '3h',
    unread: false,
    status: 'open',
    avatar: 'AK',
  },
  {
    id: '5',
    name: 'Maria Santos',
    preview: 'We need to add 5 more seats to our account.',
    time: '1d',
    unread: false,
    status: 'snoozed',
    avatar: 'MS',
  },
];

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'bot';
  name: string;
  text: string;
  time: string;
}

export const activeThread: Message[] = [
  {
    id: '1',
    sender: 'customer',
    name: 'Sarah Chen',
    text: 'Hi, I need help with my subscription billing. I was charged twice this month.',
    time: '10:42 AM',
  },
  {
    id: '2',
    sender: 'bot',
    name: 'Aspect Bot',
    text: 'Thanks for reaching out! Let me look up your account. I can see two charges on March 15 and March 18. It looks like the second charge was a renewal that processed early.',
    time: '10:42 AM',
  },
  {
    id: '3',
    sender: 'customer',
    name: 'Sarah Chen',
    text: 'That makes sense, but can I get a refund for the duplicate?',
    time: '10:44 AM',
  },
  {
    id: '4',
    sender: 'agent',
    name: 'You',
    text: "Hi Sarah! I've issued a refund for $29.00 (the March 18 charge). It should appear in your account within 3-5 business days. Is there anything else I can help with?",
    time: '10:47 AM',
  },
  {
    id: '5',
    sender: 'customer',
    name: 'Sarah Chen',
    text: "That was fast! No, that's all I needed. Thank you so much!",
    time: '10:48 AM',
  },
];
