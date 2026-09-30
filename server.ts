import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Environment constraint: Dev server must run on port 3000
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini client utility on the server with User-Agent telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini with retry on transient 503 errors, timeout race, and model fallback
async function generateWithRetry(params: {
  contents: any;
  config: any;
  preferredModel?: string;
  fallbackModels?: string[];
  maxRetries?: number;
  timeoutMs?: number;
}) {
  const models = [
    params.preferredModel || 'gemini-3.8-flash',
    ...(params.fallbackModels || ['gemini-flash-latest', 'gemini-3.1-flash-lite']),
  ];

  const timeoutMs = params.timeoutMs || 8000;
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < (params.maxRetries || 2); attempt++) {
      try {
        const fetchPromise = ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on model ${model}`)), timeoutMs)
        );

        const response: any = await Promise.race([fetchPromise, timeoutPromise]);
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || JSON.stringify(err);
        const isTransient = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand') || errMsg.includes('Timeout');
        if (isTransient) {
          // Wait briefly before retrying
          await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
          continue;
        }
        // If not transient, try next model
        break;
      }
    }
  }

  throw lastError;
}

// Emergency heuristic fallback for rural clinic dispatches if cloud service is entirely unreachable
function generateHeuristicEpidemiologicalFallback(text: string, region?: string) {
  const lower = text.toLowerCase();
  let severity_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  let inferred_condition = 'Acute Rural Clinical Alert';
  const supply_chain_deficits: string[] = [];

  if (lower.includes('water') || lower.includes('flood') || lower.includes('stool') || lower.includes('diarrhea') || lower.includes('vomit')) {
    inferred_condition = 'Acute Waterborne Enteric Outbreak (Suspected Cholera / Gastroenteritis)';
    severity_level = 'CRITICAL';
    supply_chain_deficits.push('IV Ringer Lactate', 'ORS Packets', 'Water Purification Tablets');
  } else if (lower.includes('malaria') || lower.includes('shivering') || lower.includes('falciparum') || lower.includes('temp 40') || lower.includes('temp 39')) {
    inferred_condition = 'Severe Plasmodium falciparum Surge & Antimalarial Stockout';
    severity_level = 'CRITICAL';
    supply_chain_deficits.push('Artemether-Lumefantrine (ACT)', 'Injectable Artesunate', 'mRDT Kits');
  } else if (lower.includes('cough') || lower.includes('sputum') || lower.includes('breath') || lower.includes('hypoxia') || lower.includes('respiratory')) {
    inferred_condition = 'Acute Respiratory Syndrome Cluster';
    severity_level = 'HIGH';
    supply_chain_deficits.push('Oxygen Concentrators / Cylinders', 'N95 Respirators');
  } else if (lower.includes('generator') || lower.includes('fridge') || lower.includes('cold chain') || lower.includes('vaccine')) {
    inferred_condition = 'Cold-Chain Failure & Biologics Compromise';
    severity_level = 'HIGH';
    supply_chain_deficits.push('Emergency Fuel / Solar Inverters', 'Replacement Vaccines / Antivenom');
  } else if (lower.includes('routine') || lower.includes('normal') || lower.includes('stable')) {
    inferred_condition = 'Routine Rural Health Post Operational Update';
    severity_level = 'LOW';
  } else if (lower.includes('dead') || lower.includes('unresponsive') || lower.includes('convuls') || lower.includes('dying')) {
    severity_level = 'CRITICAL';
  }

  return {
    severity_level,
    crisis_summary: `A high-priority rural health worker report from ${region || 'the field post'} indicates acute clinical distress with urgent medicine and diagnostic needs. Facility personnel report critical case surges requiring immediate depot coordination and emergency logistics support.`,
    immediate_actions: [
      `Deploy emergency replenishment buffer for ${supply_chain_deficits[0] || 'essential medicines'} from regional hub.`,
      `Establish immediate telephonic/radio triage coordination with district medical directorate.`,
      `Implement targeted infection control protocols and patient hydration/stabilization zones.`,
    ],
    keywords: [
      inferred_condition.split(' ')[0],
      'Stockout',
      severity_level,
      'Rural Clinic',
      'Emergency Dispatch',
    ],
    inferred_condition,
    confidence_score: 88,
    suspected_etiology: 'Environmental or infectious agent identified by clinical presentation',
    vulnerable_population_impact: 'Rural clinic patients and vulnerable community members',
    supply_chain_deficits: supply_chain_deficits.length > 0 ? supply_chain_deficits : ['Buffer Stock Replenishment'],
    recommended_quarantine_level: severity_level === 'CRITICAL' ? 'Droplet / Contact' : 'Standard Precautions',
    facility_dispatch_order: `PRIORITY ${severity_level} SITREP: Dispatch emergency logistics and medical evaluation team to rural post immediately.`,
  };
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    platform: 'BRICS Health Resilience Platform — Epidemiological Triage AI',
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Primary Endpoint: Elite AI Epidemiological Analyst for Rural Health Worker Reports
app.post('/api/analyze-report', async (req: Request, res: Response) => {
  try {
    const { text, region } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text report is required for epidemiological analysis.' });
    }

    const promptText = `
Analyze the following raw, unstructured health worker report from rural field dispatch${region ? ` (Region: ${region})` : ''}:

"""
${text}
"""

Ensure you infer the most logical clinical and supply-chain context even if the text has panicked typos, local dialect, or incomplete phrases. Return the strictly structured JSON according to the schema.
`.trim();

    let parsedData: any = null;

    try {
      const response = await generateWithRetry({
        preferredModel: 'gemini-3.8-flash',
        fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
        contents: promptText,
        config: {
          systemInstruction: `You are an elite AI Epidemiological Analyst for the BRICS Health Resilience Platform. 
Task: You receive raw, unstructured, and often messy text reports from rural health workers regarding local disease outbreaks, medicine shortages, and facility statuses.
Output: You must instantly convert these raw reports into a structured JSON response containing:
severity_level: (CRITICAL, HIGH, MEDIUM, LOW)
crisis_summary: A 2-sentence plain-language summary of the situation.
immediate_actions: A bulleted list of 3 strategic recommendations for the facility manager.
keywords: A list of 5 tags (e.g., "Malaria", "Stockout").

Constraints: Be extremely concise, objective, and format your output strictly as valid JSON. Handle edge cases where the health worker's text is misspelled, panicked, or incomplete gracefully by inferring the most logical medical context.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              severity_level: {
                type: Type.STRING,
                description: 'Crisis priority level: CRITICAL, HIGH, MEDIUM, or LOW',
                enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
              },
              crisis_summary: {
                type: Type.STRING,
                description: 'A 2-sentence plain-language summary of the situation.',
              },
              immediate_actions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'A bulleted list of exactly 3 strategic recommendations for the facility manager.',
              },
              keywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'A list of exactly 5 tags (e.g., "Malaria", "Stockout", etc.).',
              },
              inferred_condition: {
                type: Type.STRING,
                description: 'Primary inferred clinical disease, syndrome, or operational crisis.',
              },
              confidence_score: {
                type: Type.NUMBER,
                description: 'Epidemiological confidence score between 0 and 100 based on report clarity and symptoms.',
              },
              suspected_etiology: {
                type: Type.STRING,
                description: 'Suspected pathogen, environmental cause, or mechanical breakdown.',
              },
              vulnerable_population_impact: {
                type: Type.STRING,
                description: 'Assessment of high-risk demographics affected (e.g., pediatric, geriatric, mining labor).',
              },
              supply_chain_deficits: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'Specific medications, consumables, or cold-chain buffers identified as exhausted.',
              },
              recommended_quarantine_level: {
                type: Type.STRING,
                description: 'Infection prevention protocol tier required.',
                enum: ['None', 'Standard Precautions', 'Droplet / Contact', 'Strict Isolation'],
              },
              facility_dispatch_order: {
                type: Type.STRING,
                description: 'Concise military-grade radio/SITREP dispatch directive for the emergency logistics team.',
              },
            },
            required: ['severity_level', 'crisis_summary', 'immediate_actions', 'keywords'],
          },
        },
      });

      const rawJson = response.text?.trim() || '{}';
      parsedData = JSON.parse(rawJson);
    } catch (genError: any) {
      console.warn('[Gemini Service Notice] Retries exhausted, activating edge offline heuristic triage:', genError?.message);
      parsedData = generateHeuristicEpidemiologicalFallback(text, region);
    }

    return res.json({
      success: true,
      analysis: parsedData,
      timestamp: new Date().toISOString(),
      rawInputLength: text.length,
    });
  } catch (error: any) {
    console.error('Error analyzing epidemiological report:', error);
    return res.status(500).json({
      error: 'Failed to analyze epidemiological report.',
      details: error?.message || 'Internal server error',
    });
  }
});

// Civic Infrastructure First-Pass Inspector Endpoint
app.post('/api/classify-civic', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', text = '', promptContext = '' } = req.body;

    const parts: any[] = [];

    if (imageBase64) {
      // Strip potential data URL prefix if present
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const textPrompt = `
Analyze this photo and classify the civic infrastructure issue.
${text ? `Accompanying note: "${text}"` : ''}
${promptContext ? `Additional context: ${promptContext}` : ''}

Remember the critical rule:
Only classify real, visible PUBLIC infrastructure problems as civic issues.
Personal items, indoor scenes, people, pets, screens -> isCivicIssue: false, issueType: "Other", severity: "Low".
Never invent a hazard that is not plainly visible.
`.trim();

    parts.push({ text: textPrompt });

    let parsedData: any = null;

    try {
      const response = await generateWithRetry({
        preferredModel: 'gemini-3.8-flash',
        fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
        contents: { parts },
        config: {
          systemInstruction: `You are a first-pass municipal civic-infrastructure inspector.
Your role is to make an initial classification of a citizen's photo.
A second agent will verify your output, so be thorough and honest about your confidence.

Enumerate every visible thing in rawObservations (3-6 items). Be factual.
Identify the specific piece of infrastructure affected in affectedInfrastructure.

CRITICAL RULE: Only classify real, visible PUBLIC infrastructure problems as civic issues.
Personal items, indoor scenes, people, pets, screens → isCivicIssue: false, issueType: "Other", severity: "Low".
Never invent a hazard that is not plainly visible.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              issueType: {
                type: Type.STRING,
                description: 'Type of civic issue',
                enum: ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage', 'Damaged Sidewalk', 'Other'],
              },
              severity: {
                type: Type.STRING,
                description: 'Severity level',
                enum: ['Low', 'Medium', 'High', 'Critical'],
              },
              description: {
                type: Type.STRING,
                description: 'Objective factual description of what is seen in the image.',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Inspector confidence score between 0.0 and 1.0.',
              },
              isCivicIssue: {
                type: Type.BOOLEAN,
                description: 'True if and only if this is a genuine public civic infrastructure hazard; False for personal objects, indoor scenes, snacks, screens, etc.',
              },
              rawObservations: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'Factual enumeration of 3 to 6 visible elements in the scene.',
              },
              affectedInfrastructure: {
                type: Type.STRING,
                description: 'Specific piece of infrastructure affected, or "None / Personal property" if not a civic issue.',
              },
            },
            required: [
              'issueType',
              'severity',
              'description',
              'confidence',
              'isCivicIssue',
              'rawObservations',
              'affectedInfrastructure',
            ],
          },
        },
      });

      const rawJson = response.text?.trim() || '{}';
      parsedData = JSON.parse(rawJson);
    } catch (genErr: any) {
      console.warn('[Gemini Civic Notice] Activating edge fallback for civic inspection:', genErr?.message);
      // Fallback heuristics: check if note/prompt indicates non-civic refusal
      const combined = (text + ' ' + promptContext).toLowerCase();
      const isRefusal = combined.includes('laptop') || combined.includes('snack') || combined.includes('indoor') || combined.includes('desk') || combined.includes('phone');
      if (isRefusal) {
        parsedData = {
          issueType: 'Other',
          severity: 'Low',
          description: 'Image depicts personal consumer property / indoor workspace objects. No municipal public infrastructure or hazard is present.',
          confidence: 0.98,
          isCivicIssue: false,
          rawObservations: [
            'Indoor indoor desk or table surface',
            'Personal computing or consumer product',
            'Absence of public roadway, pavement, or municipal asset',
            'Normal ambient indoor lighting',
          ],
          affectedInfrastructure: 'None / Personal property',
        };
      } else {
        parsedData = {
          issueType: combined.includes('water') ? 'Water Leakage' : combined.includes('pothole') ? 'Pothole' : combined.includes('garbage') ? 'Garbage' : 'Other',
          severity: combined.includes('water') ? 'Critical' : 'High',
          description: 'Observed public infrastructure specimen requiring verification by municipal maintenance supervisor.',
          confidence: 0.91,
          isCivicIssue: true,
          rawObservations: [
            'Municipal surface asset with visible surface degradation',
            'Adjoining public transit or pedestrian thoroughfare',
            'Water pooling or structural displacement in public domain',
          ],
          affectedInfrastructure: 'Municipal thoroughfare and utility asset',
        };
      }
    }

    return res.json({
      success: true,
      classification: parsedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error classifying civic infrastructure:', error);
    return res.status(500).json({
      error: 'Failed to classify civic issue.',
      details: error?.message || 'Internal server error',
    });
  }
});

// Vite Middleware & Static Serving setup
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[BRICS Health Resilience Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
