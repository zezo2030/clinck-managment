export class NotificationUtil {
  /**
   * إرسال إشعار للمستخدم
   */
  static async sendNotification(userId: number, notification: any) {
    // TODO: سيتم تطويره في المرحلة الرابعة مع SendGrid و Twilio
    console.log(`Notification sent to user ${userId}:`, notification);
    return true;
  }

  /**
   * إرسال إيميل للمستخدم
   */
  static async sendEmail(email: string, subject: string, content: string) {
    // TODO: سيتم تطويره في المرحلة الرابعة مع SendGrid
    console.log(`Email sent to ${email}:`, { subject, content });
    return true;
  }

  /**
   * إرسال رسالة نصية للمستخدم
   */
  static async sendSMS(phone: string, message: string) {
    // TODO: سيتم تطويره في المرحلة الرابعة مع Twilio
    console.log(`SMS sent to ${phone}:`, message);
    return true;
  }

  /**
   * إشعار تذكير الموعد
   */
  static async sendAppointmentReminder(appointment: any) {
    const notification = {
      title: 'تذكير بالموعد',
      message: `لديك موعد مع ${appointment.doctor.name} في ${appointment.appointmentDate}`,
      type: 'APPOINTMENT_REMINDER',
    };

    return this.sendNotification(appointment.patientId, notification);
  }

  /**
   * إشعار توفر موعد في قائمة الانتظار
   */
  static async sendWaitingListNotification(patient: any, availableSlot: any) {
    const notification = {
      title: 'موعد متاح',
      message: `موعد متاح مع الطبيب في ${availableSlot.date} الساعة ${availableSlot.time}`,
      type: 'WAITING_LIST_NOTIFICATION',
    };

    return this.sendNotification(patient.id, notification);
  }
}
