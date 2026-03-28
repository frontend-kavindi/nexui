/**
 * Main plugin code for NexUI Sync Figma Plugin
 * Handles communication between UI and Figma API
 */

import { 
  TokenCollection, 
  TokenDiff, 
  UIMessage, 
  TokenResponse, 
  SyncResult,
  PluginState,
  ColorToken,
  SpacingToken,
  TypographyToken
} from './types';

// Plugin state management
let pluginState: PluginState = {};

// Initialize plugin
figma.showUI(__html__, { width: 400, height: 600 });

// Load saved state
figma.clientStorage.getAsync('githubToken').then((githubToken) => {
  figma.clientStorage.getAsync('tokensUrl').then((tokensUrl) => {
    figma.clientStorage.getAsync('lastSync').then((lastSync) => {
      pluginState = { githubToken, tokensUrl, lastSync };
      figma.ui.postMessage({ type: 'STATE_LOADED', payload: pluginState });
    });
  });
});

// Handle messages from UI
figma.ui.onmessage = async (msg: UIMessage) => {
  try {
    switch (msg.type) {
      case 'FETCH_TOKENS':
        await fetchTokens(msg.payload);
        break;
      case 'SYNC_TOKENS':
        await syncTokens(msg.payload);
        break;
      case 'APPLY_CHANGES':
        await applyTokenChanges(msg.payload.diff, msg.payload.tokens);
        break;
      case 'SAVE_TOKEN':
        await saveToken(msg.payload.key, msg.payload.value);
        break;
      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    figma.ui.postMessage({ type: 'ERROR', payload: errorMessage });
  }
};

/**
 * Fetch design tokens from GitHub
 */
async function fetchTokens(tokensUrl: string): Promise<void> {
  if (!pluginState.githubToken) {
    throw new Error('GitHub token not configured');
  }

  try {
    const response = await fetch(tokensUrl, {
      headers: {
        'Authorization': `token ${pluginState.githubToken}`,
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }

    const tokens: TokenCollection = await response.json();
    
    // Validate token structure
    validateTokens(tokens);
    
    const tokenResponse: TokenResponse = {
      tokens,
      timestamp: new Date().toISOString(),
    };

    figma.ui.postMessage({ 
      type: 'TOKENS_FETCHED', 
      payload: tokenResponse 
    });
  } catch (error) {
    throw new Error(`Failed to fetch tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate token structure
 */
function validateTokens(tokens: TokenCollection): void {
  if (!tokens || typeof tokens !== 'object') {
    throw new Error('Invalid token structure: must be an object');
  }

  if (!tokens.colors || typeof tokens.colors !== 'object') {
    throw new Error('Invalid token structure: missing colors object');
  }

  if (!tokens.spacing || typeof tokens.spacing !== 'object') {
    throw new Error('Invalid token structure: missing spacing object');
  }

  if (!tokens.typography || typeof tokens.typography !== 'object') {
    throw new Error('Invalid token structure: missing typography object');
  }

  // Validate color tokens
  for (const [name, token] of Object.entries(tokens.colors)) {
    if (token.type !== 'color' || typeof token.value !== 'string') {
      throw new Error(`Invalid color token "${name}": must have type "color" and string value`);
    }
  }

  // Validate spacing tokens
  for (const [name, token] of Object.entries(tokens.spacing)) {
    if (token.type !== 'spacing' || typeof token.value !== 'number') {
      throw new Error(`Invalid spacing token "${name}": must have type "spacing" and number value`);
    }
  }

  // Validate typography tokens
  for (const [name, token] of Object.entries(tokens.typography)) {
    if (token.type !== 'typography' || !token.value || typeof token.value !== 'object') {
      throw new Error(`Invalid typography token "${name}": must have type "typography" and object value`);
    }

    const value = token.value;
    if (!value.fontFamily || !value.fontSize || !value.fontWeight || !value.lineHeight) {
      throw new Error(`Invalid typography token "${name}": missing required properties`);
    }
  }
}

/**
 * Calculate diff between existing and new tokens
 */
function calculateTokenDiff(existingTokens: TokenCollection, newTokens: TokenCollection): TokenDiff[] {
  const diff: TokenDiff[] = [];

  // Helper function to check token differences
  const checkTokenDifferences = (
    collectionName: 'colors' | 'spacing' | 'typography',
    existing: Record<string, any>,
    updated: Record<string, any>
  ) => {
    const allKeys = new Set([...Object.keys(existing), ...Object.keys(updated)]);
    
    for (const key of allKeys) {
      const exists = existing[key];
      const updatedToken = updated[key];

      if (!exists && updatedToken) {
        // Token added
        diff.push({
          type: 'added',
          collection: collectionName,
          name: key,
          newValue: updatedToken,
        });
      } else if (exists && !updatedToken) {
        // Token removed
        diff.push({
          type: 'removed',
          collection: collectionName,
          name: key,
          oldValue: exists,
        });
      } else if (exists && updatedToken && JSON.stringify(exists) !== JSON.stringify(updatedToken)) {
        // Token modified
        diff.push({
          type: 'modified',
          collection: collectionName,
          name: key,
          oldValue: exists,
          newValue: updatedToken,
        });
      }
    }
  };

  checkTokenDifferences('colors', existingTokens.colors, newTokens.colors);
  checkTokenDifferences('spacing', existingTokens.spacing, newTokens.spacing);
  checkTokenDifferences('typography', existingTokens.typography, newTokens.typography);

  return diff;
}

/**
 * Sync tokens to Figma Variables
 */
async function syncTokens(tokens: TokenCollection): Promise<void> {
  const result: SyncResult = {
    success: false,
    diff: [],
    errors: [],
    collectionsCreated: [],
    variablesCreated: 0,
    variablesUpdated: 0,
  };

  try {
    // Get existing tokens from Figma
    const existingTokens = await getExistingTokens();
    
    // Calculate diff
    result.diff = calculateTokenDiff(existingTokens, tokens);
    
    // Send diff to UI for confirmation
    figma.ui.postMessage({ type: 'DIFF_CALCULATED', payload: result.diff });
    
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    figma.ui.postMessage({ type: 'SYNC_ERROR', payload: result });
  }
}

/**
 * Apply token changes to Figma
 */
async function applyTokenChanges(diff: TokenDiff[], tokens: TokenCollection): Promise<void> {
  const result: SyncResult = {
    success: false,
    diff,
    errors: [],
    collectionsCreated: [],
    variablesCreated: 0,
    variablesUpdated: 0,
  };

  try {
    // Create or get collections
    const colorCollection = await getOrCreateCollection('NexUI Colors');
    const spacingCollection = await getOrCreateCollection('NexUI Spacing');
    const typographyCollection = await getOrCreateCollection('NexUI Typography');
    
    result.collectionsCreated = [colorCollection.name, spacingCollection.name, typographyCollection.name];

    // Process each diff item
    for (const item of diff) {
      try {
        switch (item.collection) {
          case 'colors':
            await processColorToken(item, tokens.colors[item.name], colorCollection);
            break;
          case 'spacing':
            await processSpacingToken(item, tokens.spacing[item.name], spacingCollection);
            break;
          case 'typography':
            await processTypographyToken(item, tokens.typography[item.name], typographyCollection);
            break;
        }
        
        if (item.type === 'added') {
          result.variablesCreated++;
        } else if (item.type === 'modified') {
          result.variablesUpdated++;
        }
      } catch (error) {
        result.errors.push(`Failed to process ${item.collection}.${item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    result.success = result.errors.length === 0;
    
    // Update last sync time
    pluginState.lastSync = new Date().toISOString();
    await figma.clientStorage.setAsync('lastSync', pluginState.lastSync);
    
    figma.ui.postMessage({ type: 'SYNC_COMPLETE', payload: result });
    
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    figma.ui.postMessage({ type: 'SYNC_ERROR', payload: result });
  }
}

/**
 * Get or create variable collection
 */
async function getOrCreateCollection(name: string): Promise<VariableCollection> {
  let collection = figma.variables.getLocalVariableCollections().find(c => c.name === name);
  
  if (!collection) {
    collection = figma.variables.createVariableCollection(name);
  }
  
  return collection;
}

/**
 * Process color token
 */
async function processColorToken(
  diff: TokenDiff, 
  token: ColorToken, 
  collection: VariableCollection
): Promise<void> {
  const variables = figma.variables.getLocalVariables();
  let variable = variables.find(v => 
    v.name === diff.name && v.variableCollectionId === collection.id
  );
  
  if (!variable) {
    variable = figma.variables.createVariable(diff.name, collection.id, 'COLOR');
  }
  
  // Convert hex color to Figma color format
  const color = hexToFigmaColor(token.value);
  
  // Set value for all modes
  for (const mode of collection.modes) {
    variable.setValueForMode(mode.modeId, color);
  }
}

/**
 * Process spacing token
 */
async function processSpacingToken(
  diff: TokenDiff, 
  token: SpacingToken, 
  collection: VariableCollection
): Promise<void> {
  const variables = figma.variables.getLocalVariables();
  let variable = variables.find(v => 
    v.name === diff.name && v.variableCollectionId === collection.id
  );
  
  if (!variable) {
    variable = figma.variables.createVariable(diff.name, collection.id, 'FLOAT');
  }
  
  // Convert to pixels (Figma uses pixels internally)
  const value = token.unit === 'rem' ? token.value * 16 : token.value;
  
  // Set value for all modes
  for (const mode of collection.modes) {
    variable.setValueForMode(mode.modeId, value);
  }
}

/**
 * Process typography token
 */
async function processTypographyToken(
  diff: TokenDiff, 
  token: TypographyToken, 
  collection: VariableCollection
): Promise<void> {
  const variables = figma.variables.getLocalVariables();
  let variable = variables.find(v => 
    v.name === diff.name && v.variableCollectionId === collection.id
  );
  
  if (!variable) {
    variable = figma.variables.createVariable(diff.name, collection.id, 'STRING');
  }
  
  // Create typography string representation
  const typographyString = `${token.value.fontFamily} ${token.value.fontWeight} ${token.value.fontSize}px/${token.value.lineHeight}`;
  
  // Set value for all modes
  for (const mode of collection.modes) {
    variable.setValueForMode(mode.modeId, typographyString);
  }
}

/**
 * Convert hex color to Figma color format
 */
function hexToFigmaColor(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Get existing tokens from Figma Variables
 */
async function getExistingTokens(): Promise<TokenCollection> {
  const collections = figma.variables.getLocalVariableCollections();
  
  const tokens: TokenCollection = {
    colors: {},
    spacing: {},
    typography: {},
  };

  for (const collection of collections) {
    const variables = figma.variables.getLocalVariables();
    const collectionVariables = variables.filter(v => v.variableCollectionId === collection.id);
    
    for (const variable of collectionVariables) {
      const values = variable.valuesByMode;
      const firstValue = Object.values(values)[0];
      
      if (collection.name === 'NexUI Colors' && variable.resolvedType === 'COLOR') {
        tokens.colors[variable.name] = {
          type: 'color',
          value: figmaColorToHex(firstValue as { r: number; g: number; b: number }),
        };
      } else if (collection.name === 'NexUI Spacing' && variable.resolvedType === 'FLOAT') {
        tokens.spacing[variable.name] = {
          type: 'spacing',
          value: firstValue as number,
          unit: 'px',
        };
      } else if (collection.name === 'NexUI Typography' && variable.resolvedType === 'STRING') {
        // Parse typography string back to object
        tokens.typography[variable.name] = {
          type: 'typography',
          value: parseTypographyString(firstValue as string),
        };
      }
    }
  }

  return tokens;
}

/**
 * Convert Figma color to hex
 */
function figmaColorToHex(color: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Parse typography string back to object
 */
function parseTypographyString(str: string): TypographyToken['value'] {
  const parts = str.split(' ');
  const fontSize = parts.find(p => p.includes('px'))?.replace('px', '') || '16';
  const lineHeight = parts.find(p => p.includes('/'))?.replace('/', '') || '1.5';
  const fontWeight = parts.find(p => /^\d+$/.test(p)) || '400';
  const fontFamily = parts.filter(p => !p.includes('px') && !p.includes('/') && !/^\d+$/.test(p)).join(' ');
  
  return {
    fontFamily: fontFamily || 'Inter',
    fontSize: parseInt(fontSize),
    fontWeight: parseInt(fontWeight),
    lineHeight: parseFloat(lineHeight),
  };
}

/**
 * Save token to client storage
 */
async function saveToken(key: string, value: string): Promise<void> {
  (pluginState as any)[key] = value;
  await figma.clientStorage.setAsync(key, value);
  figma.ui.postMessage({ type: 'TOKEN_SAVED', payload: { key, value } });
}
