import { useRouter } from 'next/router';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/50 rounded-full mb-4">
              <AlertCircle className="text-red-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-gray-400">{errorMessage}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
