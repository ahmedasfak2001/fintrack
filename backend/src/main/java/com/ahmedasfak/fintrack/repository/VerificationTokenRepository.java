package com.ahmedasfak.fintrack.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ahmedasfak.fintrack.entity.User;
import com.ahmedasfak.fintrack.entity.VerificationToken;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser(User user);
}
