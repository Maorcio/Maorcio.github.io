"use client"
import Head from "next/head";
export default function NuitInfo() {
  return (
    <>
      <Head>
        <title>Nuit de l'Info 2025 — Projet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{padding:'2rem', background:'#fafaf9', color:'#1a1a1a', fontFamily:'sans-serif'}}>
        <a href="/test">← Retour au portfolio</a>
        <h1>Nuit de l'Info 2025</h1>
        <section>
          <h2>Résumé</h2>
          <p>Hackathon national (6 000+ participants). Création d'une plateforme d'alternatives open source pour l'enseignement supérieur en équipe de 6.</p>
        </section>
        <section>
          <h2>Stack & Techno</h2>
          <ul>
            <li>Node.js</li>
            <li>API REST</li>
            <li>JavaScript</li>
          </ul>
        </section>
        <section>
          <h2>Défis relevés</h2>
          <ul>
            <li>Gestion du temps et du stress en équipe</li>
            <li>Conception d'une API robuste en 24h</li>
            <li>Présentation devant jury</li>
          </ul>
        </section>
        <section>
          <h2>Ce que j'ai appris</h2>
          <ul>
            <li>Travail d'équipe intensif</li>
            <li>Communication rapide</li>
            <li>Prototypage sous pression</li>
          </ul>
        </section>
      </div>
    </>
  );
}
