// src/types/gyronorm.d.ts
declare module 'gyronorm' {
  interface GyroNormData {
    do: {
      alpha: number;
      beta: number;
      gamma: number;
      absolute: boolean;
    };
    dm: {
      x: number;
      y: number;
      z: number;
      gx: number;
      gy: number;
      gz: number;
      alpha: number;
      beta: number;
      gamma: number;
    };
  }

  interface GyroNormOptions {
    frequency?: number;
    gravityNormalized?: boolean;
    orientationBase?: 'GAME' | 'WORLD';
    decimalCount?: number;
    logger?: (data: any) => void;
    screenAdjusted?: boolean;
  }

  class GyroNorm {
    static GAME: 'GAME';
    static WORLD: 'WORLD';
    
    constructor();
    init(options?: GyroNormOptions): Promise<void>;
    start(callback: (data: GyroNormData) => void): void;
    stop(): void;
    isAvailable(): boolean;
    startLogging(logger: (data: any) => void): void;
    stopLogging(): void;
  }

  export = GyroNorm;
}