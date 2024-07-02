## Important
- [ ] Auto update teams available emails when the user links a new email.
- [~] Implement Open Api routes.
- [~] Implement permissions.

- [ ] Create DB indexes for members, linkedEmails, users, authTokens...

## General
- [ ] Add cors in order to block sensitive profile and auth requests.

- [ ] Implement API Keys.
 
- [~] Add tiny Identifier for submissions and endpoints.
- [~] Update returned models and rename the utils folder to models.

- [ ] Use env vars instead of urls in order to self-host in a future.

- [~] Improve API responses and errors (Zod validation also).

## Endpoints
- [ ] Implement folders, icons and colors.

## Auth Service
- [ ] Treat carefully send verification request and rate limits

## Submission Post
- [x] Accepts FormData and Json and transform all to json
- [ ] Send emails to the owner on submit.
- [x] Redirect to the default url.
- [ ] Store files in a S3 bucket.
