"use client"
import Head from "next/head";
export default function LegendaryBeats() {
  return (
    <>
      <Head>
        <title>Legendary Beats — Projet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={{padding:'2rem', background:'#fafaf9', color:'#1a1a1a', fontFamily:'sans-serif'}}>
        <a href="/test">← Retour au portfolio</a>
        <h1>Legendary Beats</h1>
        <section>
          <h2>Résumé</h2>
          <p>Jeu 2D développé en 48h pour une Game Jam. Le joueur affronte des boss musiciens en tirant des notes de musique.</p>
        </section>
        <section>
          <h2>Stack & Techno</h2>
          <ul>
            <li>Unity 2D</li>
            <li>C#</li>
            <li>Game Design</li>
          </ul>
        </section>
        <section>
          <h2>Défis relevés</h2>
          <ul>
            <li>Création d'un gameplay original en temps limité</li>
            <li>Collaboration avec des graphistes</li>
            <li>Gestion du sound design</li>
          </ul>
        </section>
        <section>
          <h2>Ce que j'ai appris</h2>
          <ul>
            <li>Prototypage rapide</li>
            <li>Itération sur le fun</li>
            <li>Travail interdisciplinaire</li>
          </ul>
        </section>
      </div>
    </>
  );
}
