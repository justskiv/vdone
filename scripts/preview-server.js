'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 4173;
const DEFAULT_BASE_PATH = '/vdone/';
const DEFAULT_ROOT = 'docs/.vuepress/dist';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
};

function parseArgs(argv) {
  const args = {
    basePath: DEFAULT_BASE_PATH,
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    root: DEFAULT_ROOT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];

    if (!flag.startsWith('--') || value === undefined) {
      throw new Error(`invalid argument: ${flag}`);
    }

    i += 1;

    switch (flag) {
      case '--base-path':
        args.basePath = value;
        break;
      case '--host':
        args.host = value;
        break;
      case '--port':
        args.port = Number(value);
        break;
      case '--root':
        args.root = value;
        break;
      default:
        throw new Error(`unknown argument: ${flag}`);
    }
  }

  if (!Number.isInteger(args.port) || args.port < 1 || args.port > 65535) {
    throw new Error(`invalid port: ${args.port}`);
  }

  return args;
}

function normalizeBasePath(rawBasePath) {
  if (!rawBasePath || rawBasePath === '/') {
    return '';
  }

  return `/${rawBasePath.replace(/^\/|\/$/g, '')}`;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendFile(res, filePath, status = 200) {
  fs.readFile(filePath, (err, body) => {
    if (err) {
      send(res, 404, 'not found\n', {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      return;
    }

    const ext = path.extname(filePath);
    send(res, status, body, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
    });
  });
}

function resolveRequestPath(req, root, basePath) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (err) {
    return {error: 400};
  }

  if (basePath && pathname === basePath) {
    pathname = '/';
  }

  if (basePath && pathname.startsWith(`${basePath}/`)) {
    pathname = pathname.slice(basePath.length) || '/';
  }

  if (pathname === '/') {
    pathname = '/index.html';
  } else if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const relativePath = pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return {error: 403};
  }

  return {filePath};
}

function createServer({root, basePath}) {
  const notFoundPath = path.join(root, '404.html');

  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      send(res, 405, 'method not allowed\n', {
        Allow: 'GET, HEAD',
        'Content-Type': 'text/plain; charset=utf-8',
      });
      return;
    }

    const resolved = resolveRequestPath(req, root, basePath);

    if (resolved.error === 400) {
      send(res, 400, 'bad request\n', {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      return;
    }

    if (resolved.error === 403) {
      send(res, 403, 'forbidden\n', {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      return;
    }

    fs.access(resolved.filePath, fs.constants.R_OK, (err) => {
      if (err) {
        sendFile(res, notFoundPath, 404);
        return;
      }

      sendFile(res, resolved.filePath);
    });
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root);
  const basePath = normalizeBasePath(args.basePath);
  const server = createServer({root, basePath});

  server.listen(args.port, args.host, () => {
    const urlBase = basePath ? `${basePath}/` : '/';
    console.log(`serving ${root} at http://${args.host}:${args.port}${urlBase}`);
  });
}

main();
