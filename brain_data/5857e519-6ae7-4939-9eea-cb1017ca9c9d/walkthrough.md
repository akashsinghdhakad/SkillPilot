# Web API Premium Template Upgrades

Your .NET Core Clean Web API template has been successfully upgraded to modern production standards. Below is a breakdown of the premium features that have been integrated.

## 1. Initial State Versioning
Before modifying the code, the original template baseline was correctly tagged as a release.
- Created git tag `v1.0.0-base`.
- Pushed the tag to the remote repository `origin`.

## 2. Platform Reliability and DevOps

### Application Observability (Serilog)
We replaced the default ASP.NET Core logging with **Serilog**.
- **Configuration Flow Configuration**: Extracted entirely into `appsettings.json` under `"Serilog"`.
- Uses both Console and asynchronous rolling File sinks (`logs/log-.txt`).
- Captures critical context information efficiently (MachineName, ThreadId, Request logging parameters).

### Health Checks
Integrated liveness and readiness diagnostic endpoints `/health/live` and `/health/ready`.
- **Liveness**: Instantly informs Kubernetes or load balancers if the app process is alive.
- **Readiness Check**: Performs a robust test against the SQL Server instance `connectionString` using `AspNetCore.HealthChecks.SqlServer`. If the DB goes down, the orchestrator will be notified seamlessly.

## 3. High Performance Global Error Handling
The old custom `ExceptionHandlingMiddleware.cs` has been decommissioned. In its place, we utilized .NET 8's advanced `IExceptionHandler`:
- Better pipeline integration.
- Outputs standardized [RFC 7807 Problem Details](https://datatracker.ietf.org/doc/html/rfc7807) to ensure standard client consumption practices.

## 4. API Resilience and Scalability

### API Versioning Setup
Integrated `Asp.Versioning.Mvc` to guarantee backwards compatibility.
- Route signatures now conform to `/api/v{version:apiVersion}/[controller]` (`/api/v1/auth`, `/api/v1/todos`).
- Header (`x-api-version`) mapping has also been allowed as an alternative.

### Security Enhancements
- **Rate Limiting Middleware**: Prevented brute force/DOS attacks with `FixedWindowRateLimiterOptions`. The partition key uses the remote IP Address limiting requests to `100 per minute`. Client rejection response maps to HTTP `429 Too Many Requests`.
- **CORS Strategy**: A strict `PremiumPolicy` has been introduced restricting incoming connection allowances to recognized frontend origin strings instead of blanket wildcard origins.

## 5. Input Defense (FluentValidation)
Integrated `FluentValidation.AspNetCore` which performs input request validation silently and efficiently before the Controller actions run.
- Automatically handles any malformed POST/PUT objects returning clean `Bad Request` JSON payloads.
- Added a `LoginRequestValidator` enforcing minimum username and password character sequences dynamically.

## Validation Results
- Code syntax passes all `.editorconfig` checks automatically.
- Build compiles (`dotnet build`) in ~3.9 seconds cleanly.
- Controllers mapped cleanly without shadowing logic defects.
