import React from 'react';
import { ParsedOutput } from '@/types';

interface PdfRendererProps {
  parsed: ParsedOutput;
  timestamp: Date;
  visible?: boolean;
}

const PdfRenderer = React.forwardRef<HTMLDivElement, PdfRendererProps>(({ parsed, timestamp, visible = false }, ref) => {
  const dateStr = timestamp.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const sectionStyle = { padding: '40px 60px', pageBreakInside: 'avoid' as const };
  const h2Style = { fontSize: '18px', fontWeight: 700, color: '#C8963E', marginBottom: '16px', borderBottom: '2px solid #f0ebe0', paddingBottom: '8px' };
  const cardStyle = { display: 'flex' as const, alignItems: 'flex-start' as const, gap: '12px', padding: '10px 16px', marginBottom: '6px', background: '#faf7f2', borderRadius: '8px', border: '1px solid #e8e0d4' };
  const numStyle = { width: '24px', height: '24px', borderRadius: '50%', background: '#C8963E', color: 'white', display: 'inline-flex' as const, alignItems: 'center' as const, justifyContent: 'center' as const, fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '2px' };

  return (
    <div
      ref={ref}
      style={{
        position: visible ? 'fixed' : 'absolute',
        left: visible ? '0' : '-9999px',
        top: 0, width: '794px', zIndex: visible ? 9999 : -1,
        background: '#ffffff', color: '#1a1a1a',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '13px', lineHeight: '1.6', padding: '0',
      }}
    >
      {/* Cover */}
      <div style={{ padding: '80px 60px', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pageBreakAfter: 'always' }}>
        <div style={{ fontSize: '36px', marginBottom: '24px' }}>🍃</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', fontFamily: "'Playfair Display', Georgia, serif" }}>
          Ghibli Days Studio
        </h1>
        <p style={{ fontSize: '12px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 32px' }}>
          Content Generation Report
        </p>
        <div style={{ width: '60px', height: '3px', background: '#C8963E', margin: '0 auto 32px' }} />
        <p style={{ fontSize: '16px', color: '#333', maxWidth: '500px', margin: '0 0 16px' }}>
          {parsed.titles[0] || 'Generated Content'}
        </p>
        <p style={{ fontSize: '12px', color: '#999' }}>{dateStr}</p>
      </div>

      {parsed.channelDNA && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Channel DNA Analysis</h2>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>{parsed.channelDNA}</p>
        </div>
      )}

      {parsed.titles.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Titles ({parsed.titles.length})</h2>
          {parsed.titles.map((t, i) => (
            <div key={i} style={cardStyle}>
              <span style={numStyle}>{i + 1}</span>
              <span style={{ fontSize: '13px', color: '#333' }}>{t}</span>
            </div>
          ))}
        </div>
      )}

      {parsed.description && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Description</h2>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>{parsed.description}</p>
        </div>
      )}

      {parsed.story && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Story</h2>
          {parsed.story.split(/\n\n+/).filter(p => p.trim()).map((p, i) => (
            <p key={i} style={{ fontSize: '13px', lineHeight: '1.9', color: '#444', marginBottom: '12px' }}>{p.trim()}</p>
          ))}
        </div>
      )}

      {parsed.characters.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Characters ({parsed.characters.length})</h2>
          {parsed.characters.map((c, i) => (
            <div key={i} style={{ ...cardStyle, flexDirection: 'column' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '4px' }}>{c.label}</div>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.7', margin: 0 }}>{c.description}</p>
            </div>
          ))}
        </div>
      )}

      {parsed.scenes.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Scenes ({parsed.scenes.length})</h2>
          {parsed.scenes.map((s, i) => (
            <div key={i} style={cardStyle}>
              <span style={numStyle}>{i + 1}</span>
              <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#444', margin: 0 }}>{s}</p>
            </div>
          ))}
        </div>
      )}

      {parsed.imagePrompts.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Image Prompts ({parsed.imagePrompts.length})</h2>
          {parsed.imagePrompts.map((p, i) => (
            <div key={i} style={cardStyle}>
              <span style={numStyle}>{i + 1}</span>
              <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#444', margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
      )}

      {parsed.videoPrompts.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={h2Style}>Video Prompts ({parsed.videoPrompts.length})</h2>
          {parsed.videoPrompts.map((p, i) => (
            <div key={i} style={cardStyle}>
              <span style={numStyle}>{i + 1}</span>
              <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#444', margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '24px 60px', borderTop: '1px solid #e8e0d4', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999' }}>
        <span>Generated by Ghibli Days Studio</span>
        <span>{dateStr}</span>
      </div>
    </div>
  );
});

PdfRenderer.displayName = 'PdfRenderer';

export default PdfRenderer;
