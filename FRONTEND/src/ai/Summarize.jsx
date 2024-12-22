import React, { useState } from 'react';
import axios from 'axios';

const Summarizer = ({ postContent }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizePost = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/summarize', { text: postContent });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing post:', error);
      alert('Failed to summarize the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={summarizePost} disabled={loading} className='mt-60'>
        {loading ? 'Summarizing...' : 'Summarize Post'}
      </button>
      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default Summarizer;
