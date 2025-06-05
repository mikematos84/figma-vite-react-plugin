import GithubClient from './GithubClient';

// Example usage
async function testGithubClient(token, repoString) {
  try {
    // Initialize client
    const client = new GithubClient(token);

    // Parse repository string
    const { owner, repo } = GithubClient.parseRepoString(repoString);
    console.log('Repository info:', { owner, repo });

    // Get repository information
    const repoInfo = await client.getRepository(owner, repo);
    console.log('Repository details:', repoInfo);

    // List files in root directory
    const files = await client.listFiles(owner, repo);
    console.log(
      'Files in root:',
      files.map((f) => ({ name: f.name, type: f.type }))
    );

    // Get content of a specific file (e.g., README.md)
    try {
      const readmeContent = await client.getFileContent(owner, repo, 'README.md');
      console.log('README content:', readmeContent);
    } catch (error) {
      console.log('README.md not found or inaccessible');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { testGithubClient };
