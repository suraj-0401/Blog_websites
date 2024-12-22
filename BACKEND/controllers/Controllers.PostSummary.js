import axios from 'axios';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

 const PostSummary = async (req, res) => {
  const { text } = req.body; 

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Send the request to Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );

    const summary = response.data[0]?.summary_text;

    if (!summary) {
      return res.status(500).json({ error: 'Unable to generate summary' });
    }

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Error summarizing text:', error);
    return res.status(500).json({ error: 'Failed to summarize text' });
  }
};

export default PostSummary;