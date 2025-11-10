# MCP Integration Guide
## Connect AI to Coffee Vault 1000

**Model Context Protocol (MCP)**: Industry-standard way to connect AI applications to your data

---

## What is MCP?

Model Context Protocol is a universal protocol developed by Anthropic and adopted by OpenAI, enabling AI applications like Claude Desktop, ChatGPT, and development tools to securely access your Obsidian vault.

### Why Use MCP with Coffee Vault?

1. **Natural Language Queries**: Ask questions like "What's the best water recipe for Ethiopian naturals?"
2. **AI-Powered Research**: Let Claude analyze your 1,000 notes and find connections
3. **Smart Recommendations**: Get personalized brewing suggestions based on your logs
4. **Automated Note Creation**: Generate new notes from conversations
5. **Knowledge Graph Navigation**: Explore relationships between concepts

---

## Installation Options

### Option 1: obsidian-mcp-server (Recommended)

**Best for**: Full vault access, bidirectional sync, comprehensive features

#### Prerequisites
- Obsidian with Local REST API plugin
- Node.js v18+ and npm
- Claude Desktop or compatible MCP client

#### Step 1: Install Local REST API Plugin

1. Open Obsidian Settings → Community Plugins
2. Disable Safe Mode
3. Browse and install "Local REST API"
4. Enable the plugin
5. Generate an API key (Settings → Local REST API → API Key)
6. Note the port (default: 27124)

#### Step 2: Install MCP Server

```bash
# Clone the repository
git clone https://github.com/cyanheads/obsidian-mcp-server.git
cd obsidian-mcp-server

# Install dependencies
npm install

# Build the server
npm run build
```

#### Step 3: Configure Claude Desktop

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "/path/to/obsidian-mcp-server/build/index.js"
      ],
      "env": {
        "OBSIDIAN_REST_API_KEY": "your-api-key-here",
        "OBSIDIAN_REST_API_URL": "http://localhost:27124"
      }
    }
  }
}
```

#### Step 4: Test the Connection

1. Restart Claude Desktop
2. Look for "obsidian" in available tools
3. Try a test query:

```
Can you list all coffee origins in my vault?
```

Claude should be able to access and read your vault files!

---

### Option 2: obsidian-mcp-tools (Plugin-Based)

**Best for**: Seamless integration, semantic search, Templater support

#### Step 1: Install MCP Tools Plugin

1. Open Obsidian Settings → Community Plugins
2. Search for "MCP Tools"
3. Install and enable

#### Step 2: Configure Plugin

1. Go to Settings → MCP Tools
2. Choose your model provider:
   - **Ollama** (local, private, free)
   - **OpenAI** (GPT-4)
   - **Anthropic** (Claude)
   - **OpenRouter** (100+ models)

3. Enter API credentials

#### Step 3: Enable Features

- ✅ **Vault Access**: Let AI read and write notes
- ✅ **Semantic Search**: Find notes by meaning, not just keywords
- ✅ **Templater Integration**: Use AI in template prompts
- ⚠️ **Auto-sync**: Enable real-time synchronization (optional)

#### Step 4: Test Semantic Search

1. Open Command Palette (Cmd/Ctrl + P)
2. Run "MCP Tools: Semantic Search"
3. Try: "coffees with blueberry notes"

Results should show relevant beans even if "blueberry" isn't explicitly mentioned!

---

### Option 3: Local LLM with Ollama (Privacy-First)

**Best for**: Complete privacy, no API costs, offline use

#### Step 1: Install Ollama

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download
```

#### Step 2: Download Models

```bash
# Recommended for Coffee Vault (balanced performance/quality)
ollama pull llama3.1:8b

# Alternative options
ollama pull mistral:7b      # Faster, less capable
ollama pull mixtral:8x7b    # Slower, more capable
ollama pull phi3:medium     # Efficient, good for Q&A
```

#### Step 3: Configure Smart Connections

1. Install "Smart Connections" plugin in Obsidian
2. Settings → Smart Connections → Language Model
3. Select "Ollama"
4. Model: `llama3.1:8b`
5. Endpoint: `http://localhost:11434`

#### Step 4: Generate Embeddings

1. Smart Connections Settings → Embeddings
2. Click "Generate Embeddings for Vault"
3. Wait for processing (1,000 notes ≈ 5-10 minutes)

#### Step 5: Chat with Your Vault

1. Open Command Palette
2. Run "Smart Connections: Chat"
3. Ask questions:

```
What are the key differences between Ethiopian and Kenyan coffees?
```

The AI will search your vault and provide answers based on your notes!

---

## Coffee Vault-Specific Use Cases

### 1. Brewing Optimization

**Prompt**:
```
Based on my coffee logs, what parameters should I adjust to improve
extraction for light roast Ethiopian coffees?
```

**What the AI does**:
- Reads all logs with Ethiopian beans
- Analyzes grind size, temperature, time patterns
- Compares successful vs unsuccessful brews
- Recommends specific parameter changes

### 2. Origin Discovery

**Prompt**:
```
I love fruity, wine-like coffees. What origins should I try next that
I haven't logged yet?
```

**What the AI does**:
- Scans origin profiles for flavor characteristics
- Cross-references with your logged coffees
- Recommends unexplored regions
- Explains why each suggestion matches your palate

### 3. Method Matching

**Prompt**:
```
What brewing method would best highlight the characteristics of this
Kenya AA Nyeri honey processed coffee?
```

**What the AI does**:
- Analyzes the bean's processing and flavor notes
- Reviews method profiles
- Considers your skill level and equipment
- Suggests optimal method with reasoning

### 4. Research Synthesis

**Prompt**:
```
Summarize what my vault says about the relationship between water
chemistry and extraction, including citations.
```

**What the AI does**:
- Searches scientific references
- Extracts key findings about water chemistry
- Synthesizes information from multiple papers
- Provides properly formatted citations

### 5. Automated Note Generation

**Prompt**:
```
Create a new bean profile for "Guatemala Huehuetenango Finca El Injerto
Bourbon Natural" using the standard template. The farm is at 1,800 masl,
known for chocolate and stone fruit notes, with SCA score of 87.5.
```

**What the AI does**:
- Uses Bean Profile template
- Fills in all YAML frontmatter
- Adds structured content sections
- Creates file in proper location
- Links to Guatemala origin note

### 6. Recipe Refinement

**Prompt**:
```
Analyze my last 10 V60 brews and suggest a refined recipe that optimizes
for consistency and high extraction.
```

**What the AI does**:
- Loads last 10 V60 logs
- Calculates parameter distributions
- Identifies correlation between parameters and rating
- Generates optimized recipe with confidence intervals

---

## Advanced Workflows

### Workflow 1: Daily Coffee Companion

**Morning Setup**:
```
Good morning! What beans do I have available, and based on my recent
preferences and the weather today (check via API), what should I brew?
```

**AI Response**:
- Lists beans from inventory with quantities
- Analyzes recent 30-day ratings and trends
- Checks weather (cool = fuller body recommendations)
- Suggests bean + method combination
- Provides recipe

### Workflow 2: Competition Prep

**Prompt**:
```
I'm preparing for the World Brewers Cup. Analyze winning routines
from the last 5 years and help me design a presentation for my
Ethiopian natural anaerobic coffee.
```

**AI Actions**:
- Searches WBC routine notes
- Identifies trends (signature beverages, presentations, techniques)
- Analyzes your bean's unique qualities
- Drafts presentation structure
- Suggests tasting notes phrasing
- Recommends recipe optimization experiments

### Workflow 3: Roast Development

**Prompt**:
```
I'm roasting this Colombian coffee tomorrow. Based on similar origins
and processing in my vault, what development strategy would maximize
sweetness and clarity?
```

**AI Guidance**:
- Reviews Colombian roast profiles
- Analyzes flavor outcomes from past roasts
- Suggests DTR (Development Time Ratio)
- Recommends first crack timing
- Provides troubleshooting for common defects

### Workflow 4: Scientific Deep Dive

**Prompt**:
```
I want to understand chlorogenic acid degradation during roasting.
Search my scientific references and create a comprehensive note with
synthesis of findings, chemical structures, and citations.
```

**AI Deliverable**:
- New note: "Chlorogenic Acid Degradation"
- Chemical structure diagrams (via CDN or local)
- Temperature-dependent degradation curves
- Flavor impact analysis
- Full bibliography with DOIs

---

## Security & Privacy

### ⚠️ Important Considerations

1. **Full Vault Access**: MCP gives AI complete read/write/delete access to your vault
2. **Cloud AI Services**: Using Claude/ChatGPT sends your data to their servers
3. **API Keys**: Protect your API keys; they grant full access

### 🔒 Best Practices

#### Use Local LLMs for Sensitive Data
```bash
# Ollama keeps everything on your machine
ollama run llama3.1:8b
```

#### Read-Only MCP Configuration
```json
{
  "mcpServers": {
    "obsidian-readonly": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "OBSIDIAN_READ_ONLY": "true"
      }
    }
  }
}
```

#### Vault Backups
```bash
# Automated daily backups before using AI tools
#!/bin/bash
cp -r ~/coffee-vault ~/coffee-vault-backups/coffee-vault-$(date +\%Y\%m\%d)
```

#### Excluded Folders
Create `.mcpignore`:
```
Private/
Sensitive/
Archive/
.obsidian/
```

---

## Troubleshooting

### Issue: Claude can't connect to vault

**Solutions**:
1. Verify Local REST API plugin is enabled
2. Check API key is correct in config
3. Ensure Obsidian is running
4. Test REST API:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://localhost:27124/vault
   ```

### Issue: Semantic search returns irrelevant results

**Solutions**:
1. Regenerate embeddings (may be stale)
2. Try different embedding model
3. Increase similarity threshold
4. Use more specific queries

### Issue: AI responses are slow

**Solutions**:
1. Use smaller local models (phi3, mistral)
2. Reduce context window size
3. Limit number of notes searched
4. Use caching for repeated queries

### Issue: Embeddings generation failed

**Solutions**:
1. Check available disk space (embeddings = ~500MB for 1,000 notes)
2. Reduce batch size in settings
3. Exclude attachments folder
4. Try different embedding model

---

## Performance Optimization

### For 1,000+ Notes

1. **Selective Indexing**: Only index frequently accessed folders
2. **Incremental Updates**: Re-embed only changed notes
3. **Cached Queries**: Store common query results
4. **Batched Operations**: Process multiple requests together

### Recommended Hardware

- **Minimum**: 8GB RAM, 10GB storage
- **Recommended**: 16GB RAM, 20GB storage, GPU
- **Optimal**: 32GB RAM, 50GB storage, NVIDIA GPU (for local LLMs)

---

## Next Steps

1. ✅ Install MCP server or plugin
2. ✅ Test basic queries
3. ✅ Generate embeddings (if using semantic search)
4. ✅ Try Coffee Vault-specific prompts
5. ✅ Set up automated workflows
6. ✅ Configure backups
7. ⏳ Explore Neo4j integration (advanced)
8. ⏳ Build custom MCP tools

---

## Resources

### Official Documentation
- [MCP Protocol Spec](https://spec.modelcontextprotocol.io/)
- [Obsidian MCP Server GitHub](https://github.com/cyanheads/obsidian-mcp-server)
- [Smart Connections Plugin](https://github.com/brianpetro/obsidian-smart-connections)
- [Ollama Documentation](https://ollama.com/docs)

### Community
- [Obsidian Discord](https://discord.gg/obsidianmd) - #ai-tools channel
- [r/ObsidianMD](https://reddit.com/r/ObsidianMD) - AI integration discussions
- [Coffee Vault Community](https://github.com/coffee-vault) - Coffee-specific workflows

### Video Tutorials
- [MCP Setup Walkthrough](https://youtube.com/watch?v=example) (coming soon)
- [Local LLM Integration](https://youtube.com/watch?v=example) (coming soon)
- [Advanced AI Workflows](https://youtube.com/watch?v=example) (coming soon)

---

**Ready to give Coffee Vault an AI brain? Pick your installation option above and start exploring!**

*Last Updated: 2025-11-10*
*Compatible with: Coffee Vault 1000, Obsidian 1.4+, MCP v2025-03-26*
