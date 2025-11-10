# Neo4j Knowledge Graph Schema
## Coffee Vault 1000 - Graph Database Architecture

**Version**: 1.0.0
**Last Updated**: 2025-11-10
**Purpose**: Define the complete graph schema for representing coffee knowledge

---

## Overview

This Neo4j schema transforms Coffee Vault's 1,000 notes into a living knowledge graph with:
- **10,000+ nodes** across 15 types
- **50,000+ relationships** across 25 types
- **Rich properties** from YAML frontmatter
- **Graph algorithms** for discovery and recommendation

---

## Node Types

### 1. Origin (Country/Region)
```cypher
CREATE (o:Origin {
  id: 'ethiopia-yirgacheffe',
  name: 'Yirgacheffe',
  country: 'Ethiopia',
  region: 'Sidamo',
  altitude: '1,700-2,200 masl',
  soil: 'Volcanic loam',
  climate: 'Subtropical highland',
  mainHarvest: 'October-December',
  processing: ['Washed', 'Natural'],
  knownFor: 'Floral and citrus notes',
  coordinates: {lat: 6.1538, lon: 38.2070}
})
```

**Properties**:
- Geographic data (coordinates, altitude, climate)
- Processing methods available
- Harvest seasons
- Flavor associations
- Production volume
- Certifications

### 2. Bean (Specific Coffee)
```cypher
CREATE (b:Bean {
  id: 'ethiopia-yirgacheffe-natural-g1',
  name: 'Yirgacheffe Natural Grade 1',
  variety: 'Heirloom',
  processing: 'Natural',
  grade: 'Grade 1',
  cropYear: '2024',
  roastLevel: 'Light',
  pricePerKg: 45.00,
  available: true,
  cuppingScore: 88.5,
  certifications: ['Organic', 'Fair Trade']
})
```

**Properties**:
- Variety/cultivar
- Processing method
- Grade/quality score
- Pricing
- Availability
- Certifications
- Cupping scores

### 3. Flavor (Descriptors)
```cypher
CREATE (f:Flavor {
  id: 'blueberry',
  name: 'Blueberry',
  category: 'Fruit',
  subcategory: 'Berry',
  intensity: 'Medium',
  compound: '2-methylbutanoic acid',
  chemicalFamily: 'Organic acid',
  threshold: '0.5 ppm'
})
```

**Properties**:
- Flavor category hierarchy
- Associated chemical compounds
- Detection thresholds
- Intensity levels
- Positive/negative association

### 4. Method (Brewing Technique)
```cypher
CREATE (m:Method {
  id: 'v60',
  name: 'Hario V60',
  type: 'Pour-over',
  category: 'Percolation',
  inventor: 'Hario',
  yearIntroduced: 2005,
  difficulty: 'Medium',
  idealFor: ['Light roasts', 'Fruity coffees'],
  typicalRatio: '1:16',
  brewTime: '2.5-3.5 min'
})
```

**Properties**:
- Method category
- Equipment requirements
- Skill level
- Ideal coffee types
- Parameter ranges
- Popular variations

### 5. Equipment (Tools & Machines)
```cypher
CREATE (e:Equipment {
  id: 'comandante-c40',
  name: 'Comandante C40 MK4',
  type: 'Hand Grinder',
  category: 'Grinder',
  burrType: 'Conical',
  burrMaterial: 'Stainless steel',
  manufacturer: 'Comandante',
  price: 299.00,
  releaseYear: 2014,
  rating: 4.8
})
```

**Properties**:
- Equipment specifications
- Pricing and availability
- User ratings
- Compatibility
- Maintenance requirements

### 6. Technique (Specific Practice)
```cypher
CREATE (t:Technique {
  id: 'wdt-distribution',
  name: 'Weiss Distribution Technique (WDT)',
  category: 'Distribution',
  usedIn: ['Espresso'],
  difficulty: 'Easy',
  impact: 'High',
  description: 'Stirring coffee grounds with thin needles to break clumps',
  tools: ['WDT tool', 'Dosing funnel']
})
```

**Properties**:
- Technique category
- Applicable methods
- Difficulty and impact
- Required tools
- Video tutorials

### 7. Compound (Chemical)
```cypher
CREATE (c:Compound {
  id: '2-furfurylthiol',
  name: '2-Furfurylthiol',
  formula: 'C5H6OS',
  molecularWeight: 114.17,
  flavor: 'Roasted coffee',
  threshold: '0.005 ppb',
  formationTemp: '200-220°C',
  category: 'Sulfur-containing'
})
```

**Properties**:
- Chemical formula
- Molecular properties
- Flavor contribution
- Formation conditions
- Detection threshold

### 8. Process (Post-harvest)
```cypher
CREATE (p:Process {
  id: 'carbonic-maceration',
  name: 'Carbonic Maceration',
  category: 'Anaerobic Fermentation',
  duration: '48-120 hours',
  temperature: '15-25°C',
  flavorImpact: ['Fruit-forward', 'Complex', 'Wine-like'],
  difficulty: 'Advanced',
  equipment: ['Sealed tanks', 'CO2 injection']
})
```

**Properties**:
- Process steps
- Duration and conditions
- Flavor impact
- Equipment needs
- Risk factors

### 9. Recipe (Brew Formula)
```cypher
CREATE (r:Recipe {
  id: 'classic-v60-light-roast',
  name: 'Classic V60 for Light Roasts',
  method: 'V60',
  coffeeGrams: 20,
  waterGrams: 320,
  ratio: '1:16',
  grindSize: '7/10',
  waterTemp: 94,
  totalTime: 180,
  pourPattern: '50g bloom, 120g at 0:45, 150g at 1:30',
  author: 'James Hoffmann'
})
```

**Properties**:
- All brewing parameters
- Step-by-step instructions
- Expected results
- Variations
- Creator/source

### 10. Paper (Research)
```cypher
CREATE (p:Paper {
  id: 'petracco-2001-espresso',
  title: 'Technology IV: Beverage Preparation: Brewing Trends for the New Millennium',
  authors: ['M. Petracco'],
  year: 2001,
  journal: 'Coffee: Recent Developments',
  doi: '10.1002/9780470690499.ch11',
  citations: 147,
  keyFindings: ['Espresso extraction models', 'Optimal parameters']
})
```

**Properties**:
- Citation metadata
- DOI and links
- Key findings
- Related topics
- Citation count

### 11. Person (Expert/Influencer)
```cypher
CREATE (p:Person {
  id: 'james-hoffmann',
  name: 'James Hoffmann',
  role: ['World Barista Champion', 'Author', 'YouTuber'],
  achievements: ['WBC 2007'],
  affiliation: 'Square Mile Coffee Roasters',
  website: 'https://jameshoffmann.co.uk',
  youtube: '@jameshoffmann',
  influence: 'Very High'
})
```

**Properties**:
- Professional roles
- Achievements
- Social media
- Affiliations
- Expertise areas

### 12. Company (Roaster/Manufacturer)
```cypher
CREATE (c:Company {
  id: 'la-marzocco',
  name: 'La Marzocco',
  type: 'Manufacturer',
  founded: 1927,
  headquarters: 'Florence, Italy',
  products: ['Espresso machines'],
  reputation: 'Premium',
  website: 'https://lamarzocco.com'
})
```

**Properties**:
- Company info
- Product lines
- Reputation
- Contact info

### 13. Event (Competition/Festival)
```cypher
CREATE (e:Event {
  id: 'wbc-2024',
  name: 'World Barista Championship 2024',
  type: 'Competition',
  year: 2024,
  location: 'Milan, Italy',
  winner: 'TBD',
  participants: 50,
  organizer: 'World Coffee Events'
})
```

**Properties**:
- Event details
- Winners
- Significant moments
- Video links

### 14. CoffeeLog (Personal Entry)
```cypher
CREATE (l:CoffeeLog {
  id: 'log-2024-11-10-001',
  date: '2024-11-10',
  beanUsed: 'ethiopia-yirgacheffe-natural-g1',
  method: 'v60',
  dose: 20,
  yield: 320,
  grindSize: 7,
  waterTemp: 94,
  rating: 92,
  notes: 'Incredible blueberry notes, clean finish'
})
```

**Properties**:
- All brew parameters
- Tasting notes
- Ratings
- Photos
- Extraction data

### 15. Concept (Abstract Idea)
```cypher
CREATE (c:Concept {
  id: 'extraction-yield',
  name: 'Extraction Yield',
  category: 'Brewing Science',
  definition: 'Percentage of coffee mass dissolved into water',
  formula: '(TDS * Brew Weight) / Dose Weight',
  idealRange: '18-22%',
  relatedConcepts: ['TDS', 'Strength', 'Brew ratio']
})
```

**Properties**:
- Definitions
- Formulas
- Ideal ranges
- Related concepts

---

## Relationship Types

### Geographic Relationships
1. **GROWN_IN**
   ```cypher
   (Bean)-[:GROWN_IN {altitude: '1800 masl', farm: 'Kilenso Mokonisa'}]->(Origin)
   ```

2. **BORDERS**
   ```cypher
   (Origin)-[:BORDERS {sharedCharacteristics: ['Highland', 'Volcanic']}]->(Origin)
   ```

### Sensory Relationships
3. **HAS_FLAVOR**
   ```cypher
   (Bean)-[:HAS_FLAVOR {
     intensity: 8/10,
     dominance: 'Primary',
     confidence: 0.92,
     descriptors: ['Bright', 'Juicy']
   }]->(Flavor)
   ```

4. **SIMILAR_TO**
   ```cypher
   (Flavor)-[:SIMILAR_TO {
     similarity: 0.85,
     sharedCompounds: ['Esters'],
     type: 'Aromatic'
   }]->(Flavor)
   ```

5. **CONTAINS_COMPOUND**
   ```cypher
   (Bean)-[:CONTAINS_COMPOUND {
     concentration: '450 ppm',
     significance: 'High'
   }]->(Compound)
   ```

6. **PRODUCES_FLAVOR**
   ```cypher
   (Compound)-[:PRODUCES_FLAVOR {
     mechanism: 'Volatile aromatic',
     threshold: '0.5 ppm'
   }]->(Flavor)
   ```

### Processing Relationships
7. **PROCESSED_WITH**
   ```cypher
   (Bean)-[:PROCESSED_WITH {
     duration: '72 hours',
     fermentation: 'Anaerobic',
     producer: 'Daye Bensa'
   }]->(Process)
   ```

8. **ENHANCES_FLAVOR**
   ```cypher
   (Process)-[:ENHANCES_FLAVOR {
     mechanism: 'Fermentation byproducts',
     intensity: '+40%'
   }]->(Flavor)
   ```

### Brewing Relationships
9. **BREWED_WITH**
   ```cypher
   (CoffeeLog)-[:BREWED_WITH]->(Method)
   ```

10. **USES_EQUIPMENT**
    ```cypher
    (Method)-[:USES_EQUIPMENT {
      role: 'Primary',
      required: true,
      alternatives: ['Kalita Wave', 'Chemex']
    }]->(Equipment)
    ```

11. **FOLLOWS_RECIPE**
    ```cypher
    (CoffeeLog)-[:FOLLOWS_RECIPE {
      adherence: 0.95,
      modifications: ['Water temp +2°C']
    }]->(Recipe)
    ```

12. **APPLIES_TECHNIQUE**
    ```cypher
    (Recipe)-[:APPLIES_TECHNIQUE {
      timing: 'Pre-brew',
      importance: 'High'
    }]->(Technique)
    ```

13. **OPTIMIZED_FOR**
    ```cypher
    (Method)-[:OPTIMIZED_FOR {
      roastLevel: ['Light', 'Light-Medium'],
      reason: 'Preserves delicate flavors'
    }]->(Bean)
    ```

### Knowledge Relationships
14. **CITED_IN**
    ```cypher
    (Concept)-[:CITED_IN {
      page: 42,
      context: 'Extraction modeling'
    }]->(Paper)
    ```

15. **AUTHORED_BY**
    ```cypher
    (Paper)-[:AUTHORED_BY {
      role: 'Lead author',
      affiliation: 'UC Davis'
    }]->(Person)
    ```

16. **REFERENCES**
    ```cypher
    (Paper)-[:REFERENCES {
      citationType: 'Supporting evidence',
      relevance: 'High'
    }]->(Paper)
    ```

### Product Relationships
17. **MANUFACTURED_BY**
    ```cypher
    (Equipment)-[:MANUFACTURED_BY {
      since: 2014,
      currentModel: 'MK4'
    }]->(Company)
    ```

18. **ROASTED_BY**
    ```cypher
    (Bean)-[:ROASTED_BY {
      date: '2024-11-01',
      profile: 'Light Nordic style',
      roaster: 'Tim Wendelboe'
    }]->(Company)
    ```

### Competition Relationships
19. **COMPETED_IN**
    ```cypher
    (Person)-[:COMPETED_IN {
      placement: 1,
      score: 88.5,
      year: 2024
    }]->(Event)
    ```

20. **USED_IN_COMPETITION**
    ```cypher
    (Event)-[:USED_IN_COMPETITION {
      round: 'Finals',
      performance: 'Winning routine'
    }]->(Bean)
    ```

### Derivation Relationships
21. **DERIVED_FROM**
    ```cypher
    (Concept)-[:DERIVED_FROM {
      formula: 'TDS * Brew Weight / Dose',
      dependency: 'Requires TDS measurement'
    }]->(Concept)
    ```

22. **VARIANT_OF**
    ```cypher
    (Method)-[:VARIANT_OF {
      modification: 'Inverted',
      creator: 'Community'
    }]->(Method)
    ```

### Temporal Relationships
23. **PRECEDED_BY**
    ```cypher
    (Process)-[:PRECEDED_BY {
      stage: 'Post-harvest',
      order: 1
    }]->(Process)
    ```

24. **INFLUENCED_BY**
    ```cypher
    (Method)-[:INFLUENCED_BY {
      aspect: 'Technique',
      degree: 'Significant'
    }]->(Person)
    ```

### Quality Relationships
25. **RATED**
    ```cypher
    (Person)-[:RATED {
      score: 92,
      date: '2024-11-10',
      notes: 'Exceptional clarity'
    }]->(CoffeeLog)
    ```

---

## Example Queries

### 1. Find Similar Coffees by Flavor Profile
```cypher
// Find coffees similar to Ethiopian Yirgacheffe based on shared flavors
MATCH (b1:Bean {name: 'Yirgacheffe Natural Grade 1'})-[:HAS_FLAVOR]->(f:Flavor)
MATCH (b2:Bean)-[:HAS_FLAVOR]->(f)
WHERE b1 <> b2
WITH b2, COUNT(f) AS sharedFlavors
RETURN b2.name, sharedFlavors
ORDER BY sharedFlavors DESC
LIMIT 10
```

### 2. Recipe Recommendation Engine
```cypher
// Find best recipe for a given bean based on community ratings
MATCH (b:Bean {id: 'kenya-aa-nyeri'})<-[:OPTIMIZED_FOR]-(m:Method)
MATCH (r:Recipe)-[:FOLLOWS_RECIPE]->(l:CoffeeLog)-[:BREWED_WITH]->(m)
WHERE l.rating >= 90
RETURN r.name, AVG(l.rating) AS avgRating, COUNT(l) AS timesUsed
ORDER BY avgRating DESC, timesUsed DESC
LIMIT 5
```

### 3. Flavor Compound Analysis
```cypher
// Trace flavor from compound to taste
MATCH path = (c:Compound)-[:PRODUCES_FLAVOR]->(f:Flavor)<-[:HAS_FLAVOR]-(b:Bean)
WHERE c.name = '2-Furfurylthiol'
RETURN path
```

### 4. Equipment Compatibility Matrix
```cypher
// Find all compatible equipment for a brewing method
MATCH (m:Method {name: 'Espresso'})-[:USES_EQUIPMENT]->(e:Equipment)
RETURN e.type, COLLECT(e.name) AS options
ORDER BY e.type
```

### 5. Community Detection - Flavor Families
```cypher
// Use Louvain algorithm to find flavor communities
CALL gds.louvain.stream('flavorGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS flavor,
       communityId AS flavorFamily
ORDER BY flavorFamily, flavor
```

### 6. PageRank - Most Influential Papers
```cypher
// Find most cited papers using PageRank
CALL gds.pageRank.stream('citationNetwork')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).title AS paper,
       score AS influence
ORDER BY score DESC
LIMIT 20
```

### 7. Shortest Path - Knowledge Journey
```cypher
// How is "Extraction Yield" connected to "Blueberry Flavor"?
MATCH path = shortestPath(
  (c1:Concept {name: 'Extraction Yield'})-[*]-(f:Flavor {name: 'Blueberry'})
)
RETURN path
```

### 8. Temporal Analysis - Brewing Evolution
```cypher
// Track how brewing parameters changed over time
MATCH (l:CoffeeLog)-[:USED_BEAN]->(b:Bean {id: 'ethiopia-yirgacheffe'})
RETURN l.date,
       AVG(l.grindSize) AS avgGrind,
       AVG(l.rating) AS avgRating
ORDER BY l.date
```

### 9. Supply Chain Tracing
```cypher
// Full supply chain from origin to cup
MATCH path = (o:Origin)<-[:GROWN_IN]-(b:Bean)-[:ROASTED_BY]->(c:Company),
             (b)-[:BREWED_WITH]->(m:Method)-[:USES_EQUIPMENT]->(e:Equipment)
WHERE o.name = 'Yirgacheffe'
RETURN path
```

### 10. Expertise Network
```cypher
// Find experts in a specific area based on authorship and competition wins
MATCH (p:Person)-[:AUTHORED_BY]-(paper:Paper)
WHERE paper.keyFindings CONTAINS 'Extraction'
WITH p, COUNT(paper) AS papers
OPTIONAL MATCH (p)-[:COMPETED_IN {placement: 1}]->(e:Event)
RETURN p.name, papers, COUNT(e) AS championships
ORDER BY papers DESC, championships DESC
```

---

## Graph Algorithms

### 1. Similarity - Cosine Similarity on Flavor Vectors
```cypher
// Create flavor vector embeddings and calculate similarity
CALL gds.nodeSimilarity.stream('coffeeGraph', {
  topK: 10,
  similarityMetric: 'COSINE'
})
YIELD node1, node2, similarity
WHERE gds.util.asNode(node1):Bean AND gds.util.asNode(node2):Bean
RETURN gds.util.asNode(node1).name AS coffee1,
       gds.util.asNode(node2).name AS coffee2,
       similarity
ORDER BY similarity DESC
LIMIT 100
```

### 2. Centrality - Betweenness Centrality for Key Connectors
```cypher
// Find the most "connecting" concepts in the knowledge graph
CALL gds.betweenness.stream('knowledgeGraph')
YIELD nodeId, score
WHERE gds.util.asNode(nodeId):Concept
RETURN gds.util.asNode(nodeId).name AS concept,
       score AS connectingPower
ORDER BY score DESC
LIMIT 20
```

### 3. Link Prediction - Suggest Missing Relationships
```cypher
// Predict missing OPTIMIZED_FOR relationships
CALL gds.linkPrediction.predict.stream('coffeeGraph', {
  modelName: 'brewing-optimization-model',
  relationshipTypes: ['OPTIMIZED_FOR'],
  topK: 50
})
YIELD node1, node2, probability
RETURN gds.util.asNode(node1).name AS method,
       gds.util.asNode(node2).name AS bean,
       probability
ORDER BY probability DESC
```

---

## Data Import Strategy

### Step 1: Extract from Obsidian Vault
```javascript
// Node.js script to parse vault and generate Cypher
import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs/promises';

const files = await glob('**/*.md', { cwd: vaultPath });
const cypherStatements = [];

for (const file of files) {
  const content = await fs.readFile(file, 'utf-8');
  const { data } = matter(content);

  // Generate CREATE statement based on file type
  if (data.type === 'origin') {
    cypherStatements.push(`
      CREATE (:Origin {
        id: '${slugify(data.name)}',
        name: '${data.name}',
        country: '${data.country}',
        ...
      })
    `);
  }
}
```

### Step 2: Bulk Import with neo4j-admin
```bash
# Generate CSV files from parsed data
node scripts/generate-neo4j-csv.js

# Bulk import
neo4j-admin database import full \
  --nodes=Origin=origins.csv \
  --nodes=Bean=beans.csv \
  --nodes=Flavor=flavors.csv \
  --relationships=HAS_FLAVOR=has_flavor.csv \
  --relationships=GROWN_IN=grown_in.csv \
  coffee-vault
```

### Step 3: Create Indexes and Constraints
```cypher
// Uniqueness constraints
CREATE CONSTRAINT unique_origin_id FOR (o:Origin) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT unique_bean_id FOR (b:Bean) REQUIRE b.id IS UNIQUE;
CREATE CONSTRAINT unique_flavor_id FOR (f:Flavor) REQUIRE f.id IS UNIQUE;

// Indexes for fast lookup
CREATE INDEX origin_country FOR (o:Origin) ON (o.country);
CREATE INDEX bean_roast_level FOR (b:Bean) ON (b.roastLevel);
CREATE INDEX flavor_category FOR (f:Flavor) ON (f.category);

// Full-text search indexes
CREATE FULLTEXT INDEX flavor_search FOR (f:Flavor) ON EACH [f.name, f.category];
CREATE FULLTEXT INDEX paper_search FOR (p:Paper) ON EACH [p.title, p.keyFindings];
```

---

## Maintenance & Evolution

### Auto-sync from Obsidian
```javascript
// Watch vault for changes and update Neo4j
import chokidar from 'chokidar';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

chokidar.watch(vaultPath).on('change', async (path) => {
  const content = await fs.readFile(path, 'utf-8');
  const { data } = matter(content);

  const session = driver.session();
  await session.run(`
    MERGE (n:${data.type} {id: $id})
    SET n += $properties
  `, { id: data.id, properties: data });
  await session.close();
});
```

### Backup Strategy
```bash
# Daily backup
0 2 * * * neo4j-admin database dump coffee-vault \
  --to=/backups/coffee-vault-$(date +\%Y\%m\%d).dump
```

---

## Visualization with Neo4j Bloom

### Perspectives
1. **Bean Explorer**: Focus on beans, origins, flavors
2. **Brewing Science**: Methods, equipment, techniques, recipes
3. **Research Network**: Papers, authors, citations
4. **Supply Chain**: Origins, companies, processes

### Categories and Rules
- **Origins**: Green nodes, size by production volume
- **Beans**: Brown nodes, size by rating
- **Flavors**: Colored by category (fruit=red, floral=purple, etc.)
- **Methods**: Blue nodes, size by popularity

---

## Conclusion

This Neo4j schema transforms Coffee Vault into a **living, queryable knowledge graph** where:
- Every piece of information is connected
- Complex questions get instant answers
- Hidden patterns emerge through graph algorithms
- The system grows smarter with every addition

**Next Steps**:
1. Implement CSV export from Obsidian vault
2. Bulk import to Neo4j
3. Create Bloom perspectives
4. Develop API for querying
5. Integrate with MCP for AI access

---

*Schema Version: 1.0.0*
*Compatible with: Neo4j 5.x, Obsidian Vault 1000*
*Last Updated: 2025-11-10*
