import React, { useState, useEffect } from 'react';
import './Themes.css';
import { storage } from '../../lib/storage';
import { GithubClient } from '../../lib/github';

function Themes() {
  const [configs, setConfigs] = useState({
    github: null,
    airtable: null,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load configurations from storage when component mounts
    async function loadConfigs() {
      try {
        const [githubConfig, airtableConfig] = await Promise.all([
          storage.get('githubConfig'),
          storage.get('airtableConfig'),
        ]);

        setConfigs({
          github: githubConfig,
          airtable: airtableConfig,
        });
      } catch (error) {
        console.error('Error loading configurations:', error);
        setError('Failed to load configurations');
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

  return (
    <div className="themes-container">
      <h2 className="title">Themes</h2>

      <div className="themes-card">
        <h3>Stored Configurations</h3>

        <div style={{ textAlign: 'left', margin: '1rem 0' }}>
          <h4>GitHub Configuration:</h4>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(configs.github, null, 2)}
          </pre>
        </div>

        <div style={{ textAlign: 'left', margin: '1rem 0' }}>
          <h4>Airtable Configuration:</h4>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(configs.airtable, null, 2)}
          </pre>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Repository Files</h3>
          <button
            onClick={listRepositoryFiles}
            className="button"
            disabled={loading || !configs.github?.token || !configs.github?.repo}
            style={{ marginBottom: '1rem' }}
          >
            {loading ? 'Loading...' : 'List Repository Files'}
          </button>

          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          {files.length > 0 && (
            <div style={{ textAlign: 'left' }}>
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
        </div>
      </div>
    </div>
  );
}

export default Themes;
