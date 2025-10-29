import { resolve } from 'path';
import { existsSync } from 'fs';

export default function resolver(request, options) {
  // Handle .js imports that should resolve to .ts files
  if (request.endsWith('.js')) {
    const tsPath = request.replace(/\.js$/, '.ts');
    const resolvedTsPath = resolve(options.basedir, tsPath);
    
    if (existsSync(resolvedTsPath)) {
      return resolvedTsPath;
    }
  }
  
  // Fall back to default resolution
  return options.defaultResolver(request, options);
}