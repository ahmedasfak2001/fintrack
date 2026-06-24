package com.ahmedasfak.fintrack.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ahmedasfak.fintrack.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ErrorResponse> handleRuntimeException(
                        RuntimeException ex) {

                ErrorResponse response = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(response);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleException(
                        Exception ex) {

                ErrorResponse response = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Something went wrong");

                return ResponseEntity
                                .status(
                                                HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(response);
        }

        @ExceptionHandler(AccountAlreadyVerifiedException.class)
        public ResponseEntity<ErrorResponse> handleAccountAlreadyVerified(
                        AccountAlreadyVerifiedException ex) {

                ErrorResponse error = new ErrorResponse();

                error.setMessage(
                                ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(error);
        }
}