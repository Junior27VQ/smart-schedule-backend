import React from 'react';
import '../stylish/MathConceptsPanel.css';

export default function MathConceptsPanel({ totalMaterias, materiasPorHorario, combinacionesTotales,
    validasCount, descartadasCount, reglaLogica }) {
  return (
    <div className="math-panel">
      <h4 className="math-panel-title">
        📐 Fundamento Matemático y Formal (Matemáticas Discretas)
      </h4>
      <div className="math-grid">
        
        {/* 1. Cálculo Combinatorio */}
        <div className="math-card">
          <span className="math-card-label">Cálculo Combinatorio C(n, k)</span>
          <span className="math-card-value">
            Fórmula: C({totalMaterias || 8}, {materiasPorHorario || 3})
            <br />
            <span className="math-formula">Combinaciones = {combinacionesTotales || 56}</span>
          </span>
        </div>

        {/* 2. Teoría de Conjuntos */}
        <div className="math-card">
          <span className="math-card-label">Teoría de Conjuntos (Conjunto S)</span>
          <span className="math-card-value">
            Cardinalidad: <span className="math-formula">|S| = {totalMaterias} materias</span>
          </span>
        </div>

        {/* 3. Combinatoria y Espacio Muestral */}
        <div className="math-card">
          <span className="math-card-label">Espacio Muestral y Conteo</span>
          <span className="math-card-value">
            Válidos / Descartados: <span className="math-formula">{validasCount} / {descartadasCount}</span>
          </span>
        </div>

        {/* 4. Teoría de Conjuntos (Materias Obligatorias) */}
        <div className="math-card">
          <span className="math-card-label">Teoría de Conjuntos (Inclusión)</span>
          <span className="math-card-value">
            Para las materias obligatorias:
            <br />
            <span className="math-formula">Materias obligatorias ⊆ Materias del horario</span>
          </span>
        </div>

        {/* 5. Regla Aplicada y Lógica Proposicional Unificada */}
        <div className="math-card" style={{ gridColumn: '1 / -1' }}>
          <span className="math-card-label">Reglas Aplicadas & Lógica Proposicional</span>
          <span className="math-card-value" style={{ fontWeight: 'normal' }}>
            Restricciones: No cruces <strong>AND</strong> Incluye Programación <strong>AND</strong> Créditos ≤ 12
            <br />
            Equivalencia formal: <code className="math-formula">P (Prerrequisitos) ∧ Q (No Cruce) ∧ R (Créditos)</code>
            <br />
            <span style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', display: 'block' }}>
              Estado actual de evaluación: <strong>{reglaLogica || 'Evaluado bajo restricciones formales'}</strong>
            </span>
          </span>
        </div>

      </div>
    </div>
  );
}