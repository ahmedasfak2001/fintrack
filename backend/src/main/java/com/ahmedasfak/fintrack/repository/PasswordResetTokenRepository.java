package com.ahmedasfak.fintrack.repository;

import com.ahmedasfak.fintrack.entity.PasswordResetToken;
import com.ahmedasfak.fintrack.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);
}