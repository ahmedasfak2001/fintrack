package com.ahmedasfak.fintrack.service;

import com.ahmedasfak.fintrack.dto.AuthResponse;
import com.ahmedasfak.fintrack.security.JwtService;

import com.ahmedasfak.fintrack.repository.ExpenseRepository;
import com.ahmedasfak.fintrack.dto.LoginRequest;
import com.ahmedasfak.fintrack.dto.RegisterRequest;
import com.ahmedasfak.fintrack.dto.UserProfileResponse;
import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.repository.UserRepository;
import com.ahmedasfak.fintrack.entity.VerificationToken;
import com.ahmedasfak.fintrack.exception.AccountAlreadyVerifiedException;
import com.ahmedasfak.fintrack.exception.VerificationException;
import com.ahmedasfak.fintrack.repository.VerificationTokenRepository;
import com.ahmedasfak.fintrack.entity.PasswordResetToken;
import com.ahmedasfak.fintrack.repository.PasswordResetTokenRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final VerificationTokenRepository verificationTokenRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final EmailService emailService;
        private final ExpenseRepository expenseRepository;

        public UserService(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        VerificationTokenRepository verificationTokenRepository,
                        PasswordResetTokenRepository passwordResetTokenRepository,
                        EmailService emailService,
                        ExpenseRepository expenseRepository) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.verificationTokenRepository = verificationTokenRepository;
                this.passwordResetTokenRepository = passwordResetTokenRepository;
                this.emailService = emailService;
                this.expenseRepository = expenseRepository;
        }

        private final UserRepository userRepository;

        // For register User, we will check if the email already exists. If it does, we
        // will return an error message. If it doesn't, we will create a new user and
        // save it to the database. We will also encrypt the password using
        // BCryptPasswordEncoder.
        public String register(RegisterRequest request) {

                System.out.println(
                                "REGISTER API HIT");
                if (userRepository.existsByEmail(request.getEmail())) {

                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "User already exists");
                }

                User user = new User();

                user.setName(request.getName());
                user.setEmail(request.getEmail());

                // Password encrypted usi BCrypt.
                user.setPassword(
                                passwordEncoder.encode(request.getPassword()));

                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                user.setEnabled(false);
                userRepository.save(user);
                String token = UUID.randomUUID().toString();
                VerificationToken verificationToken = new VerificationToken();

                verificationToken.setToken(token);

                verificationToken.setUser(user);

                verificationToken.setExpiryDate(
                                LocalDateTime.now()
                                                .plusHours(24));

                verificationTokenRepository.save(
                                verificationToken);

                String verificationLink = "https://fintrack-0la1.onrender.com/api/users/verify?token="
                                + token;

                // Send email
                emailService.sendVerificationEmail(
                                user.getEmail(),
                                verificationLink);

                System.out.println(
                                "Verification Token = "
                                                + token);

                return "User Registered Successfully";
        }

        // For login, we will check if the email exists. If it doesn't, we will return
        // an error message. If it does, we will check if the password matches. If it
        // doesn't,
        public AuthResponse login(LoginRequest request) {

                User user = userRepository
                                .findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Incorrect email or password"));

                boolean passwordMatched = passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword());

                if (!passwordMatched) {
                        throw new RuntimeException("Incorrect email or password");
                }
                if (!user.getEnabled()) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Please verify your email before logging in");
                }

                String token = jwtService.generateToken(user.getEmail());

                // return new AuthResponse(token);
                return new AuthResponse(
                                token,
                                user.getName());
        }

        // To verify account after registration
        public String verifyAccount(String token) {

                VerificationToken verificationToken = verificationTokenRepository
                                .findByToken(token)
                                .orElseThrow(() -> new VerificationException(
                                                """
                                                                Invalid Verification Link

                                                                The verification link is invalid or may have been removed.

                                                                Please check the link or request a new verification email.
                                                                """));

                User user = verificationToken.getUser();

                if (user.getEnabled()) {
                        throw new VerificationException("Account already verified");
                }

                if (verificationToken.getExpiryDate()
                                .isBefore(LocalDateTime.now())) {

                        throw new VerificationException("Verification link expired");
                }

                user.setEnabled(true);

                userRepository.save(user);

                verificationTokenRepository.delete(verificationToken);

                return """
                                🎉 Email Verification Successful!

                                Your FinTrack account has been activated successfully.

                                You can now log in and start managing your expenses.
                                """;
        }

        // reverification
        public String resendVerificationEmail(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "No account found with this email"));

                if (user.getEnabled()) {

                        throw new AccountAlreadyVerifiedException(
                                        "Account is already verified");
                }

                verificationTokenRepository
                                .findByUser(user)
                                .ifPresent(
                                                verificationTokenRepository::delete);

                String token = UUID.randomUUID().toString();

                VerificationToken verificationToken = new VerificationToken();

                verificationToken.setToken(token);

                verificationToken.setUser(user);

                verificationToken.setExpiryDate(
                                LocalDateTime.now()
                                                .plusHours(24));

                verificationTokenRepository.save(
                                verificationToken);

                String verificationLink = "https://fintrack-0la1.onrender.com/api/users/verify?token="
                                + token;

                emailService.sendVerificationEmail(
                                user.getEmail(),
                                verificationLink);

                return """
                                A new verification email has been sent.

                                Please check your inbox.
                                """;
        }

        public String forgotPassword(String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "No account found with this email"));

                passwordResetTokenRepository
                                .findByUser(user)
                                .ifPresent(passwordResetTokenRepository::delete);

                String token = UUID.randomUUID().toString();

                PasswordResetToken resetToken = new PasswordResetToken();

                resetToken.setToken(token);

                resetToken.setUser(user);

                resetToken.setExpiryDate(
                                LocalDateTime.now()
                                                .plusHours(24));

                passwordResetTokenRepository.save(
                                resetToken);

                // String resetLink = "http://localhost:8080/api/users/reset-password?token="
                // + token;

                String resetLink = "https://fintrack-0la1.onrender.com/api/users/reset-password?token="
                                + token;
                // String resetLink =
                // "http://192.168.31.80:8080/api/users/reset-password?token="
                // + token;

                emailService.sendPasswordResetEmail(
                                user.getEmail(),
                                resetLink);

                System.out.println("FORGOT PASSWORD API HIT");

                System.out.println("Generated Reset Token = " + token);

                System.out.println("Sending reset email to = " + user.getEmail());

                return """
                                Password reset email sent successfully.

                                Please check your inbox.
                                """;
        }

        public String resetPassword(
                        String token,
                        String newPassword) {

                PasswordResetToken resetToken = passwordResetTokenRepository
                                .findByToken(token)
                                .orElseThrow(() -> new RuntimeException(
                                                "Invalid password reset link"));

                if (resetToken.getExpiryDate()
                                .isBefore(LocalDateTime.now())) {

                        throw new RuntimeException(
                                        "Password reset link expired");
                }

                User user = resetToken.getUser();

                user.setPassword(
                                passwordEncoder.encode(
                                                newPassword));

                user.setUpdatedAt(
                                LocalDateTime.now());

                userRepository.save(user);

                passwordResetTokenRepository
                                .delete(resetToken);

                return """
                                Password reset successful.

                                You can now login using your new password.
                                """;
        }

        public UserProfileResponse getProfile(String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                BigDecimal currentExpense = expenseRepository.getTotalExpenseByUser(user);

                return new UserProfileResponse(
                                user.getName(),
                                user.getEmail(),
                                user.getMonthlyBudget(),
                                user.getEnabled(),
                                currentExpense);
        }

        public String changePassword(
                        String email,
                        String oldPassword,
                        String newPassword) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                boolean passwordMatched = passwordEncoder.matches(
                                oldPassword,
                                user.getPassword());

                if (!passwordMatched) {

                        throw new RuntimeException(
                                        "Current password is incorrect");
                }

                user.setPassword(
                                passwordEncoder.encode(
                                                newPassword));

                user.setUpdatedAt(
                                LocalDateTime.now());

                userRepository.save(user);

                return "Password changed successfully";
        }
}