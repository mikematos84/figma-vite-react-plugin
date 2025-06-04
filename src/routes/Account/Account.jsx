import React, { useState } from 'react';
import './Account.css';

function Account() {
  const [githubConfig, setGithubConfig] = useState({
    repo: import.meta.env.VITE_GITHUB_REPO || '',
    directory: import.meta.env.VITE_GITHUB_DIRECTORY || '',
    token: import.meta.env.VITE_GITHUB_TOKEN || ''
  });

  const [airtableConfig, setAirtableConfig] = useState({
    appId: import.meta.env.VITE_AIRTABLE_APP_ID || '',
    token: import.meta.env.VITE_AIRTABLE_TOKEN || ''
  });

  const handleGithubChange = (e) => {
    const { name, value } = e.target;
    setGithubConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAirtableChange = (e) => {
    const { name, value } = e.target;
    setAirtableConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // TODO: Implement actual storage logic
    console.log('Saving configurations:', { githubConfig, airtableConfig });
    // Placeholder for clientStorage implementation
    parent.postMessage({ 
      pluginMessage: { 
        type: 'save-config',
        githubConfig,
        airtableConfig
      }
    }, '*');
  };

  return (
    <div className="account-container">
      <h2 className="title account-title">Account Settings</h2>
      
      {/* GitHub Configuration Section */}
      <div className="account-section">
        <h3 className="account-section-title">GitHub Configuration</h3>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="repo" className="label field-label">Repository</label>
            <input
              type="text"
              id="repo"
              name="repo"
              value={githubConfig.repo}
              onChange={handleGithubChange}
              className="input field-input"
              placeholder="[@owner/]repository"
            />
          </div>
          <div className="form-field">
            <label htmlFor="directory" className="label field-label">Directory</label>
            <input
              type="text"
              id="directory"
              name="directory"
              value={githubConfig.directory}
              onChange={handleGithubChange}
              className="input field-input"
              placeholder="path/to/directory"
            />
          </div>
          <div className="form-field">
            <label htmlFor="githubToken" className="label field-label">Token</label>
            <input
              type="text"
              id="githubToken"
              name="token"
              value={githubConfig.token}
              onChange={handleGithubChange}
              className="input field-input"
              placeholder="Enter your GitHub token"
            />
          </div>
        </div>
      </div>

      {/* Airtable Configuration Section */}
      <div className="account-section">
        <h3 className="account-section-title">Airtable Configuration</h3>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="appId" className="label field-label">App ID</label>
            <input
              type="text"
              id="appId"
              name="appId"
              value={airtableConfig.appId}
              onChange={handleAirtableChange}
              className="input field-input"
              placeholder="Enter your Airtable App ID"
            />
          </div>
          <div className="form-field">
            <label htmlFor="airtableToken" className="label field-label">Token</label>
            <input
              type="text"
              id="airtableToken"
              name="token"
              value={airtableConfig.token}
              onChange={handleAirtableChange}
              className="input field-input"
              placeholder="Enter your Airtable token"
            />
          </div>
        </div>
      </div>

      <div className="save-button-container">
        <button onClick={handleSave} className="button">
          Save Configuration
        </button>
      </div>
    </div>
  );
}

export default Account; 