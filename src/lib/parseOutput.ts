import { ParsedOutput } from '@/types';

/** Split prompt blocks separated by horizontal rules or numbering */
function parsePromptList(content: string): string[] {
  // Split by separator lines (─── or ═══) or numbered entries
  const blocks = content
    .split(/\n*[─═]{3,}\n*/)
    .map(b => b.trim())
    .filter(b => b.length > 0 && !/^\(\d+ total\)$/i.test(b));

  if (blocks.length > 1) {
    return blocks;
  }

  // Fallback: split by numbered entries like "Image 1:" or "Video Prompt 1:"
  const numbered = content
    .split(/\n(?=(?:Image|Video)\s*(?:Prompt\s*)?\d+\s*:)/i)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  if (numbered.length > 1) {
    return numbered;
  }

  // Fallback: numbered list
  const list = content
    .split(/\n(?=\d+[\.\)])/)
    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(l => l.length > 0);

  return list.length > 0 ? list : content.split('\n\n').filter(l => l.trim().length > 0);
}

export function parseOutput(raw: string): ParsedOutput {
  const result: ParsedOutput = {
    channelDNA: '',
    channelDNAJson: null,
    titles: [],
    story: '',
    characters: [],
    imagePrompts: [],
    videoPrompts: [],
    raw,
  };

  // Normalize line endings
  const text = raw.replace(/\r\n/g, '\n');

  // Try to find sections by common headers
  const sectionPatterns = [
    { key: 'titles', patterns: [/(?:^|\n).*?TITLES?.*?\n/i] },
    { key: 'story', patterns: [/(?:^|\n).*?STORY.*?\n/i] },
    { key: 'characters', patterns: [/(?:^|\n).*?CHARACTERS?.*?\n/i] },
    { key: 'imagePrompts', patterns: [/(?:^|\n).*?IMAGE\s*PROMPTS?.*?\n/i] },
    { key: 'videoPrompts', patterns: [/(?:^|\n).*?VIDEO\s*PROMPTS?.*?\n/i] },
    { key: 'channelDNA', patterns: [/(?:^|\n).*?CHANNEL\s*DNA.*?\n/i, /(?:^|\n).*?DNA\s*ANALYSIS.*?\n/i] },
  ];

  // Find all section positions
  const sections: { key: string; start: number; headerEnd: number }[] = [];

  for (const sp of sectionPatterns) {
    for (const pattern of sp.patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        sections.push({
          key: sp.key,
          start: match.index,
          headerEnd: match.index + match[0].length,
        });
        break;
      }
    }
  }

  // Sort by position
  sections.sort((a, b) => a.start - b.start);

  // Extract content between sections
  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].headerEnd;
    const end = i + 1 < sections.length ? sections[i + 1].start : text.length;
    const content = text.slice(start, end).trim();

    switch (sections[i].key) {
      case 'channelDNA': {
        result.channelDNA = content;
        // Try to find JSON block
        const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          result.channelDNAJson = jsonMatch[1].trim();
        } else {
          // Try to find raw JSON object
          const objMatch = content.match(/\{[\s\S]*\}/);
          if (objMatch) {
            try {
              JSON.parse(objMatch[0]);
              result.channelDNAJson = objMatch[0];
            } catch {}
          }
        }
        break;
      }
      case 'titles': {
        result.titles = content
          .split('\n')
          .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter(l => l.length > 0);
        break;
      }
      case 'story': {
        result.story = content;
        break;
      }
      case 'characters': {
        // Try to parse character blocks
        const charBlocks = content.split(/\n(?=(?:Father|Mother|Boy|Girl|One\s*Boy|Child|Kid|Son|Daughter|Grandfather|Grandmother|Elder|Baby|Toddler|Man|Woman|Old\s*Man|Old\s*Woman))/i);
        for (const block of charBlocks) {
          const firstLine = block.split('\n')[0].trim();
          if (firstLine) {
            const labelMatch = firstLine.match(/^(Father|Mother|Boy|Girl|One\s*Boy|Child|Kid|Son|Daughter|Grandfather|Grandmother|Elder|Baby|Toddler|Man|Woman|Old\s*Man|Old\s*Woman)[:\s-]*/i);
            if (labelMatch) {
              result.characters.push({
                label: labelMatch[1],
                description: block.replace(firstLine, '').trim() || firstLine.replace(labelMatch[0], '').trim(),
              });
            } else {
              result.characters.push({ label: 'Character', description: block.trim() });
            }
          }
        }
        if (result.characters.length === 0) {
          result.characters.push({ label: 'Characters', description: content });
        }
        break;
      }
      case 'imagePrompts': {
        result.imagePrompts = parsePromptList(content);
        break;
      }
      case 'videoPrompts': {
        result.videoPrompts = parsePromptList(content);
        break;
      }
    }
  }

  // If no sections found, put everything in raw
  if (sections.length === 0) {
    result.channelDNA = text;
  }

  return result;
}

export function generateDownloadText(parsed: ParsedOutput): string {
  let text = '═══════════════════════════════════════\n';
  text += '  GHIBLI DAYS — GENERATED CONTENT\n';
  text += '═══════════════════════════════════════\n\n';

  if (parsed.channelDNA) {
    text += '── CHANNEL DNA ANALYSIS ──\n\n' + parsed.channelDNA + '\n\n';
  }
  if (parsed.titles.length) {
    text += '── TITLES ──\n\n' + parsed.titles.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n\n';
  }
  if (parsed.story) {
    text += '── STORY ──\n\n' + parsed.story + '\n\n';
  }
  if (parsed.characters.length) {
    text += '── CHARACTERS ──\n\n' + parsed.characters.map(c => `${c.label}: ${c.description}`).join('\n\n') + '\n\n';
  }
  if (parsed.imagePrompts.length) {
    text += '── IMAGE PROMPTS ──\n\n' + parsed.imagePrompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n') + '\n\n';
  }
  if (parsed.videoPrompts.length) {
    text += '── VIDEO PROMPTS ──\n\n' + parsed.videoPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n') + '\n\n';
  }

  return text;
}
