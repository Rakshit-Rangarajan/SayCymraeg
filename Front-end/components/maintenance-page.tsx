import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-md">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Dan Gynnal a Chadw
        </h1>
        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-4">
          (Under Maintenance)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Mae'n ddrwg gennym, rydym yn gwneud gwaith cynnal a chadw ar hyn o bryd. Byddwn yn ôl ar-lein cyn bo hir!
          <br />
          <br />
          Sorry, we're currently performing maintenance. We'll be back online shortly!
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          - SayCymraeg Admins
        </p>
      </div>
    </div>
  );
}
