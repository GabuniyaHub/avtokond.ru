import nodemailer from 'nodemailer';

// Инициализация Nodemailer для Яндекс почты
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Отправить письмо с кодом подтверждения
 */
export async function sendVerificationEmail(
    email: string,
    code: string,
    fullName: string
) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Подтверждение записи на техосмотр - Автоконд',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Подтверждение записи на техосмотр</h2>
        <p>Привет, ${fullName}!</p>
        <p>Вы оставили запрос на техосмотр. Для подтверждения использу следующий код:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h1 style="letter-spacing: 2px; color: #0f172a;">${code}</h1>
        </div>
        <p>Код действителен 15 минут.</p>
        <p>Если это были не вы, просто проигнорируйте это письмо.</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          ООО "Автоконд" - техосмотр и транспортное обслуживание<br>
          ул. Сибирская, 121, пгт. Междуреченский<br>
          Тел: 8 (34677) 33463<br>
          Email: avtokond2000@yandex.ru
        </p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Отправить письмо с подтверждением записи
 */
export async function sendConfirmationEmail(
    email: string,
    fullName: string,
    appointmentDate: string,
    appointmentTime: string,
    vehicleModel: string
) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Запись на техосмотр подтверждена - Автоконд',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Ваша запись подтверждена</h2>
        <p>Привет, ${fullName}!</p>
        <p>Спасибо за вашу запрос. Ваша запись на техосмотр подтверждена:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0f172a;">
          <p><strong>Дата:</strong> ${appointmentDate}</p>
          <p><strong>Время:</strong> ${appointmentTime}</p>
          <p><strong>Марка и модель ТС:</strong> ${vehicleModel}</p>
        </div>
        <p style="color: #666; margin: 20px 0;">
          Пожалуйста, приезжайте за 10 минут до назначенного времени.<br>
          Не забудьте взять с собой необходимые документы.
        </p>
        <p style="color: #666;">
          Если нужно отменить или перенести запись, свяжитесь с нами:<br>
          Тел: 8 (34677) 33463<br>
          Email: avtokond2000@yandex.ru
        </p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          ООО "Автоконд" - техосмотр и транспортное обслуживание<br>
          ул. Сибирская, 121, пгт. Междуреченский<br>
          График работы: Вт-Сб 8:30-17:30 (обед 12:00-13:30)
        </p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Отправить письмо администратору о новой записи
 */
export async function sendAdminNotification(
    fullName: string,
    phone: string,
    email: string,
    appointmentDate: string,
    appointmentTime: string,
    vehicleModel: string,
    vehicleType: string
) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Новая запись на техосмотр - ${vehicleType}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Новая запись на техосмотр</h2>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Имя клиента:</strong> ${fullName}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Тип ТС:</strong> ${vehicleType}</p>
          <p><strong>Марка и модель:</strong> ${vehicleModel}</p>
          <p><strong>Дата записи:</strong> ${appointmentDate}</p>
          <p><strong>Время записи:</strong> ${appointmentTime}</p>
        </div>
        <p>Это сообщение было автоматически отправлено из системы обработки записей Автоконд.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Отправить письмо администратору о контактном сообщении
 */
export async function sendContactNotification(
    fullName: string,
    email: string,
    phone: string | undefined,
    subject: string,
    message: string
) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `Новое сообщение от клиента: ${subject}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Новое сообщение от клиента</h2>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>От:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Телефон:</strong> ${phone}</p>` : ''}
          <p><strong>Тема:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 15px 0;">
          <p><strong>Сообщение:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p>Это сообщение было автоматически отправлено из системы на сайте Автоконд.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
}
