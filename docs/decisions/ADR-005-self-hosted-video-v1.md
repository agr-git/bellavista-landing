# ADR-005 — Self-Hosted Video on Lightsail (v1)

**Date:** 2026-04-21
**Status:** Accepted
**Deciders:** Alejo Gil

---

## Context

The site is video-heavy: a full-bleed hero drone clip and one video per plot chapter (3–5 videos total). Video hosting options evaluated:

**Option A — Video CDN (Cloudinary / Mux / Bunny.net)**
Upload videos to a managed service. Get adaptive bitrate streaming, CDN edge delivery, and automatic format optimization (WebM/AV1 fallback).

**Option B — Self-hosted on Lightsail via Nginx**
Store video files in `/srv/bellavista/media/`. Serve via Nginx with long `Cache-Control` headers and gzip/brotli for everything except the video files themselves.

**Option C — YouTube / Vimeo embeds**
Upload to YouTube/Vimeo and embed as iframes.

---

## Decision

**Self-host on Lightsail for v1. Revisit if bandwidth cost or buffering becomes a problem.**

---

## Reasons

1. **Zero additional cost in v1.** Lightsail includes 1TB/month outbound transfer. A 5-video site with ~20s loops at 1080p (≈15–30 MB/video) would need ~50,000 page loads to exhaust the transfer allowance. For a farm at pre-launch traffic, this is not a concern.

2. **No CDN account overhead.** Cloudinary, Mux, and Bunny.net all require account setup, billing configuration, API key management, and upload pipelines. Nginx serves files — zero configuration beyond the location block.

3. **No third-party player.** YouTube/Vimeo embeds introduce third-party scripts, cookies, and consent requirements (GDPR). The site targets a global audience including EU buyers; avoiding third-party embeds is cleaner.

4. **Videos are short loops, not on-demand streams.** The drone footage is ambient (20s loops, autoplay muted). Adaptive bitrate streaming is valuable for long-form VOD; it adds complexity without clear benefit for 20-second loops.

5. **Nginx can serve compressed static assets effectively.** Long `Cache-Control: max-age=31536000` headers mean repeat visitors load video from browser cache. First-load bandwidth is the only concern.

---

## Nginx configuration (B11)

```nginx
# /nginx/bellavista.conf
location /media/ {
  alias /srv/bellavista/media/;

  # Video files — no compression (already compressed)
  location ~* \.(mp4|webm|mov)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Accept-Ranges bytes;
  }

  # Other static assets — compress
  gzip_static on;
  brotli_static on;
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## Trigger criteria for upgrading to CDN

Upgrade to Cloudinary / Mux / Bunny.net if ANY of the following:
- Lightsail bandwidth regularly exceeds 800GB/month (80% of free tier)
- Users report buffering on first load (especially outside Colombia)
- Video assets grow beyond 500MB total (multiple 4K videos)
- Client requests adaptive streaming for a documentary-style long video

---

## Video encoding spec (for production assets)

When real drone footage is produced:
- **Format:** MP4 (H.264 baseline) + WebM (VP9) for browser compatibility
- **Hero loop:** ≤30MB, 20–30s, 1080p 24fps, no audio track
- **Chapter videos:** ≤100MB, 60–120s, 1080p
- **Serve:** `<video autoplay muted loop playsinline>` with `<source>` for each format
- **Fallback:** poster image (1080p JPEG) shown while video loads

---

## Consequences

- First-load performance depends on Lightsail bandwidth, not a CDN edge network
- Users geographically distant from the Lightsail region (Miami or São Paulo, TBD) may see slower video start
- If traffic spikes (press coverage, social virality), Lightsail bandwidth costs could rise unexpectedly
- Video upload workflow: `scp` or `rsync` to `/srv/bellavista/media/` — no pipeline needed
