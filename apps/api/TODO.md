# TODO
- [x] Implement endpoints.
- [x] Implement profile.
- [x] Implement submissions.

## Important
- [x] Think about teams and it's permissions.
- [x] think about pricing permissions too.

- [ ] Create a good role/permissions system.
- [ ] Implement permissions

- [ ] Create DB indexes for members, linkedEmails, users, authTokens...

## General
- [ ] Add cors in order to block sensitive profile and auth requests.

- [ ] Implement API Keys.
 
- [ ] Add tiny Identifier for submissions and endpoints.
- [ ] Update returned models and rename the utils folder to models.

- [ ] Use env vars instead of urls in order to self host in a future.

## Auth Service
- [ ] Check if type 'account' | 'password' is necessary
- [ ] Treat carefully send verification request and rate limits

## Waitlist Post
- [x] Implement email sending on waitlist join.

## Submission Post
- [~] Accepts FormData and Json and transform all to json
- [ ] Send emails to the owner on submit.
- [~] Redirect to the default url.
- [ ] Store files in a S3 bucket.
