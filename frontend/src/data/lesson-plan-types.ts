export type FormLesson = {
  week: number
  date?: string
  form?: string
  class?: string
  subject?: string
  topic: string
  subTopic?: string
  objectives?: string
  references?: string
  teachingAids?: string
  previousKnowledge?: string
  content?: string
  starter?: string
  development?: string
  consolidation?: string
  evaluation?: string
  assignment?: string
  reflection?: string
  remarks?: string
}

export type FormSchemeRow = {
  week: number
  dates?: string
  topic: string
  subTopic?: string
  objectives?: string
  content?: string
  activities?: string
  resources?: string
  methods?: string
  teachingAids?: string
  references?: string
  assessment?: string
  remarks?: string
}
