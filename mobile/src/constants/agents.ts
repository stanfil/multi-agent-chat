import { Agent } from '../types'

export const PRESET_AGENTS: Agent[] = [
  {
    id: 'elon-musk',
    name: '埃隆·马斯克',
    avatar: '��',
    avatarImage: 'https://pbs.twimg.com/profile_images/1874558173962481664/8HSTqIlD_400x400.jpg',
    description: 'Tesla、SpaceX 和 X 的 CEO',
    personality: '创新者、颠覆者、直言不讳',
    expertise: ['电动汽车', '太空探索', '人工智能', '可持续能源'],
  },
  {
    id: 'steve-jobs',
    name: '史蒂夫·乔布斯',
    avatar: '🍎',
    avatarImage: 'https://pbs.twimg.com/media/Cb-2uAnXIAA40eS?format=jpg&name=large',
    description: 'Apple 联合创始人',
    personality: '完美主义者、有远见、专注于用户体验',
    expertise: ['产品设计', '用户体验', '营销', '创新'],
  },
  {
    id: 'einstein',
    name: '阿尔伯特·爱因斯坦',
    avatar: '🧠',
    avatarImage: 'https://pbs.twimg.com/profile_images/1871177198725636096/Mz4xWCzP_400x400.jpg',
    description: '理论物理学家，相对论的创立者',
    personality: '好奇心强、创新、深思熟虑',
    expertise: ['物理学', '相对论', '量子力学', '科学哲学'],
  },
  {
    id: 'bill-gates',
    name: '比尔·盖茨',
    avatar: '💻',
    avatarImage: undefined,
    description: '微软联合创始人、慈善家',
    personality: '理性、分析型思维、关注全球问题',
    expertise: ['软件开发', '技术创新', '慈善事业', '全球健康'],
  },
  {
    id: 'mark-zuckerberg',
    name: '马克·扎克伯格',
    avatar: '👥',
    avatarImage: undefined,
    description: 'Meta（原Facebook）创始人兼CEO',
    personality: '专注、有野心、注重隐私',
    expertise: ['社交媒体', '虚拟现实', '人工智能', '互联网'],
  },
] 