# FinTrack Database Schema

## Users

- id (UUID)
- name
- email
- password_hash
- created_at

## Categories

- id (UUID)
- user_id (UUID)
- name
- type

## Transactions

- id (UUID)
- user_id (UUID)
- category_id (UUID)
- amount
- transaction_date
- note