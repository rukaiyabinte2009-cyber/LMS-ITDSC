import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  Server,
  Terminal,
  ShieldCheck,
  Code2,
  FileCode,
  FileCheck2,
  ExternalLink,
  Layers,
  X,
} from 'lucide-react';
import { DATABASE_CONNECTION_GUIDE } from '../lib/databaseDocs';

interface DatabaseDeploymentGuideProps {
  onClose?: () => void;
}

export const DatabaseDeploymentGuide: React.FC<DatabaseDeploymentGuideProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'db_code' | 'sql_schema' | 'env_vars' | 'package_script'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const packageScriptCode = `// scripts/package.mjs (Run on your local PC)
import { execSync } from 'node:child_process';
import { cpSync, rmSync, mkdirSync } from 'node:fs';

const run = (cmd, cwd) => {
  console.log(\`> \${cmd} in \${cwd}\`);
  execSync(cmd, { cwd, stdio: 'inherit' });
};

console.log('Building web frontend (Next.js static export)...');
run('npm run build', 'web'); // creates web/out

console.log('Compiling Express server (TypeScript)...');
run('npm run build', 'server'); // creates server/dist

console.log('Assembling deploy/ folder...');
rmSync('deploy', { recursive: true, force: true });
mkdirSync('deploy');
mkdirSync('deploy/public');

// Copy static Next.js export into Express public folder
cpSync('web/out', 'deploy/public', { recursive: true });

// Copy compiled server and database migrations
cpSync('server/dist', 'deploy/dist', { recursive: true });
cpSync('server/migrations', 'deploy/migrations', { recursive: true });

// Copy runtime files
for (const file of ['app.js', 'package.json', 'package-lock.json']) {
  cpSync(\`server/\${file}\`, \`deploy/\${file}\`);
}

console.log('Done! Zip the contents of deploy/ into deploy.zip and upload to cPanel /home/itdatasc/learn_app');`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL & cPanel Connection Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How We Connect the Database on cPanel
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Here is the exact method, connection pooling logic, and production deployment scripts designed specifically
            for CloudLinux Passenger and shared cPanel PostgreSQL hosting.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'architecture'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Connection Method</span>
        </button>

        <button
          onClick={() => setActiveTab('db_code')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'db_code'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>2. server/src/db.ts</span>
        </button>

        <button
          onClick={() => setActiveTab('sql_schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'sql_schema'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>3. 001_init.sql</span>
        </button>

        <button
          onClick={() => setActiveTab('env_vars')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'env_vars'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>4. cPanel .env</span>
        </button>

        <button
          onClick={() => setActiveTab('package_script')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'package_script'
              ? 'bg-teal-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>5. package.mjs (Deploy)</span>
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE EXPLANATION */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">How Node.js Connects to cPanel PostgreSQL</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {DATABASE_CONNECTION_GUIDE.architectureSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {DATABASE_CONNECTION_GUIDE.steps.map((s) => (
                <div key={s.step} className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center border border-teal-500/30">
                      {s.step}
                    </span>
                    <h3 className="font-bold text-sm text-white">{s.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.details}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-teal-950/40 border border-teal-500/30 space-y-3 text-xs">
              <h4 className="font-bold text-teal-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Crucial cPanel PostgreSQL Rules for Production</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                <li>
                  <strong>Localhost Connection:</strong> PostgreSQL runs on <code className="bg-slate-900 px-1 py-0.5 rounded text-teal-200">localhost:5432</code> on the cPanel server. Set <code className="bg-slate-900 px-1 py-0.5 rounded text-teal-200">ssl: false</code> because the connection is internal to the machine.
                </li>
                <li>
                  <strong>Special Characters in Password:</strong> If your PostgreSQL user password has characters like <code className="text-amber-300">#</code>, <code className="text-amber-300">@</code>, or <code className="text-amber-300">%</code>, encode them in the connection string (e.g. <code className="text-amber-300">#</code> becomes <code className="text-amber-300">%23</code>).
                </li>
                <li>
                  <strong>Pure JavaScript Driver (<code className="text-teal-300">pg</code>):</strong> Do not use native compile packages or Prisma on shared hosting. The <code className="text-teal-300">pg</code> npm package is 100% JavaScript and runs reliably without missing C++ build tools.
                </li>
                <li>
                  <strong>Connection Pooling Limit:</strong> Set <code className="bg-slate-900 px-1 py-0.5 rounded text-teal-200">max: 10</code>. Shared hosting restricts concurrent connections and memory per cPanel account.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DB.TS CODE */}
      {activeTab === 'db_code' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">server/src/db.ts</h3>
              <p className="text-xs text-slate-400">Database connection pool and query execution helper</p>
            </div>
            <button
              onClick={() => handleCopy(DATABASE_CONNECTION_GUIDE.dbTsCode, 'db_ts')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all border border-teal-500/40"
            >
              {copiedKey === 'db_ts' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'db_ts' ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-300 overflow-x-auto shadow-2xl">
            <pre>{DATABASE_CONNECTION_GUIDE.dbTsCode}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: SQL SCHEMA */}
      {activeTab === 'sql_schema' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">migrations/001_init.sql</h3>
              <p className="text-xs text-slate-400">
                Paste this into phpPgAdmin (SQL tab) in cPanel to initialize all tables
              </p>
            </div>
            <button
              onClick={() => handleCopy(DATABASE_CONNECTION_GUIDE.schemaSql, 'schema_sql')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all border border-teal-500/40"
            >
              {copiedKey === 'schema_sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'schema_sql' ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] shadow-2xl">
            <pre>{DATABASE_CONNECTION_GUIDE.schemaSql}</pre>
          </div>
        </div>
      )}

      {/* TAB 4: ENV VARS */}
      {activeTab === 'env_vars' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">cPanel Environment Variables</h3>
              <p className="text-xs text-slate-400">Add these key-value pairs in Setup Node.js App</p>
            </div>
            <button
              onClick={() => handleCopy(DATABASE_CONNECTION_GUIDE.envTemplate, 'env_tpl')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all border border-teal-500/40"
            >
              {copiedKey === 'env_tpl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'env_tpl' ? 'Copied!' : 'Copy Variables'}</span>
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-300 overflow-x-auto shadow-2xl">
            <pre>{DATABASE_CONNECTION_GUIDE.envTemplate}</pre>
          </div>
        </div>
      )}

      {/* TAB 5: PACKAGING SCRIPT */}
      {activeTab === 'package_script' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">scripts/package.mjs</h3>
              <p className="text-xs text-slate-400">Builds static frontend + compiled server into deploy/ folder</p>
            </div>
            <button
              onClick={() => handleCopy(packageScriptCode, 'pkg_script')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all border border-teal-500/40"
            >
              {copiedKey === 'pkg_script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'pkg_script' ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-300 overflow-x-auto shadow-2xl">
            <pre>{packageScriptCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
