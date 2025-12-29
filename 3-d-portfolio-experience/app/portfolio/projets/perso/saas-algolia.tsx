"use client"
import Head from "next/head";
export default function SaasAlgolia() {
  return (
    <>
      <Head>
        <title>SaaS type Algolia — Projet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{padding:'2rem', background:'#fafaf9', color:'#1a1a1a', fontFamily:'sans-serif'}}>
        <a href="/test">← Retour au portfolio</a>
        <h1>SaaS type Algolia</h1>
        <section>
          <h2>Résumé</h2>
          <p>Plateforme de recherche et d'indexation avec dashboard moderne. Architecture respectant les principes SOLID.</p>
        </section>
        <section>
          <h2>Stack & Techno</h2>
          <ul>
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>AdonisJS</li>
          </ul>
        </section>
        <section>
          <h2>Défis relevés</h2>
          <ul>
            <li>Architecture scalable</li>
            <li>Gestion des index</li>
            <li>Dashboard moderne</li>
          </ul>
        </section>
        <section>
          <h2>Ce que j'ai appris</h2>
          <ul>
            <li>Principes SOLID</li>
            <li>Déploiement SaaS</li>
            <li>Gestion de projet agile</li>
          </ul>
        </section>
      </div>
    </>
  );
}
