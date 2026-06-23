// package com.ahmedasfak.fintrack.service;

// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// @Service
// public class EmailService {

//         private final JavaMailSender mailSender;

//         public EmailService(JavaMailSender mailSender) {
//                 this.mailSender = mailSender;
//         }

//         // public void sendVerificationEmail(
//         // String toEmail,
//         // String verificationLink) {

//         // System.out.println("Sending email to: " + toEmail);

//         // SimpleMailMessage message = new SimpleMailMessage();

//         // message.setFrom("fintrack.expensetrack@gmail.com");

//         // message.setTo(toEmail);

//         // message.setSubject(
//         // "Verify Your FinTrack Account");

//         // message.setText(
//         // "Click the link below to verify your account:\n\n"
//         // + verificationLink);

//         // mailSender.send(message);
//         // }
//         public void sendVerificationEmail(
//                         String toEmail,
//                         String verificationLink) {

//                 try {

//                         System.out.println("EMAIL START");

//                         System.out.println("FINTRACK BUILD 2026-06-23 SMTP TEST");

//                         SimpleMailMessage message = new SimpleMailMessage();

//                         message.setFrom(
//                                         "fintrack.expensetrack@gmail.com");

//                         message.setTo(toEmail);

//                         message.setSubject(
//                                         "Verify Your FinTrack Account");

//                         message.setText(
//                                         "Click the link below:\n\n"
//                                                         + verificationLink);

//                         mailSender.send(message);

//                         System.out.println("EMAIL SENT SUCCESS");

//                 } catch (Exception e) {

//                         System.out.println("EMAIL FAILED");

//                         e.printStackTrace();

//                         // throw e;
//                 }
//         }
//         // public void sendPasswordResetEmail(
//         // String toEmail,
//         // String resetLink) {

//         // System.out.println(
//         // "Sending password reset email to: "
//         // + toEmail);

//         // SimpleMailMessage message = new SimpleMailMessage();
//         // message.setFrom("fintrack.expensetrack@gmail.com");
//         // message.setTo(toEmail);

//         // message.setSubject(
//         // "Reset Your FinTrack Password");

//         // message.setText(
//         // """
//         // You requested a password reset for your FinTrack account.

//         // Click the link below to reset your password:

//         // """
//         // + resetLink
//         // +
//         // """

//         // This link will expire in 24 hours.

//         // If you did not request this change, please ignore this email.

//         // Team FinTrack
//         // """);

//         // mailSender.send(message);
//         // }
//         public void sendPasswordResetEmail(
//                         String toEmail,
//                         String resetLink) {

//                 try {

//                         System.out.println(
//                                         "Sending password reset email to: "
//                                                         + toEmail);

//                         SimpleMailMessage message = new SimpleMailMessage();

//                         message.setFrom("fintrack.expensetrack@gmail.com");
//                         // message.setFrom("af7ae7001@smtp-brevo.com");
//                         message.setTo(toEmail);

//                         message.setSubject(
//                                         "Reset Your FinTrack Password");

//                         message.setText(
//                                         "Reset Link:\n\n" + resetLink);

//                         mailSender.send(message);

//                         System.out.println(
//                                         "Password reset email sent successfully");

//                 } catch (Exception e) {

//                         System.out.println(
//                                         "PASSWORD RESET EMAIL ERROR");

//                         e.printStackTrace();
//                 }
//         }
// }

// newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
package com.ahmedasfak.fintrack.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

        @Value("${brevo.api.key}")
        private String brevoApiKey;

        private final RestTemplate restTemplate = new RestTemplate();

        private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

        public void sendVerificationEmail(
                        String toEmail,
                        String verificationLink) {

                try {

                        HttpHeaders headers = new HttpHeaders();

                        headers.setContentType(MediaType.APPLICATION_JSON);

                        headers.set("api-key", brevoApiKey);

                        Map<String, Object> requestBody = Map.of(

                                        "sender",
                                        Map.of(
                                                        "name", "FinTrack",
                                                        "email", "af7ae7001@smtp-brevo.com"),

                                        "to",
                                        List.of(
                                                        Map.of(
                                                                        "email", toEmail)),

                                        "subject",
                                        "Verify Your FinTrack Account",

                                        "textContent",
                                        """
                                                        Welcome to FinTrack!

                                                        Click the link below to verify your account:

                                                        """ + verificationLink

                        );

                        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

                        restTemplate.postForEntity(
                                        BREVO_URL,
                                        request,
                                        String.class);

                        System.out.println("EMAIL SENT SUCCESS");

                } catch (Exception e) {

                        System.out.println("EMAIL FAILED");

                        e.printStackTrace();
                }
        }

        public void sendPasswordResetEmail(
                        String toEmail,
                        String resetLink) {

                try {

                        HttpHeaders headers = new HttpHeaders();

                        headers.setContentType(MediaType.APPLICATION_JSON);

                        headers.set("api-key", brevoApiKey);

                        Map<String, Object> requestBody = Map.of(

                                        "sender",
                                        Map.of(
                                                        "name", "FinTrack",
                                                        "email", "fintrack.expensetrack@gmail.com"),

                                        "to",
                                        List.of(
                                                        Map.of(
                                                                        "email", toEmail)),

                                        "subject",
                                        "Reset Your FinTrack Password",

                                        "textContent",
                                        """
                                                        You requested a password reset.

                                                        Click the link below:

                                                        """ + resetLink

                        );

                        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

                        restTemplate.postForEntity(
                                        BREVO_URL,
                                        request,
                                        String.class);

                        System.out.println(
                                        "PASSWORD RESET EMAIL SENT");

                } catch (Exception e) {

                        System.out.println(
                                        "PASSWORD RESET EMAIL FAILED");

                        e.printStackTrace();
                }
        }
}
