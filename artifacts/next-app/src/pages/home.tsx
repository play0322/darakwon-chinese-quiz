import React, { useState, useEffect, useCallback } from 'react';
import { Home as HomeIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type VocabularyItem = {
  chinese: string;
  pinyin: string;
  meaning: string;
};

type QuizMode = 'pinyin' | 'chinese' | 'meaning';
type AppStep = 'login' | 'select-lesson' | 'select-mode' | 'quiz' | 'result';

const VOCAB_DATA: Record<string, VocabularyItem[]> = {
  "1": [
    { chinese: '刚', pinyin: 'gāng', meaning: '방금, 막' },
    { chinese: '同屋', pinyin: 'tóngwū', meaning: '룸메이트' },
    { chinese: '称呼', pinyin: 'chēnghu', meaning: '~라고 부르다' },
    { chinese: '正确', pinyin: 'zhèngquè', meaning: '정확하다' },
    { chinese: '人民', pinyin: 'rénmín', meaning: '인민, 국민' },
    { chinese: '时候', pinyin: 'shíhou', meaning: '때, 시각' },
    { chinese: '高中', pinyin: 'gāozhōng', meaning: '고등학교' },
    { chinese: '高级中学', pinyin: 'gāojí zhōngxué', meaning: '고등학교(정식)' },
    { chinese: '同学', pinyin: 'tóngxué', meaning: '학교 친구' },
    { chinese: '毕业', pinyin: 'bìyè', meaning: '졸업하다' },
    { chinese: '后', pinyin: 'hòu', meaning: '뒤, 후' },
    { chinese: '中文系', pinyin: 'Zhōngwén xì', meaning: '중문과' },
    { chinese: '年级', pinyin: 'niánjí', meaning: '학년' },
    { chinese: '怪不得', pinyin: 'guàibude', meaning: '어쩐지, 과연' },
    { chinese: '过奖', pinyin: 'guòjiǎng', meaning: '과찬이다' },
    { chinese: '为什么', pinyin: 'wèishénme', meaning: '왜, 무엇 때문에' },
    { chinese: '本来', pinyin: 'běnlái', meaning: '본래, 원래' },
    { chinese: '虽然', pinyin: 'suīrán', meaning: '비록 ~하지만' },
    { chinese: '不少', pinyin: 'bùshǎo', meaning: '적지 않다, 많다' },
    { chinese: '为了', pinyin: 'wèile', meaning: '~하기 위하여' },
    { chinese: '自我', pinyin: 'zìwǒ', meaning: '자아, 자신' },
    { chinese: '开发', pinyin: 'kāifā', meaning: '개발하다' },
    { chinese: '辞职', pinyin: 'cízhí', meaning: '사직하다' },
    { chinese: '读书', pinyin: 'dúshū', meaning: '공부하다' },
    { chinese: '进修', pinyin: 'jìnxiū', meaning: '연수하다' },
    { chinese: '因为', pinyin: 'yīnwèi', meaning: '왜냐하면' },
    { chinese: '经济', pinyin: 'jīngjì', meaning: '경제' },
    { chinese: '市场', pinyin: 'shìchǎng', meaning: '시장' },
    { chinese: '一边', pinyin: 'yìbiān', meaning: '~하면서 (동시)' },
    { chinese: '房间', pinyin: 'fángjiān', meaning: '방' },
    { chinese: '出去', pinyin: 'chūqù', meaning: '나가다, 외출하다' },
    { chinese: '进来', pinyin: 'jìnlái', meaning: '들어오다' },
    { chinese: '等', pinyin: 'děng', meaning: '기다리다' },
    { chinese: '认识', pinyin: 'rènshi', meaning: '알다, 인식하다' },
    { chinese: '银行', pinyin: 'yínháng', meaning: '은행' },
    { chinese: '对', pinyin: 'duì', meaning: '~에 대하여' },
    { chinese: '感兴趣', pinyin: 'gǎn xìngqù', meaning: '흥미를 느끼다' },
    { chinese: '宿舍', pinyin: 'sùshè', meaning: '기숙사' },
    { chinese: '找', pinyin: 'zhǎo', meaning: '찾다, 방문하다' },
    { chinese: '聊天', pinyin: 'liáotiān', meaning: '이야기 나누다' },
    { chinese: '所以', pinyin: 'suǒyǐ', meaning: '그래서, 그러므로' },
    { chinese: '怎么回事', pinyin: 'zěnme huí shì', meaning: '무슨 일인지, 어찌 된 일인지' },
    { chinese: '赶上', pinyin: 'gǎnshàng', meaning: '따라잡다, 타다' },
    { chinese: '目的', pinyin: 'mùdì', meaning: '목적' },
    { chinese: '原因', pinyin: 'yuányīn', meaning: '원인' },
    { chinese: '结果', pinyin: 'jiéguǒ', meaning: '결과' },
    { chinese: '动作', pinyin: 'dòngzuò', meaning: '동작' },
    { chinese: '以前', pinyin: 'yǐqián', meaning: '이전' },
    { chinese: '一会儿', pinyin: 'yíhuìr', meaning: '잠시' },
    { chinese: '以后', pinyin: 'yǐhòu', meaning: '이후' },
    { chinese: '着急', pinyin: 'zháojí', meaning: '조급해하다' },
    { chinese: '地铁', pinyin: 'dìtiě', meaning: '지하철' },
    { chinese: '跑', pinyin: 'pǎo', meaning: '달리다' },
    { chinese: '追上', pinyin: 'zhuīshàng', meaning: '따라잡다' },
    { chinese: '休息', pinyin: 'xiūxi', meaning: '휴식하다' },
    { chinese: '站', pinyin: 'zhàn', meaning: '역, 정거장' },
    { chinese: '早', pinyin: 'zǎo', meaning: '이르다' },
    { chinese: '才', pinyin: 'cái', meaning: '비로소, 겨우' },
    { chinese: '懂', pinyin: 'dǒng', meaning: '알아듣다, 이해하다' },
    { chinese: '一句汉语', pinyin: 'yí jù Hànyǔ', meaning: '중국어 한 마디' },
    { chinese: '做代表', pinyin: 'zuò dàibiǎo', meaning: '대표를 맡다' },
    { chinese: '比较', pinyin: 'bǐjiào', meaning: '비교적' },
    { chinese: '合适', pinyin: 'héshì', meaning: '적당하다, 알맞다' },
    { chinese: '没想到', pinyin: 'méi xiǎngdào', meaning: '생각지도 못하다' },
    { chinese: '生气', pinyin: 'shēngqì', meaning: '화내다' },
    { chinese: '根本', pinyin: 'gēnběn', meaning: '근본적으로, 아예' },
    { chinese: '参观', pinyin: 'cānguān', meaning: '참관하다, 관람하다' },
    { chinese: '告诉', pinyin: 'gàosu', meaning: '알리다, 말해주다' },
    { chinese: '人口', pinyin: 'rénkǒu', meaning: '인구' },
    { chinese: '火车', pinyin: 'huǒchē', meaning: '기차' },
    { chinese: '一大早', pinyin: 'yí dà zǎo', meaning: '이른 아침, 새벽같이' },
    { chinese: '出门', pinyin: 'chū mén', meaning: '외출하다, 집을 나서다' },
    { chinese: '文化', pinyin: 'wénhuà', meaning: '문화' },
    { chinese: '了解', pinyin: 'liǎojiě', meaning: '이해하다, 알다' },
    { chinese: '应该', pinyin: 'yīnggāi', meaning: '마땅히 ~해야 한다' },
    { chinese: '穿', pinyin: 'chuān', meaning: '입다' },
    { chinese: '电视台', pinyin: 'diànshìtái', meaning: '텔레비전 방송국' },
    { chinese: '介绍', pinyin: 'jièshào', meaning: '소개하다' },
    { chinese: '要好', pinyin: 'yàohǎo', meaning: '우애가 좋다, 친하다' },
    { chinese: '学哥', pinyin: 'xuégē', meaning: '선배(남학생)' },
    { chinese: '公交车', pinyin: 'gōngjiāochē', meaning: '버스' },
    { chinese: '其实', pinyin: 'qíshí', meaning: '사실은' },
    { chinese: '医院', pinyin: 'yīyuàn', meaning: '병원' },
    { chinese: '看病', pinyin: 'kànbìng', meaning: '진찰받다, 진료하다' },
    { chinese: '企业', pinyin: 'qǐyè', meaning: '기업' },
    { chinese: '第二专业', pinyin: 'dì èr zhuānyè', meaning: '제2 전공' },
    { chinese: '以为', pinyin: 'yǐwéi', meaning: '~인 줄 알다' },
    { chinese: '宇宙', pinyin: 'yǔzhòu', meaning: '우주' },
    { chinese: '中心', pinyin: 'zhōngxīn', meaning: '중심' },
    { chinese: '认为', pinyin: 'rènwéi', meaning: '~라고 여기다' },
    { chinese: '杰出', pinyin: 'jiéchū', meaning: '걸출하다' },
    { chinese: '学者', pinyin: 'xuézhě', meaning: '학자' },
    { chinese: '干净', pinyin: 'gānjìng', meaning: '깨끗하다' },
    { chinese: '整齐', pinyin: 'zhěngqí', meaning: '단정하다' },
    { chinese: '认真', pinyin: 'rènzhēn', meaning: '성실하다' },
    { chinese: '旅行', pinyin: 'lǚxíng', meaning: '여행하다' },
    { chinese: '努力', pinyin: 'nǔlì', meaning: '노력하다' },
    { chinese: '词典', pinyin: 'cídiǎn', meaning: '사전' },
    { chinese: '天气', pinyin: 'tiānqì', meaning: '날씨' },
    { chinese: '帮助', pinyin: 'bāngzhù', meaning: '돕다' },
    { chinese: '握手', pinyin: 'wòshǒu', meaning: '악수하다' },
    { chinese: '亲切', pinyin: 'qīnqiè', meaning: '친절하다' },
    { chinese: '辛苦', pinyin: 'xīnkǔ', meaning: '수고하다' },
    { chinese: '职员', pinyin: 'zhíyuán', meaning: '직원' },
    { chinese: '记者', pinyin: 'jìzhě', meaning: '기자' },
    { chinese: '科长', pinyin: 'kēzhǎng', meaning: '과장' },
    { chinese: '出生', pinyin: 'chūshēng', meaning: '태어나다' },
    { chinese: '属', pinyin: 'shǔ', meaning: '~띠에 속하다' },
    { chinese: '羊', pinyin: 'yáng', meaning: '양' },
    { chinese: '狗', pinyin: 'gǒu', meaning: '개' },
    { chinese: '牛', pinyin: 'niú', meaning: '소' },
    { chinese: '同事', pinyin: 'tóngshì', meaning: '동료' },
    { chinese: '尊敬', pinyin: 'zūnjìng', meaning: '존경하다' },
    { chinese: '历史', pinyin: 'lìshǐ', meaning: '역사' },
    { chinese: '管理', pinyin: 'guǎnlǐ', meaning: '관리/경영' },
    { chinese: '关系', pinyin: 'guānxi', meaning: '관계' },
    { chinese: '派', pinyin: 'pài', meaning: '파견하다' },
  ],
  "2": [
    { chinese: '适应', pinyin: 'shìyìng', meaning: '적응하다' },
    { chinese: '压力', pinyin: 'yālì', meaning: '스트레스' },
    { chinese: '节', pinyin: 'jié', meaning: '[수업 시간 단위를 세는 양사]' },
    { chinese: '那样', pinyin: 'nàyàng', meaning: '그렇게, 그렇다' },
    { chinese: '建议', pinyin: 'jiànyì', meaning: '건의/제안(하다)' },
    { chinese: '想到', pinyin: 'xiǎngdào', meaning: '생각하다, 생각이 미치다' },
    { chinese: '或者', pinyin: 'huòzhě', meaning: '~이거나 아니면 ~이다' },
    { chinese: '有时', pinyin: 'yǒushí', meaning: '때로는, 어떤 때' },
    { chinese: '洗', pinyin: 'xǐ', meaning: '씻다, 빨다' },
    { chinese: '打扫', pinyin: 'dǎsǎo', meaning: '청소하다' },
    { chinese: '上街', pinyin: 'shàngjiē', meaning: '거리로 나가다' },
    { chinese: '逛', pinyin: 'guàng', meaning: '구경하다, 거닐다' },
    { chinese: '转', pinyin: 'zhuàn', meaning: '한가하게 돌아다니다' },
    { chinese: '总', pinyin: 'zǒng', meaning: '늘, 언제나' },
    { chinese: '紧张', pinyin: 'jǐnzhāng', meaning: '바쁘다, 긴장되다' },
    { chinese: '自己', pinyin: 'zìjǐ', meaning: '자기, 자신' },
    { chinese: '事情', pinyin: 'shìqing', meaning: '일, 사건' },
    { chinese: '早上', pinyin: 'zǎoshang', meaning: '아침' },
    { chinese: '便利店', pinyin: 'biànlìdiàn', meaning: '편의점' },
    { chinese: '打工', pinyin: 'dǎgōng', meaning: '아르바이트하다' },
    { chinese: '当', pinyin: 'dāng', meaning: '~이 되다, 담당하다' },
    { chinese: '家教', pinyin: 'jiājiào', meaning: '가정교사' },
    { chinese: '家庭教师', pinyin: 'jiātíng jiàoshī', meaning: '가정교사' },
    { chinese: '生活', pinyin: 'shēnghuó', meaning: '생활(하다)' },
    { chinese: '补习班', pinyin: 'bǔxíbān', meaning: '학원' },
    { chinese: '英语', pinyin: 'Yīngyǔ', meaning: '영어' },
    { chinese: '如果', pinyin: 'rúguǒ', meaning: '만약 ~라면' },
    { chinese: '更', pinyin: 'gèng', meaning: '더욱, 더' },
    { chinese: '玩儿', pinyin: 'wánr', meaning: '놀다' },
    { chinese: '洗衣服', pinyin: 'xǐ yīfu', meaning: '옷을 세탁하다' },
    { chinese: '早就', pinyin: 'zǎojiù', meaning: '진작에, 벌써' },
    { chinese: '机会', pinyin: 'jīhuì', meaning: '기회' },
    { chinese: '卖光', pinyin: 'màiguāng', meaning: '다 팔리다 (매진)' },
    { chinese: '除了-以外', pinyin: 'chúle-yǐwài', meaning: '~을 제외하고' },
    { chinese: '决定', pinyin: 'juédìng', meaning: '결정(하다)' },
    { chinese: '担心', pinyin: 'dānxīn', meaning: '걱정하다' },
    { chinese: '长大', pinyin: 'zhǎngdà', meaning: '자라다, 성장하다' },
    { chinese: '曾经', pinyin: 'céngjīng', meaning: '일찍이, 이전에' },
    { chinese: '开始', pinyin: 'kāishǐ', meaning: '시작(하다)' },
    { chinese: '强', pinyin: 'qiáng', meaning: '강하다, 뛰어나다' },
    { chinese: '下班', pinyin: 'xiàbān', meaning: '퇴근하다' },
    { chinese: '放学', pinyin: 'fàngxué', meaning: '하교하다' },
    { chinese: '乒乓球', pinyin: 'pīngpāngqiú', meaning: '탁구' },
    { chinese: '爱人', pinyin: 'àiren', meaning: '배우자' },
    { chinese: '奇怪', pinyin: 'qíguài', meaning: '이상하다, 기괴하다' },
    { chinese: '留在', pinyin: 'liúzài', meaning: '~에 남다, 머물다' },
    { chinese: '周日', pinyin: 'zhōurì', meaning: '일요일' },
    { chinese: '游泳', pinyin: 'yóuyǒng', meaning: '수영(하다)' },
    { chinese: '练', pinyin: 'liàn', meaning: '연습하다, 단련하다' },
    { chinese: '太极拳', pinyin: 'tàijíquán', meaning: '태극권' },
    { chinese: '瑜伽', pinyin: 'yújiā', meaning: '요가' },
    { chinese: '约会', pinyin: 'yuēhuì', meaning: '약속, 데이트(하다)' },
    { chinese: '午休', pinyin: 'wǔxiū', meaning: '점심시간 휴식' },
    { chinese: '睡午觉', pinyin: 'shuì wǔjiào', meaning: '낮잠을 자다' },
    { chinese: '散步', pinyin: 'sànbù', meaning: '산책(하다)' },
    { chinese: '报纸', pinyin: 'bàozhǐ', meaning: '신문' },
    { chinese: '幸福', pinyin: 'xìngfú', meaning: '행복(하다)' },
    { chinese: '小说', pinyin: 'xiǎoshuō', meaning: '소설' },
    { chinese: '躺', pinyin: 'tǎng', meaning: '눕다' },
    { chinese: '床', pinyin: 'chuáng', meaning: '침대' },
    { chinese: '打开', pinyin: 'dǎkāi', meaning: '열다, (기기를) 켜다' },
    { chinese: '日语', pinyin: 'Rìyǔ', meaning: '일본어' },
    { chinese: '外语', pinyin: 'wàiyǔ', meaning: '외국어' },
    { chinese: '假期', pinyin: 'jiàqī', meaning: '휴가, 방학' },
    { chinese: '游戏', pinyin: 'yóuxì', meaning: '게임(하다)' },
    { chinese: '常常', pinyin: 'chángcháng', meaning: '자주' },
    { chinese: '公园', pinyin: 'gōngyuán', meaning: '공원' },
    { chinese: '锻炼', pinyin: 'duànliàn', meaning: '운동하다, 단련하다' },
    { chinese: '约好', pinyin: 'yuēhǎo', meaning: '약속하다' },
    { chinese: '早起', pinyin: 'zǎoqǐ', meaning: '일찍 일어나다' },
    { chinese: '画展', pinyin: 'huàzhǎn', meaning: '미술 전시회' },
    { chinese: '篮球', pinyin: 'lánqiú', meaning: '농구' },
  ],
  "3": [
    { chinese: '奖学金', pinyin: 'jiǎngxuéjīn', meaning: '장학금' },
    { chinese: '祝贺', pinyin: 'zhùhè', meaning: '축하하다, 경하하다' },
    { chinese: '成绩', pinyin: 'chéngjì', meaning: '성적' },
    { chinese: '呀', pinyin: 'ya', meaning: '(어조사)' },
    { chinese: '砸', pinyin: 'zá', meaning: '실패하다, 망치다' },
    { chinese: '考砸', pinyin: 'kǎozá', meaning: '시험을 망치다' },
    { chinese: '平均', pinyin: 'píngjūn', meaning: '평균(하다)' },
    { chinese: '班', pinyin: 'bān', meaning: '반' },
    { chinese: '数一数二', pinyin: 'shǔ yī shǔ èr', meaning: '1~2위를 다투다, 손꼽히다' },
    { chinese: '光', pinyin: 'guāng', meaning: '단지, 오로지' },
    { chinese: '顾', pinyin: 'gù', meaning: '돌보다, 주의하다' },
    { chinese: '社团', pinyin: 'shètuán', meaning: '동아리' },
    { chinese: '活动', pinyin: 'huódòng', meaning: '활동' },
    { chinese: '熬', pinyin: 'áo', meaning: '(밤을) 새우다, 견디다' },
    { chinese: '参加', pinyin: 'cānjiā', meaning: '참가하다' },
    { chinese: '茶道', pinyin: 'chádào', meaning: '다도' },
    { chinese: '吉他', pinyin: 'jítā', meaning: '기타' },
    { chinese: '拉丁舞', pinyin: 'lādīngwǔ', meaning: '라틴댄스' },
    { chinese: '选', pinyin: 'xuǎn', meaning: '선택하다' },
    { chinese: '句子', pinyin: 'jùzi', meaning: '문장' },
    { chinese: '专业', pinyin: 'zhuānyè', meaning: '전공' },
    { chinese: '必修', pinyin: 'bìxiū', meaning: '필수 과목' },
    { chinese: '选修', pinyin: 'xuǎnxiū', meaning: '선택 과목' },
    { chinese: '轻松', pinyin: 'qīngsōng', meaning: '수월하다, 가뿐하다' },
    { chinese: '不管', pinyin: 'bùguǎn', meaning: '~에 관계없이' },
    { chinese: '影响', pinyin: 'yǐngxiǎng', meaning: '영향(을 주다)' },
    { chinese: '第一名', pinyin: 'dì yī míng', meaning: '1등' },
    { chinese: '倒数', pinyin: 'dàoshǔ', meaning: '거꾸로 세다' },
    { chinese: '报告', pinyin: 'bàogào', meaning: '보고서, 리포트' },
    { chinese: '方言', pinyin: 'fāngyán', meaning: '방언, 사투리' },
    { chinese: '学费', pinyin: 'xuéfèi', meaning: '학비' },
    { chinese: '拿到', pinyin: 'nádào', meaning: '얻다, 따다' },
    { chinese: '上个学期', pinyin: 'shàng ge xuéqī', meaning: '지난 학기' },
    { chinese: '看起来', pinyin: 'kàn qǐlai', meaning: '보아하니, 보기에' },
    { chinese: '并不', pinyin: 'bìng bù', meaning: '결코 ~하지 않다' },
    { chinese: '怎样', pinyin: 'zěnyàng', meaning: '어떠하다' },
    { chinese: '只有', pinyin: 'zhǐyǒu', meaning: '단지 ~뿐' },
    { chinese: '快~了', pinyin: 'kuài ~ le', meaning: '곧 ~하려고 하다' },
    { chinese: '协会', pinyin: 'xiéhuì', meaning: '협회' },
    { chinese: '一共', pinyin: 'yígòng', meaning: '모두, 합계' },
    { chinese: '难', pinyin: 'nán', meaning: '어렵다' },
    { chinese: '哭', pinyin: 'kū', meaning: '울다' },
    { chinese: '怕', pinyin: 'pà', meaning: '두려워하다' },
    { chinese: '便宜', pinyin: 'piányi', meaning: '싸다' },
    { chinese: '小馋猫儿', pinyin: 'xiǎochánmāor', meaning: '먹보' },
    { chinese: '聪明', pinyin: 'cōngmíng', meaning: '똑똑하다' },
    { chinese: '道理', pinyin: 'dàoli', meaning: '도리, 이치' },
    { chinese: '橘子', pinyin: 'júzi', meaning: '귤' },
    { chinese: '酸', pinyin: 'suān', meaning: '시다' },
    { chinese: '容易', pinyin: 'róngyì', meaning: '쉽다' },
    { chinese: '刮风', pinyin: 'guā fēng', meaning: '바람 불다' },
    { chinese: '下雨', pinyin: 'xià yǔ', meaning: '비 오다' },
    { chinese: '忘记', pinyin: 'wàngjì', meaning: '잊다' },
    { chinese: '停课', pinyin: 'tíng kè', meaning: '휴강하다' },
    { chinese: '发表', pinyin: 'fābiǎo', meaning: '발표하다' },
    { chinese: '改', pinyin: 'gǎi', meaning: '고치다' },
    { chinese: '交', pinyin: 'jiāo', meaning: '제출하다' },
    { chinese: '为止', pinyin: 'wéizhǐ', meaning: '~까지 (마감)' },
    { chinese: '作业', pinyin: 'zuòyè', meaning: '숙제' },
    { chinese: '后天', pinyin: 'hòutiān', meaning: '모레' },
    { chinese: '算', pinyin: 'suàn', meaning: '셈하다, 계산하다' },
    { chinese: '同意', pinyin: 'tóngyì', meaning: '동의하다' },
    { chinese: '讲', pinyin: 'jiǎng', meaning: '말하다, 강연하다' },
    { chinese: '特别', pinyin: 'tèbié', meaning: '특별하다' },
    { chinese: '内容', pinyin: 'nèiróng', meaning: '내용' },
    { chinese: '关于', pinyin: 'guānyú', meaning: '~에 관하여' },
    { chinese: '练习', pinyin: 'liànxí', meaning: '연습하다' },
    { chinese: '留', pinyin: 'liú', meaning: '(숙제를) 내주다, 남기다' },
    { chinese: '一篇', pinyin: 'yì piān', meaning: '(보고서 등) 한 편' },
    { chinese: '跆拳道', pinyin: 'táiquándào', meaning: '태권도' },
    { chinese: '调查', pinyin: 'diàochá', meaning: '조사(하다)' },
    { chinese: '口语', pinyin: 'kǒuyǔ', meaning: '회화, 구어' },
    { chinese: '阅读', pinyin: 'yuèdú', meaning: '독해, 읽기' },
    { chinese: '写作', pinyin: 'xiězuò', meaning: '쓰기, 작문' },
    { chinese: '累死了', pinyin: 'lèi sǐ le', meaning: '피곤해 죽겠다' },
    { chinese: '时刻', pinyin: 'shíkè', meaning: '시각, 때' },
    { chinese: '不错', pinyin: 'búcuò', meaning: '괜찮다' },
    { chinese: '努力', pinyin: 'nǔlì', meaning: '노력하다' },
    { chinese: '考', pinyin: 'kǎo', meaning: '시험을 치다' },
    { chinese: '办', pinyin: 'bàn', meaning: '처리하다, 방법을 강구하다' },
  ],
  "4": [
    { chinese: '打篮球', pinyin: 'dǎ lánqiú', meaning: '농구를 하다' },
    { chinese: '连续', pinyin: 'liánxù', meaning: '연속하다, 계속하다' },
    { chinese: '投', pinyin: 'tóu', meaning: '던지다, 투척하다' },
    { chinese: '迷', pinyin: 'mí', meaning: '팬(fan), 광(狂), 마니아(mania), 애호가' },
    { chinese: '考试', pinyin: 'kǎoshì', meaning: '시험, 시험을 치르다' },
    { chinese: '咱们', pinyin: 'zánmen', meaning: '우리(들)' },
    { chinese: '场', pinyin: 'chǎng', meaning: '차례, 바탕 (경기 등을 세는 양사)' },
    { chinese: '比赛', pinyin: 'bǐsài', meaning: '경기, 시합' },
    { chinese: '那还用说', pinyin: 'Nà hái yòng shuō', meaning: '말할 것도 없지! 그렇고 말고!' },
    { chinese: '可惜', pinyin: 'kěxī', meaning: '섭섭하다, 아쉽다, 애석하다' },
    { chinese: '上次', pinyin: 'shàngcì', meaning: '지난번, 저번' },
    { chinese: '负伤', pinyin: 'fùshāng', meaning: '부상을 당하다, 다치다' },
    { chinese: '输', pinyin: 'shū', meaning: '패하다, 지다, 잃다' },
    { chinese: '可不是', pinyin: 'kěbúshì', meaning: '왜 아니겠나, 그렇지, 그렇고 말고' },
    { chinese: '比', pinyin: 'bǐ', meaning: '~대~ (두 개의 수를 비교할 때)' },
    { chinese: '差', pinyin: 'chà', meaning: '부족하다, 모자라다' },
    { chinese: '分', pinyin: 'fēn', meaning: '점 (성적 평가의 점수나 승부의 득점 수)' },
    { chinese: '赢', pinyin: 'yíng', meaning: '이기다, 승리하다' },
    { chinese: '队', pinyin: 'duì', meaning: '(어떤 성질을 지닌) 단체, 팀' },
    { chinese: '加油', pinyin: 'jiāyóu', meaning: '힘을 내다, 응원하다' },
    { chinese: '不如', pinyin: 'bùrú', meaning: '~만 못하다' },
    { chinese: '这样', pinyin: 'zhèyàng', meaning: '이렇다, 이와 같다, 이렇게' },
    { chinese: '力量', pinyin: 'lìliang', meaning: '능력, 역량, 힘' },
    { chinese: '嘛', pinyin: 'ma', meaning: '(당연한 사실을 나타내는 어기조사)' },
    { chinese: '因此', pinyin: 'yīncǐ', meaning: '이로 인하여, 그래서' },
    { chinese: '约', pinyin: 'yuē', meaning: '약속하다, 예약하다' },
    { chinese: '参赛', pinyin: 'cānsài', meaning: '시합에 참가하다' },
    { chinese: '今晚', pinyin: 'jīnwǎn', meaning: '오늘 밤' },
    { chinese: '相信', pinyin: 'xiāngxìn', meaning: '믿다, 신뢰하다' },
    { chinese: '流利', pinyin: 'liúlì', meaning: '유창하다' },
    { chinese: '还给', pinyin: 'huángěi', meaning: '돌려주다' },
    { chinese: '吃药', pinyin: 'chī yào', meaning: '약을 먹다' },
    { chinese: '功课', pinyin: 'gōngkè', meaning: '학업, 숙제, 공부' },
    { chinese: '猜', pinyin: 'cāi', meaning: '추측하다, 알아맞히다' },
    { chinese: '最好', pinyin: 'zuìhǎo', meaning: '가장 좋다, ~하는 것이 제일 좋다' },
    { chinese: '性格', pinyin: 'xìnggé', meaning: '성격' },
    { chinese: '房子', pinyin: 'fángzi', meaning: '집, 건물' },
    { chinese: '跑步', pinyin: 'pǎobù', meaning: '달리기를 하다, 조깅하다' },
    { chinese: '脚', pinyin: 'jiǎo', meaning: '발' },
    { chinese: '扭伤', pinyin: 'niǔshāng', meaning: '삐다, 접질리다' },
    { chinese: '公寓', pinyin: 'gōngyù', meaning: '아파트' },
    { chinese: '搬走', pinyin: 'bānzǒu', meaning: '이사 가다, 옮겨 가다' },
    { chinese: '班长', pinyin: 'bānzhǎng', meaning: '반장' },
    { chinese: '下围棋', pinyin: 'xià wéiqí', meaning: '바둑을 두다' },
    { chinese: '下象棋', pinyin: 'xià xiàngqí', meaning: '장기를 두다' },
    { chinese: '打麻将', pinyin: 'dǎ májiàng', meaning: '마작을 하다' },
    { chinese: '较量', pinyin: 'jiàoliàng', meaning: '겨루다, 대결하다, 힘을 다투다' },
    { chinese: '盘', pinyin: 'pán', meaning: '판, 국 (바둑, 장기 등을 세는 양사)' },
    { chinese: '局', pinyin: 'jú', meaning: '판, 국 (경기나 시합을 세는 양사)' },
    { chinese: '钓鱼', pinyin: 'diàoyú', meaning: '낚시하다' },
    { chinese: '爬山', pinyin: 'páshān', meaning: '등산하다' },
    { chinese: '拍照', pinyin: 'pāizhào', meaning: '사진을 찍다' },
    { chinese: '交响乐', pinyin: 'jiāoxiǎngyuè', meaning: '교향악' },
    { chinese: '画儿', pinyin: 'huàr', meaning: '그림' },
    { chinese: '真正', pinyin: 'zhēnzhèng', meaning: '진정한, 참된' },
    { chinese: '歌手', pinyin: 'gēshǒu', meaning: '가수' },
    { chinese: '踢足球', pinyin: 'tī zúqiú', meaning: '축구를 하다' },
    { chinese: '队员', pinyin: 'duìyuán', meaning: '팀원, 대원' },
    { chinese: '主力', pinyin: 'zhǔlì', meaning: '주력 (선수)' },
    { chinese: '输给', pinyin: 'shūgěi', meaning: '~에게 지다' },
    { chinese: '操场', pinyin: 'cāochǎng', meaning: '운동장' },
    { chinese: '骑车', pinyin: 'qíchē', meaning: '자전거를 타다' },
    { chinese: '刚好', pinyin: 'gānghǎo', meaning: '마침, 딱 맞게' },
    { chinese: '照相', pinyin: 'zhàoxiàng', meaning: '사진을 찍다' },
    { chinese: '留个纪念', pinyin: 'liú ge jìniàn', meaning: '기념으로 남기다' },
    { chinese: '投进', pinyin: 'tóujìn', meaning: '(공을) 던져 넣다, 골인시키다' },
    { chinese: '音乐', pinyin: 'yīnyuè', meaning: '음악' },
  ]
};

const GAS_URL = "https://script.google.com/macros/s/AKfycbx0yepSATmVnqx_446z0_mnDswdp-WlCLpjwdeg8MvY7BPl8CVn-ZLggqHsnSEkPlte/exec";

export default function HomePage() {
  const [step, setStep] = useState<AppStep>('login');
  const [studentName, setStudentName] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<string>("1");
  const [quizMode, setQuizMode] = useState<QuizMode>('pinyin');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectList, setIncorrectList] = useState<VocabularyItem[]>([]);
  const [isReview, setIsReview] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentLessonData = VOCAB_DATA[selectedLesson] || [];

  const unlockAudio = () => {
    if (typeof window.speechSynthesis === 'undefined') return;
    const msg = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(msg);
  };

  const speak = (text: string) => {
    if (typeof window.speechSynthesis === 'undefined') return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh-CN';
    msg.rate = 0.8;
    window.speechSynthesis.speak(msg);
  };

  const generateOptions = useCallback((correctAnswer: string, allData: VocabularyItem[], type: keyof VocabularyItem) => {
    let choices = allData.map(item => item[type]).filter(val => val !== correctAnswer);
    choices = Array.from(new Set(choices)).sort(() => 0.5 - Math.random()).slice(0, 3);
    choices.push(correctAnswer);
    return choices.sort(() => 0.5 - Math.random());
  }, []);

  useEffect(() => {
    if (step === 'quiz' && currentLessonData.length > 0) {
      const currentData = isReview ? incorrectList : currentLessonData;
      if (currentData[quizIndex]) {
        const type = quizMode;
        setOptions(generateOptions(currentData[quizIndex][type], currentLessonData, type));
      }
    }
  }, [quizIndex, step, isReview, quizMode, incorrectList, generateOptions, currentLessonData, selectedLesson]);

  const handleAnswer = (answer: string) => {
    if (showNext) return;
    const currentData = isReview ? incorrectList : currentLessonData;
    const currentQuestion = currentData[quizIndex];
    const isCorrect = answer === currentQuestion[quizMode];

    setSelectedAnswer(answer);
    if (isCorrect) {
      setScore(s => s + 1);
      speak(currentQuestion.chinese);
    } else if (!isReview) {
      setIncorrectList(prev => [...prev, currentQuestion]);
    }
    setShowNext(true);
  };

  const nextQuestion = () => {
    const currentData = isReview ? incorrectList : currentLessonData;
    if (quizIndex + 1 < currentData.length) {
      setQuizIndex(quizIndex + 1);
      setShowNext(false);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const startQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    setStep('quiz');
    setQuizIndex(0);
    setScore(0);
    setIncorrectList([]);
    setIsReview(false);
    setShowNext(false);
    setSelectedAnswer(null);
  };

  const startReview = () => {
    setIsReview(true);
    setQuizIndex(0);
    setScore(0);
    setStep('quiz');
    setShowNext(false);
    setSelectedAnswer(null);
  };

  const goHome = () => {
    setStep('select-lesson');
    setIncorrectList([]);
    setIsReview(false);
    setScore(0);
    setQuizIndex(0);
    setShowNext(false);
    setSelectedAnswer(null);
  };

  const finishQuiz = async () => {
    if (GAS_URL.startsWith("http")) {
      fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          studentName,
          lesson: selectedLesson,
          mode: isReview ? "오답복습" : quizMode,
          score,
          total: isReview ? incorrectList.length : currentLessonData.length
        })
      });
    }
    setStep('result');
  };

  const currentQuizData = isReview ? incorrectList : currentLessonData;
  const currentQuestion = currentQuizData[quizIndex];

  const getQuestionText = () => {
    if (!currentQuestion) return '';
    switch (quizMode) {
      case 'pinyin': return currentQuestion.chinese;
      case 'chinese': return currentQuestion.pinyin;
      case 'meaning': return currentQuestion.chinese;
      default: return '';
    }
  };

  const getButtonClass = (option: string) => {
    if (!showNext) return 'bg-white border-slate-100 hover:border-sky-200';
    if (option === currentQuestion[quizMode]) return 'bg-emerald-50 border-emerald-500 text-emerald-700';
    if (option === selectedAnswer && option !== currentQuestion[quizMode]) return 'bg-red-50 border-red-500 text-red-700';
    return 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 overflow-x-hidden">
      <nav className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <button onClick={goHome} className="flex items-center gap-1.5 text-sky-600 font-bold text-base hover:text-sky-700 transition-colors">
          <HomeIcon size={20} />
          <span>Home</span>
        </button>
        <div className="flex flex-col items-end">
          <span className="font-bold text-slate-700 text-sm">{studentName || "Darakwon"}</span>
          {step !== 'login' && step !== 'select-lesson' && <span className="text-xs text-sky-500 font-bold">제 {selectedLesson}과 학습중</span>}
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        {step === 'login' && (
          <div className="flex flex-col gap-4 mt-10 text-center">
            <h1 className="text-2xl font-black text-sky-900 leading-tight">다락원 중국어마스터<br/>STEP3</h1>
            <p className="text-slate-500 -mt-2 mb-4 font-medium">(단어 학습앱)</p>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="p-5 border-2 border-sky-100 rounded-[30px] focus:border-sky-500 outline-none shadow-sm text-center font-bold"
              value={studentName}
              onKeyDown={(e) => { if (e.key === 'Enter' && studentName.trim()) { unlockAudio(); setStep('select-lesson'); } }}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button
              disabled={!studentName.trim()}
              onClick={() => { unlockAudio(); setStep('select-lesson'); }}
              className="p-5 bg-sky-500 text-white rounded-[30px] font-black text-xl shadow-lg active:scale-95 disabled:bg-slate-300 hover:bg-sky-600 transition-colors"
            >
              학습 시작
            </button>
          </div>
        )}

        {step === 'select-lesson' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4 text-sky-900 text-center font-black">공부할 과를 선택하세요</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(VOCAB_DATA).sort((a, b) => Number(a) - Number(b)).map((num) => (
                <button
                  key={num}
                  onClick={() => { setSelectedLesson(num); setStep('select-mode'); }}
                  className="p-6 bg-white border-2 border-sky-50 rounded-[25px] flex items-center gap-4 hover:border-sky-500 shadow-sm transition-all group active:scale-95"
                >
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-black text-xl group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    {num}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-lg text-sky-900">제 {num}과 단어</div>
                    <div className="text-xs font-bold text-slate-400">총 {VOCAB_DATA[num].length} 단어</div>
                  </div>
                </button>
              ))}
              {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <div key={num} className="p-6 bg-slate-100 border-2 border-dashed border-slate-200 rounded-[25px] flex items-center gap-4 opacity-60">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-black text-xl">{num}</div>
                  <div className="text-left font-bold text-slate-400">제 {num}과 준비 중</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'select-mode' && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="text-center mb-6">
              <span className="bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-sm font-black uppercase tracking-wider">Lesson {selectedLesson}</span>
              <h2 className="text-2xl font-black text-slate-700 mt-2">모드 선택</h2>
            </div>
            <button onClick={() => startQuiz('pinyin')} className="p-6 bg-sky-500 text-white rounded-[30px] font-black shadow-lg text-lg hover:bg-sky-600 transition-colors">1단계: 한자 보고 병음 찾기</button>
            <button onClick={() => startQuiz('chinese')} className="p-6 bg-cyan-500 text-white rounded-[30px] font-black shadow-lg text-lg hover:bg-cyan-600 transition-colors">2단계: 병음 보고 한자 찾기</button>
            <button onClick={() => startQuiz('meaning')} className="p-6 bg-teal-500 text-white rounded-[30px] font-black shadow-lg text-lg hover:bg-teal-600 transition-colors">3단계: 한자 보고 뜻 찾기</button>
          </div>
        )}

        {step === 'quiz' && currentQuestion && (
          <div className="flex flex-col gap-3 items-center">
            <div className="w-full">
              <div className="flex justify-between text-slate-500 mb-2 text-xs font-bold px-1 uppercase tracking-widest">
                <span>Progress</span>
                <span>{quizIndex + 1} / {currentQuizData.length}</span>
              </div>
              <Progress value={((quizIndex + 1) / currentQuizData.length) * 100} className="h-3" />
            </div>

            <div
              className="text-center py-10 bg-white w-full rounded-[40px] shadow-xl border-2 border-sky-50 cursor-pointer active:scale-95 transition-all relative group"
              onClick={() => speak(currentQuestion.chinese)}
            >
              <div className="text-5xl md:text-6xl font-black text-sky-900 mb-2 tracking-tight group-hover:text-sky-600 transition-colors break-words px-4">
                {getQuestionText()}
              </div>
              <p className="text-sky-300 font-bold text-xs tracking-[0.2em] uppercase">
                {quizMode === 'chinese' ? "듣고 알맞은 한자를 고르세요" : "발음 듣기 (클릭)"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={showNext}
                  className={`p-4 rounded-[24px] border-2 font-bold text-lg md:text-xl transition-all shadow-sm active:scale-95 text-center break-words ${getButtonClass(opt)}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showNext && (
              <button onClick={nextQuestion} className="w-full p-4 bg-teal-500 text-white rounded-[30px] font-bold text-xl md:text-2xl shadow-2xl animate-pulse mt-3 hover:bg-teal-600 transition-colors">
                {quizIndex + 1 < currentQuizData.length ? '다음 문제 ➔' : '결과 보기'}
              </button>
            )}
          </div>
        )}

        {step === 'result' && (
          <div className="text-center flex flex-col gap-8 mt-12">
            <div>
              <h2 className="text-5xl font-black text-sky-900 uppercase mb-2">Well Done!</h2>
              <div className="text-xl font-bold text-slate-400 font-black">제 {selectedLesson}과 학습 완료</div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-sky-50">
              <div className="text-sm font-bold text-slate-400 mb-1 font-black">정답률</div>
              <div className="text-6xl font-black text-sky-600">{Math.round((score / currentQuizData.length) * 100)}%</div>
              <div className="text-slate-500 font-bold mt-2 font-black">{currentQuizData.length}문제 중 {score}개 정답</div>
            </div>

            {incorrectList.length > 0 && !isReview && (
              <button onClick={startReview} className="p-6 bg-rose-500 text-white rounded-[30px] font-black shadow-lg text-xl hover:bg-rose-600 transition-colors">
                틀린 {incorrectList.length}문제 복습
              </button>
            )}
            <button onClick={goHome} className="p-6 bg-sky-500 text-white rounded-[30px] font-black shadow-lg text-xl hover:bg-sky-600 transition-colors">다른 과 학습하기</button>
          </div>
        )}
      </main>
    </div>
  );
}
