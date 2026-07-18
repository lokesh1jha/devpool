import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const subscribeToNewsletter = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/add-email-for-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const { error } = await response.json();
        setErrorMessage(error || 'Failed to subscribe');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="pr-4">
      <div>
        <h3 className="font-bold mb-4 sm:mb-2 text-white">
          Subscribe to our newsletter
        </h3>
        <p className="text-gray-400 my-2 w-full sm:w-[50vw] md:w-[50vw]">
          Join our DevPool to receive curated job matches via email
        </p>
        <div className="flex space-x-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            onClick={subscribeToNewsletter}
            disabled={status === 'loading' || !email}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {status === 'success' && (
          <p className="text-green-400 text-sm mt-2">Successfully subscribed!</p>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-1 text-red-400 text-sm mt-2">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsLetter;
