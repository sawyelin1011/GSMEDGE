declare module 'degit' {
  interface DegitOptions {
    cache?: boolean;
    force?: boolean;
    verbose?: boolean;
    mode?: 'tar' | 'git';
  }

  interface Emitter {
    clone(dest: string): Promise<void>;
    on(event: string, handler: (...args: any[]) => void): Emitter;
  }

  function degit(src: string, options?: DegitOptions): Emitter;

  export = degit;
}
