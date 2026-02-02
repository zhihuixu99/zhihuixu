export interface Question {
  id: number
  text: string
  factor: string
}

export interface Factor {
  name: string
  description: string
  questionIds: number[]
}

export const factors: Record<string, Factor> = {
  somatization: {
    name: "躯体化",
    description: "反映主观的身体不适感",
    questionIds: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
  },
  obsessive: {
    name: "强迫症状",
    description: "反映临床上强迫症状群",
    questionIds: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
  },
  interpersonal: {
    name: "人际关系敏感",
    description: "反映个人人际关系状况",
    questionIds: [6, 21, 34, 36, 37, 41, 61, 69, 73],
  },
  depression: {
    name: "抑郁",
    description: "反映抑郁苦闷的情感状态",
    questionIds: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
  },
  anxiety: {
    name: "焦虑",
    description: "反映焦虑、紧张等表现",
    questionIds: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
  },
  hostility: {
    name: "敌对",
    description: "反映敌对、攻击等表现",
    questionIds: [11, 24, 63, 67, 74, 81],
  },
  phobic: {
    name: "恐怖",
    description: "反映恐惧害怕的情绪",
    questionIds: [13, 25, 47, 50, 70, 75, 82],
  },
  paranoid: {
    name: "偏执",
    description: "反映猜疑、偏执等表现",
    questionIds: [8, 18, 43, 68, 76, 83],
  },
  psychotic: {
    name: "精神病性",
    description: "反映精神病性症状表现",
    questionIds: [7, 16, 35, 62, 77, 84, 85, 87, 88, 90],
  },
  other: {
    name: "其他",
    description: "睡眠及饮食等状况",
    questionIds: [19, 44, 59, 60, 64, 66, 89],
  },
}

export const questions: Question[] = [
  { id: 1, text: "头痛", factor: "somatization" },
  { id: 2, text: "神经过敏，心中不踏实", factor: "anxiety" },
  { id: 3, text: "头脑中有不必要的想法或字句盘旋", factor: "obsessive" },
  { id: 4, text: "头昏或昏倒", factor: "somatization" },
  { id: 5, text: "对异性的兴趣减退", factor: "depression" },
  { id: 6, text: "对旁人责备求全", factor: "interpersonal" },
  { id: 7, text: "感到别人能控制您的思想", factor: "psychotic" },
  { id: 8, text: "责怪别人制造麻烦", factor: "paranoid" },
  { id: 9, text: "忘记性大", factor: "obsessive" },
  { id: 10, text: "担心自己的衣饰整齐及仪态的端正", factor: "obsessive" },
  { id: 11, text: "容易烦恼和激动", factor: "hostility" },
  { id: 12, text: "胸痛", factor: "somatization" },
  { id: 13, text: "害怕空旷的场所或街道", factor: "phobic" },
  { id: 14, text: "感到自己的精力下降，活动减慢", factor: "depression" },
  { id: 15, text: "想结束自己的生命", factor: "depression" },
  { id: 16, text: "听到旁人听不到的声音", factor: "psychotic" },
  { id: 17, text: "发抖", factor: "anxiety" },
  { id: 18, text: "感到大多数人都不可信任", factor: "paranoid" },
  { id: 19, text: "胃口不好", factor: "other" },
  { id: 20, text: "容易哭泣", factor: "depression" },
  { id: 21, text: "同异性相处时感到害羞不自在", factor: "interpersonal" },
  { id: 22, text: "感到受骗，中了圈套或有人想抓住您", factor: "depression" },
  { id: 23, text: "无缘无故地突然感到害怕", factor: "anxiety" },
  { id: 24, text: "自己不能控制地大发脾气", factor: "hostility" },
  { id: 25, text: "怕单独出门", factor: "phobic" },
  { id: 26, text: "经常责怪自己", factor: "depression" },
  { id: 27, text: "腰痛", factor: "somatization" },
  { id: 28, text: "感到难以完成任务", factor: "obsessive" },
  { id: 29, text: "感到孤独", factor: "depression" },
  { id: 30, text: "感到苦闷", factor: "depression" },
  { id: 31, text: "过分担忧", factor: "depression" },
  { id: 32, text: "对事物不感兴趣", factor: "depression" },
  { id: 33, text: "感到害怕", factor: "anxiety" },
  { id: 34, text: "您的感情容易受到伤害", factor: "interpersonal" },
  { id: 35, text: "旁人能知道您的私下想法", factor: "psychotic" },
  { id: 36, text: "感到别人不理解您、不同情您", factor: "interpersonal" },
  { id: 37, text: "感到人们对您不友好，不喜欢您", factor: "interpersonal" },
  { id: 38, text: "做事必须做得很慢以保证做得正确", factor: "obsessive" },
  { id: 39, text: "心跳得很厉害", factor: "anxiety" },
  { id: 40, text: "恶心或胃部不舒服", factor: "somatization" },
  { id: 41, text: "感到比不上他人", factor: "interpersonal" },
  { id: 42, text: "肌肉酸痛", factor: "somatization" },
  { id: 43, text: "感到有人在监视您、谈论您", factor: "paranoid" },
  { id: 44, text: "难以入睡", factor: "other" },
  { id: 45, text: "做事必须反复检查", factor: "obsessive" },
  { id: 46, text: "难以作出决定", factor: "obsessive" },
  { id: 47, text: "怕乘电车、公共汽车、地铁或火车", factor: "phobic" },
  { id: 48, text: "呼吸有困难", factor: "somatization" },
  { id: 49, text: "一阵阵发冷或发热", factor: "somatization" },
  { id: 50, text: "因为感到害怕而避开某些东西、场合或活动", factor: "phobic" },
  { id: 51, text: "脑子变空了", factor: "obsessive" },
  { id: 52, text: "身体发麻或刺痛", factor: "somatization" },
  { id: 53, text: "喉咙有梗塞感", factor: "somatization" },
  { id: 54, text: "感到前途没有希望", factor: "depression" },
  { id: 55, text: "不能集中注意力", factor: "obsessive" },
  { id: 56, text: "感到身体的某一部分软弱无力", factor: "somatization" },
  { id: 57, text: "感到紧张或容易紧张", factor: "anxiety" },
  { id: 58, text: "感到手或脚发重", factor: "somatization" },
  { id: 59, text: "想到死亡的事", factor: "other" },
  { id: 60, text: "吃得太多", factor: "other" },
  { id: 61, text: "当别人看着您或谈论您时感到不自在", factor: "interpersonal" },
  { id: 62, text: "有一些不属于您自己的想法", factor: "psychotic" },
  { id: 63, text: "有想打人或伤害他人的冲动", factor: "hostility" },
  { id: 64, text: "醒得太早", factor: "other" },
  { id: 65, text: "必须反复洗手、点数目或触摸某些东西", factor: "obsessive" },
  { id: 66, text: "睡得不稳不深", factor: "other" },
  { id: 67, text: "有想摔坏或破坏东西的冲动", factor: "hostility" },
  { id: 68, text: "有一些别人没有的想法或念头", factor: "paranoid" },
  { id: 69, text: "感到对别人神经过敏", factor: "interpersonal" },
  { id: 70, text: "在商店或电影院等人多的地方感到不自在", factor: "phobic" },
  { id: 71, text: "感到任何事情都很困难", factor: "depression" },
  { id: 72, text: "一阵阵恐惧或惊恐", factor: "anxiety" },
  { id: 73, text: "感到在公共场合吃东西很不舒服", factor: "interpersonal" },
  { id: 74, text: "经常与人争论", factor: "hostility" },
  { id: 75, text: "单独一人时神经很紧张", factor: "phobic" },
  { id: 76, text: "别人对您的成绩没有作出恰当的评价", factor: "paranoid" },
  { id: 77, text: "即使和别人在一起也感到孤单", factor: "psychotic" },
  { id: 78, text: "感到坐立不安心神不宁", factor: "anxiety" },
  { id: 79, text: "感到自己没有什么价值", factor: "depression" },
  { id: 80, text: "感到熟悉的东西变成陌生或不像是真的", factor: "anxiety" },
  { id: 81, text: "大叫或摔东西", factor: "hostility" },
  { id: 82, text: "害怕会在公共场合晕倒", factor: "phobic" },
  { id: 83, text: "感到别人想占您的便宜", factor: "paranoid" },
  { id: 84, text: "为一些有关性的想法而很苦恼", factor: "psychotic" },
  { id: 85, text: "您认为应该因为自己的过错而受到惩罚", factor: "psychotic" },
  { id: 86, text: "感到要赶快把事情做完", factor: "anxiety" },
  { id: 87, text: "感到自己的身体有严重问题", factor: "psychotic" },
  { id: 88, text: "从未感到和其他人很亲近", factor: "psychotic" },
  { id: 89, text: "感到自己有罪", factor: "other" },
  { id: 90, text: "感到自己的脑子有毛病", factor: "psychotic" },
]

export const ratingOptions = [
  { value: 1, label: "没有", description: "自觉无该项症状" },
  { value: 2, label: "很轻", description: "自觉有该项症状，但发生得不频繁、不严重" },
  { value: 3, label: "中等", description: "自觉有该项症状，其严重程度为中度" },
  { value: 4, label: "偏重", description: "自觉有该项症状，其程度为中度到严重之间" },
  { value: 5, label: "严重", description: "自觉该症状的频度和强度都十分严重" },
]

export interface TestResult {
  totalScore: number
  positiveItems: number
  positiveAverage: number
  factorScores: Record<string, { score: number; average: number; level: string }>
  gsi: number // 总症状指数
  psi: number // 阳性症状痛苦水平
}

export function calculateResults(answers: Record<number, number>): TestResult {
  const answeredQuestions = Object.keys(answers).length
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
  
  // 阳性项目数（得分>=2的项目）
  const positiveItems = Object.values(answers).filter(val => val >= 2).length
  
  // 阳性项目均分
  const positiveSum = Object.values(answers).filter(val => val >= 2).reduce((sum, val) => sum + val, 0)
  const positiveAverage = positiveItems > 0 ? positiveSum / positiveItems : 0
  
  // 总症状指数
  const gsi = totalScore / 90
  
  // 阳性症状痛苦水平
  const psi = positiveItems > 0 ? positiveSum / positiveItems : 0
  
  // 各因子分数
  const factorScores: Record<string, { score: number; average: number; level: string }> = {}
  
  for (const [key, factor] of Object.entries(factors)) {
    const factorAnswers = factor.questionIds.map(id => answers[id] || 1)
    const factorSum = factorAnswers.reduce((sum, val) => sum + val, 0)
    const factorAvg = factorSum / factor.questionIds.length
    
    let level = "正常"
    if (factorAvg >= 3) {
      level = "重度"
    } else if (factorAvg >= 2.5) {
      level = "中重度"
    } else if (factorAvg >= 2) {
      level = "中度"
    } else if (factorAvg >= 1.5) {
      level = "轻度"
    }
    
    factorScores[key] = {
      score: factorSum,
      average: Number(factorAvg.toFixed(2)),
      level,
    }
  }
  
  return {
    totalScore,
    positiveItems,
    positiveAverage: Number(positiveAverage.toFixed(2)),
    factorScores,
    gsi: Number(gsi.toFixed(2)),
    psi: Number(psi.toFixed(2)),
  }
}

export function getOverallAssessment(result: TestResult): { level: string; description: string } {
  if (result.gsi >= 2.5) {
    return {
      level: "需要关注",
      description: "您的测评结果显示心理健康状况需要关注，建议寻求专业心理咨询师或医生的帮助。"
    }
  } else if (result.gsi >= 2) {
    return {
      level: "中度症状",
      description: "您的测评结果显示存在一定程度的心理困扰，建议关注自身心理状态，必要时寻求专业帮助。"
    }
  } else if (result.gsi >= 1.5) {
    return {
      level: "轻度症状",
      description: "您的测评结果显示存在轻微的心理压力，建议适当调整生活方式，保持身心健康。"
    }
  }
  return {
    level: "状态良好",
    description: "您的测评结果显示心理健康状况良好，请继续保持健康的生活方式。"
  }
}
