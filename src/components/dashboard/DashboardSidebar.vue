<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__logo-mark" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="2.5" width="12" height="12" rx="1.5" transform="rotate(45 11 2.5)" stroke="#F5A623"
            stroke-width="2" />
        </svg>
      </span>
      <span class="sidebar__logo-text">FlowAlert</span>
    </div>

    <nav class="sidebar__nav" aria-label="Principal">
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': activeNav === item.id }"
      >
        <span class="sidebar__link-icon" aria-hidden="true">
          <svg v-if="item.icon === 'home'" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor"
              stroke-width="1.6" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="item.icon === 'turmas'" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 11c1.66 0 3-1.12 3-2.5S17.66 6 16 6s-3 1.12-3 2.5S14.34 11 16 11ZM8 11c1.66 0 3-1.12 3-2.5S9.66 6 8 6 5 7.12 5 8.5 6.34 11 8 11Zm0 2c-2.33 0-7 1.17-7 3.5V19h7v-3.5M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 2.05 1.97 3.45V19h7v-3.5c0-2.33-4.67-3.5-7-3.5Z"
              fill="currentColor" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 17H9l-1 2h8l-1-2ZM5 9a7 7 0 0 1 14 0c0 5 2 6 2 6H3s2-1 2-6Z" stroke="currentColor"
              stroke-width="1.6" stroke-linejoin="round" />
          </svg>
        </span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="sidebar__footer">
      <RouterLink :to="{ name: 'logout' }" class="sidebar__logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Sair
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  activeNav: { type: String, default: 'home' },
})

const navItems = [
  { id: 'home', label: 'Home', icon: 'home', to: { name: 'dashboard' } },
  { id: 'turmas', label: 'Turmas', icon: 'turmas', to: { name: 'turmas' } },
  { id: 'avisos', label: 'Avisos', icon: 'avisos', to: { name: 'dashboard' } },
]
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-self: stretch;
  width: 16.5rem;
  height: 100%;
  max-height: 100dvh;
  padding: 1.35rem 0.85rem 1.25rem;
  background: #1a2338;
  color: rgba(255, 255, 255, 0.88);
  box-sizing: border-box;
  overflow: hidden;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0 0.5rem 1.75rem;
}

.sidebar__logo-mark {
  display: flex;
}

.sidebar__logo-text {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.sidebar__link:hover {
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.05);
}

.sidebar__link--active {
  color: #fff;
  background: rgba(0, 0, 0, 0.22);
  box-shadow: inset 3px 0 0 #f0a830;
}

.sidebar__link-icon {
  display: flex;
  opacity: 0.9;
}

.sidebar__footer {
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar__logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.sidebar__logout:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.16);
}
</style>
