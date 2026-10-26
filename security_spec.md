# PHHIPROS Security Specification

## Data Invariants
- The site content document must always have `hero`, `sections`, and `footer`.
- Only authenticated users can modify the site content (in a real app, this would be limited to admins, but here we allow any authenticated user for the 'clone and edit' experience).
- All timestamps must be server-generated.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: Attempting to set `/site/content` without a login. (Denied)
2. **Missing Hero**: Payload missing the `hero` field. (Denied)
3. **Giant Title**: Title exceeding 200 characters. (Denied)
4. **Invalid Type**: `sections` provided as a string instead of array. (Denied)
5. **Malicious Update**: Attempting to remove the `footer`. (Denied)
6. **Future Timestamp**: Sending a `updatedAt` from the future (client-side). (Denied)
7. **Identity Spoofing**: Setting `updatedBy` to a different UID. (Denied)
8. **Shadow Field**: Adding `isAdmin: true` to the config doc. (Denied)
9. **Invalid ID**: Attempting to write to `/site/malicious_path`. (Denied)
10. **Resource Poisoning**: Sending a 1MB string for a link label. (Denied)
11. **Outcome Bypass**: Modifying an immutable field if any existed. (N/A)
12. **PII Leak**: Attempting to read a non-existent private collection. (Denied)

## Test Runner (Draft)
A `firestore.rules.test.ts` would verify these, but since I don't have a test runner environment for rules here, I will proceed to generate hardened rules manually following the 8 pillars.
