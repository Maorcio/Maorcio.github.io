"use client";
import '../../styles/portfolio-web.css';
import { useEffect } from "react";
import Head from "next/head";

export default function PortfolioInspireIlanPage() {
    useEffect(() => {
        // Curseur personnalisé avec mouvement fluide
        const cursor = document.querySelector('.custom-cursor') as HTMLElement | null;
        const interactiveElements = document.querySelectorAll('a, button, .bento-card, .skill-item, .contact-item, .tag');
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        function animateCursor() {
            const speed = 0.15;
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            if (cursor) {
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
            }
            requestAnimationFrame(animateCursor);
        }
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        animateCursor();
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
        });
        // Intersection Observer avec seuils adaptés
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };
        const observer = new window.IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('bento-grid')) {
                        entry.target.querySelectorAll('.bento-card').forEach(card => {
                            card.classList.add('visible');
                        });
                    }
                    if (entry.target.classList.contains('skills-grid')) {
                        entry.target.querySelectorAll('.skill-item').forEach(skill => {
                            skill.classList.add('visible');
                        });
                    }
                    if (entry.target.classList.contains('timeline')) {
                        entry.target.querySelectorAll('.timeline-item').forEach(item => {
                            item.classList.add('visible');
                        });
                    }
                }
            });
        }, observerOptions);
        document.querySelectorAll('section, .bento-grid, .skills-grid, .timeline').forEach(el => {
            observer.observe(el);
        });
        // Particules Sakura avec vitesses variées
        const sakuraContainer = document.getElementById('sakuraContainer');
        const sakuraCount = 12;
        if (sakuraContainer) {
            for (let i = 0; i < sakuraCount; i++) {
                const sakura = document.createElement('div');
                sakura.classList.add('sakura');
                sakura.style.left = Math.random() * 100 + '%';
                sakura.style.animationDuration = (Math.random() * 15 + 25) + 's';
                sakura.style.animationDelay = Math.random() * 8 + 's';
                sakuraContainer.appendChild(sakura);
            }
        }
        // Smooth scroll
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (this: HTMLAnchorElement, e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href) {
                    const target = document.querySelector(href) as HTMLElement | null;
                    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        // Nettoyage possible ici si besoin
    }, []);

    return (
        <>
            <Head>
                <title>Maxim — Portfolio</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600;900&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
            </Head>
            <div className="custom-cursor"></div>
            <div className="sakura-container" id="sakuraContainer"></div>
            <header>
                <div className="grid-bg"></div>
                <div className="hero-content">
                    <span className="jp-accent">ポートフォリオ · Portfolio</span>
                    <h1>
                        <span>M</span><span>a</span><span>x</span><span>i</span><span>m</span>
                    </h1>
                    <p className="subtitle">Étudiant en 2ème année de BUT Informatique parcours IAMSI à l'IUT de Montpellier, passionné par le développement full-stack, l'architecture logicielle et le luxe.</p>
                </div>
            </header>
            <nav>
                <a href="#about">À propos</a>
                <a href="#skills">Compétences</a>
                <a href="#projects">Projets</a>
                <a href="#parcours">Parcours</a>
                <a href="#passions">Passions</a>
                <a href="#contact">Contact</a>
            </nav>
            <main>
                {/* À propos */}
                <section id="about">
                    <div className="section-header">
                        <span className="section-number">01 — PRÉSENTATION</span>
                        <h2>À propos</h2>
                        <p className="section-desc">Étudiant en 2ème année de BUT Informatique parcours Intégration des Applications et Management des Systèmes d'Information (IAMSI) à l'IUT de Montpellier, je me spécialise dans le développement full-stack avec Next.js, React, Node.js et AdonisJS. Mon approche du développement s'articule autour de l'architecture logicielle propre, des principes SOLID et de l'optimisation des performances.<br /><br />Ma philosophie : rechercher le détail qui fait la différence. Dans le luxe, j'admire la provenance et l'histoire de chaque composant, le savoir-faire artisanal qui distingue une pièce d'exception. Cette même exigence guide mon code : chaque ligne doit avoir un sens, chaque architecture une raison d'être.<br /><br />Au-delà du code, je suis pratiquant de Taekwondo (1er dan) et Hapkimudo depuis 10 ans, avec un engagement dans l'ouverture d'une section combat pour accompagner des jeunes compétiteurs. La musique fait également partie de mon quotidien : guitare et piano en autodidacte depuis 5 ans, exploration de la création sonore et des harmonies. Je cultive un intérêt pour le mobilier, l'architecture, la logistique et la cuisine, domaines où excellence et précision se rencontrent.</p>
                    </div>
                    <div className="bento-card" style={{ maxWidth: 800, margin: '0 auto' }}>
                        <p><strong>Vision :</strong> Après mon BUT, je vise une alternance de 2 ans dans le secteur du luxe, débutant en avril 2026 (stage de 2 mois puis alternance). Mon objectif : développer des solutions IT innovantes pour des maisons d'exception comme Hermès, Zegna, Berluti ou Jaeger-LeCoultre, en combinant expertise technique et compréhension profonde de l'artisanat de luxe.</p>
                    </div>
                </section>
                {/* Compétences */}
                <section id="skills">
                    <div className="section-header">
                        <span className="section-number">02 — COMPÉTENCES</span>
                        <h2>Compétences</h2>
                    </div>
                    <div className="bento-card" style={{ maxWidth: 900, margin: '0 auto', marginBottom: '2rem' }}>
                        <h3>Stack principale</h3>
                        <ul>
                            <li><strong>Frontend :</strong> Next.js (Pages Router), React, TypeScript, Tailwind CSS</li>
                            <li><strong>Backend :</strong> AdonisJS 6 (Lucid ORM), Node.js, API REST</li>
                            <li><strong>Langages :</strong> TypeScript, JavaScript, Java, Rust, Python</li>
                            <li><strong>Bases de données :</strong> PostgreSQL, JSON (migration prévue)</li>
                            <li><strong>Outils :</strong> Docker, Git, Visual Studio Code</li>
                        </ul>
                        <h3 style={{marginTop:'1.5rem'}}>Langages favoris</h3>
                        <ul>
                            <li><strong>Java :</strong> Développement académique, POO avancée</li>
                            <li><strong>Rust :</strong> Projets personnels, exploration de la performance et sécurité mémoire</li>
                            <li><strong>Python :</strong> Finance algorithmique (TA-Lib), analyse de données</li>
                        </ul>
                        <h3 style={{marginTop:'1.5rem'}}>Soft skills</h3>
                        <ul>
                            <li>Architecture logicielle et principes SOLID</li>
                            <li>Développement sous pression (hackathons)</li>
                            <li>Travail d'équipe et coordination technique</li>
                            <li>Gestion du stress (arts martiaux)</li>
                            <li>Apprentissage autodidacte (musique, technologies)</li>
                        </ul>
                    </div>
                </section>
                {/* Projets */}
                <section id="projects">
                    <div className="section-header">
                        <span className="section-number">03 — PROJETS</span>
                        <h2>Projets</h2>
                    </div>
                    <div className="bento-grid">
                        <div className="bento-card">
                            <h3>Nuit de l'Info 2025 - Alternatives Open Source</h3>
                            <p><strong>Contexte :</strong> Hackathon national (4-5 décembre 2025), 6 000+ participants, 900 équipes. En équipe de 6, développement d'une plateforme d'alternatives open source pour l'enseignement supérieur.</p>
                            <p><strong>Stack :</strong> Node.js, HTML/CSS, JavaScript</p>
                            <ul>
                                <li>Architecture backend Node.js : routes, logique métier, endpoints API REST</li>
                                <li>Intégration frontend-backend et gestion des requêtes asynchrones</li>
                                <li>Coordination technique de l'équipe sur la répartition des tâches</li>
                            </ul>
                            <p><strong>Méthodes :</strong> Sprints courts 2-3h, communication continue, priorisation des fonctionnalités sous contrainte temporelle (16h non-stop)</p>
                            <p><strong>Compétences développées :</strong> Architecture REST, débogage rapide, gestion du stress, travail collaboratif intensif</p>
                            <p><strong>Résultat :</strong> Application fonctionnelle livrée dans les délais</p>
                        </div>
                        <div className="bento-card">
                            <h3>Nuit de l'Info 2024 - Thématique Maritime</h3>
                            <p><strong>Contexte :</strong> Hackathon national 2024, développement d'une application web sur la thématique des océans.</p>
                            <p><strong>Stack :</strong> HTML/CSS, JavaScript</p>
                            <p><strong>Compétences développées :</strong> Développement frontend, intégration, travail d'équipe sous pression</p>
                        </div>
                        <div className="bento-card">
                            <h3>Code Game Jam 2025 - "Legendary Beats"</h3>
                            <p><strong>Thème :</strong> Mélodie à l'infini</p>
                            <p><strong>Concept :</strong> Jeu 2D Unity où le joueur tire des notes de musique pour affronter des boss légendaires (grands musiciens décédés) et débloquer leurs instruments iconiques.</p>
                            <p><strong>Stack :</strong> Unity 2D, C#</p>
                            <p><strong>Mon rôle :</strong> Proposition du concept original, programmation C# orientée objet, game design</p>
                            <p><strong>Défis :</strong> Projet ambitieux pour 48h, gestion du scope, prototypage rapide</p>
                            <p><strong>Compétences développées :</strong> Unity 2D, C#, créativité sous contrainte, collaboration intensive</p>
                        </div>
                        <div className="bento-card">
                            <h3>Application de Gestion de Recettes</h3>
                            <p><strong>Contexte :</strong> Projet personnel pour organiser mes 40+ recettes de cuisine.</p>
                            <p><strong>Stack :</strong> Next.js (Pages Router), React, TypeScript, Tailwind CSS, stockage JSON (migration BDD prévue)</p>
                            <ul>
                                <li>Timers multiples pour suivi de cuisson simultanée</li>
                                <li>Gestion mains libres par dictée vocale</li>
                                <li>Sélection de recettes pour génération automatique de liste de courses</li>
                                <li>Conversion des ingrédients par unité de mesure</li>
                                <li>Calcul automatique des quantités selon le nombre de personnes</li>
                            </ul>
                            <p><strong>Vision :</strong> Release open source prévue en 2026</p>
                            <p><strong>Compétences développées :</strong> Architecture Next.js, gestion d'état React, design responsive, UX intuitive</p>
                        </div>
                        <div className="bento-card">
                            <h3>SaaS de Recherche et Indexation</h3>
                            <p><strong>Contexte :</strong> Projet personnel business inspiré d'Algolia, développement en cours pendant mon temps libre.</p>
                            <p><strong>Stack :</strong> Frontend : Next.js (Pages Router), React, TypeScript, Tailwind CSS<br />Backend : AdonisJS 6 (Lucid ORM, validateurs, middleware)</p>
                            <p><strong>Architecture :</strong> API REST, principes SOLID, séparation des responsabilités, architecture en couches</p>
                            <p><strong>Compétences développées :</strong> AdonisJS 6 avancé, architecture système complexe, design d'API publique</p>
                        </div>
                        <div className="bento-card">
                            <h3>Projets scolaires</h3>
                            <ul>
                                <li>2024 - SAE 1.01 : Le 421</li>
                                <li>2024 - SAE 1.05 : L'escape Game</li>
                                <li>2025 - SAE 2.01 : Pokemon !</li>
                                <li>2025 - SAE 2.05 : JOCS</li>
                                <li>2025 - SAE 3.01 : CTF</li>
                            </ul>
                        </div>
                    </div>
                </section>
                {/* Parcours */}
                <section id="parcours">
                    <div className="section-header">
                        <span className="section-number">04 — PARCOURS</span>
                        <h2>Parcours</h2>
                    </div>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-year">2024—2027</div>
                            <div className="timeline-title">BUT Informatique - IAMSI</div>
                            <div className="timeline-desc">IUT de Montpellier · 2ème année en cours. Formation en développement d'applications optimisées, administration de systèmes informatiques, gestion des données et conduite de projets en équipe.</div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">2020</div>
                            <div className="timeline-title">Stage d'observation</div>
                            <div className="timeline-desc">Orosys (Two notes Audio Engineering) · 3 jours de découverte des solutions audio professionnelles pour musiciens.</div>
                        </div>
                    </div>
                </section>
                {/* Passions */}
                <section id="passions">
                    <div className="section-header">
                        <span className="section-number">05 — PASSIONS</span>
                        <h2>Passions</h2>
                    </div>
                    <div className="bento-grid">
                        <div className="bento-card">
                            <h3>Arts Martiaux (10 ans)</h3>
                            <ul>
                                <li><strong>Taekwondo pied-poing :</strong> 1er dan</li>
                                <li><strong>Hapkimudo :</strong> Débutant (2 ans de pratique)</li>
                                <li>Engagement associatif : ouverture d'une section combat pour accompagner des enfants en compétition</li>
                                <li>Apports : discipline, gestion du stress, persévérance, apprentissage itératif</li>
                            </ul>
                        </div>
                        <div className="bento-card">
                            <h3>Musique (5 ans en autodidacte)</h3>
                            <ul>
                                <li><strong>Guitare</strong> et <strong>Piano</strong> : exploration personnelle des styles et techniques</li>
                                <li>Recherche de l'harmonie et de la précision</li>
                            </ul>
                        </div>
                        <div className="bento-card">
                            <h3>Luxe et Savoir-faire</h3>
                            <p>Fascination pour l'histoire et la provenance des pièces d'exception. Maisons admirées : <strong>Hermès</strong> (maroquinerie artisanale), <strong>Zegna</strong> (textiles d'excellence), <strong>Berluti</strong> (patines uniques), <strong>Jaeger-LeCoultre</strong> (haute horlogerie).</p>
                        </div>
                        <div className="bento-card">
                            <h3>Autres intérêts</h3>
                            <p>Mobilier, architecture, logistique, cuisine - domaines où beauté et fonctionnalité convergent.</p>
                        </div>
                        <div className="bento-card">
                            <h3>Projets Personnels Techniques</h3>
                            <p><strong>Finance Algorithmique :</strong> Développement d'outils d'analyse financière en <strong>Python</strong> (TA-Lib) avec exploration de la réécriture en <strong>Rust</strong> pour optimisation des performances.</p>
                        </div>
                    </div>
                </section>
                {/* Contact */}
                <section id="contact">
                    <div className="section-header">
                        <span className="section-number">06 — CONTACT</span>
                        <h2>Contact</h2>
                        <p className="section-desc">Recherche d'alternance : Stage de 2 mois + alternance de 2 ans dans le secteur du luxe, démarrage avril 2026. Préférence : Paris ou Montpellier, 100% présentiel.</p>
                    </div>
                    <div className="contact-grid">
                        <div className="contact-item">
                            <div className="contact-label">Email</div>
                            <div className="contact-value"><a href="mailto:ton-email@exemple.com">ton-email@exemple.com</a></div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-label">LinkedIn</div>
                            <div className="contact-value"><a href="#">URL LinkedIn</a></div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-label">GitHub</div>
                            <div className="contact-value"><a href="#">URL GitHub</a></div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-label">Localisation</div>
                            <div className="contact-value">Montpellier, France</div>
                        </div>
                    </div>
                </section>
            </main>
            <footer>
                <div className="haiku">
                    Sous les cerisiers<br />
                    Le code et l'harmonie<br />
                    Un chemin d'honneur
                </div>
                <p>© 2025 Maxim · Conçu avec intention</p>
            </footer>
        </>
    );
}