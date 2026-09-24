<template>
    <aside class="hero" aria-hidden="false">
        <div class="hero__bg" aria-hidden="true">
            <span class="hero__orb hero__orb--1" />
            <span class="hero__orb hero__orb--2" />
            <span class="hero__orb hero__orb--3" />
        </div>

        <header class="hero__brand">
            <span class="hero__logo-mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="11" y="2.5" width="12" height="12" rx="1.5" transform="rotate(45 11 2.5)" stroke="#F5A623"
                        stroke-width="2" />
                </svg>
            </span>
            <span class="hero__logo-text">FlowAlert</span>
        </header>

        <div class="hero__content">
            <div class="hero__visual" aria-hidden="true">
                <div class="hero__bulb">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z"
                            stroke="#F5A623" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>

                <div class="hero__cards">
                    <div class="hero__card hero__card--back" />
                    <div class="hero__card hero__card--front">
                        <span class="hero__card-line" />
                        <span class="hero__card-line hero__card-line--short" />
                    </div>
                </div>

                <svg class="hero__spark" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L11 9H18L10 22L12 14H6L13 2Z" fill="#F5A623" opacity="0.95" />
                </svg>
            </div>

            <h1 class="hero__title">
                Avise seus alunos na hora certa, sem grupo de WhatsApp.
            </h1>
            <p class="hero__subtitle">
                Aula cancelada, mudança de sala, avisos gerais - tudo enviado automaticamente para a turma certa.
            </p>
        </div>
    </aside>
</template>

<style scoped>
.hero {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 2.5rem 3rem 3.5rem;
    background: #16213e;
    color: #fff;
    overflow: hidden;
}

.hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.hero__orb {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.hero__orb--1 {
    width: 420px;
    height: 420px;
    top: -120px;
    right: -80px;
}

.hero__orb--2 {
    width: 280px;
    height: 280px;
    bottom: 10%;
    left: -100px;
}

.hero__orb--3 {
    width: 160px;
    height: 160px;
    top: 42%;
    right: 18%;
    background: rgba(255, 255, 255, 0.03);
}

.hero__brand {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.hero__logo-mark {
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero__logo-text {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: 0.01em;
}

.hero__content {
    position: relative;
    z-index: 1;
    margin-top: auto;
    max-width: 26rem;
    padding-bottom: 0.5rem;
}

.hero__visual {
    position: relative;
    min-height: 7.5rem;
    margin-bottom: 1.75rem;
}

.hero__bulb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 1.25rem;
}

.hero__cards {
    position: absolute;
    top: 0;
    left: 4.5rem;
    width: 11rem;
    height: 5.5rem;
}

.hero__card {
    position: absolute;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(4px);
}

.hero__card--back {
    width: 9.5rem;
    height: 4.5rem;
    top: 0.35rem;
    left: 1.25rem;
    opacity: 0.55;
}

.hero__card--front {
    position: relative;
    width: 9.5rem;
    height: 4.5rem;
    top: 1.1rem;
    left: 0;
    padding: 0.85rem 1rem;
    box-sizing: border-box;
}

.hero__card-line {
    display: block;
    height: 3px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.2);
    margin-bottom: 0.45rem;
    width: 70%;
}

.hero__card-line--short {
    width: 45%;
}

.hero__card--front::after {
    content: '';
    position: absolute;
    right: 0.85rem;
    top: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
    border: 2px solid #f5a623;
    border-radius: 50%;
    border-top-color: transparent;
    border-right-color: transparent;
    transform: rotate(-30deg);
}

.hero__spark {
    position: absolute;
    left: 0.15rem;
    bottom: 0.25rem;
    filter: drop-shadow(0 0 8px rgba(245, 166, 35, 0.45));
}

.hero__title {
    margin: 0 0 1rem;
    font-family: var(--font-serif);
    font-size: clamp(1.65rem, 2.2vw, 2rem);
    font-weight: 600;
    line-height: 1.28;
    letter-spacing: -0.02em;
    color: #fff;
}

.hero__subtitle {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.62);
    max-width: 22rem;
}

@media (max-width: 900px) {
    .hero {
        min-height: 42vh;
        padding: 2rem 1.5rem 2.5rem;
    }

    .hero__content {
        max-width: none;
    }

    .hero__subtitle {
        max-width: none;
    }
}
</style>
