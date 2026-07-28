import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface FormattedDate {
  dateLabel: string;
  weekdayLabel: string;
}

/**
 * YYYY-MM-DD 날짜 문자열을 전달받아 한국어 월/일 및 요일 표시 라벨을 반환하는 함수.
 * 예: "2026-07-27" -> { dateLabel: "7월 27일", weekdayLabel: "월" }
 *
 * @param dateString YYYY-MM-DD 규격 날짜 문자열
 * @returns dateLabel과 weekdayLabel 객체
 */
export function formatDate(dateString: string): FormattedDate {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      return { dateLabel: dateString, weekdayLabel: '' };
    }
    const dateLabel = format(date, 'M월 d일', { locale: ko });
    const weekdayLabel = format(date, 'EEE', { locale: ko });
    return { dateLabel, weekdayLabel };
  } catch {
    return { dateLabel: dateString, weekdayLabel: '' };
  }
}
