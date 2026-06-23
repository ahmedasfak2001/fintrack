package com.ahmedasfak.fintrack.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

        private final JavaMailSender mailSender;

        public EmailService(JavaMailSender mailSender) {
                this.mailSender = mailSender;
        }

        // public void sendVerificationEmail(
        // String toEmail,
        // String verificationLink) {

        // System.out.println("Sending email to: " + toEmail);

        // SimpleMailMessage message = new SimpleMailMessage();

        // message.setFrom("fintrack.expensetrack@gmail.com");

        // message.setTo(toEmail);

        // message.setSubject(
        // "Verify Your FinTrack Account");

        // message.setText(
        // "Click the link below to verify your account:\n\n"
        // + verificationLink);

        // mailSender.send(message);
        // }
        public void sendVerificationEmail(
                        String toEmail,
                        String verificationLink) {

                try {

                        System.out.println("EMAIL START");

                        SimpleMailMessage message = new SimpleMailMessage();

                        message.setFrom(
                                        "fintrack.expensetrack@gmail.com");

                        message.setTo(toEmail);

                        message.setSubject(
                                        "Verify Your FinTrack Account");

                        message.setText(
                                        "Click the link below:\n\n"
                                                        + verificationLink);

                        mailSender.send(message);

                        System.out.println("EMAIL SENT SUCCESS");

                } catch (Exception e) {

                        System.out.println("EMAIL FAILED");

                        e.printStackTrace();

                        // throw e;
                }
        }
        // public void sendPasswordResetEmail(
        // String toEmail,
        // String resetLink) {

        // System.out.println(
        // "Sending password reset email to: "
        // + toEmail);

        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setFrom("fintrack.expensetrack@gmail.com");
        // message.setTo(toEmail);

        // message.setSubject(
        // "Reset Your FinTrack Password");

        // message.setText(
        // """
        // You requested a password reset for your FinTrack account.

        // Click the link below to reset your password:

        // """
        // + resetLink
        // +
        // """

        // This link will expire in 24 hours.

        // If you did not request this change, please ignore this email.

        // Team FinTrack
        // """);

        // mailSender.send(message);
        // }
        public void sendPasswordResetEmail(
                        String toEmail,
                        String resetLink) {

                try {

                        System.out.println(
                                        "Sending password reset email to: "
                                                        + toEmail);

                        SimpleMailMessage message = new SimpleMailMessage();

                        message.setFrom("fintrack.expensetrack@gmail.com");
                        // message.setFrom("af7ae7001@smtp-brevo.com");
                        message.setTo(toEmail);

                        message.setSubject(
                                        "Reset Your FinTrack Password");

                        message.setText(
                                        "Reset Link:\n\n" + resetLink);

                        mailSender.send(message);

                        System.out.println(
                                        "Password reset email sent successfully");

                } catch (Exception e) {

                        System.out.println(
                                        "PASSWORD RESET EMAIL ERROR");

                        e.printStackTrace();
                }
        }
}
