---
type: producer-profile
name: <% tp.system.prompt("Producer/Farm/Cooperative name") %>
category: <% tp.system.suggester(["Farm", "Cooperative", "Washing Station", "Exporter", "Importer", "Other"], ["farm", "cooperative", "washing-station", "exporter", "importer", "other"]) %>
country: <% tp.system.prompt("Country") %>
region: <% tp.system.prompt("Region/Province", "") %>
status: active
date: <% tp.date.now("YYYY-MM-DD") %>
tags: "[producer-profile, <%  tp.frontmatter.country.toLowerCase()  %>]"
---

# 🌱 <% tp.frontmatter.name %>

**Category**: <% tp.frontmatter.category %>  
**Location**: <% tp.frontmatter.region %>, <% tp.frontmatter.country %>  
**Status**: <% tp.frontmatter.status %>  
**Date Added**: <% tp.frontmatter.date %>

---

## 📍 Location & Contact

**Country**: <% tp.frontmatter.country %>  
**Region**: <% tp.frontmatter.region %>  
**Subregion**:  
**City**:  
**Coordinates**:  
**Address**:  

**Contact Information**:
- **Contact Person**:  
- **Email**:  
- **Phone**:  
- **Website**:  

---

## 🏛️ Organization Structure

**Organization Type**:  
**Established**:  
**Owner/Founder**:  
**Manager**:  
**Membership Count**:  
**Farmers Count**:  
**Workers Count**:  
**Women Farmers**:  
**Women Workers**:  

---

## 🌿 Farm Characteristics

**Altitude Range**:  -  meters  
**Typical Altitude**:  meters  
**Farm Size**:  hectares  
**Terrain**:  
**Soil Type**:  
**Microclimate**:  

**Production Capacity**:
- **Annual Production**:  kg/bags
- **Production Volume**:  
- **Peak Season**:  
- **Harvest Frequency**:  

**Varieties Grown**:
- 
- 

**Processing Capability**:
- 
- 

---

## ✅ Certifications & Sustainability

**Certifications**:
- [ ] Organic
- [ ] Fair Trade
- [ ] Rainforest Alliance
- [ ] Bird Friendly
- [ ] Shade Grown
- [ ] Carbon Neutral
- [ ] B-Corp
- [ ] Direct Trade Verified
- [ ] RFA
- [ ] UTZ
- [ ] C.A.F.E. Practices
- [ ] SMBC

**Certification Numbers**:  
**Certification Dates**:  
**Certification Expiry**:  

**Sustainability Metrics**:
- **Environmental Impact Score**: /10
- **Social Impact Score**: /10
- **Sustainability Rating**:  
- **Organic Percentage**: %
- **Carbon Footprint**:  kg CO2/kg coffee

**Sustainable Practices**:
- [ ] Water Conservation
- [ ] Soil Conservation
- [ ] Biodiversity Protection

---

## 🤝 Direct Trade Relationships

**Roaster Partners**:
- 

**Partnership Details**:
- **Relationship Started**:  
- **Contract Type**:  
- **Price Premium**: % above commodity
- **Direct Trade Verified**: [ ] Yes / [ ] No
- **Relationship Quality**:  

**Contract Terms**:
- **Price Mechanism**:  
- **Quality Requirements**:  
- **Payment Terms**:  

---

## 📊 Quality Profile

**Typical Quality Grade**:  
**Specialty Grade Percentage**: %  
**Cupping Score Range**:  
**Quality Consistency**:  
**Quality Reputation**:  

**Quality Control**:
- [ ] Has Cupping Lab
- [ ] QC Program in Place
- [ ] Traceability System
- [ ] Lot Tracking

---

## 💰 Economic & Social Impact

**Economic Metrics**:
- **Farmer Income Premium**: % above commodity
- **Price per kg**: $
- **Annual Revenue**: $
- **Employment Created**:  jobs
- **Local Economic Impact**:  

**Social Programs**:
- [ ] Education Programs
- [ ] Healthcare Access
- [ ] Housing Improvements
- [ ] Infrastructure Development

**Community Investment**:  


---

## 👤 Personal Relationship

**Engagement History**:
- **Date Discovered**:  
- **First Contact**:  
- **Visits Count**:  
- **Last Visit**:  

**Relationship Assessment**:
- **Relationship Strength**:  
- **Communication Frequency**:  
- **Personal Connection**: [ ] Yes / [ ] No
- **Would Support**: [ ] Yes / [ ] No

**Visit Notes**:  


---

## 📝 Producer Story

<% tp.file.cursor() %>

---

## 💭 Personal Notes & Observations

**Producer Story**:  


**Personal Notes**:  


**Relationship Notes**:  


---

## 🔗 Related Beans

```dataview
TABLE 
  name as "Bean Name",
  roaster as "Roaster",
  purchase-date as "Purchase Date",
  rating as "Rating"
FROM "Beans Library"
WHERE producer-link = this.file.link OR contains(name, this.name)
SORT purchase-date DESC
```

---

## 📈 Statistics

**Beans Purchased**: 0 (from beans above)  
**Average Rating**: ⭐⭐⭐⭐⭐ (calculating...)  
**Total Spent**: $0.00  
**Relationship Duration**:  days

---

**Tags**: <% tp.frontmatter.tags.join(", ") %>

