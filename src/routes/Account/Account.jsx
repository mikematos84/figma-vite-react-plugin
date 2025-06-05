import React, { useState, useEffect } from 'react';
import './Account.css';
import { storage } from '../../lib/storage';
import { GithubClient } from '../../lib/github';
import { isFigmaPlugin } from '../../lib/utils/environment';

const DEFAULT_GITHUB_CONFIG = {
  repo: '',
  directory: '',
  token: '',
};

const DEFAULT_AIRTABLE_CONFIG = {
  appId: '',
  token: '',
};

function Account() {
  const [githubConfig, setGithubConfig] = useState(DEFAULT_GITHUB_CONFIG);
  const [airtableConfig, setAirtableConfig] = useState(DEFAULT_AIRTABLE_CONFIG);
  const [saveStatus, setSaveStatus] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load configuration from storage when component mounts
    async function loadConfig() {
      try {
        // Load GitHub config
        const savedGithubConfig = await storage.get('githubConfig');
        setGithubConfig(savedGithubConfig || DEFAULT_GITHUB_CONFIG);

        // Load Airtable config
        const savedAirtableConfig = await storage.get('airtableConfig');
        setAirtableConfig(savedAirtableConfig || DEFAULT_AIRTABLE_CONFIG);
      } catch (error) {
        console.error('Error loading configuration:', error);
        setError('Failed to load configuration');
      }
    }

    loadConfig();
  }, []);

  const handleGithubChange = (e) => {
    const { name, value } = e.target;
    setGithubConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAirtableChange = (e) => {
    const { name, value } = e.target;
    setAirtableConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setError(null);

    try {
      // Save configs one at a time to avoid race conditions
      await storage.set('githubConfig', githubConfig);
      await storage.set('airtableConfig', airtableConfig);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveStatus('error');
      setError(error.message || 'Failed to save configuration');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return 'Error Saving';
      default:
        return 'Save Configuration';
    }
  };

  const getSaveButtonClass = () => {
    return `button ${saveStatus ? `button--${saveStatus}` : ''}`;
  };

  return (
    <div className="account-container">
      <h2 className="title account-title">
        Account Settings {!isFigmaPlugin() && ' (Development Mode)'}
      </h2>

      {/* GitHub Configuration Section */}
      <div className="account-section">
        <h3 className="account-section-title">GitHub Configuration</h3>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="repo" className="label field-label">
              Repository
            </label>
            <input
              type="text"
              id="repo"
              name="repo"
              value={githubConfig?.repo}
              onChange={handleGithubChange}
              className="input field-input"
              placeholder="username/repository"
            />
          </div>
          <div className="form-field">
            <label htmlFor="directory" className="label field-label">
              Directory
            </label>
            <input
              type="text"
              id="directory"
              name="directory"
              value={githubConfig?.directory}
              onChange={handleGithubChange}
              className="input field-input"
              placeholder="path/to/directory"
            />
          </div>
          <div className="form-field">
            <label htmlFor="githubToken" className="label field-label">
              GitHub Token
            </label>
            <input
              type="text"
              id="githubToken"
              name="token"
              value={githubConfig?.token}
              onChange={handleGithubChange}
              className="input field-input"
              placeholder="Enter your GitHub token"
            />
          </div>
        </div>

        {error && (
          <div className="error-message" style={{ marginTop: '1rem', color: 'red' }}>
            {error}
          </div>
        )}
      </div>

      {/* Airtable Configuration Section */}
      <div className="account-section">
        <h3 className="account-section-title">Airtable Configuration</h3>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="appId" className="label field-label">
              App ID
            </label>
            <input
              type="text"
              id="appId"
              name="appId"
              value={airtableConfig?.appId}
              onChange={handleAirtableChange}
              className="input field-input"
              placeholder="Enter your Airtable App ID"
            />
          </div>
          <div className="form-field">
            <label htmlFor="airtableToken" className="label field-label">
              Token
            </label>
            <input
              type="text"
              id="airtableToken"
              name="token"
              value={airtableConfig?.token}
              onChange={handleAirtableChange}
              className="input field-input"
              placeholder="Enter your Airtable token"
            />
          </div>
        </div>
      </div>

      <div className="save-button-container">
        <button
          onClick={handleSave}
          className={getSaveButtonClass()}
          disabled={saveStatus === 'saving'}
        >
          {getSaveButtonText()}
        </button>
      </div>
    </div>
  );
}

export default Account;
