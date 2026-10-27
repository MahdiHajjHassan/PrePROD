# One-computer defense rehearsal

Use demonstration data. Prepare the local trusted CA and private credentials,
then start with docker compose up --build -d --force-recreate. Show each item
through the interface and its direct backend check. Do not share passwords/keys.

1. Open a guest window: public tasks, text/status/priority/owner filters, all
   sorts, page two, legal pages, theme persistence and en/fr/ar RTL.
2. Disable JavaScript in a clean browser context: actual task text, metadata
   and normal filter/pagination links remain available.
3. Register/sign in as member A; create/edit/complete/delete a task. Show public
   disclosure and invalid-title handling. Change display name and password;
   old sessions lose access and login is required again.
4. Open member B in a separate browser profile/context on the same computer.
   Both create tasks and refresh to see both. B has no controls for A's tasks;
   a direct forbidden request also fails. Two stale edits cannot overwrite.
5. Sign in as administrator: search users, change a display name, promote then
   demote B. B's already-open session immediately loses admin authorization.
   Show the last-admin conflict. Delete a demonstration account only after
   confirming its sessions/tasks will be removed.
6. Run ./docs/api/examples.sh with the private environment/local CA. Explain
   all five operations, member-scoped key, ownership/version checks, shared
   60/minute quota and separate invalid-attempt quota. Open OpenAPI documentation.
7. Import JSON and CSV, including Unicode/quotes/newlines. Reject a mixed invalid
   batch with no partial writes. Export a combined filter with more than 25
   matches and show every matching row is exported. Explain CSV formula safety.
8. Create/update/delete tasks through normal UI, API and imports. Show unread
   notifications, mark-one/all and that another user's notification is private.
   Delete a sample task and show personal activity still counts the action.
   Explain seven UTC days, previous-period deltas and the chart's data table.
9. Show actual Chrome/Firefox/Edge product versions and executed suite results,
   both themes, Arabic/mobile layout, keyboard focus/dialog behavior and a clean
   console. Imported-CA manual checks use no certificate bypass.
10. Recreate the app container and prove existing account/task identifiers persist.
    Show migrations/schema, ignored credentials and reference PDF integrity.
11. Run npm run verify and npm run rehearse. Inspect exact source revision and
    results. Only the explicitly isolated test project may reset its test data.
12. Mahdi and Joseph each explain one feature request path, a meaningful test,
    an invalid/unauthorized case, a design tradeoff and how both sides connect.
    Record only real walkthroughs/reviews/commits; preserve source provenance.

The source agent can automate installation and feature checks. It cannot record
a human defense, a Joseph-authenticated contribution or a manual trusted-browser
interaction as having happened. Those fields stay explicit in individual records.
