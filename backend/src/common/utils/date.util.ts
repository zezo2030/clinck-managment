export class DateUtil {
  /**
   * إضافة أيام إلى تاريخ معين
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * إضافة ساعات إلى تاريخ معين
   */
  static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  /**
   * إضافة دقائق إلى تاريخ معين
   */
  static addMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  /**
   * التحقق من أن التاريخ في نفس اليوم
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * الحصول على بداية اليوم
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * الحصول على نهاية اليوم
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * تنسيق التاريخ للعرض
   */
  static formatDate(date: Date, locale: string = 'ar-SA'): string {
    return date.toLocaleDateString(locale);
  }

  /**
   * تنسيق الوقت للعرض
   */
  static formatTime(date: Date, locale: string = 'ar-SA'): string {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * التحقق من أن الوقت بين ساعات العمل
   */
  static isWithinWorkingHours(
    time: Date,
    startTime: Date,
    endTime: Date,
  ): boolean {
    const timeOnly = new Date(2000, 0, 1, time.getHours(), time.getMinutes());
    const startOnly = new Date(2000, 0, 1, startTime.getHours(), startTime.getMinutes());
    const endOnly = new Date(2000, 0, 1, endTime.getHours(), endTime.getMinutes());

    return timeOnly >= startOnly && timeOnly <= endOnly;
  }

  /**
   * إنشاء slots زمنية بفواصل محددة
   */
  static generateTimeSlots(
    startTime: Date,
    endTime: Date,
    slotDurationMinutes: number = 30,
  ): Date[] {
    const slots: Date[] = [];
    const current = new Date(startTime);

    while (current < endTime) {
      slots.push(new Date(current));
      current.setMinutes(current.getMinutes() + slotDurationMinutes);
    }

    return slots;
  }
}
