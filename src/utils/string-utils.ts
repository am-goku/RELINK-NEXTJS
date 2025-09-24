export function extractHashtags(text: string): string[] {
    if (!text) return [];
    // Match words starting with # followed by letters, numbers, or underscores
    const matches = text.match(/#[\p{L}\p{N}_]+/gu);
    return matches ? matches.map(tag => tag.slice(1)) : [];
}