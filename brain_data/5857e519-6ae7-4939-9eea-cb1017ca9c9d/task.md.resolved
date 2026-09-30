# JWT Refresh Token Upgrade Tasks

- [x] **Models & DTOs**
  - [x] Update `User.cs` with RefreshToken properties.
  - [x] Add `RefreshToken` to `LoginResponse.cs`.
  - [x] Create `RefreshTokenRequest.cs` DTO.
- [x] **Repository Layer**
  - [x] Add `UpdateAsync` to `IUserRepository.cs`.
  - [x] Implement in `UserRepositoryInMemory.cs`.
  - [x] Implement in `UserRepositoryEf.cs`.
  - [x] Implement in `UserRepositorySql.cs` (ADO.NET).
- [x] **Service & Auth Logic**
  - [x] Implement Token generation logic in `AuthService.cs`.
  - [x] Create `RefreshTokenAsync` in `AuthService.cs`.
  - [x] Integrate into `AuthController.cs`.
- [ ] **Database & Migrations**
  - [ ] Execute EF Core Migration `AddRefreshTokens`.
  - [ ] Update ADO.NET SQL commands inside `README.md`.
