# Game and account HTTP contracts

Use games.md and auth.md for the current same-origin HTTPS session-cookie API.
Private responses are no-store; mutations enforce Origin.
Administrator POST /api/admin/users creates a validated account (email,
displayName, password and MEMBER/ADMIN role), hashes its password and returns a
safe AccountDTO with status201. Creation is limited to10/minute/admin and rechecks
the current role. GET lists, PUT /:id updates and DELETE /:id deletes.
