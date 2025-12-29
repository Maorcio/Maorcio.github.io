"use client"
import Head from "next/head";
export default function GestionRecettes() {
  return (
    <>
      <Head>
        <title>Gestion de Recettes — Projet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{padding:'2rem', background:'#fafaf9', color:'#1a1a1a', fontFamily:'sans-serif'}}>
        <a href="/test">← Retour au portfolio</a>
        <h1>Gestion de Recettes</h1>
        <section>
          <h2>Résumé</h2>
          <p>Application personnelle avec fonctionnalités avancées : timers, dictée vocale, génération de liste de courses, conversion d'ingrédients.</p>
        </section>
        <section>
          <h2>Stack & Techno</h2>
          <ul>
            <li>Next.js</li>
            <li>React</li>
            <li>Tailwind</li>
          </ul>
        </section>
        <section>
          <h2>Défis relevés</h2>
          <ul>
            <li>Gestion de la reconnaissance vocale</li>
            <li>Expérience utilisateur fluide</li>
            <li>Optimisation mobile</li>
          </ul>
        </section>
        <section>
          <h2>Ce que j'ai appris</h2>
          <ul>
            <li>Accessibilité</li>
            <li>Design UX</li>
            <li>Déploiement Next.js</li>
          </ul>
        </section>
      </div>
    </>
  );
}
