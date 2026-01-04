import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export async function ConnectionTest() {
  let status: 'success' | 'error' | 'loading' = 'loading';
  let message = 'Testing connection...';
  let recipesCount = 0;
  let profilesCount = 0;
  let errorDetails: string | null = null;

  try {
    const supabase = await createClient();

    // Test 1: Check if we can connect to Supabase
    const { count: recipesCountResult, error: recipesError } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    const { count: profilesCountResult, error: profilesError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (recipesError || profilesError) {
      status = 'error';
      message = 'Connection failed';
      errorDetails = recipesError?.message || profilesError?.message || 'Unknown error';
    } else {
      status = 'success';
      message = 'Connected successfully!';
      recipesCount = recipesCountResult || 0;
      profilesCount = profilesCountResult || 0;
    }
  } catch (error) {
    status = 'error';
    message = 'Connection error';
    errorDetails = error instanceof Error ? error.message : 'Unknown error occurred';
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {status === 'loading' && (
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        )}
        {status === 'error' && (
          <XCircle className="h-6 w-6 text-red-500" />
        )}
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900">
            Supabase Connection Test
          </h3>
          <p className={`mt-1 text-sm ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-zinc-600'}`}>
            {message}
          </p>
          
          {status === 'success' && (
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              <p>
                <span className="font-medium">Recipes:</span> {recipesCount}
              </p>
              <p>
                <span className="font-medium">Profiles:</span> {profilesCount}
              </p>
            </div>
          )}
          
          {status === 'error' && errorDetails && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">Error Details:</p>
              <p className="mt-1 text-sm text-red-700">{errorDetails}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

