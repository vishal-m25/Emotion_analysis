import React, { useState } from 'react';

const SentimentAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-emotion-analysis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: inputText })
      });

      const data = await response.json();
      
      console.log('API Response:', data);

      if (Array.isArray(data) && data.length > 0) {
        const emotionResults = data[0]; 

        if (Array.isArray(emotionResults)) {
          const finalEmotion = emotionResults.reduce((max, current) => {
            return current.score > max.score ? current : max;
          });

          setResult(finalEmotion);
        } else {
          console.error('Invalid response format for emotions:', emotionResults);
        }
      } else {
        console.error('Invalid response structure:', data);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Emotion Analysis</h1>
      <textarea
        rows="6"
        cols="60"
        placeholder="Enter text to analyze emotion..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={styles.textarea}
      />
      <br />
      <button onClick={analyzeSentiment} disabled={loading} style={styles.button}>
        {loading ? 'Analyzing...' : 'Analyze Emotion'}
      </button>
      {result && (
        <div style={styles.resultContainer}>
          <h2 style={styles.resultHeading}>Emotion:</h2>
          <p style={styles.resultText}> {(result.label==="others")?"Normal":result.label}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    background: 'linear-gradient(145deg, #6e7dff, #4d58e1)',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: 'auto',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    color: '#fff',
    fontFamily: '"Arial", sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    fontSize: '1.1rem',
    borderRadius: '10px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    resize: 'none',
    transition: 'all 0.3s ease-in-out',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 20px',
    fontSize: '1.2rem',
    borderRadius: '30px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  resultContainer: {
    marginTop: '30px',
    backgroundColor: '#fff',
    color: '#333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  resultHeading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#333',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: '1.2rem',
    margin: '10px 0',
    textAlign: 'center',
  },
};

export default SentimentAnalyzer;
