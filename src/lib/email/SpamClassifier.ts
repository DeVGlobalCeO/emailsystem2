import { Email } from '../../types/email';

interface SpamScore {
  score: number;
  reasons: string[];
}

export class SpamClassifier {
  private static SPAM_SCORE_THRESHOLD = 5;
  
  // Header-based rules
  private static HEADER_RULES = {
    'X-Spam-Flag': { score: 5, check: (value: string) => value.toLowerCase() === 'yes' },
    'X-Spam-Status': { score: 3, check: (value: string) => value.toLowerCase().includes('yes') },
    'X-Spam-Level': { score: 0.5, check: (value: string) => value.length > 5 },
    'Authentication-Results': { 
      score: 3, 
      check: (value: string) => {
        const lower = value.toLowerCase();
        return lower.includes('fail') || lower.includes('softfail');
      }
    }
  };

  // Content-based rules
  private static CONTENT_PATTERNS = [
    {
      pattern: /\b(viagra|cialis|enlargement|casino|lottery|winner)\b/gi,
      score: 2,
      reason: 'Suspicious keywords detected'
    },
    {
      pattern: /\b(urgent|congratulations|won|prize|million|dollars)\b/gi,
      score: 1,
      reason: 'Potential scam keywords'
    },
    {
      pattern: /[^\s]{30,}/g, // Long strings without spaces
      score: 1,
      reason: 'Unusual text patterns'
    },
    {
      pattern: /\b[A-Z]{5,}\b/g, // All caps words
      score: 0.5,
      reason: 'Excessive capitalization'
    }
  ];

  // URL and link analysis
  private static URL_PATTERNS = [
    {
      pattern: /(http|https):\/\/[^\s/$.?#].[^\s]*/gi,
      score: 0.5,
      reason: 'Suspicious URLs'
    },
    {
      pattern: /\b(?:click here|visit now|sign up)\b/gi,
      score: 1,
      reason: 'Suspicious call-to-action phrases'
    }
  ];

  static analyzeHeaders(headers: Record<string, string>): SpamScore {
    let score = 0;
    const reasons: string[] = [];

    for (const [header, rule] of Object.entries(this.HEADER_RULES)) {
      const value = headers[header];
      if (value && rule.check(value)) {
        score += rule.score;
        reasons.push(`Suspicious header: ${header}`);
      }
    }

    return { score, reasons };
  }

  static analyzeContent(content: string): SpamScore {
    let score = 0;
    const reasons: string[] = [];

    // Check content patterns
    for (const rule of this.CONTENT_PATTERNS) {
      const matches = content.match(rule.pattern);
      if (matches) {
        score += rule.score * matches.length;
        reasons.push(rule.reason);
      }
    }

    // Check URL patterns
    for (const rule of this.URL_PATTERNS) {
      const matches = content.match(rule.pattern);
      if (matches) {
        score += rule.score * matches.length;
        reasons.push(rule.reason);
      }
    }

    return { score, reasons };
  }

  static classifyEmail(email: Email & { headers: Record<string, string> }): {
    isSpam: boolean;
    score: number;
    reasons: string[];
  } {
    // Analyze headers
    const headerAnalysis = this.analyzeHeaders(email.headers);
    
    // Analyze content (subject + body)
    const contentAnalysis = this.analyzeContent(
      `${email.subject}\n${email.body}`
    );

    // Combine scores and reasons
    const totalScore = headerAnalysis.score + contentAnalysis.score;
    const allReasons = [...headerAnalysis.reasons, ...contentAnalysis.reasons];

    return {
      isSpam: totalScore >= this.SPAM_SCORE_THRESHOLD,
      score: totalScore,
      reasons: allReasons
    };
  }
}