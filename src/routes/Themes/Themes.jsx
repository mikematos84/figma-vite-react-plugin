import React, { useState, useEffect } from 'react';
import './Themes.css';
import { storage } from '../../lib/storage';
import { GithubClient } from '../../lib/github';
import { AirtableClient } from '../../lib/airtable';
import { isDevelopment } from '../../lib/utils/environment';

function Themes() {
  const [configs, setConfigs] = useState({
    github: null,
    airtable: null,
  });
  const [files, setFiles] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokensError, setTokensError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load configurations from storage when component mounts
    async function loadConfigs() {
      setIsLoading(true);
      setError(null);

      try {
        // Load configs sequentially to avoid message handling issues
        if (isDevelopment()) {
          console.log('Loading GitHub config...');
        }
        const githubConfig = await storage.get('githubConfig');

        if (isDevelopment()) {
          console.log('Loading Airtable config...');
        }
        const airtableConfig = await storage.get('airtableConfig');

        if (isDevelopment()) {
          console.log('Configs loaded:', { githubConfig, airtableConfig });
        }

        setConfigs({
          github: githubConfig || null,
          airtable: airtableConfig || null,
        });
      } catch (error) {
        console.error('Error loading configurations:', error);
        setError('Failed to load configurations: ' + (error.message || 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    loadConfigs();
  }, []);

  const listRepositoryFiles = async () => {
    setLoading(true);
    setError(null);
    setFiles([]);

    try {
      if (!configs.github?.token || !configs.github?.repo) {
        throw new Error(
          'GitHub token and repository are required. Please configure them in Account settings.'
        );
      }

      const client = new GithubClient(configs.github.token);
      const { owner, repo } = GithubClient.parseRepoString(configs.github.repo);

      // List files in the root directory (or specified directory if exists)
      const path = configs.github.directory || '.';
      const fileList = await client.listFiles(owner, repo, path);

      setFiles(fileList);
    } catch (err) {
      console.error('Error listing files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDesignTokens = async () => {
    setTokensLoading(true);
    setTokensError(null);
    setTokens([]);

    try {
      if (!configs.airtable?.token || !configs.airtable?.appId) {
        throw new Error(
          'Airtable token and App ID are required. Please configure them in Account settings.'
        );
      }

      const client = new AirtableClient(configs.airtable.token, configs.airtable.appId);

      const designTokens = await client.get();
      setTokens(designTokens);
    } catch (err) {
      console.error('Error loading design tokens:', err);
      setTokensError(err.message);
    } finally {
      setTokensLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="themes-container">
        <h2 className="title">Themes</h2>
        <div className="themes-card">
          <p>Loading configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="themes-container">
      <h2 className="title">Themes</h2>

      {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={listRepositoryFiles}
            className="button"
            disabled={loading || !configs.github?.token || !configs.github?.repo}
          >
            {loading ? 'Loading...' : 'List Repository Files'}
          </button>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {tokensError && <div style={{ color: 'red', marginBottom: '1rem' }}>{tokensError}</div>}

        {/* Repository Files Section */}
        {files.length > 0 && (
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h3>Repository Files</h3>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                background: '#f5f5f5',
                borderRadius: '4px',
                maxHeight: '300px',
                overflow: 'auto',
              }}
            >
              {files.map((file) => (
                <li
                  key={file.sha}
                  style={{
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{file.type === 'dir' ? '📁' : '📄'}</span>
                  <span>{file.name}</span>
                  {file.type === 'dir' && (
                    <span
                      style={{
                        fontSize: '0.8em',
                        color: '#666',
                        marginLeft: 'auto',
                      }}
                    >
                      Directory
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            display: 'flex',
          }}
        >
          <button
            onClick={() => loadDesignTokens()}
            className="button"
            disabled={tokensLoading || !configs.airtable?.token || !configs.airtable?.appId}
          >
            {tokensLoading ? 'Loading...' : 'Load Design Tokens'}
          </button>
        </div>
        {/* Design Tokens Section */}
        {tokens.length > 0 && (
          <div className="tokens-table-container">
            <table className="design-tokens-table">
              <thead>
                <tr>
                  {Object.keys(tokens[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => {
                  const {
                    'Token Name': tokenName,
                    'Token Type': tokenType,
                    'Token Value': tokenValue,
                    Description: description,
                    'Brand Metadata': brandMetadata,
                    'Approval Status': approvalStatus,
                    'Design Token Image': designTokenImage,
                  } = token;

                  const {
                    id,
                    thumbnails: {
                      small: { height, url, width },
                    },
                  } = designTokenImage[0];
                  return (
                    <tr key={index}>
                      <td>{tokenName}</td>
                      <td>{tokenType}</td>
                      <td>{tokenValue}</td>
                      <td>{description}</td>
                      <td>{brandMetadata}</td>
                      <td>{approvalStatus}</td>
                      <td>
                        <img src={url} alt={id} style={{ width: width, height: height }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Themes;
