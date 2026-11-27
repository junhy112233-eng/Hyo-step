import type { HyoTopic } from '../types/hyo.ts';

interface RawTopic {
  title: string;
  ko: string;
  sample: string;
}

const SAMPLE_HOME =
  'I show care for my family by helping at home. I wash the dishes after dinner. Sometimes, I help my younger brother with his homework. These small actions make my family happy. I feel proud when we help each other.';

const SAMPLE_ELDER =
  'Last weekend, I helped my grandmother carry heavy bags. It was cold outside, so I walked slowly beside her. She smiled and thanked me warmly. I felt happy because I could help her. I want to spend more time with her next weekend.';

const SAMPLE_TALK =
  'I show respect for my family by listening carefully when we talk. After dinner, we often sit together and share our day. I put away my phone so I can focus on them. Talking together makes our home warm. I feel thankful for our time together.';

const SAMPLE_CARE =
  'Yesterday, my mom looked tired after work. I made warm tea and cleaned the living room table. She was surprised and gave me a big smile. Helping her made me feel proud too. Small kindnesses can make a big difference at home.';

const RAW_TOPICS: RawTopic[] = [
  { title: 'How can you show care and respect for your family?', ko: '가족에게 사랑과 존중을 어떻게 표현할 수 있나요?', sample: SAMPLE_HOME },
  { title: 'How do you help your family after dinner?', ko: '저녁 식사 후에 가족을 어떻게 도와주나요?', sample: SAMPLE_HOME },
  { title: 'Write about a time you carried something heavy for a family member.', ko: '가족을 위해 무거운 짐을 들어주었던 경험을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you cheer up someone in your family when they feel tired?', ko: '가족 중 누군가 피곤해 보일 때 어떻게 기운을 북돋아 주나요?', sample: SAMPLE_CARE },
  { title: 'What small chore do you do at home without being asked?', ko: '누가 시키지 않아도 집에서 스스로 하는 작은 집안일은 무엇인가요?', sample: SAMPLE_HOME },
  { title: 'How do you show respect when an older family member is speaking?', ko: '웃어른이 말씀하실 때 어떻게 존중을 표현하나요?', sample: SAMPLE_TALK },
  { title: 'Write about a meal or snack you prepared for your family.', ko: '가족을 위해 직접 준비한 식사나 간식에 대해 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you help your grandparents or older relatives?', ko: '할머니, 할아버지 또는 친척 어른을 어떻게 도와드리나요?', sample: SAMPLE_ELDER },
  { title: 'What is a kind way to greet your family in the morning?', ko: '아침에 가족에게 다정하게 인사하는 나만의 방법은 무엇인가요?', sample: SAMPLE_TALK },
  { title: 'Write about a time you shared something nice with your family.', ko: '가족과 좋은 것을 함께 나누었던 경험을 써 보세요.', sample: SAMPLE_HOME },

  { title: 'How do you help keep shared spaces clean at home?', ko: '집 안의 함께 쓰는 공간을 깨끗하게 유지하기 위해 무엇을 하나요?', sample: SAMPLE_HOME },
  { title: 'Write about a warm conversation you had with your family recently.', ko: '최근에 가족과 나눈 따뜻했던 대화에 대해 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you say thank you to the people who take care of you?', ko: '나를 돌봐주는 가족에게 감사를 어떻게 표현하나요?', sample: SAMPLE_TALK },
  { title: 'What do you do when someone in your family catches a cold?', ko: '가족 중 누군가 감기에 걸렸을 때 어떻게 챙겨주나요?', sample: SAMPLE_CARE },
  { title: 'Write about helping a younger brother, sister, or cousin.', ko: '동생이나 어린 친척을 도와주었던 이야기를 써 보세요.', sample: SAMPLE_HOME },
  { title: 'How do you show patience when your family is busy?', ko: '가족이 바쁠 때 어떻게 배려하고 기다려 주나요?', sample: SAMPLE_TALK },
  { title: 'Write about walking together with someone in your family.', ko: '가족과 함께 산책하거나 걸었던 시간에 대해 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you help with recycling or taking out the trash?', ko: '분리수거나 쓰레기 버리기를 어떻게 도와주나요?', sample: SAMPLE_HOME },
  { title: 'What makes your home feel happy and peaceful?', ko: '우리 집을 행복하고 평화롭게 만드는 것은 무엇인가요?', sample: SAMPLE_TALK },
  { title: 'Write about a message or letter you wrote to your family.', ko: '가족에게 쓴 감사 메시지나 편지에 대해 써 보세요.', sample: SAMPLE_CARE },

  { title: 'How do you help your parents or guardians on weekends?', ko: '주말에 부모님이나 보호자를 어떻게 도와드리나요?', sample: SAMPLE_HOME },
  { title: 'Write about listening carefully to a family member’s story.', ko: '가족의 이야기를 끝까지 귀 기울여 들었던 경험을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help with groceries or shopping for your family?', ko: '장을 보거나 식료품을 정리할 때 어떻게 돕나요?', sample: SAMPLE_ELDER },
  { title: 'What polite words do you use with your family every day?', ko: '매일 가족에게 자주 사용하는 예의 바른 말은 무엇인가요?', sample: SAMPLE_TALK },
  { title: 'Write about a time you made someone in your family smile.', ko: '가족 중 누군가를 웃게 만들었던 순간을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you help get ready before a family trip or outing?', ko: '가족 외출이나 여행 전에 어떤 준비를 함께 돕나요?', sample: SAMPLE_HOME },
  { title: 'What do you do to help on a family member’s birthday?', ko: '가족의 생일에 어떤 따뜻한 일을 하나요?', sample: SAMPLE_CARE },
  { title: 'How do you take care of your own things so your family worries less?', ko: '가족의 걱정을 덜기 위해 내 물건과 할 일을 어떻게 챙기나요?', sample: SAMPLE_HOME },
  { title: 'Write about teaching a family member how to use a phone or app.', ko: '가족에게 스마트폰이나 앱 사용법을 알려주었던 경험을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you share good news from school with your family?', ko: '학교에서 있었던 좋은 소식을 가족과 어떻게 나누나요?', sample: SAMPLE_TALK },

  { title: 'What can you do when a family member comes home late?', ko: '가족이 늦게 귀가할 때 어떤 배려를 할 수 있나요?', sample: SAMPLE_CARE },
  { title: 'Write about washing dishes or setting the table at home.', ko: '설거지를 하거나 상을 차렸던 경험에 대해 써 보세요.', sample: SAMPLE_HOME },
  { title: 'How do you show care for a family member who lives far away?', ko: '멀리 사는 가족에게 안부와 마음을 어떻게 전하나요?', sample: SAMPLE_ELDER },
  { title: 'What is one thing you appreciate about your family?', ko: '가족에게 가장 고마움을 느끼는 점 한 가지는 무엇인가요?', sample: SAMPLE_TALK },
  { title: 'Write about a time you apologized kindly after a small argument.', ko: '작은 다툼 뒤에 먼저 따뜻하게 사과했던 경험을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help fold laundry or organize clothes at home?', ko: '빨래를 개거나 옷을 정리하는 일을 어떻게 돕나요?', sample: SAMPLE_HOME },
  { title: 'Write about spending screen-free time with your family.', ko: '스마트폰을 잠시 내려놓고 가족과 함께 보낸 시간을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you comfort a family member who had a hard day?', ko: '힘든 하루를 보낸 가족을 어떻게 위로하나요?', sample: SAMPLE_CARE },
  { title: 'What polite habit do you practice during family meals?', ko: '가족과 함께 식사할 때 지키는 좋은 예절은 무엇인가요?', sample: SAMPLE_TALK },
  { title: 'Write about helping clean up after a rainy or snowy day.', ko: '비나 눈이 온 날 가족을 도와 집 안팎을 정리했던 일을 써 보세요.', sample: SAMPLE_ELDER },

  { title: 'How do you remember important dates for your family?', ko: '가족의 중요한 날을 어떻게 기억하고 챙기나요?', sample: SAMPLE_CARE },
  { title: 'Write about holding the door or an umbrella for a family member.', ko: '가족을 위해 문을 잡아주거나 우산을 씌워주었던 일을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you help care for a family pet or plants at home?', ko: '집에 있는 반려동물이나 식물을 돌보며 가족을 어떻게 돕나요?', sample: SAMPLE_HOME },
  { title: 'What can you say to encourage a family member before an important day?', ko: '중요한 날을 앞둔 가족에게 어떤 응원의 말을 해줄 수 있나요?', sample: SAMPLE_TALK },
  { title: 'Write about making a warm drink for someone in your family.', ko: '가족에게 따뜻한 차나 음료를 챙겨드린 경험을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you help when guests or relatives visit your home?', ko: '손님이나 친척이 집에 오셨을 때 어떻게 도와드리나요?', sample: SAMPLE_HOME },
  { title: 'Write about a traditional holiday moment you shared with your family.', ko: '명절이나 가족 모임에서 따뜻함을 느꼈던 순간을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you give up a comfortable seat or share the best part with family?', ko: '편한 자리를 양보하거나 맛있는 것을 가족에게 양보한 경험을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'What is a promise you want to keep for your family this month?', ko: '이번 달 가족을 위해 꼭 지키고 싶은 약속은 무엇인가요?', sample: SAMPLE_HOME },
  { title: 'Write about saying good night warmly to your family.', ko: '잠들기 전 가족에게 따뜻하게 인사하는 모습을 써 보세요.', sample: SAMPLE_TALK },

  { title: 'How do you help your family save water or electricity at home?', ko: '집에서 물이나 전기를 아끼며 가족을 돕는 방법은 무엇인가요?', sample: SAMPLE_HOME },
  { title: 'Write about a photo or memory you talked about with your family.', ko: '가족과 함께 옛 사진이나 추억을 이야기한 시간을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you help someone in your family find something they lost?', ko: '가족이 잃어버린 물건을 함께 찾아주었던 경험을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'What helpful job can you do in the kitchen?', ko: '부엌에서 가족을 위해 할 수 있는 도움은 무엇인가요?', sample: SAMPLE_HOME },
  { title: 'Write about giving a shoulder massage or back rub to a family member.', ko: '가족의 어깨를 주물러 드리거나 안마해 드린 경험을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you stay calm and speak gently at home?', ko: '집에서 화가 날 때도 차분하고 부드럽게 말하려고 어떻게 노력하나요?', sample: SAMPLE_TALK },
  { title: 'Write about helping a family member learn something new.', ko: '가족이 새로운 것을 배우는 데 도움을 주었던 경험을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you greet your grandparents on the phone or video call?', ko: '전화나 영상 통화로 조부모님께 어떻게 안부 인사를 드리나요?', sample: SAMPLE_ELDER },
  { title: 'What can you do on Sunday evening to help your family start the week well?', ko: '일요일 저녁에 가족이 한 주를 기분 좋게 시작하도록 무엇을 할 수 있나요?', sample: SAMPLE_HOME },
  { title: 'Write about sharing an umbrella or jacket with a family member.', ko: '가족에게 우산이나 겉옷을 나누어 주었던 일을 써 보세요.', sample: SAMPLE_CARE },

  { title: 'How do you help keep shoes or the entryway neat at home?', ko: '현관이나 신발을 깔끔하게 정리하며 가족을 어떻게 돕나요?', sample: SAMPLE_HOME },
  { title: 'Write about asking a family member about their day.', ko: '가족에게 오늘 하루가 어땠는지 먼저 물어보았던 경험을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help carry bags when coming home together?', ko: '함께 집에 돌아올 때 가방이나 짐을 어떻게 들어주나요?', sample: SAMPLE_ELDER },
  { title: 'What is a kind surprise you want to do for your family?', ko: '가족을 위해 해보고 싶은 작은 깜짝 선물이나 행동은 무엇인가요?', sample: SAMPLE_CARE },
  { title: 'Write about watching a movie or show together with your family.', ko: '가족과 함께 영화나 TV를 보며 즐거웠던 시간을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help when someone in your family is studying or working?', ko: '가족이 공부하거나 일할 때 어떤 배려를 하나요?', sample: SAMPLE_TALK },
  { title: 'Write about thanking someone who cooked a meal for you.', ko: '맛있는 식사를 만들어 준 가족에게 고마움을 표현한 일을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you help clean the bathroom or sink at home?', ko: '화장실이나 세면대를 정리하며 가족을 어떻게 돕나요?', sample: SAMPLE_HOME },
  { title: 'What makes a family feel respected when they give you advice?', ko: '가족이 조언을 해줄 때 존중받는 느낌을 주려면 어떻게 해야 할까요?', sample: SAMPLE_TALK },
  { title: 'Write about helping pack lunch or snacks for an outing.', ko: '나들이나 외출을 위해 도시락이나 간식을 함께 챙긴 일을 써 보세요.', sample: SAMPLE_HOME },

  { title: 'How do you show care on Parents’ Day or a family celebration?', ko: '어버이날이나 가족 기념일에 어떻게 마음을 전하나요?', sample: SAMPLE_CARE },
  { title: 'Write about reading something aloud or helping read small text for an elder.', ko: '어른을 위해 작은 글씨나 안내문을 대신 읽어드린 경험을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you help keep your bedroom tidy for your family?', ko: '내 방을 스스로 정리해서 가족을 편하게 해주는 방법을 써 보세요.', sample: SAMPLE_HOME },
  { title: 'Write about laughing together with your family over a funny moment.', ko: '가족과 함께 웃었던 즐거웠던 순간에 대해 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help younger kids stay safe outside?', ko: '동생이나 어린 가족이 밖에서 안전하도록 어떻게 챙겨주나요?', sample: SAMPLE_HOME },
  { title: 'What is one kind habit you learned from your family?', ko: '가족에게 배운 좋은 습관이나 배려의 모습은 무엇인가요?', sample: SAMPLE_TALK },
  { title: 'Write about bringing water or medicine to someone who needed rest.', ko: '쉬고 있는 가족에게 물이나 약을 챙겨다 준 경험을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you show care before leaving home for school?', ko: '학교에 가기 전 집을 나서며 가족에게 어떻게 마음을 표현하나요?', sample: SAMPLE_TALK },
  { title: 'Write about helping fix or organize something broken or messy at home.', ko: '집에서 어지럽혀진 물건을 정리하거나 고치는 것을 도운 일을 써 보세요.', sample: SAMPLE_HOME },
  { title: 'How do you celebrate a family member’s small success?', ko: '가족의 작은 성취나 좋은 일을 어떻게 함께 축하하나요?', sample: SAMPLE_TALK },

  { title: 'Write about waiting for everyone before starting a meal.', ko: '모두가 모일 때까지 기다렸다가 함께 식사했던 경험을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help your family during a busy morning?', ko: '바쁜 아침 시간에 가족을 위해 무엇을 도울 수 있나요?', sample: SAMPLE_HOME },
  { title: 'Write about drawing a card or making a small gift for your family.', ko: '가족을 위해 직접 카드를 그리거나 작은 선물을 만든 일을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you help protect your family’s health at home?', ko: '집에서 가족의 건강을 지키기 위해 할 수 있는 일은 무엇인가요?', sample: SAMPLE_CARE },
  { title: 'Write about walking slowly to match an older family member’s pace.', ko: '어른의 걸음 속도에 맞추어 천천히 함께 걸었던 경험을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you show care when your family shares food together?', ko: '가족과 음식을 나누어 먹을 때 어떻게 배려하나요?', sample: SAMPLE_ELDER },
  { title: 'Write about helping clean up books, papers, or desks at home.', ko: '집 안의 책이나 책상을 함께 정리했던 일을 써 보세요.', sample: SAMPLE_HOME },
  { title: 'How do you listen when a family member gives you a reminder?', ko: '가족이 당부나 조언을 해줄 때 어떤 태도로 듣나요?', sample: SAMPLE_TALK },
  { title: 'Write about helping someone in your family carry groceries upstairs.', ko: '가족과 함께 계단이나 현관까지 장바구니를 옮겼던 일을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'What kind word can brighten your family’s evening?', ko: '가족의 저녁 시간을 환하게 밝힐 수 있는 다정한 말 한마디는 무엇인가요?', sample: SAMPLE_TALK },

  { title: 'Write about helping take care of someone when they are busy with work.', ko: '가족이 일로 바쁠 때 내가 대신 챙겨준 일을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'How do you show respect to people who support you every day?', ko: '매일 나를 응원하고 도와주는 가족에게 어떻게 존중을 보이나요?', sample: SAMPLE_TALK },
  { title: 'Write about helping set up chairs or cushions for your family.', ko: '가족이 편하게 쉴 수 있도록 자리나 방석을 챙겨드린 일을 써 보세요.', sample: SAMPLE_ELDER },
  { title: 'How do you share household tasks fairly with your family?', ko: '가족과 집안일을 어떻게 나누어 함께 하나요?', sample: SAMPLE_HOME },
  { title: 'Write about a time you felt proud after helping at home.', ko: '집에서 가족을 도운 뒤 뿌듯함을 느꼈던 경험을 써 보세요.', sample: SAMPLE_HOME },
  { title: 'How do you show gratitude for a warm home and meal?', ko: '따뜻한 집과 식사에 대해 어떻게 고마움을 표현하나요?', sample: SAMPLE_CARE },
  { title: 'Write about calling or texting a family member just to say you care.', ko: '특별한 용건 없이도 안부를 묻는 연락을 드렸던 경험을 써 보세요.', sample: SAMPLE_TALK },
  { title: 'How do you help keep noise low when someone is sleeping at home?', ko: '집에서 누군가 자고 있을 때 조용히 배려했던 경험을 써 보세요.', sample: SAMPLE_CARE },
  { title: 'Write about one small HYO action you did this week.', ko: '이번 주에 내가 실천한 작은 효(HYO) 행동 한 가지를 써 보세요.', sample: SAMPLE_HOME },
  { title: 'What does showing care and respect for family mean to you?', ko: '나에게 가족을 아끼고 존중하는 마음(HYO)이란 무엇인가요?', sample: SAMPLE_TALK },
];

export const HYO_TOPICS_100: HyoTopic[] = RAW_TOPICS.map((item, idx) => ({
  id: `hyo-${String(idx + 1).padStart(3, '0')}`,
  title: item.title,
  subtitle: 'In this app, HYO means showing care and respect for your family in your own way.',
  koreanSubtitle: item.ko,
  sampleParagraph: item.sample,
}));
