import React from 'react';
import { ParsedOutput } from '@/types';

interface PdfRendererProps {
  parsed: ParsedOutput;
  timestamp: Date;
}

const PdfRenderer = React.forwardRef<HTMLDivElement, PdfRendererProps>(({ parsed, timestamp }, ref) => {
  const dateStr = timestamp.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      ref={ref}
      className="pdf-export"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '210mm',
        background: 'white',
        color: '#1a1a2e',
        fontSize: '11px',
        lineHeight: '1.6',
      }}
    >
      {/* Cover Page */}
      <div className="pdf-cover">
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6c5ce7, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'white', fontSize: '1.5rem', fontWeight: 700,
          }}>✦</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' }}>
            Ghibli Days
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Content Generation Report
          </p>
        </div>
        <div style={{ width: '60px', height: '2px', background: '#6c5ce7', margin: '2rem auto' }} />
        <p style={{ fontSize: '0.9rem', color: '#444', maxWidth: '400px' }}>
          {parsed.titles[0] || 'Generated Content'}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '1rem' }}>{dateStr}</p>
      </div>

      {/* Table of Contents */}
      <div style={{ padding: '2rem 2.5rem', pageBreakAfter: 'always' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1a1a2e' }}>Contents</h2>
        {[
          parsed.channelDNA && 'Channel DNA Analysis',
          parsed.titles.length > 0 && `Titles (${parsed.titles.length})`,
          parsed.story && 'Story',
          parsed.characters.length > 0 && `Characters (${parsed.characters.length})`,
          parsed.imagePrompts.length > 0 && `Image Prompts (${parsed.imagePrompts.length})`,
          parsed.videoPrompts.length > 0 && `Video Prompts (${parsed.videoPrompts.length})`,
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{
            padding: '0.6rem 0',
            borderBottom: '1px solid #f0f0f5',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            fontSize: '0.85rem', color: '#444',
          }}>
            <span style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: '#6c5ce7', color: 'white',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</span>
            {item}
          </div>
        ))}
      </div>

      {/* Channel DNA */}
      {parsed.channelDNA && (
        <div style={{ padding: '2rem 2.5rem' }} className="pdf-section">
          <div className="pdf-section-title">Channel DNA Analysis</div>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-wrap' }}>
            {parsed.channelDNA}
          </p>
        </div>
      )}

      {/* Titles */}
      {parsed.titles.length > 0 && (
        <div style={{ padding: '2rem 2.5rem' }} className="pdf-section">
          <div className="pdf-section-title">Titles</div>
          <div style={{ display: 'grid', gap: '0.4rem' }}>
            {parsed.titles.map((t, i) => (
              <div key={i} className="pdf-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="pdf-prompt-num">{i + 1}</span>
                <span style={{ fontSize: '0.8rem', color: '#333' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Story */}
      {parsed.story && (
        <div style={{ padding: '2rem 2.5rem' }} className="pdf-section">
          <div className="pdf-section-title">Story</div>
          {parsed.story.split(/\n\n+/).filter(p => p.trim()).map((p, i) => (
            <p key={i} style={{ fontSize: '0.8rem', lineHeight: 1.9, color: '#444', marginBottom: '0.75rem' }}>
              {p.trim()}
            </p>
          ))}
        </div>
      )}

      {/* Characters */}
      {parsed.characters.length > 0 && (
        <div style={{ padding: '2rem 2.5rem' }} className="pdf-section">
          <div className="pdf-section-title">Characters</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {parsed.characters.map((c, i) => (
              <div key={i} className="pdf-card">
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1a1a2e', marginBottom: '0.3rem' }}>{c.label}</div>
                <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.7 }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Prompts */}
      {parsed.imagePrompts.length > 0 && (
        <div style={{ padding: '2rem 2.5rem' }} className="pdf-section">
          <div className="pdf-section-title">Image Prompts</div>
          {parsed.imagePrompts.map((p, i) => (
            <div key={i} className="pdf-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span className="pdf-prompt-num">{i + 1}</span>
              <p style={{ fontSize: '0.75rem', lineHeight: 1.8, color: '#444' }}>{p}</p>
            </div>
          ))}
        </div>
      )}

      {/* Video Prompts */}
      {parsed.videoPrompts.length > 0 && (
        <div style={{ padding: '2rem 2.5rem' }} className="pdf-section">
          <div className="pdf-section-title">Video Prompts</div>
          {parsed.videoPrompts.map((p, i) => (
            <div key={i} className="pdf-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span className="pdf-prompt-num">{i + 1}</span>
              <p style={{ fontSize: '0.75rem', lineHeight: 1.8, color: '#444' }}>{p}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '2rem 2.5rem',
        borderTop: '1px solid #f0f0f5',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.7rem', color: '#999',
      }}>
        <span>Generated by Ghibli Days</span>
        <span>{dateStr}</span>
      </div>
    </div>
  );
});

PdfRenderer.displayName = 'PdfRenderer';

export default PdfRenderer;
