import { avisoNotificationSummary } from './avisoDisplay'
import { formatRelativeNoticeTime } from './noticePreview'

const READ_AT_KEY = 'flowalert:notifications-read-at'

export function getNotificationsReadAt() {
  const raw = sessionStorage.getItem(READ_AT_KEY)
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

export function markNotificationsReadAt(date = new Date()) {
  sessionStorage.setItem(READ_AT_KEY, date.toISOString())
}

export function isAvisoUnread(sentAt, readAt) {
  const sent = new Date(sentAt)
  if (Number.isNaN(sent.getTime())) return false
  if (!readAt) return true
  return sent > readAt
}

export function mapAvisoToNotification(aviso, readAt) {
  return {
    id: aviso.id,
    tone: aviso.tone,
    icon: aviso.icon,
    title: aviso.title,
    text: avisoNotificationSummary(aviso),
    time: formatRelativeNoticeTime(aviso.sentAt),
    unread: isAvisoUnread(aviso.sentAt, readAt),
  }
}
