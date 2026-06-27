package com.ahmedasfak.fintrack.controller;

import com.ahmedasfak.fintrack.dto.AuthResponse;
import com.ahmedasfak.fintrack.dto.ChangePasswordRequest;
import com.ahmedasfak.fintrack.dto.LoginRequest;
import com.ahmedasfak.fintrack.dto.RegisterRequest;
import com.ahmedasfak.fintrack.dto.ResendVerificationRequest;
import com.ahmedasfak.fintrack.service.UserService;
import com.ahmedasfak.fintrack.dto.ForgotPasswordRequest;
import com.ahmedasfak.fintrack.dto.ResetPasswordRequest;
import com.ahmedasfak.fintrack.dto.UpdateProfileRequest;
import com.ahmedasfak.fintrack.dto.UserProfileResponse;
import com.ahmedasfak.fintrack.dto.ChangePasswordRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        @PostMapping("/register")
        public String register(@RequestBody RegisterRequest request) {
                System.out.println("REGISTER API HIT");
                return userService.register(request);
        }

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(
                        @RequestBody LoginRequest request) {

                return ResponseEntity.ok(
                                userService.login(request));
        }

        // verify user endpoint
        @GetMapping("/verify")
        public ResponseEntity<String> verify(
                        @RequestParam String token) {

                String message = userService.verifyAccount(token);

                return ResponseEntity.ok(message);
        }

        // re-verification endpoint
        @PostMapping("/resend-verification")
        public ResponseEntity<String> resendVerification(
                        @RequestBody ResendVerificationRequest request) {
                return ResponseEntity.ok(
                                userService.resendVerificationEmail(
                                                request.getEmail()));
        }

        // forgot password endpoint
        @PostMapping("/forgot-password")
        public ResponseEntity<String> forgotPassword(
                        @RequestBody ForgotPasswordRequest request) {

                return ResponseEntity.ok(
                                userService.forgotPassword(
                                                request.getEmail()));
        }

        // reset password endpoint
        @PostMapping("/reset-password")
        public ResponseEntity<String> resetPassword(
                        @RequestBody ResetPasswordRequest request) {

                return ResponseEntity.ok(
                                userService.resetPassword(
                                                request.getToken(),
                                                request.getNewPassword()));
        }

        @GetMapping("/reset-password")
        public ResponseEntity<Void> resetPasswordPage(
                        @RequestParam String token) {

                String deepLink = "fintrack://reset-password?token="
                                + token;

                System.out.println("Redirecting to: " + deepLink);

                return ResponseEntity
                                .status(302)
                                .header("Location", deepLink)
                                .build();
        }

        @GetMapping("/profile")
        public UserProfileResponse getProfile(
                        Authentication authentication) {

                String email = authentication.getName();

                return userService.getProfile(email);
        }

        @PutMapping("/profile")
        public ResponseEntity<String> updateProfile(
                        Authentication authentication,
                        @RequestBody UpdateProfileRequest request) {

                String email = authentication.getName();

                return ResponseEntity.ok(
                                userService.updateProfile(
                                                email,
                                                request.getName()));
        }

        @PutMapping("/change-password")
        public ResponseEntity<String> changePassword(
                        Authentication authentication,
                        @RequestBody ChangePasswordRequest request) {

                String email = authentication.getName();

                return ResponseEntity.ok(
                                userService.changePassword(
                                                email,
                                                request.getOldPassword(),
                                                request.getNewPassword()));
        }

}