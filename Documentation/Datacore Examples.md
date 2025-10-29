---
type: reference
tags: [datacore, queries, reference, jsx, react]
---

# ⚡ Datacore Query Examples

**React-powered queries for your coffee data**

Datacore is a next-generation query plugin using JSX/React syntax. It's 2-100x faster than Dataview with no content flickering and seamless updates.

**Prerequisites**: Install Datacore plugin (Community Plugins → "Datacore")

---

## 🎯 Why Datacore?

### Advantages Over Dataview

✅ **Performance**: 2-100x faster, no flicker  
✅ **React Components**: Full component system  
✅ **Inline Editing**: Modify properties directly in tables  
✅ **State Management**: React hooks for complex interactions  
✅ **Modern Syntax**: JSX instead of custom query language  
✅ **Reusable**: Create component libraries

### When to Use

- Large vaults (100+ coffee logs)
- Interactive tables (inline editing)
- Complex calculations
- Custom UI components
- Real-time updates

---

## 📋 Basic Syntax

### Simple Table

````jsx
```datacore
const coffees = dc.pages('"Coffee Logs"');

return <dc.Table 
  rows={coffees}
  columns={[
    {id: "Date", value: coffee => coffee.date},
    {id: "Beans", value: coffee => coffee.beans},
    {id: "Rating", value: coffee => coffee.rating}
  ]}
/>
```
````

### With Filtering

````jsx
```datacore
const topRated = dc.pages('"Coffee Logs"')
  .where(p => p.rating >= 4)
  .sort(p => p.date, 'desc');

return <dc.Table 
  rows={topRated}
  columns={[
    {id: "⭐", value: c => c.rating},
    {id: "Beans", value: c => c.$link},
    {id: "Origin", value: c => c.origin}
  ]}
/>
```
````

---

## ☕ Coffee Log Queries

### All Coffee Logs (Sorted)

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc');

return <dc.Table 
  rows={logs}
  columns={[
    {id: "Date", value: log => log.date},
    {id: "☕ Beans", value: log => log.$link},
    {id: "⭐ Rating", value: log => log.rating},
    {id: "Method", value: log => log["brew-method"]},
    {id: "Origin", value: log => log.origin}
  ]}
  paging={20}
/>
```
````

### Top Rated This Month

````jsx
```datacore
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const thisMonth = dc.pages('"Coffee Logs"')
  .where(p => {
    const logDate = new Date(p.date);
    return logDate >= firstDay && logDate <= lastDay && p.rating >= 4.5;
  })
  .sort(p => p.rating, 'desc');

return <dc.Table 
  rows={thisMonth}
  columns={[
    {id: "⭐ Rating", value: c => c.rating},
    {id: "☕ Beans", value: c => c.beans},
    {id: "Roaster", value: c => c.roaster},
    {id: "Date", value: c => c.date}
  ]}
/>
```
````

### Recent Sessions (Last 7 Days)

````jsx
```datacore
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const recent = dc.pages('"Coffee Logs"')
  .where(p => new Date(p.date) >= weekAgo)
  .sort(p => p.date, 'desc');

return <dc.Table 
  rows={recent}
  columns={[
    {id: "Date", value: log => log.date},
    {id: "Beans", value: log => log.beans},
    {id: "⭐", value: log => log.rating},
    {id: "Method", value: log => log["brew-method"]}
  ]}
/>
```
````

---

## 📊 Statistical Queries

### Overall Statistics Card

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').where(p => p.type === "coffee-log");
const totalLogs = logs.length;
const avgRating = logs.length > 0 ? logs.average(p => p.rating) : 0;
const totalCups = logs.sum(p => p["cups-brewed"] || 0);
const topRated = logs.filter(p => p.rating >= 4.5).length;

return <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  padding: '1rem'
}}>
  <div style={{background: '#FFF9F0', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D2691E'}}>
    <h3>Total Sessions</h3>
    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3E2723'}}>{totalLogs}</div>
  </div>
  <div style={{background: '#FFF9F0', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D2691E'}}>
    <h3>Average Rating</h3>
    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3E2723'}}>{avgRating.toFixed(2)}/5</div>
  </div>
  <div style={{background: '#FFF9F0', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D2691E'}}>
    <h3>Total Cups</h3>
    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3E2723'}}>{totalCups}</div>
  </div>
  <div style={{background: '#FFF9F0', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #D2691E'}}>
    <h3>Top Rated (4.5+)</h3>
    <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3E2723'}}>{topRated}</div>
  </div>
</div>
```
````

### Monthly Breakdown

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"');

// Group by month
const byMonth = {};
logs.forEach(log => {
  if (!log.date) return;
  const month = log.date.toString().substring(0, 7); // YYYY-MM
  if (!byMonth[month]) {
    byMonth[month] = {sessions: 0, totalRating: 0, totalCups: 0};
  }
  byMonth[month].sessions++;
  byMonth[month].totalRating += log.rating || 0;
  byMonth[month].totalCups += log["cups-brewed"] || 0;
});

const monthData = Object.entries(byMonth)
  .map(([month, stats]) => ({
    month,
    sessions: stats.sessions,
    avgRating: (stats.totalRating / stats.sessions).toFixed(2),
    totalCups: stats.totalCups
  }))
  .sort((a, b) => b.month.localeCompare(a.month));

return <dc.Table 
  rows={monthData}
  columns={[
    {id: "Month", value: d => d.month},
    {id: "Sessions", value: d => d.sessions},
    {id: "Avg ⭐", value: d => d.avgRating},
    {id: "Total Cups", value: d => d.totalCups}
  ]}
/>
```
````

---

## 🌍 Origin-Based Queries

### Coffees by Origin

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').where(p => p.origin === "Ethiopia");

return <dc.Table 
  rows={logs.sort(p => p.rating, 'desc')}
  columns={[
    {id: "⭐ Rating", value: c => c.rating},
    {id: "☕ Beans", value: c => c.$link},
    {id: "Roaster", value: c => c.roaster},
    {id: "Date", value: c => c.date}
  ]}
/>
```
````

### Average Rating by Origin

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').where(p => p.origin);

// Group by origin
const byOrigin = {};
logs.forEach(log => {
  const origin = log.origin;
  if (!byOrigin[origin]) {
    byOrigin[origin] = {count: 0, totalRating: 0, ratings: []};
  }
  byOrigin[origin].count++;
  byOrigin[origin].totalRating += log.rating || 0;
  byOrigin[origin].ratings.push(log.rating);
});

const originStats = Object.entries(byOrigin)
  .map(([origin, stats]) => ({
    origin,
    sessions: stats.count,
    avgRating: (stats.totalRating / stats.count).toFixed(2),
    minRating: Math.min(...stats.ratings),
    maxRating: Math.max(...stats.ratings)
  }))
  .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating));

return <dc.Table 
  rows={originStats}
  columns={[
    {id: "🌍 Origin", value: d => d.origin},
    {id: "Sessions", value: d => d.sessions},
    {id: "Avg ⭐", value: d => d.avgRating},
    {id: "Range", value: d => `${d.minRating}-${d.maxRating}`}
  ]}
/>
```
````

### Origin Distribution Pie Chart Data

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').where(p => p.origin);

// Count by origin
const originCounts = {};
logs.forEach(log => {
  const origin = log.origin;
  originCounts[origin] = (originCounts[origin] || 0) + 1;
});

const sorted = Object.entries(originCounts)
  .map(([origin, count]) => ({origin, count}))
  .sort((a, b) => b.count - a.count);

return <div>
  <h3>Origin Distribution</h3>
  {sorted.map(({origin, count}) => (
    <div key={origin} style={{marginBottom: '0.5rem'}}>
      <strong>{origin}</strong>: {count} sessions ({(count / logs.length * 100).toFixed(1)}%)
      <div style={{
        width: `${count / logs.length * 100}%`,
        height: '8px',
        background: '#D2691E',
        borderRadius: '4px'
      }}/>
    </div>
  ))}
</div>
```
````

---

## ☕ Roaster Analysis

### All Logs from Roaster

````jsx
```datacore
// Change "Blue Bottle Coffee" to your roaster
const roasterName = "Blue Bottle Coffee";

const logs = dc.pages('"Coffee Logs"')
  .where(p => p.roaster && p.roaster.path && p.roaster.path.includes(roasterName))
  .sort(p => p.date, 'desc');

return <dc.Table 
  rows={logs}
  columns={[
    {id: "Beans", value: c => c.beans},
    {id: "⭐", value: c => c.rating},
    {id: "Method", value: c => c["brew-method"]},
    {id: "Date", value: c => c.date}
  ]}
/>
```
````

### Roaster Leaderboard

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').where(p => p.roaster);

// Group by roaster
const byRoaster = {};
logs.forEach(log => {
  const roaster = log.roaster.path || log.roaster;
  if (!byRoaster[roaster]) {
    byRoaster[roaster] = {count: 0, totalRating: 0};
  }
  byRoaster[roaster].count++;
  byRoaster[roaster].totalRating += log.rating || 0;
});

const roasterStats = Object.entries(byRoaster)
  .map(([roaster, stats]) => ({
    roaster: roaster.replace(/^.*\//, '').replace('.md', ''),
    sessions: stats.count,
    avgRating: (stats.totalRating / stats.count).toFixed(2)
  }))
  .sort((a, b) => parseFloat(b.avgRating) - parseFloat(a.avgRating));

return <dc.Table 
  rows={roasterStats}
  columns={[
    {id: "☕ Roaster", value: d => d.roaster},
    {id: "Sessions", value: d => d.sessions},
    {id: "Avg ⭐", value: d => d.avgRating}
  ]}
/>
```
````

---

## 🔧 Brew Method Analysis

### Method Performance

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').where(p => p["brew-method"]);

// Group by method
const byMethod = {};
logs.forEach(log => {
  const method = log["brew-method"];
  if (!byMethod[method]) {
    byMethod[method] = {count: 0, totalRating: 0, totalCups: 0};
  }
  byMethod[method].count++;
  byMethod[method].totalRating += log.rating || 0;
  byMethod[method].totalCups += log["cups-brewed"] || 0;
});

const methodStats = Object.entries(byMethod)
  .map(([method, stats]) => ({
    method,
    sessions: stats.count,
    avgRating: (stats.totalRating / stats.count).toFixed(2),
    totalCups: stats.totalCups,
    cupsPerSession: (stats.totalCups / stats.count).toFixed(1)
  }))
  .sort((a, b) => b.sessions - a.sessions);

return <dc.Table 
  rows={methodStats}
  columns={[
    {id: "🔧 Method", value: d => d.method},
    {id: "Sessions", value: d => d.sessions},
    {id: "Avg ⭐", value: d => d.avgRating},
    {id: "Total Cups", value: d => d.totalCups}
  ]}
/>
```
````

---

## 🫘 Bean Library Queries

### Active Beans

````jsx
```datacore
const beans = dc.pages('"Beans Library"')
  .where(p => p.status === "active")
  .sort(p => p["purchase-date"], 'desc');

return <dc.Table 
  rows={beans}
  columns={[
    {id: "🫘 Bean", value: b => b.$link},
    {id: "Roaster", value: b => b.roaster},
    {id: "Origin", value: b => b.origin},
    {id: "Purchased", value: b => b["purchase-date"]}
  ]}
/>
```
````

### Beans to Rebuy

````jsx
```datacore
const beans = dc.pages('"Beans Library"')
  .where(p => p["would-rebuy"] === true)
  .sort(p => p["purchase-date"], 'desc');

if (beans.length === 0) {
  return <div className="callout">
    <p>No beans marked for rebuy yet. Try more coffees and mark your favorites!</p>
  </div>
}

return <dc.List items={beans.map(bean => ({
  content: `**${bean["bean-name"]}** from ${bean.roaster} (${bean.origin}) - $${bean.price}`
}))} />
```
````

---

## 🎨 Interactive Components

### Editable Rating Table

````jsx
```datacore
const [editMode, setEditMode] = dc.useState(false);

const logs = dc.pages('"Coffee Logs"')
  .where(p => p.type === "coffee-log")
  .sort(p => p.date, 'desc')
  .limit(10);

return <div>
  <button onClick={() => setEditMode(!editMode)}>
    {editMode ? "View Mode" : "Edit Mode"}
  </button>
  
  <dc.Table 
    rows={logs}
    columns={[
      {id: "Beans", value: c => c.beans},
      {id: "Rating", value: c => c.rating, editable: editMode},
      {id: "Date", value: c => c.date}
    ]}
  />
</div>
```
````

### Conditional Styling

````jsx
```datacore
const logs = dc.pages('"Coffee Logs"').sort(p => p.rating, 'desc');

return <dc.Table 
  rows={logs}
  columns={[
    {id: "Beans", value: c => c.beans},
    {
      id: "⭐ Rating", 
      value: c => c.rating,
      render: (rating) => (
        <span style={{
          color: rating >= 4.5 ? '#FF6B35' : rating >= 3.5 ? '#D2691E' : '#8D6E63',
          fontWeight: rating >= 4.5 ? 'bold' : 'normal',
          fontSize: rating >= 4.5 ? '1.1em' : '1em'
        }}>
          {rating}
        </span>
      )
    },
    {id: "Origin", value: c => c.origin}
  ]}
/>
```
````

---

## 📈 Advanced Patterns

### Multi-Column Sorting

````jsx
```datacore
const [sortBy, setSortBy] = dc.useState('rating');
const [sortDir, setSortDir] = dc.useState('desc');

const logs = dc.pages('"Coffee Logs"');

// Sort based on state
const sorted = logs.sort((a, b) => {
  const valA = a[sortBy];
  const valB = b[sortBy];
  const mult = sortDir === 'asc' ? 1 : -1;
  return (valA > valB ? 1 : -1) * mult;
});

return <div>
  <div>
    Sort by: 
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="rating">Rating</option>
      <option value="date">Date</option>
      <option value="beans">Beans</option>
    </select>
    <button onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
      {sortDir === 'asc' ? '↑' : '↓'}
    </button>
  </div>
  
  <dc.Table 
    rows={sorted}
    columns={[
      {id: "Beans", value: c => c.beans},
      {id: "Rating", value: c => c.rating},
      {id: "Date", value: c => c.date}
    ]}
    paging={20}
  />
</div>
```
````

### Search Filter

````jsx
```datacore
const [search, setSearch] = dc.useState('');

const logs = dc.pages('"Coffee Logs"')
  .where(p => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      (p.beans && p.beans.toLowerCase().includes(searchLower)) ||
      (p.origin && p.origin.toLowerCase().includes(searchLower)) ||
      (p.roaster && String(p.roaster).toLowerCase().includes(searchLower))
    );
  });

return <div>
  <input 
    type="text" 
    placeholder="Search beans, origin, or roaster..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}}
  />
  
  <dc.Table 
    rows={logs}
    columns={[
      {id: "Beans", value: c => c.beans},
      {id: "Origin", value: c => c.origin},
      {id: "Rating", value: c => c.rating}
    ]}
    paging={15}
  />
  
  <p>Found {logs.length} results</p>
</div>
```
````

---

## 🔗 Resources

**Official Documentation**:
- [Datacore GitHub](https://github.com/blacksmithgu/datacore)
- [Datacore API Reference](https://blacksmithgu.github.io/datacore/)
- [React Hooks Documentation](https://react.dev/reference/react)

**Learning**:
- [JSX Intro](https://react.dev/learn/writing-markup-with-jsx)
- [React Components](https://react.dev/learn/your-first-component)
- [Datacore Discord](https://discord.gg/obsidianmd) - #datacore channel

**Related**:
- [[Bases Configuration Guide]] - Native database views
- [[Plugin Installation Guide]] - Setup instructions
- [[Views/Coffee Dashboard]] - Example implementations

---

## 💡 Pro Tips

1. **Use State Management**: `dc.useState()` for interactive components
2. **Performance**: Filter early, sort late - minimize array operations
3. **Reusability**: Extract common logic into functions
4. **Debugging**: `console.log()` works in Datacore blocks
5. **Styling**: Inline styles or CSS classes for custom appearance
6. **Pagination**: Use `paging={20}` for large tables
7. **Error Handling**: Check for null/undefined values before accessing

---

**Last Updated**: 2025-10-24  
**Datacore Version**: 0.1.18+  
**Requires**: Datacore plugin installed and enabled

