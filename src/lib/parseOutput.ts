import { ParsedOutput } from '@/types';

/** Split prompt blocks separated by horizontal rules or numbering */
function parsePromptList(content: string): string[] {
  // Split by ┌─ IMAGE or ┌─ VIDEO markers
  const boxSplit = content
    .split(/\n*┌─\s*(?:IMAGE|VIDEO|SCENE)\s*/i)
    .map(b => b.replace(/^─+\s*/, '').trim())
    .filter(b => b.length > 0);
  if (boxSplit.length > 1) return boxSplit;

  // Split by separator lines (─── or ═══)
  const blocks = content
    .split(/\n*[─═]{3,}\n*/)
    .map(b => b.trim())
    .filter(b => b.length > 0 && !/^\(\d+ total\)$/i.test(b));
  if (blocks.length > 1) return blocks;

  // Fallback: split by numbered entries like "Image 1:" or "Video Prompt 1:"
  const numbered = content
    .split(/\n(?=(?:Image|Video|Scene)\s*(?:Prompt\s*)?\d+\s*:)/i)
    .map(b => b.trim())
    .filter(b => b.length > 0);
  if (numbered.length > 1) return numbered;

  // Fallback: numbered list
  const list = content
    .split(/\n(?=\d+[\.\)])/)
    .map(l => l.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(l => l.length > 0);

  return list.length > 0 ? list : content.split('\n\n').filter(l => l.trim().length > 0);
}

function parseDescription(content: string, result: ParsedOutput) {
  result.description = content;
  const lines = content.split('\n');
  const hookLines: string[] = [];
  const bodyLines: string[] = [];
  const timestamps: string[] = [];
  const hashtags: string[] = [];
  let closingQuote = '';
  let foundTimestamp = false;

  for (const line of lines) {
    const trimmed = line.trim();
    // Hashtags
    if (/^#\w/.test(trimmed)) {
      const tags = trimmed.match(/#\w+/g);
      if (tags) hashtags.push(...tags);
      continue;
    }
    // Timestamps (e.g. 0:00 or 00:00)
    if (/^\d{1,2}:\d{2}/.test(trimmed)) {
      timestamps.push(trimmed);
      foundTimestamp = true;
      continue;
    }
    // Closing quote (line with "..." pattern or starts/ends with quotes)
    if (/^[""].*[""]$/.test(trimmed) || /^".*"$/.test(trimmed)) {
      closingQuote = trimmed;
      continue;
    }
    // Before timestamps = hook/body
    if (!foundTimestamp) {
      if (hookLines.length < 2 && trimmed.length > 0) {
        hookLines.push(trimmed);
      } else {
        bodyLines.push(trimmed);
      }
    } else {
      bodyLines.push(trimmed);
    }
  }

  result.descriptionHook = hookLines.join('\n');
  result.descriptionBody = bodyLines.filter(l => l.trim()).join('\n');
  result.timestamps = timestamps;
  result.closingQuote = closingQuote;
  result.hashtags = hashtags;
}

function parseStoryContent(content: string, result: ParsedOutput) {
  result.story = content;

  // Extract THREE PLANTED DETAILS (bullet lines near the top)
  const plantedMatch = content.match(/(?:THREE\s+)?PLANTED\s+DETAILS?\s*:?\s*\n([\s\S]*?)(?:\n\n|\n(?=[A-Z]))/i);
  if (plantedMatch) {
    result.plantedDetails = plantedMatch[1]
      .split('\n')
      .map(l => l.replace(/^[\s•\-\*]+/, '').trim())
      .filter(l => l.length > 0);
  } else {
    // Try bullet points at start
    const bullets = content.match(/^[\s]*[•\-\*]\s+.+/gm);
    if (bullets && bullets.length >= 2 && bullets.length <= 5) {
      result.plantedDetails = bullets.map(b => b.replace(/^[\s•\-\*]+/, '').trim());
    }
  }

  // Extract ENDING VISUAL
  const endingMatch = content.match(/\[ENDING\s+VISUAL\s*:?\s*([\s\S]*?)\]/i);
  if (endingMatch) {
    result.endingVisual = endingMatch[1].trim();
  } else {
    const endingSection = content.match(/ENDING\s+VISUAL\s*:?\s*\n([\s\S]*?)$/i);
    if (endingSection) {
      result.endingVisual = endingSection[1].trim();
    }
  }
}

export function parseOutput(raw: string): ParsedOutput {
  const result: ParsedOutput = {
    channelDNA: '',
    channelDNAJson: null,
    titles: [],
    description: '',
    descriptionHook: '',
    descriptionBody: '',
    timestamps: [],
    closingQuote: '',
    hashtags: [],
    story: '',
    plantedDetails: [],
    endingVisual: '',
    characters: [],
    scenes: [],
    imagePrompts: [],
    videoPrompts: [],
    raw,
  };

  const text = raw.replace(/\r\n/g, '\n');

  // Section patterns — support both emoji headers and text-only headers
  const sectionPatterns = [
    { key: 'titles', patterns: [/(?:^|\n).*?🎬\s*TITLE.*?\n/i, /(?:^|\n).*?TITLES?.*?\n/i] },
    { key: 'description', patterns: [/(?:^|\n).*?📋\s*DESCRIPTION.*?\n/i, /(?:^|\n).*?DESCRIPTION.*?\n/i] },
    { key: 'story', patterns: [/(?:^|\n).*?📖\s*STORY.*?\n/i, /(?:^|\n).*?STORY.*?\n/i] },
    { key: 'characters', patterns: [/(?:^|\n).*?🎭\s*CHARACTER.*?\n/i, /(?:^|\n).*?CHARACTERS?.*?\n/i] },
    { key: 'scenes', patterns: [/(?:^|\n).*?🎞️?\s*SCENES?.*?\n/i, /(?:^|\n).*?SCENE\s*(?:GENERATION|DESCRIPTIONS?|BREAKDOWN|SCRIPT).*?\n/i] },
    { key: 'imagePrompts', patterns: [/(?:^|\n).*?🖼️?\s*IMAGE\s*PROMPTS?.*?\n/i, /(?:^|\n).*?IMAGE\s*PROMPTS?.*?\n/i] },
    { key: 'videoPrompts', patterns: [/(?:^|\n).*?🎥\s*VIDEO\s*PROMPTS?.*?\n/i, /(?:^|\n).*?VIDEO\s*PROMPTS?.*?\n/i] },
    { key: 'channelDNA', patterns: [/(?:^|\n).*?CHANNEL\s*DNA.*?\n/i, /(?:^|\n).*?DNA\s*ANALYSIS.*?\n/i] },
  ];

  const sections: { key: string; start: number; headerEnd: number }[] = [];

  for (const sp of sectionPatterns) {
    for (const pattern of sp.patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        // Avoid duplicate keys
        if (!sections.find(s => s.key === sp.key)) {
          sections.push({
            key: sp.key,
            start: match.index,
            headerEnd: match.index + match[0].length,
          });
        }
        break;
      }
    }
  }

  sections.sort((a, b) => a.start - b.start);

  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].headerEnd;
    const end = i + 1 < sections.length ? sections[i + 1].start : text.length;
    const content = text.slice(start, end).trim();

    switch (sections[i].key) {
      case 'channelDNA': {
        result.channelDNA = content;
        const jsonMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          result.channelDNAJson = jsonMatch[1].trim();
        } else {
          const objMatch = content.match(/\{[\s\S]*\}/);
          if (objMatch) {
            try { JSON.parse(objMatch[0]); result.channelDNAJson = objMatch[0]; } catch {}
          }
        }
        break;
      }
      case 'titles': {
        result.titles = content
          .split('\n')
          .map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^[⭐📈💖⚡]\s*/, '').trim())
          .filter(l => l.length > 0);
        break;
      }
      case 'description': {
        parseDescription(content, result);
        break;
      }
      case 'story': {
        parseStoryContent(content, result);
        break;
      }
      case 'characters': {
        const CHAR_LABELS = /(?:Father|Mother|Dad|Mom|Papa|Mama|Boy|Girl|Child|Kid|Son|Daughter|Grandfather|Grandmother|Grandpa|Grandma|Elder|Baby|Toddler|Man|Woman|Old\s*Man|Old\s*Woman|One\s*Boy|One\s*Girl|Little\s*Boy|Little\s*Girl|Young\s*Boy|Young\s*Girl|Brother|Sister|Uncle|Aunt|Narrator|Pet|Cat|Dog|Friend|Stranger|Villager|Character\s*\d*)/i;
        const numberedChars = content.split(/\n(?=\d+[\.\)]\s*)/);
        const labelSplit = content.split(new RegExp(`\\n(?=${CHAR_LABELS.source}[:\\s-])`, 'i'));

        const charBlocks = labelSplit.length >= numberedChars.length && labelSplit.length > 1
          ? labelSplit
          : numberedChars.length > 1
            ? numberedChars
            : content.split(/\n\n+/).filter(b => b.trim().length > 0);

        for (const block of charBlocks) {
          const trimmed = block.trim();
          if (!trimmed) continue;
          const cleaned = trimmed.replace(/^\d+[\.\)]\s*/, '');
          const labelMatch = cleaned.match(/^\*{0,2}([^:*\n-]+?)\*{0,2}\s*[:\-–—]\s*([\s\S]*)/);
          if (labelMatch) {
            result.characters.push({
              label: labelMatch[1].trim(),
              description: labelMatch[2].trim() || cleaned,
            });
          } else {
            const lines = cleaned.split('\n');
            result.characters.push({
              label: lines[0].replace(/^\*{1,2}|\*{1,2}$/g, '').trim() || 'Character',
              description: lines.slice(1).join('\n').trim() || lines[0].trim(),
            });
          }
        }
        if (result.characters.length === 0) {
          result.characters.push({ label: 'Characters', description: content });
        }
        break;
      }
      case 'scenes': {
        result.scenes = parsePromptList(content);
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

  if (sections.length === 0) {
    result.channelDNA = text;
  }

  return result;
}

export function generateDownloadText(parsed: ParsedOutput): string {
  let text = '═══════════════════════════════════════\n';
  text += '  GHIBLI DAYS STUDIO — GENERATED CONTENT\n';
  text += '═══════════════════════════════════════\n\n';

  if (parsed.channelDNA) {
    text += '── CHANNEL DNA ANALYSIS ──\n\n' + parsed.channelDNA + '\n\n';
  }
  if (parsed.titles.length) {
    text += '── TITLES ──\n\n' + parsed.titles.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n\n';
  }
  if (parsed.description) {
    text += '── DESCRIPTION ──\n\n' + parsed.description + '\n\n';
  }
  if (parsed.story) {
    text += '── STORY ──\n\n' + parsed.story + '\n\n';
  }
  if (parsed.characters.length) {
    text += '── CHARACTERS ──\n\n' + parsed.characters.map(c => `${c.label}: ${c.description}`).join('\n\n') + '\n\n';
  }
  if (parsed.scenes.length) {
    text += '── SCENES ──\n\n' + parsed.scenes.map((s, i) => `${i + 1}. ${s}`).join('\n\n') + '\n\n';
  }
  if (parsed.imagePrompts.length) {
    text += '── IMAGE PROMPTS ──\n\n' + parsed.imagePrompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n') + '\n\n';
  }
  if (parsed.videoPrompts.length) {
    text += '── VIDEO PROMPTS ──\n\n' + parsed.videoPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n') + '\n\n';
  }

  return text;
}
