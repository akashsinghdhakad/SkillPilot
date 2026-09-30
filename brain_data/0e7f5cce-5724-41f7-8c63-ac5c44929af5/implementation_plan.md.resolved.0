# Fix Network Access Issues

The application isn't accessible on the network because `npm run dev` only listens on the local machine (`localhost`). To expose it to your network, we need to use the `server` script we created and update the Next.js security configuration.

## User Review Required

> [!IMPORTANT]
> Next.js 15 and 16 require explicit permission for network origins to enable features like Hot Module Replacement (HMR). I will add your local IP to the configuration.

## Proposed Changes

### [Component Name]

#### [MODIFY] [next.config.ts](file:///d:/TodoPro/next.config.ts)
- Add `experimental.allowedDevOrigins` to allow access from `172.16.11.21`.

## Open Questions

- Is `172.16.11.21` definitely the IP you are using on other devices? (Based on earlier `ipconfig` output).

## Verification Plan

### Automated Tests
- Run `npm run server` and check for any origin-related warnings in the logs.

### Manual Verification
- Confirm you can access `http://172.16.11.21:3000` from another device on the same Wi-Fi.
