<template>
  <div style="max-width: 500px; margin: 4rem auto; text-align: center;">
    <div class="card" style="padding: 3rem 2rem;">
      <div style="font-size: 4rem; line-height: 1; margin-bottom: 1rem;">🔍</div>
      <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
        404
      </h1>
      <h2 style="font-size: 1.25rem; font-weight: 600; color: #475569; margin-bottom: 1rem;">
        Page Not Found
      </h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem;">
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <router-link to="/dashboard" class="btn btn-primary" style="padding: 0.65rem 1.5rem;">
        Return to Dashboard
      </router-link>
    </div>
  </div>
</template>
