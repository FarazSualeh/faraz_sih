/**
 * Global Phaser Game Manager
 * Handles WebGL context loss and ensures only one game instance exists at a time
 */

let activeGame: Phaser.Game | null = null;
let isCreatingGame = false;
let contextLostCount = 0;
const MAX_CONTEXT_LOSSES = 0; // Use Canvas immediately, no tolerance for context loss

// Detect if device is low-power or has issues
let forcedCanvasMode = false;

// Try to restore Canvas mode preference from localStorage
try {
  const savedMode = localStorage.getItem('phaser-renderer-mode');
  if (savedMode === 'canvas') {
    forcedCanvasMode = true;
  }
} catch (e) {
  // localStorage not available
}

// Detect problematic environments on startup
const detectProblematicEnvironment = (): boolean => {
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check for known problematic browsers
  const isProblematicBrowser = /SamsungBrowser|UCBrowser|Opera Mini/i.test(navigator.userAgent);
  
  // Check for low memory devices (if available)
  const hasLowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false;
  
  // Check for Safari (known WebGL issues)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Test WebGL stability
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) || 
               canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });
    if (!gl) {
      canvas.remove();
      return true; // No WebGL support
    }
    
    // Check for context loss extension
    const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    if (!ext) {
      canvas.remove();
      return true; // Can't handle context loss properly
    }
    
    // Clean up test canvas
    canvas.remove();
  } catch (e) {
    return true; // WebGL test failed
  }
  
  // Use Canvas on mobile, Safari, or problematic browsers for stability
  return isMobile || isProblematicBrowser || hasLowMemory || isSafari;
};

// Check on initialization - DEFAULT TO CANVAS for maximum stability
if (!forcedCanvasMode) {
  forcedCanvasMode = detectProblematicEnvironment();
  if (forcedCanvasMode) {
    // Save preference silently
    try {
      localStorage.setItem('phaser-renderer-mode', 'canvas');
    } catch (e) {
      // localStorage not available
    }
  } else {
    // Even if detection passes, still prefer Canvas for games (educational platform doesn't need WebGL)
    forcedCanvasMode = true;
    try {
      localStorage.setItem('phaser-renderer-mode', 'canvas');
    } catch (e) {
      // localStorage not available
    }
  }
}

export const PhaserManager = {
  /**
   * Creates a new Phaser game instance, ensuring the previous one is destroyed
   */
  createGame: async (config: Phaser.Types.Core.GameConfig): Promise<Phaser.Game | null> => {
    // Prevent multiple simultaneous creations
    if (isCreatingGame) {
      console.warn('Game creation already in progress');
      return null;
    }

    isCreatingGame = true;

    try {
      // Destroy existing game first
      await PhaserManager.destroyGame();

      // Wait for cleanup - longer delay for stability
      await new Promise(resolve => setTimeout(resolve, 200));

      // Force garbage collection hint
      if ((window as any).gc) {
        (window as any).gc();
      }

      // Create new game with enhanced config
      const enhancedConfig = PhaserManager.enhanceConfig(config);
      activeGame = new Phaser.Game(enhancedConfig);

      // Setup context loss handling
      PhaserManager.setupContextHandlers(activeGame);

      return activeGame;
    } catch (error) {
      console.error('Error creating Phaser game:', error);
      // On error, force canvas mode
      forcedCanvasMode = true;
      return null;
    } finally {
      isCreatingGame = false;
    }
  },

  /**
   * Destroys the active game instance
   */
  destroyGame: async (): Promise<void> => {
    if (activeGame) {
      try {
        // Get canvas reference before destroying
        const canvas = activeGame.canvas;
        
        // Simply destroy the game - let Phaser handle internal cleanup
        // removeCanvas=true, noReturn=false
        activeGame.destroy(true, false);
        
        activeGame = null;

        // Remove canvas from DOM if it still exists
        if (canvas && canvas.parentNode) {
          try {
            canvas.parentNode.removeChild(canvas);
          } catch (e) {
            // Canvas may already be removed
          }
        }

        // Additional cleanup wait
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Suppress all destruction errors - they're usually harmless
        // and occur when WebGL context is lost
        console.warn('Game destruction completed with warnings (this is usually safe)');
        activeGame = null;
      }
    }
  },

  /**
   * Enhances game config with optimal settings for context stability
   */
  enhanceConfig: (config: Phaser.Types.Core.GameConfig): Phaser.Types.Core.GameConfig => {
    // Determine renderer type - always use Canvas for stability
    const rendererType = forcedCanvasMode ? Phaser.CANVAS : Phaser.WEBGL;

    return {
      ...config,
      type: rendererType,
      render: {
        ...config.render,
        antialias: false,
        roundPixels: true,
        transparent: false,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'low-power',
        batchSize: 512, // Reduced from 1024
        // Remove maxLights and maxTextures to avoid shader errors
        mipmapFilter: 'LINEAR', // Simpler filtering
      },
      fps: {
        ...config.fps,
        target: 60,
        min: 15,
        smoothStep: true,
        forceSetTimeOut: false,
        deltaHistory: 10,
      },
      // Limit pipeline count
      pipeline: {
        ...config.pipeline,
      },
      callbacks: {
        preBoot: (game: Phaser.Game) => {
          game.events.on('boot', () => {
            console.log(`Phaser game booted (${rendererType === Phaser.CANVAS ? 'Canvas' : 'WebGL'} renderer)`);
          });

          // Call original preBoot if exists
          if (config.callbacks?.preBoot) {
            config.callbacks.preBoot(game);
          }
        },
        postBoot: (game: Phaser.Game) => {
          PhaserManager.setupContextHandlers(game);

          // Limit texture memory
          if (game.textures) {
            game.textures.on('addtexture', () => {
              // Keep texture count low
              const textureKeys = game.textures.getTextureKeys();
              if (textureKeys.length > 50) {
                console.warn('Too many textures loaded, clearing oldest');
                // Remove oldest textures
                const toRemove = textureKeys.slice(0, 10);
                toRemove.forEach(key => {
                  if (key !== '__DEFAULT' && key !== '__MISSING') {
                    game.textures.remove(key);
                  }
                });
              }
            });
          }

          // Call original postBoot if exists
          if (config.callbacks?.postBoot) {
            config.callbacks.postBoot(game);
          }
        }
      }
    };
  },

  /**
   * Sets up WebGL context loss/restore handlers
   */
  setupContextHandlers: (game: Phaser.Game): void => {
    if (!game.canvas) return;

    const canvas = game.canvas as HTMLCanvasElement;

    canvas.addEventListener('webglcontextlost', (event: Event) => {
      event.preventDefault();
      contextLostCount++;
      console.error(`WebGL context lost (${contextLostCount}/${MAX_CONTEXT_LOSSES})`);

      if (contextLostCount >= MAX_CONTEXT_LOSSES) {
        console.warn('Maximum context losses reached. Will use Canvas renderer on next game.');
        forcedCanvasMode = true;
      }

      // Attempt to recover
      setTimeout(() => {
        if (game.canvas) {
          try {
            const gl = (game.canvas as HTMLCanvasElement).getContext('webgl') || 
                       (game.canvas as HTMLCanvasElement).getContext('experimental-webgl');
            if (gl) {
              const loseContextExt = gl.getExtension('WEBGL_lose_context');
              if (loseContextExt) {
                loseContextExt.restoreContext();
              }
            }
          } catch (e) {
            console.error('Failed to restore context:', e);
            forcedCanvasMode = true;
          }
        }
      }, 100);
    }, false);

    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored successfully');
      // Don't reset counter - we want to track cumulative issues
    }, false);
  },

  /**
   * Gets the active game instance
   */
  getActiveGame: (): Phaser.Game | null => {
    return activeGame;
  },

  /**
   * Resets the context loss counter (use sparingly)
   */
  resetContextLossCounter: (): void => {
    contextLostCount = 0;
    forcedCanvasMode = false;
  },

  /**
   * Check if Canvas mode is forced
   */
  isCanvasModeForced: (): boolean => {
    return forcedCanvasMode;
  }
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    PhaserManager.destroyGame();
  });

  // Also cleanup on visibility change (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && activeGame) {
      // Pause the game when tab is hidden
      if (activeGame.loop) {
        activeGame.loop.sleep();
      }
    } else if (!document.hidden && activeGame) {
      // Resume when tab is visible
      if (activeGame.loop) {
        activeGame.loop.wake();
      }
    }
  });
}