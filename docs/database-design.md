# Database Design

## Core Tables
- users
- profiles
- pets
- pet_care_profiles
- pet_medical_profiles
- vaccinations
- medications
- surgeries
- vet_visits
- documents
- pet_access_permissions
- share_links
- qr_codes
- reminders
- reminder_deliveries
- partner_organizations
- partner_members
- audit_logs
- notifications

## Core Relationships
- One user has one profile
- One owner can have many pets
- One pet has one care profile
- One pet has one medical profile
- One pet can have many vaccinations
- One pet can have many medications
- One pet can have many surgeries
- One pet can have many vet visits
- One pet can have many documents
- One pet can have many reminders
- One pet can have many share links
- One pet can have many access permissions
