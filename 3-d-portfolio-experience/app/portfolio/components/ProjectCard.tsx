import React from "react";

export interface ProjectCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  stack?: string;
  role?: string;
  skills?: string;
  result?: string;
  link?: string;
  children?: React.ReactNode;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  subtitle,
  description,
  stack,
  role,
  skills,
  result,
  link,
  children
}) => (
  <div className="bento-card">
    <h3>{link ? <a href={link}>{title}</a> : title}</h3>
    {subtitle && <p><strong>{subtitle}</strong></p>}
    {description && <p>{description}</p>}
    {stack && <p><strong>Stack :</strong> {stack}</p>}
    {role && <p><strong>Rôle :</strong> {role}</p>}
    {skills && <p><strong>Compétences :</strong> {skills}</p>}
    {result && <p><strong>Résultat :</strong> {result}</p>}
    {children}
  </div>
);
