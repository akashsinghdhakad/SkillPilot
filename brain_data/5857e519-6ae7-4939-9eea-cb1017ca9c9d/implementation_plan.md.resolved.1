# JWT Refresh Token Authentication Upgrade 🔐

To enhance the security and user experience of our premium template, we are integrating an industry-standard **JWT Refresh Token** persistence architecture. This allows users to stay securely logged in indefinitely without needing to constantly re-type their password, while the primary access tokens remain locked on short expiration timers (e.g. 15 minutes) for high security logic.

## Proposed Changes

---

### Models/Entities Layer
We need to augment the database schema to mathematically track the lifespan of refresh credentials per user.
#### [MODIFY] [User.cs](file:///d:/learning/dotnet/DotNetCoreWebAPI/dotnetWebApiCoreCBA/Models/Entities/User.cs)
- Add `public string? RefreshToken { get; set; }`
- Add `public DateTime? RefreshTokenExpiryTime { get; set; }`

### Data Transfer Objects (DTOs) Layer
Modifying the external data contracts mapping HTTP payloads.
#### [MODIFY] [LoginResponse.cs](file:///d:/learning/dotnet/DotNetCoreWebAPI/dotnetWebApiCoreCBA/Models/DTOs/Auth/LoginResponse.cs)
- Append `public string RefreshToken { get; set; } = string.Empty;`
#### [NEW] `RefreshTokenRequest.cs` (inside `Models/DTOs/Auth`)
- Structure accepting `{ string Token, string RefreshToken }`.

### Services Architecture Layer
Creating the cryptographic mechanisms.
#### [MODIFY] [IAuthService.cs](file:///d:/learning/dotnet/DotNetCoreWebAPI/dotnetWebApiCoreCBA/Services/Interfaces/IAuthService.cs) & [AuthService.cs](file:///d:/learning/dotnet/DotNetCoreWebAPI/dotnetWebApiCoreCBA/Services/Implementations/AuthService.cs)
- Introduce a secure random token generator utilizing `System.Security.Cryptography.RandomNumberGenerator`.
- Tie token generation recursively into `LoginAsync`.
- Structure new logic mapping `Task<LoginResponse?> RefreshTokenAsync(RefreshTokenRequest request)`.

### Controllers Layer
Exposing the HTTP Route for public access intercepting DTOs.
#### [MODIFY] [AuthController.cs](file:///d:/learning/dotnet/DotNetCoreWebAPI/dotnetWebApiCoreCBA/Controllers/AuthController.cs)
- Map `[HttpPost("refresh")]` accepting `RefreshTokenRequest`.

### Repositories Layer (The Tri-Data Challenge)
Because this template features three loosely-coupled repository implementations, all of them must be surgically managed:
#### [MODIFY] [IUserRepository.cs](file:///d:/learning/dotnet/DotNetCoreWebAPI/dotnetWebApiCoreCBA/Repositories/Interfaces/IUserRepository.cs)
- Add `Task UpdateAsync(User user);` strictly so the tokens can be safely committed over an existing row without exposing implicit DB saving calls.

#### [MODIFY] EF Core Model
- Modify `UserRepositoryEf.cs` logic.
- Execute EF command `dotnet ef migrations add AddRefreshTokens` against `AppDbContext.cs`.

#### [MODIFY] ADO.NET SQL Model
- Open `UserRepositorySql.cs` and intercept mapped ADO.NET queries modifying raw string literals to write the `RefreshToken` variable states explicitly back to `UPDATE Users SET ...`.
- Provide the updated `CREATE TABLE` and `ALTER TABLE` snippets in the core README.

#### [MODIFY] In-Memory Model
- Implement `UpdateAsync` using simple `.FirstOrDefault` index replacement.

## User Review Required

> [!WARNING]
> Because you utilize Raw ADO.NET commands in this codebase directly alongside automatic EF Core tools, changing the Database schema introduces dual management. I will auto-generate the EF migration, but I will explicitly have to write flat ADO string parameter updates! 

> [!TIP]
> The current JWT lifetime is exactly 60 minutes. Moving forward, it's best practice to reduce the primary JWT access token life to **15 minutes** and assign the Refresh Token a lifespan of **7 days**. I will automatically integrate this config shift into `appsettings.json` during the update.

## Open Questions

1. **Token Invalidation strategy**: Do you want logic to allow users to "Revoke" all active refresh tokens (Log out from all devices)? If so, I will add an explicit `/api/v1/auth/revoke` endpoint.
2. **EF Core Database Updates**: Depending on how your physical Database is operating (whether you have actually deployed a DB or just run the template In-Memory), applying the `SQL Migration` command might fail if the configured connection string doesn't point to a real database. We can rely exclusively on In-Memory testing or modify connection contexts together. Are you actively bound to a LocalDb SQL instance currently?
