import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    color: '#333',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '24px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonHover: {
    backgroundColor: '#2980b9'
  },
  responseContainer: {
    marginTop: '20px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    whiteSpace: 'pre-wrap'
  },
  loadingBarContainer: {
    width: '100%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '20px'
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#3498db',
    transition: 'width 0.5s ease-out'
  },
  explanation: {
    marginTop: '20px',
    marginBottom: '30px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#555'
  },
  footnote: {
    marginTop: '30px',
    fontSize: '12px',
    color: '#888',
    textAlign: 'center'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none'
  }
};

const InvestmentFitAssessmentTool = () => {
  const [fundLink, setFundLink] = useState('');
  const [companyLink, setCompanyLink] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 99) return 99;
          return prev + 1;
        });
      }, 300);
    } else if (loadingProgress === 100) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingProgress]);

  const ensureHttps = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseContent('');
    setLoadingProgress(0);

    const processedFundLink = ensureHttps(fundLink);
    const processedCompanyLink = ensureHttps(companyLink);

    try {
      const response = await fetch('https://hook.eu2.make.com/qx7ojxurkd67v7hxdj1tekfhqu9q6t2b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fundLink: processedFundLink, companyLink: processedCompanyLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to Make.com');
      }

      const htmlContent = await response.text();
      setLoadingProgress(100);
      setTimeout(() => {
        setResponseContent(htmlContent);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      setResponseContent('<p>An error occurred while processing your request. Please try again. </p>');
      setIsLoading(false);
    }
  };

  const formatResponse = (content) => {
    // Replace multiple consecutive <br> tags with a single one
    const singleLineBreaks = content.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>');

    // Add some spacing after headings
    return singleLineBreaks.replace(/<h(\d)>(.*?)<\/h\1>/gi, (match, level, text) => {
      return `<h${level} style="margin-bottom: 0px;">${text}</h${level}>`;
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Investment Fit Assessment Tool</h2>
      <p style={styles.explanation}>
        This tool I have built uses AI to analyse your investment fund's mandate and assess whether a company is a good fit.
        Simply input your investment fund's website and the website of the company you're considering.
        The AI will then take it from here, scouring the internet to understand your fund's mandate and company profile to evaluate the fit.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={fundLink}
          onChange={(e) => setFundLink(e.target.value)}
          placeholder="Enter investment fund website"
          required
          style={styles.input}
        />
        <input
          type="text"
          value={companyLink}
          onChange={(e) => setCompanyLink(e.target.value)}
          placeholder="Enter company website"
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ ...styles.button, ...(isHovered && !isLoading ? styles.buttonHover : {}) }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading ? 'Processing...' : 'Assess Fit'}
        </button>
      </form>
      {isLoading && (
        <div style={styles.loadingBarContainer}>
          <div style={{ ...styles.loadingBarFill, width: `${loadingProgress}%` }} />
        </div>
      )}
      {responseContent && !isLoading && (
        <div
          style={styles.responseContainer}
          dangerouslySetInnerHTML={{ __html: formatResponse(responseContent) }}
        />
      )}
      <p style={styles.footnote}>
        Created by <a href="https://www.linkedin.com/in/nihaar-udathu/" target="_blank" rel="noopener noreferrer" style={styles.link}>Nihaar Udathu</a>
      </p>
    </div>
  );
};

export default InvestmentFitAssessmentTool;