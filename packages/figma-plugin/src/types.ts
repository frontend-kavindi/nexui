/**
 * DECISION LOG: Why Variables API over Styles API
 * 
 * DECISION: Using Figma Variables API instead of Styles API
 * 
 * REASONING:
 * 1. Variables API is the modern, future-proof approach for design tokens
 * 2. Variables support semantic naming and collections (better organization)
 * 3. Variables can be referenced across properties (consistent theming)
 * 4. Variables support modes (light/dark themes) out of the box
 * 5. Variables API provides better programmatic control and querying
 * 6. Styles API is legacy and being phased out for token management
 * 7. Variables support numeric values for spacing/sizing (more precise)
 * 8. Better integration with modern design systems and component libraries
 * 
 * ALTERNATIVES CONSIDERED:
 * - Styles API: Legacy, limited to visual properties, no semantic organization
 * - Manual token sync: Error-prone, time-consuming, no automation
 * 
 * IMPLEMENTATION NOTES:
 * - Variable Collections for organization (Colors, Spacing, Typography)
 * - Variable Modes for theme support (light, dark)
 * - Proper error handling for token validation
 * - Diff UI for preview before applying changes
 */

// Token types from NexUI design system
export interface ColorToken {
  type: 'color';
  value: string;
  description?: string;
}

export interface SpacingToken {
  type: 'spacing';
  value: number;
  unit: 'px' | 'rem';
  description?: string;
}

export interface TypographyToken {
  type: 'typography';
  value: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing?: number;
  };
  description?: string;
}

export type DesignToken = ColorToken | SpacingToken | TypographyToken;

export interface TokenCollection {
  colors: Record<string, ColorToken>;
  spacing: Record<string, SpacingToken>;
  typography: Record<string, TypographyToken>;
}

export interface TokenDiff {
  type: 'added' | 'modified' | 'removed';
  collection: 'colors' | 'spacing' | 'typography';
  name: string;
  oldValue?: any;
  newValue?: any;
}

export interface PluginState {
  githubToken?: string;
  tokensUrl?: string;
  lastSync?: string;
}

// Figma Variable types
export interface VariableCollection {
  id: string;
  name: string;
  variableIds: string[];
  modes: Array<{
    name: string;
    modeId: string;
  }>;
}

export interface Variable {
  id: string;
  name: string;
  variableCollectionId: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING';
  valuesByMode: Record<string, any>;
}

// Message types for UI communication
export interface UIMessage {
  type: 'FETCH_TOKENS' | 'SYNC_TOKENS' | 'SHOW_DIFF' | 'ERROR' | 'SUCCESS' | 'SAVE_TOKEN' | 'GET_STATE' | 'STATE_LOADED' | 'TOKEN_SAVED' | 'TOKENS_FETCHED' | 'DIFF_CALCULATED' | 'SYNC_COMPLETE' | 'SYNC_ERROR' | 'APPLY_CHANGES';
  payload?: any;
}

export interface TokenResponse {
  tokens: TokenCollection;
  timestamp: string;
}

export interface SyncResult {
  success: boolean;
  diff: TokenDiff[];
  errors: string[];
  collectionsCreated: string[];
  variablesCreated: number;
  variablesUpdated: number;
}
