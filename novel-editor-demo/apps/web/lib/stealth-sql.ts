// lib/stealth-sql.ts
/**
 * 🎩 Stealth SQL Query System
 * 
 * Automatically injects @agent and database name into user queries
 * Client just types natural language, we handle the technical bits
 */

export interface StealthQueryConfig {
  workspaceSlug: string;
  databaseName: string;
  userQuery: string;
}

export function enhanceQueryForSQL(config: StealthQueryConfig): string {
  const { workspaceSlug, databaseName, userQuery } = config;
  
  // Check if query is already enhanced (avoid double injection)
  if (userQuery.includes('@agent') && userQuery.includes(databaseName)) {
    return userQuery;
  }
  
  // Stealth enhancement - inject @agent and database name seamlessly
  const enhancedQuery = `@agent ${userQuery} in ${databaseName}`;
  
  console.log('🔍 [Stealth SQL] Original query:', userQuery);
  console.log('🎩 [Stealth SQL] Enhanced query:', enhancedQuery);
  
  return enhancedQuery;
}

export function createAnalyticsQuery(userQuestion: string): string {
  return enhanceQueryForSQL({
    workspaceSlug: 'analytics',
    databaseName: 'socialgarden_sow',
    userQuery: userQuestion
  });
}

// Elegant query templates for common questions
export const ELEGANT_QUERIES = {
  totalSOWs: "How many documents are currently in our system?",
  averageValue: "What is the average investment across all our proposals?",
  recentActivity: "Show me the most recent documents created this week",
  topClients: "Which clients have the highest total investment?",
  monthlyTrend: "What is our monthly SOW creation trend?",
  acceptanceRate: "What percentage of SOWs have been accepted?",
  pipelineValue: "What is the total value of all pending proposals?"
};

// For client portal - even more subtle
export function createClientQuery(clientName: string, question: string): string {
  // Find their workspace
  const workspaceSlug = `client-${clientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  
  // Enhance query but make it about THEIR data only
  return `@agent ${question} for ${clientName} in ${workspaceSlug}`;
}
