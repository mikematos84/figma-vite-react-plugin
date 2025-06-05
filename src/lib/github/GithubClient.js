import { Octokit } from '@octokit/rest';

class GithubClient {
  constructor(token) {
    if (!token) {
      throw new Error('GitHub token is required');
    }

    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>} Repository information
   */
  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get contents of a file or directory in a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - Path to the file or directory
   * @param {string} [ref] - The name of the commit/branch/tag (optional)
   * @returns {Promise<Object|Array>} File or directory contents
   */
  async getContents(owner, repo, path, ref) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });
      return data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * List files in a directory
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - Directory path
   * @returns {Promise<Array>} Array of file information
   */
  async listFiles(owner, repo, path = '') {
    try {
      const contents = await this.getContents(owner, repo, path);
      return Array.isArray(contents) ? contents : [contents];
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Get the content of a specific file
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - File path
   * @returns {Promise<string>} Decoded file content
   */
  async getFileContent(owner, repo, path) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(data)) {
        throw new Error('Path points to a directory, not a file');
      }

      // GitHub API returns content as base64 encoded
      return Buffer.from(data.content, 'base64').toString('utf8');
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Parse a GitHub repository URL or string into owner and repo
   * @param {string} repoString - Repository string (e.g., "owner/repo" or full GitHub URL)
   * @returns {Object} Object containing owner and repo
   */
  static parseRepoString(repoString) {
    if (!repoString) {
      throw new Error('Repository string is required');
    }

    // Handle full GitHub URLs
    if (repoString.includes('github.com')) {
      const url = new URL(repoString);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length < 2) {
        throw new Error('Invalid GitHub URL');
      }
      return {
        owner: parts[0],
        repo: parts[1],
      };
    }

    // Handle owner/repo format
    const parts = repoString.split('/');
    if (parts.length !== 2) {
      throw new Error('Invalid repository format. Expected "owner/repo"');
    }

    return {
      owner: parts[0],
      repo: parts[1],
    };
  }

  /**
   * Handle API errors and provide more meaningful error messages
   * @private
   * @param {Error} error - The error to handle
   * @returns {Error} Processed error with meaningful message
   */
  _handleError(error) {
    if (error.status === 404) {
      return new Error('Repository or resource not found');
    }
    if (error.status === 401) {
      return new Error('Invalid GitHub token or unauthorized access');
    }
    if (error.status === 403) {
      return new Error('Rate limit exceeded or access denied');
    }
    return error;
  }
}

export default GithubClient;
