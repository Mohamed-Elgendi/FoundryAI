/**
 * LAYER 6: EXPANSION & PLUGIN ARCHITECTURE
 * ========================================
 * Extensible plugin system for future growth
 * Modular architecture that allows adding new features without core changes
 */

import { safeLogError } from '@/lib/utils/logger';
import { globalEventBus } from './logic-layer';

// ==========================================
// PLUGIN INTERFACES
// ==========================================

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  permissions: PluginPermission[];
}

export type PluginPermission = 
  | 'storage:read'
  | 'storage:write'
  | 'api:ai'
  | 'api:external'
  | 'ui:component'
  | 'ui:theme'
  | 'event:listen'
  | 'event:emit';

export interface PluginContext {
  eventBus: typeof globalEventBus;
  storage: {
    get: <T>(key: string) => Promise<T | null>;
    set: <T>(key: string, value: T) => Promise<boolean>;
  };
  api: {
    generate: (prompt: string) => Promise<unknown>;
  };
  ui: {
    registerComponent: (slot: string, component: unknown) => void;
    registerTheme: (theme: ThemeDefinition) => void;
  };
}

export interface ThemeDefinition {
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

export interface Plugin {
  metadata: PluginMetadata;
  initialize: (context: PluginContext) => Promise<void>;
  destroy?: () => Promise<void>;
  hooks?: {
    [key: string]: (...args: unknown[]) => unknown | Promise<unknown>;
  };
}

// ==========================================
// PLUGIN REGISTRY
// ==========================================

export class PluginRegistry {
  private plugins = new Map<string, Plugin>();
  private hooks = new Map<string, Set<(...args: unknown[]) => unknown | Promise<unknown>>>();
  private components = new Map<string, unknown[]>();
  private themes = new Map<string, ThemeDefinition>();

  /**
   * Register a plugin
   */
  async register(plugin: Plugin, context: PluginContext): Promise<boolean> {
    try {
      // Check dependencies
      for (const dep of plugin.metadata.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Missing dependency: ${dep}`);
        }
      }

      // Initialize plugin
      await plugin.initialize(context);
      
      // Store plugin
      this.plugins.set(plugin.metadata.id, plugin);

      // Register hooks
      if (plugin.hooks) {
        for (const [hookName, handler] of Object.entries(plugin.hooks)) {
          this.registerHook(hookName, handler);
        }
      }

      globalEventBus.emit('plugin:registered', { 
        pluginId: plugin.metadata.id,
        timestamp: Date.now(),
      });

      console.log(`[PluginRegistry] Registered: ${plugin.metadata.name} v${plugin.metadata.version}`);
      return true;
    } catch (error) {
      safeLogError(error, { 
        operation: 'pluginRegister', 
        pluginId: plugin.metadata.id 
      });
      return false;
    }
  }

  /**
   * Unregister a plugin
   */
  async unregister(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    try {
      // Call destroy if available
      if (plugin.destroy) {
        await plugin.destroy();
      }

      // Remove hooks
      if (plugin.hooks) {
        for (const hookName of Object.keys(plugin.hooks)) {
          this.hooks.delete(hookName);
        }
      }

      // Remove plugin
      this.plugins.delete(pluginId);

      globalEventBus.emit('plugin:unregistered', { 
        pluginId,
        timestamp: Date.now(),
      });

      return true;
    } catch (error) {
      safeLogError(error, { operation: 'pluginUnregister', pluginId });
      return false;
    }
  }

  /**
   * Register a hook
   */
  registerHook(
    name: string,
    handler: (...args: unknown[]) => unknown | Promise<unknown>
  ): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, new Set());
    }
    this.hooks.get(name)!.add(handler);
  }

  /**
   * Execute hooks
   */
  async executeHooks(name: string, ...args: unknown[]): Promise<unknown[]> {
    const handlers = this.hooks.get(name);
    if (!handlers) return [];

    const results: unknown[] = [];
    for (const handler of handlers) {
      try {
        const result = await handler(...args);
        results.push(result);
      } catch (error) {
        safeLogError(error, { operation: 'executeHook', hookName: name });
      }
    }
    return results;
  }

  /**
   * Register UI component
   */
  registerComponent(slot: string, component: unknown): void {
    if (!this.components.has(slot)) {
      this.components.set(slot, []);
    }
    this.components.get(slot)!.push(component);
  }

  /**
   * Get components for a slot
   */
  getComponents(slot: string): unknown[] {
    return [...(this.components.get(slot) || [])];
  }

  /**
   * Register theme
   */
  registerTheme(theme: ThemeDefinition): void {
    this.themes.set(theme.name, theme);
  }

  /**
   * Get all registered themes
   */
  getThemes(): ThemeDefinition[] {
    return Array.from(this.themes.values());
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if plugin exists
   */
  has(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }
}

// ==========================================
// EXTENSION POINTS
// ==========================================

/**
 * Extension points allow plugins to hook into core functionality
 */
export const EXTENSION_POINTS = {
  // Pre-generation hooks
  'idea:beforeValidate': 'Called before idea validation',
  'idea:afterValidate': 'Called after idea validation',
  
  // Generation hooks
  'generation:before': 'Called before AI generation',
  'generation:after': 'Called after AI generation',
  'generation:error': 'Called on generation error',
  
  // UI hooks
  'ui:output:render': 'Custom output rendering',
  'ui:input:enhance': 'Input enhancement features',
  
  // Export hooks
  'export:before': 'Before exporting data',
  'export:after': 'After exporting data',
  
  // Theme hooks
  'theme:load': 'When theme is loaded',
  'theme:change': 'When theme changes',
} as const;

export type ExtensionPoint = keyof typeof EXTENSION_POINTS;

// ==========================================
// MODULE SYSTEM
// ==========================================

export interface Module {
  name: string;
  enabled: boolean;
  initialize: () => Promise<void>;
  destroy?: () => Promise<void>;
}

/**
 * Module Manager - Manages optional modules
 */
export class ModuleManager {
  private modules = new Map<string, Module>();
  private enabledModules = new Set<string>();

  /**
   * Register a module
   */
  register(module: Module): this {
    this.modules.set(module.name, module);
    
    if (module.enabled) {
      this.enabledModules.add(module.name);
    }
    
    return this;
  }

  /**
   * Enable a module
   */
  async enable(name: string): Promise<boolean> {
    const module = this.modules.get(name);
    if (!module) return false;

    try {
      await module.initialize();
      this.enabledModules.add(name);
      globalEventBus.emit('module:enabled', { module: name });
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'enableModule', module: name });
      return false;
    }
  }

  /**
   * Disable a module
   */
  async disable(name: string): Promise<boolean> {
    const module = this.modules.get(name);
    if (!module) return false;

    try {
      if (module.destroy) {
        await module.destroy();
      }
      this.enabledModules.delete(name);
      globalEventBus.emit('module:disabled', { module: name });
      return true;
    } catch (error) {
      safeLogError(error, { operation: 'disableModule', module: name });
      return false;
    }
  }

  /**
   * Check if module is enabled
   */
  isEnabled(name: string): boolean {
    return this.enabledModules.has(name);
  }

  /**
   * Get all modules
   */
  getModules(): Module[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get enabled modules
   */
  getEnabledModules(): string[] {
    return Array.from(this.enabledModules);
  }
}

// ==========================================
// ADAPTER PATTERN FOR EXTERNAL SERVICES
// ==========================================

export interface ServiceAdapter<T, R> {
  name: string;
  adapt: (data: T) => Promise<R>;
  validate: (data: unknown) => data is T;
}

/**
 * Adapter Registry - For external service integration
 */
export class AdapterRegistry {
  private adapters = new Map<string, ServiceAdapter<unknown, unknown>>();

  /**
   * Register an adapter
   */
  register<T, R>(adapter: ServiceAdapter<T, R>): void {
    this.adapters.set(adapter.name, adapter as ServiceAdapter<unknown, unknown>);
  }

  /**
   * Get adapter by name
   */
  get<T, R>(name: string): ServiceAdapter<T, R> | undefined {
    return this.adapters.get(name) as ServiceAdapter<T, R> | undefined;
  }

  /**
   * Adapt data using named adapter
   */
  async adapt<T, R>(name: string, data: T): Promise<R | null> {
    const adapter = this.get<T, R>(name);
    if (!adapter) return null;

    try {
      if (adapter.validate(data)) {
        return await adapter.adapt(data);
      }
    } catch (error) {
      safeLogError(error, { operation: 'adapterAdapt', adapterName: name });
    }
    
    return null;
  }
}

// ==========================================
// API VERSIONING
// ==========================================

export interface APIVersion {
  version: string;
  deprecated?: boolean;
  sunsetDate?: Date;
  handlers: Record<string, (req: unknown) => Promise<unknown>>;
}

/**
 * API Version Manager
 */
export class APIManager {
  private versions = new Map<string, APIVersion>();
  private currentVersion: string;

  constructor(defaultVersion: string) {
    this.currentVersion = defaultVersion;
  }

  /**
   * Register API version
   */
  register(version: APIVersion): void {
    this.versions.set(version.version, version);
  }

  /**
   * Get API version
   */
  get(version?: string): APIVersion | undefined {
    return this.versions.get(version || this.currentVersion);
  }

  /**
   * Route request to appropriate version
   */
  async route(
    version: string | undefined,
    endpoint: string,
    request: unknown
  ): Promise<unknown> {
    const api = this.get(version);
    
    if (!api) {
      throw new Error(`API version ${version} not found`);
    }

    if (api.deprecated) {
      console.warn(`[API] Version ${api.version} is deprecated`);
    }

    const handler = api.handlers[endpoint];
    if (!handler) {
      throw new Error(`Endpoint ${endpoint} not found in version ${api.version}`);
    }

    return handler(request);
  }

  /**
   * Get all versions
   */
  getVersions(): APIVersion[] {
    return Array.from(this.versions.values());
  }
}

// ==========================================
// EXPANSION LAYER FACADE
// ==========================================

export class ExpansionLayer {
  public plugins: PluginRegistry;
  public modules: ModuleManager;
  public adapters: AdapterRegistry;
  public api: APIManager;

  constructor() {
    this.plugins = new PluginRegistry();
    this.modules = new ModuleManager();
    this.adapters = new AdapterRegistry();
    this.api = new APIManager('v1');
  }

  /**
   * Initialize expansion layer
   */
  async initialize(): Promise<void> {
    // Register built-in modules
    this.registerBuiltInModules();
    
    // Enable default modules
    for (const module of this.modules.getModules()) {
      if (module.enabled) {
        await this.modules.enable(module.name);
      }
    }

    globalEventBus.emit('expansion:initialized', { timestamp: Date.now() });
    console.log('[ExpansionLayer] Initialized');
  }

  /**
   * Register built-in modules
   */
  private registerBuiltInModules(): void {
    // Example built-in modules
    this.modules.register({
      name: 'export-pdf',
      enabled: false,
      initialize: async () => {
        console.log('[Module] Export PDF initialized');
      },
    });

    this.modules.register({
      name: 'export-markdown',
      enabled: true,
      initialize: async () => {
        console.log('[Module] Export Markdown initialized');
      },
    });

    this.modules.register({
      name: 'dark-mode',
      enabled: true,
      initialize: async () => {
        console.log('[Module] Dark Mode initialized');
      },
    });
  }

  /**
   * Get system info
   */
  getInfo(): {
    plugins: number;
    modules: { total: number; enabled: number };
    adapters: number;
    apiVersions: string[];
  } {
    return {
      plugins: this.plugins.getPlugins().length,
      modules: {
        total: this.modules.getModules().length,
        enabled: this.modules.getEnabledModules().length,
      },
      adapters: 0, // TODO: Track adapters
      apiVersions: this.api.getVersions().map(v => v.version),
    };
  }
}

// Singleton instance
export const expansionLayer = new ExpansionLayer();
