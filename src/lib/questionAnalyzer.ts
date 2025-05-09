// Factors that indicate complexity:
// 1. Question length
// 2. Presence of numbers and mathematical symbols
// 3. Keywords indicating complexity
// 4. Subject matter indicators

export function analyzeQuestionComplexity(question: string): number {
    let baseTime = 15; // Base time in seconds
    
    // Factor 1: Question length
    const wordCount = question.split(' ').length;
    if (wordCount > 20) baseTime += 10;
    if (wordCount > 35) baseTime += 15;

    // Factor 2: Mathematical complexity
    const mathSymbols = /[+\-*/^√∑∫=≠≈≤≥πθ∆∇]|sin|cos|tan|log/g;
    const mathSymbolCount = (question.match(mathSymbols) || []).length;
    if (mathSymbolCount > 0) baseTime += mathSymbolCount * 5;

    // Factor 3: Complex keywords
    const complexityKeywords = [
        'calculate', 'compute', 'derive', 'solve', 'prove',
        'analyze', 'explain', 'compare', 'contrast', 'evaluate',
        'triangle', 'circle', 'square', 'rectangle', 'polygon',
        'equation', 'function', 'graph', 'probability', 'statistics'
    ];
    
    const keywordCount = complexityKeywords.filter(keyword => 
        question.toLowerCase().includes(keyword)
    ).length;
    baseTime += keywordCount * 8;

    // Factor 4: Subject indicators
    const subjects = {
        math: /\b(math|algebra|geometry|calculus|trigonometry)\b/i,
        science: /\b(physics|chemistry|biology|science)\b/i,
        logic: /\b(logic|reasoning|pattern)\b/i
    };

    Object.values(subjects).forEach(pattern => {
        if (pattern.test(question)) baseTime += 10;
    });

    // Minimum and maximum bounds
    const minTime = 5;  // Minimum 5 seconds
    const maxTime = 120; // Maximum 2 minutes

    return Math.min(Math.max(baseTime, minTime), maxTime);
} 