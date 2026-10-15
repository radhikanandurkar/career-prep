// Level scores
const LEVEL_VALUES = {
  'beginner': 1,
  'intermediate': 2,
  'advanced': 3,
};

const getLevelScore = (levelStr) => {
  if (!levelStr) return 0;
  return LEVEL_VALUES[levelStr.toLowerCase()] || 1;
};

/**
 * Skill Gap Analysis Engine
 * Evaluates student skills against target industry role benchmark
 */
function analyzeSkillGap(studentSkills = [], targetRole) {
  if (!targetRole || !targetRole.requiredSkills || targetRole.requiredSkills.length === 0) {
    return {
      overallMatch: 0,
      strongSkills: [],
      skillsToImprove: [],
      missingSkills: [],
      recommendedActions: [],
      categoryBreakdown: {},
    };
  }

  // Normalize student skills map (lowercase key -> skill object)
  const studentSkillMap = new Map();
  studentSkills.forEach((s) => {
    if (s && s.name) {
      studentSkillMap.set(s.name.trim().toLowerCase(), {
        name: s.name.trim(),
        level: s.level || 'Intermediate',
        category: s.category || 'Technical',
      });
    }
  });

  const strongSkills = [];
  const skillsToImprove = [];
  const missingSkills = [];
  const recommendedActions = [];
  const categoryStats = {};

  let totalMaxScore = 0;
  let earnedScore = 0;

  targetRole.requiredSkills.forEach((reqSkill) => {
    const skillNameLower = reqSkill.name.trim().toLowerCase();
    const reqLevel = reqSkill.requiredLevel || 'Intermediate';
    const reqScore = getLevelScore(reqLevel);
    const weight = reqSkill.weight || 5;
    const category = reqSkill.category || 'Core Technical';

    totalMaxScore += reqScore * weight;

    if (!categoryStats[category]) {
      categoryStats[category] = { total: 0, earned: 0, skills: [] };
    }
    categoryStats[category].total += reqScore * weight;

    const matchedStudentSkill = studentSkillMap.get(skillNameLower);

    if (matchedStudentSkill) {
      const studentScore = getLevelScore(matchedStudentSkill.level);

      if (studentScore >= reqScore) {
        // Strong skill (student meets or exceeds requirement)
        earnedScore += reqScore * weight;
        categoryStats[category].earned += reqScore * weight;
        strongSkills.push({
          name: reqSkill.name,
          currentLevel: matchedStudentSkill.level,
          requiredLevel: reqLevel,
          category,
          status: 'Mastered / Strong',
          matchPercentage: 100,
        });
      } else {
        // Skill to improve (student knows it but below target level)
        const partialScore = studentScore * weight;
        earnedScore += partialScore;
        categoryStats[category].earned += partialScore;

        const matchPct = Math.round((studentScore / reqScore) * 100);
        skillsToImprove.push({
          name: reqSkill.name,
          currentLevel: matchedStudentSkill.level,
          requiredLevel: reqLevel,
          category,
          status: 'Needs Improvement',
          gap: `${matchedStudentSkill.level} → ${reqLevel}`,
          matchPercentage: matchPct,
        });

        recommendedActions.push({
          skill: reqSkill.name,
          currentLevel: matchedStudentSkill.level,
          requiredLevel: reqLevel,
          gap: 'Moderate Level Gap',
          priority: reqSkill.importance === 'Must-have' ? 'High' : 'Medium',
          action: `Upgrade from ${matchedStudentSkill.level} to ${reqLevel} by completing intermediate-to-advanced project milestones and coding assessments in ${reqSkill.name}.`,
          recommendedCategory: category,
        });
      }
    } else {
      // Missing skill (not in student profile)
      missingSkills.push({
        name: reqSkill.name,
        currentLevel: 'Not Acquired',
        requiredLevel: reqLevel,
        category,
        importance: reqSkill.importance || 'Must-have',
        status: 'Missing',
        matchPercentage: 0,
      });

      recommendedActions.push({
        skill: reqSkill.name,
        currentLevel: 'Not Acquired',
        requiredLevel: reqLevel,
        gap: reqSkill.importance === 'Must-have' ? 'Critical Role Gap' : 'Required Skill Gap',
        priority: reqSkill.importance === 'Must-have' ? 'High' : 'Medium',
        action: `Learn fundamentals of ${reqSkill.name} up to ${reqLevel} proficiency. Focus on core syntax, architectural patterns, and practical hands-on exercises.`,
        recommendedCategory: category,
      });
    }
  });

  // Calculate preferred skills bonus (up to 5% bonus if student holds preferred skills)
  if (targetRole.preferredSkills && targetRole.preferredSkills.length > 0) {
    let matchedPreferred = 0;
    targetRole.preferredSkills.forEach((pref) => {
      if (studentSkillMap.has(pref.trim().toLowerCase())) {
        matchedPreferred++;
      }
    });
    // Add bonus up to 5 points
    const bonus = Math.round((matchedPreferred / targetRole.preferredSkills.length) * 5);
    earnedScore += (bonus / 100) * totalMaxScore;
  }

  const overallMatch = totalMaxScore > 0 ? Math.min(100, Math.round((earnedScore / totalMaxScore) * 100)) : 0;

  // Compute category breakdown percentages
  const categoryBreakdown = {};
  Object.keys(categoryStats).forEach((cat) => {
    const item = categoryStats[cat];
    categoryBreakdown[cat] = item.total > 0 ? Math.round((item.earned / item.total) * 100) : 0;
  });

  return {
    targetRoleTitle: targetRole.title,
    overallMatch,
    strongSkills,
    skillsToImprove,
    missingSkills,
    recommendedActions,
    categoryBreakdown,
    totalRequiredSkills: targetRole.requiredSkills.length,
    strongCount: strongSkills.length,
    improveCount: skillsToImprove.length,
    missingCount: missingSkills.length,
  };
}

module.exports = { analyzeSkillGap };
