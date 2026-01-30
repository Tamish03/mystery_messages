USER OPENS LOGIN PAGE (Frontend)
        ↓
User enters:
- Email / Username
- Password
        ↓
Frontend calls:
signIn("credentials", credentials)
        ↓
HTTP request sent to:
POST /api/auth/signin
        ↓
────────────────────────────────────────
ROUTING LAYER (route.ts)
────────────────────────────────────────
        ↓
Next.js matches /api/auth/* route
        ↓
route.ts executes:
NextAuth(authOptions)
        ↓
NextAuth engine is initialized
        ↓
────────────────────────────────────────
AUTH CONFIGURATION (options.ts)
────────────────────────────────────────
        ↓
NextAuth reads:
providers[]
        ↓
CredentialsProvider is selected
        ↓
NextAuth prepares credentials object
        ↓
authorize(credentials) is called
        ↓
────────────────────────────────────────
AUTHENTICATION LOGIC (authorize)
────────────────────────────────────────
        ↓
dbConnect() → connect to MongoDB
        ↓
Extract credentials:
- identifier (email or username)
- password
        ↓
Query database:
userModel.findOne({
  email OR username
})
        ↓
Is user found?
        ├─ NO → return null → AUTH FAILED ❌
        │         ↓
        │     NextAuth stops login
        │     Error returned to frontend
        │
        └─ YES
              ↓
        Is user.isVerified true?
        ├─ NO → return null → AUTH FAILED ❌
        │
        └─ YES
              ↓
        bcrypt.compare(
          enteredPassword,
          hashedPassword
        )
              ↓
        Is password valid?
        ├─ NO → return null → AUTH FAILED ❌
        │
        └─ YES
              ↓
        return user object ✅
        ↓
────────────────────────────────────────
HANDOVER TO NEXTAUTH ENGINE
────────────────────────────────────────
        ↓
NextAuth receives valid user
        ↓
NextAuth creates JWT payload
        ↓
────────────────────────────────────────
JWT CALLBACK (FIRST TIME LOGIN)
────────────────────────────────────────
        ↓
jwt({ token, user, account, profile })
        ↓
user EXISTS (first login only)
        ↓
Copy custom fields:
- token._id = user._id
- token.username = user.username
- token.isVerified = user.isVerified
- token.isAcceptingMessages = user.isAcceptingMessages
        ↓
Return token
        ↓
────────────────────────────────────────
JWT STORAGE & SECURITY
────────────────────────────────────────
        ↓
JWT is:
- signed with NEXTAUTH_SECRET
- encrypted
- given expiry time
        ↓
JWT stored in HttpOnly cookie 🍪
        ↓
Cookie sent to browser
        ↓
User is now AUTHENTICATED ✅
        ↓
────────────────────────────────────────
SESSION CALLBACK (CLIENT VISIBILITY)
────────────────────────────────────────
        ↓
session({ session, token })
        ↓
Copy safe fields from token:
- session.user._id = token._id
- session.user.username = token.username
- session.user.isVerified = token.isVerified
- session.user.isAcceptingMessages = token.isAcceptingMessages
        ↓
Return session
        ↓
Frontend receives session
        ↓
useSession() / getSession() works
        ↓
session.user is available in UI
        ↓
────────────────────────────────────────
TYPESCRIPT AWARENESS (next-auth.d.ts)
────────────────────────────────────────
        ↓
TypeScript reads module augmentation:
declare module "next-auth"
        ↓
User interface extended:
- _id
- username
- isVerified
- isAcceptingMessages
        ↓
Session interface updated:
session.user uses custom User
        ↓
declare module "next-auth/jwt"
        ↓
JWT interface extended:
- _id
- username
- isVerified
- isAcceptingMessages
        ↓
TypeScript now ALLOWS:
session.user.username
token._id
        ↓
(NO runtime effect – compile-time only)
        ↓
────────────────────────────────────────
SUBSEQUENT REQUESTS (USER STILL LOGGED IN)
────────────────────────────────────────
        ↓
User refreshes page / navigates app
        ↓
Frontend calls:
useSession() / getServerSession()
        ↓
NextAuth reads HttpOnly cookie
        ↓
JWT extracted from cookie
        ↓
────────────────────────────────────────
JWT CALLBACK (SUBSEQUENT CALLS)
────────────────────────────────────────
        ↓
jwt({ token })
        ↓
user DOES NOT exist now
        ↓
Token expiry is extended
        ↓
Token returned unchanged
        ↓
────────────────────────────────────────
SESSION CALLBACK (AGAIN)
────────────────────────────────────────
        ↓
session({ session, token })
        ↓
session rebuilt from token
        ↓
Frontend remains authenticated
        ↓
User continues using app without re-login
        ↓
────────────────────────────────────────
LOGOUT (OPTIONAL)
────────────────────────────────────────
        ↓
signOut() called
        ↓
NextAuth clears cookie
        ↓
JWT destroyed
        ↓
Session removed
        ↓
User logged out ❌





+------------------------------------------------------+
|                  FRONTEND (UI)                        |
+------------------------------------------------------+
            |
            |  User enters credentials
            |  (email / username + password)
            |
            v
+------------------------------------------------------+
| signIn("credentials", credentials)                   |
+------------------------------------------------------+
            |
            | HTTP POST
            v
+------------------------------------------------------+
|        /api/auth/signin (Next.js)                    |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|                route.ts                              |
|   NextAuth(authOptions)                              |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|          NextAuth Engine Initialized                 |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|          options.ts (Auth Rules)                     |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|         CredentialsProvider Selected                 |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|               authorize()                            |
+------------------------------------------------------+
            |
            |-- dbConnect()
            |-- Read credentials
            |-- Query MongoDB
            |
            v
+----------------------+        +----------------------+
|   User NOT Found     |        |     User Found       |
+----------------------+        +----------------------+
            |                           |
            | return null               |
            |                           v
            |               +-------------------------+
            |               |  Email Verified ?       |
            |               +-------------------------+
            |                           |
            |                 +---------+---------+
            |                 |                   |
            |              NO |                   | YES
            |                 |                   |
            |           return null                v
            |                           +-------------------------+
            |                           | bcrypt.compare()        |
            |                           +-------------------------+
            |                                       |
            |                             +---------+---------+
            |                             |                   |
            |                          NO |                   | YES
            |                             |                   |
            |                        return null        return user
            |                                               |
            v                                               v
+---------------------------------------------------------------+
|                 AUTHENTICATION SUCCESS                        |
+---------------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|            jwt() callback (FIRST LOGIN)              |
+------------------------------------------------------+
            |
            |-- token._id = user._id
            |-- token.username = user.username
            |-- token.isVerified = user.isVerified
            |
            v
+------------------------------------------------------+
|   JWT Signed + Encrypted (NEXTAUTH_SECRET)           |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|   JWT Stored in HttpOnly Cookie                      |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|            session() callback                        |
+------------------------------------------------------+
            |
            |-- session.user._id = token._id
            |-- session.user.username = token.username
            |-- session.user.isVerified = token.isVerified
            |
            v
+------------------------------------------------------+
|        SESSION SENT TO FRONTEND                      |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
| useSession() / getServerSession()                    |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|   USER IS AUTHENTICATED AND USING APP                |
+------------------------------------------------------+

==================== LATER REQUESTS ====================

            |
            v
+------------------------------------------------------+
| Frontend calls useSession() again                    |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
| JWT read from HttpOnly Cookie                        |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
|            jwt() callback (NO user)                  |
+------------------------------------------------------+
            |
            |-- Extend token expiry
            |
            v
+------------------------------------------------------+
|            session() callback                        |
+------------------------------------------------------+
            |
            |-- Rebuild session from token
            |
            v
+------------------------------------------------------+
|        USER REMAINS LOGGED IN                         |
+------------------------------------------------------+

==================== TYPESCRIPT LAYER ==================

+------------------------------------------------------+
|               next-auth.d.ts                         |
+------------------------------------------------------+
| declare module "next-auth"                           |
|  - Extend User                                       |
|  - Extend Session                                    |
|                                                      |
| declare module "next-auth/jwt"                       |
|  - Extend JWT                                        |
+------------------------------------------------------+

(TypeScript ONLY — no runtime execution)

==================== LOGOUT ============================

            |
            v
+------------------------------------------------------+
| signOut()                                            |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
| Cookie cleared, JWT destroyed                        |
+------------------------------------------------------+
            |
            v
+------------------------------------------------------+
| USER LOGGED OUT                                      |
+------------------------------------------------------+
