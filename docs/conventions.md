Conventions etc.

* User id redundancy: User id should be in url's when appropriate, even if it is possible to get it from a header. Example: /v1/users/{user-id}/photos
* We use guids for id's (when appropriate)
* In general we use camelCase
* For enum like strings we use UPPERCASE
* We use jsonapi standard. We can deviate from jsonapi if we have good reasons to. For instance we use camelCase instead of kebab-case (which is used in examples at jsonapi.org).
* In the databases we use same casing for names as in the api. Table names should be in singular.
* Perhaps we should use websockets
