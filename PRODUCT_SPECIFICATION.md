# Digital Lesson Plan & Scheme of Work System
## Comprehensive Product Specification v1.0

---

## Executive Summary

The Digital Lesson Plan & Scheme of Work System is a web application designed to solve three interconnected problems teachers face: **document loss**, **planning inconsistency**, and **inefficient plan reusability**. By providing a centralized, organized digital repository with templating and collaboration features, this system enables teachers to save time on planning while maintaining consistency across classrooms and schools.

**Core Insight:** Teachers don't lack planning discipline—they lack a system that makes planning easy and persistent. Moving their workflow from scattered files (Google Docs, Word, email chains, paper) to a unified platform with zero friction will dramatically improve outcomes.

---

## 1. CORE PROBLEM & SOLUTION

### 1.1 The Problem Statement

**Current State - How Teachers Lose Plans Today:**

| Issue | Root Cause | Impact |
|-------|-----------|--------|
| **Digital Disorganization** | Plans scattered across Google Drive, Dropbox, personal computers, USB drives, email chains | Duplicate versions, outdated plans used in classroom, time wasted searching |
| **Version Control Chaos** | No system to track which plan is "current"; overwrites old versions; no audit trail | Different teachers teaching same course from different versions; compliance risk |
| **Plan Loss on Job Transitions** | Teachers leave; plans stay on personal accounts or school server without proper documentation | Schools lose institutional knowledge; new teachers rebuild from scratch |
| **Inconsistent Planning Format** | Each teacher uses different templates/structure; no standard for what constitutes a "complete" plan | Hard to audit, share, or improve; compliance issues around curriculum coverage |
| **Zero Reusability Framework** | No systematic way to discover, adapt, or share plans within/across schools | Teachers reinvent the wheel yearly; fragmented institutional knowledge |
| **Time Wasted on Format, Not Pedagogy** | Teachers spend planning time formatting documents instead of thinking through pedagogy | Low-quality plans rushed due to administrative overhead |

**Who This Affects Most:**
- **New teachers** (lowest planning efficiency, highest learning curve)
- **Part-time/supply teachers** (short-term tenure, knowledge loss)
- **Subject coordinators** (responsible for consistency, no visibility into teacher practices)
- **Multi-school teachers** (synchronizing plans across locations manually)
- **High-turnover schools** (institutional knowledge loss compounds annually)

### 1.2 Success Definition: What "Solved" Looks Like

A teacher using this system successfully will:

✅ **Create a lesson plan in <15 minutes** using guided templates (not 45 minutes formatting in Word)  
✅ **Reuse plans from previous years** with one-click import and date updates  
✅ **Never lose a plan** because it's centrally stored and versioned  
✅ **Know exactly which version is current** across all synchronizations  
✅ **Share plans with colleagues** withoutemailing files or managing permissions manually  
✅ **See curriculum coverage at a glance** (term view shows all lessons linked to standards)  
✅ **Comply with school audits** through complete, timestamped planning records  
✅ **Reduce planning time by 2-3 hours/week** by not searching for docs or reformatting  

**Measurable Success Outcomes:**
- Plans are never lost between job transitions or hard drive failures
- Planning time decreases from ~4-5 hours/week to ~2 hours/week
- 90%+ of teachers use the system for at least 80% of their planning
- Teachers report plans are "easier to iterate on" and "better structured"

### 1.3 Primary Users & Stakeholders

#### Primary User: **The Classroom Teacher**
- **Role:** Creates lesson plans, organizes by grade/subject, exports for classroom use
- **Problem Solved:** Time savings + peace of mind (no loss)
- **Usage:** 3-5 hours/week (planning, quarterly review)

#### Secondary User: **Subject Coordinator / Department Head**
- **Role:** Oversees curriculum consistency, approves plans, manages templates, audits coverage
- **Problem Solved:** Visibility into teacher planning; easy compliance verification
- **Usage:** 2-3 hours/week (reviewing summaries, updating templates)

#### Tertiary User: **School Administrator**
- **Role:** Manages user accounts, monitors adoption, generates compliance reports
- **Problem Solved:** Institutional knowledge preservation; accountability
- **Usage:** 1-2 hours/week (user management, reports)

#### Not a User (Out of Scope for MVP):
- **Students** – This is a teacher-facing tool, not a student-facing app
- **Parents** – No parent communication features in MVP
- **External organizations** – Local authorities/education boards view read-only reports only

---

## 2. USER PERSONAS & JOBS TO BE DONE

### Persona 1: **Sarah - New Teacher (Year 1-2)**
- **Age/Context:** 26, NQT (Newly Qualified Teacher), English, first teaching job
- **Current Pain:** Overwhelmed by planning expectations; spending 8-10 hours/week on plans formatted by hand; terrified of losing work; doesn't know what a "complete" plan looks like; copying from Google images of textbook teacher editions
- **Jobs to Be Done:**
  1. Find/access **proven templates** so I don't guess what a plan should contain
  2. **Create plans quickly** without worrying about formatting
  3. **Safeguard my work** in case I switch schools
  4. **Learn from others** by seeing how experienced teachers structure plans
- **Why She'll Use It:** Reduces cognitive load; templates give her confidence; central storage = peace of mind
- **Success Metric for Her:** Reduces planning time from 8 hrs/week to 4 hrs/week in first term

### Persona 2: **Marcus - Experienced Teacher (15 years)**
- **Age/Context:** 45, Head of English, 15 years teaching, several schools
- **Current Pain:** Has accumulated excellent plans in Word/PDF scattered across 3 different drives; spends 30 mins/week just finding last year's plans for similar classes; wants colleagues to use his high-quality plans but has no system to distribute them; needs to audit which teachers are covering the new curriculum standards
- **Jobs to Be Done:**
  1. **Centralize my archives** so I can find Year 8 Literature Unit 3 in 10 seconds
  2. **Share proven plans** with department without manual email chains
  3. **See what others are teaching** to spot gaps in curriculum coverage
  4. **Maintain consistency** across classes and across teachers
- **Why He'll Use It:** Better organization than his current system; easier curriculum oversight; can finally leverage his expertise
- **Success Metric for Him:** Finds re-usable plans 80% faster; shares plans with 10+ colleagues/term

### Persona 3: **Priya - Subject Coordinator (Maths)**
- **Age/Context:** 38, Maths Lead, responsible for curriculum consistency and compliance
- **Current Pain:** Can't see what teachers are actually planning (they use own systems); compliance audit requires manually reviewing 20 teacher files; no way to ensure all teachers cover required standards; new teachers ask "what should a Year 9 plan include?" and she has no standard template; frustrated that teachers reinvent plans each year
- **Jobs to Be Done:**
  1. **View all plans by grade/term** to see curriculum coverage at a glance
  2. **Create & enforce standard templates** for the department
  3. **Identify gaps and overlaps** in curriculum coverage
  4. **Reduce time on compliance audits** from 4 hours to 30 minutes
- **Why She'll Use It:** Central visibility; compliance automation; enforces quality standards
- **Success Metric for Her:** Plans are 100% standardized; audits take <1 hour instead of 4

### Persona 4: **Jamal - School Administrator**
- **Age/Context:** 52, Deputy Head, responsible for school data and teacher accountability
- **Current Pain:** No institutional record of what teachers actually teach; if teacher leaves, all plans leave with them; can't easily show Ofsted "evidence of planning"; no way to track curriculum coverage school-wide; teacher turnover means constant planning knowledge loss
- **Jobs to Be Done:**
  1. **Preserve planning knowledge** when teachers leave
  2. **Generate compliance reports** for audits without manual data collection
  3. **New teacher onboarding** can now include proven plans from predecessors
  4. **Track institutional curriculum coverage** across all grades/subjects
- **Why He'll Use It:** Institutional asset preservation; reduced admin burden; tangible audit evidence
- **Success Metric for Him:** Can generate a "curriculum coverage report" in 5 minutes; retains 90%+ of plans when teachers leave

---

## 3. FEATURE PRIORITIZATION: MVP vs. FUTURE PHASES

### 3.1 MVP (Phase 1) - Launch Features [Must-Have for Success]

**These features directly solve the core problem and are essential for market viability:**

#### Core Feature 1: **Plan Creation & Storage**
- **What it does:** Teachers create lesson plans using a guided form (not blank page)
- **Workflow:**
  1. Select grade/subject/topic
  2. Choose a template (or start blank)
  3. Fill form fields: Learning objectives, activities, resources, assessment, differentiation notes
  4. System auto-saves as they type
  5. Plan is immediately stored in centralized database with version history
- **Why MVP:** Solves document loss + provides structure
- **Success Definition:** Teachers create plans in <15 minutes using template

#### Core Feature 2: **Organized Storage by Grade/Subject/Term**
- **What it does:** Plans auto-organize in a hierarchical structure
  ```
  School > Subject > Grade > Term > Week > Lesson Plan
  ```
- **Workflow:**
  - Teacher tagged plan with Grade 8, English, Term 3
  - System files it automatically
  - Teacher finds it with one click next year
- **Why MVP:** Solves disorganization + enables reusability
- **Success Definition:** 80%+ of teachers can find a past plan within 30 seconds

#### Core Feature 3: **Plan Reuse (Copy & Adapt)**
- **What it does:** One-click import of past plans; auto-updates dates and references
- **Workflow:**
  1. Teacher views "Year 8 Macbeth Unit" from last year
  2. Clicks "Use This Plan Again"
  3. System creates copy with 2025 dates automatically filled
  4. Teacher edits only what's changed
- **Why MVP:** Enables the "2-3 hours/week saved" outcome
- **Success Definition:** 60%+ of new plans in a term are based on past plans

#### Core Feature 4: **PDF Export**
- **What it does:** Export any plan to PDF for printing/sharing, or upload to school intranet
- **Workflow:**
  1. Teacher clicks "Export as PDF"
  2. Gets professionally formatted document with logo, branding
  3. Can print or email to colleagues/admin
- **Why MVP:** Many teachers will want hard copies or to print for classroom; some schools need to upload to learning platforms
- **Success Definition:** ~20-30% of plans are exported each term

#### Core Feature 5: **Basic Sharing (Within-School)**
- **What it does:** Teacher can share plans with colleagues in same school
- **Workflow:**
  1. Teacher clicks "Share with Department"
  2. Selects colleagues from the school
  3. Colleagues can view, comment, but not edit (unless permission granted)
  4. Shared plan updates for all viewers when original is edited
- **Why MVP:** Enables collaboration; builds adoption (seeing others' plans is motivating)
- **Access Rules:**
  - Teachers can share their own plans
  - Department heads can share department templates
  - Teachers can view/comment on shared plans
  - Cannot edit others' plans without explicit permission
- **Success Definition:** 40%+ of plans are shared with at least 1 colleague

#### Core Feature 6: **Curriculum Mapping Dashboard (For Coordinators)**
- **What it does:** Department lead can view all term plans by grade; see which standards/topics are covered
- **Workflow:**
  1. Coordinator logs in; selects "Maths, Grade 9, Term 1"
  2. See all 6 teachers' plans displayed in a checklist view
  3. Can identify gaps (e.g., "No one is covering Probability Unit")
  4. Can see overlaps (e.g., "3 teachers covering Fractions—could consolidate")
- **Why MVP:** Solving Priya's (coordinator) core problem; enables quality consistency
- **Success Definition:** Audits take 30 minutes instead of 4 hours

#### Core Feature 7: **User Roles & Permissions**
- **Three roles:**
  - **Teacher:** Create/view own plans, view school shared plans, comment on others' plans
  - **Department Head:** All Teacher permissions + create templates, see all department plans, audit trails, force standard templates
  - **Administrator:** All permissions + manage users, manage multiple schools, generate compliance reports
- **Why MVP:** Different users have different needs; prevents chaos/security issues
- **Success Definition:** Permission system is intuitive; no support tickets about "why can't I see X?"

---

### 3.2 Phase 2 Features - Early Enhancement (0-6 months post-launch)

These solve real problems but aren't critical for launch; add significant value once core is solid:

- **Advanced Search:** Filter plans by: standard/curriculum alignment, learning objectives, resource type, difficulty level
- **Comments & Feedback:** Department heads can leave feedback on plans; teachers can iterate internally before "publishing"
- **Plan Templates Library:** Pre-built, Ofsted-aligned templates for each subject/grade combination
- **Bulk Plan Upload:** Teachers can upload existing Word/PDF plans to system; system OCRs them
- **Curriculum Alignment Tagging:** Link plans to curriculum standards (e.g., Common Core, UK National Curriculum); system flags gaps
- **Cross-School Sharing (Initial):** Allows viewing plans from other schools in the same trust/network; read-only initially
- **Mobile App (Read-Only):** Teachers can view/download plans on tablet during lessons
- **Analytics Dashboard:** Tracking adoption, usage patterns, time saved estimates

---

### 3.3 Phase 3+ Features - Future Vision (6+ months)

- **AI-Powered Suggestions:** See detailed section below
- **Lesson Delivery Integration:** Teachers can upload lesson photos/artifacts to plan; creates case study archive
- **Student Outcome Tracking:** Link lesson plans to student assessment results; see what worked
- **Differentiation Assistant:** AI prompts for how to modify lessons for SEND/ELL/gifted students
- **Cross-School Collaboration:** Formal partnerships between schools to share best practice plans
- **Integration with Student Information Systems (SIS):** Auto-pull student rosters, learning profiles
- **Parent Communication Portal:** Share overview of term plans with parents

---

## 4. CORE WORKFLOWS: DETAILED USER JOURNEYS

### Workflow 1: Creating a New Lesson Plan (Sarah - New Teacher)

**Context:** Sarah is planning her Year 8 English lessons for Term 3 (new unit on Poetry)

**Steps:**
1. **Log in & navigate:** Goes to English > Grade 8 > Term 3
2. **Start new plan:** Clicks "+ New Lesson Plan"
3. **Select template:** System shows "Poetry Unit (Generic)" template; she selects it
4. **Auto-fill suggestion:** System asks "How many weeks for this unit?" She says 4 weeks
5. **Template pre-populates:**
   - Week 1: Introduction to Poetry (3 lessons)
   - Week 2: Poetry analysis techniques (4 lessons)
   - Week 3: Writing poetry (3 lessons)
   - Week 4: Anthology creation & feedback (3 lessons)
6. **Customize:** She adds her school's poetry anthology and specific poems for each lesson
7. **Save:** Clicks save; system auto-saves every 30 seconds while she works
8. **View in calendar:** Term view now shows her 4-week unit visually; no gaps or conflicts
9. **Share:** Clicks "Notify my department" to show that week 1-2 coverage is live
10. **Export:** Exports Week 1 lessons to PDF for printing and classroom display

**Pain Points Solved:**
- ✅ Didn't start from blank page (template removed paralysis)
- ✅ Didn't need to manually format (system handles structure)
- ✅ Plan is auto-saved (no loss risk)
- ✅ Plan is findable next year (organized hierarchically)
- ✅ Completed 4-week unit in 35 minutes (vs. 3 hours in Word)

---

### Workflow 2: Reusing & Adapting Last Year's Plan (Marcus - Experienced Teacher)

**Context:** Marcus taught Year 10 Literature last year; now teaching it again. Wants to use last year's plans but update specific texts.

**Steps:**
1. **Log in:** Goes to English > Grade 10 > Term 1
2. **Browse archive:** Sees dropdown "Use a past plan?" and clicks it
3. **Select previous year:** System shows "English, Grade 10, Term 1, 2024" folder
4. **View summary:** Old plan shows: "Includes Shakespeare Unit, Modern Literature, Close Reading"
5. **Click "Import Full Term":** System creates a copy of all 40 lessons with 2025 dates
6. **Edit specific lessons:** Marcus modifies:
   - Shakespeare text (changed from Hamlet to Romeo & Juliet)
   - Added new essay prompt based on new exam board spec
7. **Save & review:** System shows a diff of what changed vs. last year
8. **Department visibility:** Department head can see plan was updated; last modified date shows 2025
9. **Share new version:** Marcus shares the revised plan so other Year 10 teachers can use it

**Pain Points Solved:**
- ✅ Found past plans in 10 seconds (vs. 20 minutes manually searching)
- ✅ Didn't retype 40 lessons from scratch
- ✅ Clear version control (2024 vs. 2025 visible)
- ✅ New teachers can see how this unit was structured last year
- ✅ Time spent: 45 minutes to adapt vs. 3+ hours to rebuild

---

### Workflow 3: Curriculum Mapping & Gap Identification (Priya - Coordinator)

**Context:** Priya needs to audit whether all Grade 9 Maths teachers are covering the full curriculum this term. She suspects double coverage on Fractions and gaps in Statistics.

**Steps:**
1. **Log in:** Goes to Math > Grade 9 > Term 1
2. **View Coordinate Dashboard:** Sees all 6 teachers' plans in a table view:
   ```
   Teacher | Unit 1 | Unit 2 | Unit 3 | Unit 4 | Gaps Identified
   --------|--------|--------|--------|--------|----------------
   Ms. Lee | Numbers | Fractions | Algebra | Geometry | OK
   Mr. Patel | Numbers | Fractions | Algebra | Statistics | OK
   Ms. Khan | Numbers | Indices | Fractions | Geometry | MISSING: Statistics
   ...
   ```
3. **Identify issue:** Sees that:
   - 4 teachers have Fractions (schedule for reduction meeting)
   - Ms. Khan is missing Statistics (needs to add it)
4. **Click feedback:** Leaves a comment on Ms. Khan's plan: "Please add 2-week Stats unit; where were you planning to fit it?"
5. **Generate report:** Clicks "Export Audit Report" → PDF showing coverage matrix for SLT
6. **Track fix:** Marks Ms. Khan's feedback as "pending response"; system reminds her to follow up in 1 week

**Pain Points Solved:**
- ✅ Audit done in 15 minutes instead of 4 hours (no manual file gathering)
- ✅ Gaps identified visually (not by reading 6 Word docs)
- ✅ Evidence for Ofsted/SLT immediately available
- ✅ Non-adversarial feedback mechanism (comments not reports)
- ✅ Proactive gap prevention (caught before teaching season)

---

### Workflow 4: Onboarding a New Teacher (Jamal - Administrator)

**Context:** A new Year 7 Science teacher joins mid-term. Jamal wants her to hit the ground running with proven plans.

**Steps:**
1. **Create user account:** Jamal adds her to the system; assigns role "Teacher" + "Science Department"
2. **Send welcome email:** System automatically sends onboarding email with link to "Grade 7 Science starter plans"
3. **New teacher logs in:** See options:
   - "Popular Plans by Grade 7 Teachers (Last 3 Years)"
   - "Department Standard Templates"
   - "Plans from year you're teaching now (in progress)"
4. **Browse & import:** New teacher sees last year's Year 7 Science plans from 3 predecessors
5. **Bulk import:** Clicks "Import all Grade 7 plans" → System copies all 60 lessons into her "ToDo" folder
6. **Customize:** She reviews/customizes each unit over next 2 weeks
7. **Approve & release:** Department head reviews; approves new teacher's adjusted plans
8. **Active:** Plans are now live; new teacher in independent groove within 1 week (vs. 3-4 weeks building from scratch)

**Pain Points Solved:**
- ✅ Institutional knowledge transferred (not lost with previous teacher)
- ✅ New teacher doesn't reinvent wheel
- ✅ Quality control maintained (not using random plans)
- ✅ Onboarding time reduced from 4 weeks to 1 week
- ✅ Curriculum continuity maintained mid-year

---

## 5. TECHNICAL REQUIREMENTS

### 5.1 Architecture & Technology Stack

**Recommended Architecture:**
```
Frontend: React.js / Vue.js (accessible, responsive, works on tablets)
Backend: Node.js + Express OR Python + Django (choose based on team skill)
Database: PostgreSQL (relational structure good for hierarchical plans)
Storage: AWS S3 or Google Cloud Storage (for PDF exports, bulk files)
Authentication: OAuth 2.0 (Google/Microsoft single sign-on for schools)
Hosting: AWS or Google Cloud (enterprise-grade uptime required)
```

**Why these choices:**
- React/Vue for smooth forms and real-time autosave
-PostgreSQL for structured hierarchy (School > Subject > Grade > Term > Plan)
- OAuth for low sign-up friction (teachers already have Google/Outlook at school)
- Cloud hosting for reliability and scalability

### 5.2 Data Model & Storage Requirements

**Core Data Entities:**

```
School
├── Name, Location, Type (Primary/Secondary/Academy)
├── Admin users
└── Plans (all plans across school)

User
├── Email, Name, Role (Teacher/Coordinator/Admin)
├── School (belongs to 1+ schools)
├── Subjects taught
└── Plans owned

Plan
├── Title, Description
├── Grade, Subject, Term, Week
├── Status (Draft/In Progress/Published/Archived)
├── Learning objectives
├── Lesson breakdown (daily breakdown)
├── Resources, assessments, differentiation notes
├── Created date, Last modified date
├── Version history (all edits tracked)
├── Permissions & sharing (who can view/edit)
├── Curriculum alignment (tags linking to standards)
└── Comments (feedback from colleagues)

Template
├── Curriculum area
├── Grade, Duration
├── Suggested structure
└── Customizable fields

Comment
├── Author, timestamp, content
├── Associated plan
└── Resolution status
```

**Storage Estimates (1,000 teacher school, 5 years of data):**
- Total plans: ~5,000 (1,000 teachers × 5 plans/year)
- With version history: ~20,000 total records
- PDF exports stored for 6 months: ~2-3 GB
- **Total database size:** ~500 MB - 1 GB (very modest)
- **Recommendation:** On-premise database OR small cloud instance; no need for distributed system at launch

### 5.3 Scalability & Performance Targets

**Phase 1 Targets (MVP Launch):**
- **Users:** 1-3 schools, 100-300 teachers
- **Concurrent users:** 50 simultaneous users (typical: planning happens 4-6 PM)
- **Response time:** <2 seconds for any action
- **Uptime:** 99.5% (acceptable for education; no 24/7 criticality)

**Growth Path (Year 2):**
- **Users:** 50-100 schools, 5,000-10,000 teachers
- **Concurrent users:** 500 simultaneous
- **Scaling action:** Move to load-balanced backend, caching layer (Redis)

**Long-term (Year 3+):**
- Multi-region deployment for international expansion
- Database replication for high availability
- Archive old plans (5+ years) to cold storage

### 5.4 Integrations (MVP + Future)

**MVP (Not Required for Launch):**
- Single sign-on via Google Workspace / Microsoft 365
  - *Reason:* 95% of schools already use these; massively reduces sign-up friction
  - *Effort:* Medium (2-3 week engineering time)

**Phase 2 Integrations:**
- **Curriculum standards database** (e.g., Common Core, UK National Curriculum)
  - Allows teachers to tag/align lessons to standards
  - Enables coordinator dashboard to show coverage against standards
  - *Effort:* Low-medium (data import + tagging UI)

**Phase 3+ Integrations:**
- **Student Information Systems (SIS):**
  - Sync student rosters from Clever, Skyward, or school-specific systems
  - Allow plans to link to student cohorts
  - *Effort:* High (depends on school's SIS; often custom)
  
- **Learning Management Systems (LMS):**
  - Sync plans to Canvas, Google Classroom, ClassDojo
  - Teachers can view student grades alongside plan activities
  - *Effort:* High (highly variable by LMS)

- **Calendar Systems:**
  - Sync school calendar (holidays, professional development days)
  - Plans automatically adjust for gaps
  - *Effort:* Medium

### 5.5 Data Privacy & Compliance

**Key Requirements:**

| Aspect | Requirement | Justification |
|--------|-------------|---------------|
| **Data Residency** | EU: GDPR-compliant servers only; US: FERPA-compliant infrastructure | Legal requirement for schools |
| **Encryption** | All data encrypted at rest (AES-256) and in transit (TLS 1.2+) | Protects student/curriculum data |
| **Data Retention** | Plans retained for 7 years (comply with school records policies); users can request deletion | Supports audits; complies with retention laws |
| **Access Logs** | Audit trail of all user access (who viewed/edited plan, when) | Evidence for Ofsted/compliance |
| **Age of Consent** | Teachers are adults; no child data collected in MVP | Out of scope unless student features added |
| **Backup & Disaster Recovery** | Daily automated backups; recovery time <24 hours | Protects against data loss |
| **SOC 2 Compliance** | Aim for SOC 2 Type II certification within Year 2 | Enterprise schools often require this |

**Privacy Policy Essentials:**
- Teachers own their plans; can export/delete at any time
- School admin can access all teachers' plans for compliance (subject to country laws)
- We don't use plan data for marketing or profiling
- Third-party vendors (hosting, email) are bound by data processing agreements

---

## 6. BUSINESS MODEL & GO-TO-MARKET

### 6.1 Pricing Tiers & Revenue Model (Recommended)

**Option A: School-Wide License (Recommended for Education)**

```
Small School (< 200 teachers)      → £600/year or $750/year
Medium School (200-500 teachers)   → £1,500/year or $1,875/year
Large/Multi-School Network         → Custom pricing (negotiated)
```

**Why this model:**
- ✅ Aligns with school budget cycles (annual purchase)
- ✅ Lower friction than per-teacher licensing (admin buys, all teachers free)
- ✅ Encourages adoption (no argument about "cost per teacher")
- ✅ Easy to understand (one line item on school P&L)
- ✅ Scales revenue with organization size

**What's Included:**
- Unlimited teachers at school
- All core features (create, share, curriculum mapping)
- 7-year data retention
- Basic support (email)
- Annual software updates

**Add-ons (Future):**
- Advanced analytics dashboard: +£200/year
- Priority support (phone + Slack): +£300/year
- Dedicated onboarding specialist: +£1,000

---

### 6.2 Go-to-Market Strategy (Year 1)

**Phase 1A: Pilot (Months 1-2)**
- **Target:** 1-2 schools, 50-100 teachers total
- **Selection:** One primary + one secondary; diverse subject areas
- **Strategy:** Free pilot; weekly feedback calls; iterate on UX
- **Goal:** Prove product-market fit; generate testimonials
- **Outcome:** Refine workflows; identify missing features

**Phase 1B: Soft Launch (Months 3-4)**
- **Target:** 5-10 schools (500-1,000 teachers)
- **Pricing:** Discounted launch price (£400/school/year) with 2-year lock-in
- **Strategy:** Inbound via word-of-mouth; direct outreach to pilot schools' networks
- **Marketing:** Case study videos, testimonials, teacher feedback
- **Goal:** Validate product; build case studies for enterprise sales

**Phase 2: Growth (Months 5-12)**
- **Target:** 50-100 schools (5,000+ teachers)
- **Pricing:** Transition to full pricing; offer discounts for multi-year commitments
- **Strategy:** 
  - Partner with school associations (unions, subject bodies)
  - Target subject coordinators as entry point
  - Free trial (30 days) for new schools
  - Webinar + demo strategy
- **Goal:** Build brand; reach revenue targets

**Key Entry Points (In Order):**
1. **Subject coordinator** (Priya persona) - easiest sell due to audit pain
2. **New teacher cohorts** (Sarah persona) - quickest adoption
3. **School leadership** (Jamal persona) - institutional decision
4. **Experienced teachers** (Marcus persona) - quality/efficiency advocates

---

### 6.3 Competitive Positioning

**Current Alternatives Teachers Use:**
- Google Docs / Microsoft Word (free but disorganized)
- Shared drives (organized but no structure)
- Email chains (chaotic)
- Paper (lost easily)
- Commercial lesson planning sites (TeachingBooks, TES, but for templates only—not storage)

**Why This System is Different:**
- ✅ Centralized storage (not scattered across tools)
- ✅ Organizational structure (not just "a folder")
- ✅ Designed for reuse (templates + import, not inspiration)
- ✅ School-wide collaboration (not individual teacher silos)
- ✅ Compliance-ready (audit trails, reporting)

**Competitive Advantages vs. Existing Tools:**
| Feature | This System | Google Docs | Shared Drive | Paper |
|---------|------------|------------|-------------|-------|
| Central storage | ✅ Yes | ❌ Scattered | ✅ Yes | ❌ No |
| Findability | ✅ Yes | ❌ Difficult | ✅ Moderate | ❌ No |
| School-wide sharing | ✅ Easy | ⚠️ Manual | ✅ Yes | ❌ No |
| Audit trails | ✅ Yes | ⚠️ Limited | ❌ No | ❌ No |
| Planning structure | ✅ Guided | ❌ Blank page | ❌ No structure | ❌ Blank page |
| Reuse support | ✅ Built-in | ❌ Manual copy/paste | ⚠️ File copy | ❌ Manual retype |

---

## 7. AI SUGGESTIONS FEATURE - DETAILED VISION

### 7.1 What AI Will Do (Phase 3+)

**Current State (MVP):** Teachers manually create/structure all plans

**With AI (Year 2+):** AI assists in content generation, structure, and compliance

### Capability 1: **Learning Objective Generation**
- **What it does:** Teacher types a topic; AI suggests 5 potential learning objectives
- **Example:**
  ```
  Teacher types: "Quadratic equations"
  AI suggests:
  - Students will be able to solve quadratic equations using factoring
  - Students will be able to apply the quadratic formula
  - Students will understand the relationship between roots and factors
  - Students will model real-world scenarios with quadratic equations
  - Students will critique different solution methods for efficiency
  ```
- **Teacher chooses:** Selects which objectives match their context
- **Why useful:** Reduces blank-page paralysis; exposes pedagogical best practices

### Capability 2: **Activity & Resource Suggestions**
- **What it does:** AI suggests activities, resources, and differentiation for given objectives
- **Example:**
  ```
  Learning Objective: "Students will solve quadratic equations using factoring"
  
  AI suggests activities:
  - Exploration: Give students cards with different quadratic equations; they sort by method needed
  - Traditional: Worked examples with scaffolded practice problems (Khan Academy link)
  - Hands-on: Use algebra tiles to visualize factoring
  
  AI suggests resources:
  - Desmos graphing tool (visualize solutions)
  - Khan Academy: "Quadratic equations" module
  - GeoGebra: Factoring interactive
  
  AI suggests differentiation:
  - Below grade level: Provide factor pairs to choose from
  - ELL: Use visual representations; provide vocabulary glossary
  - Gifted: Ask students to create their own quadratic problems with given roots
  ```
- **Teacher customizes:** Picks/edits suggestions; adds school-specific resources
- **Why useful:** Exposes teachers to pedagogy research; saves research time

### Capability 3: **Curriculum Alignment & Gap Detection**
- **What it does:** AI reviews plan; flags which curriculum standards are covered/missing
- **Example:**
  ```
  Teacher's Grade 8 Algebra plan mentions:
  - Solving equations
  - Graphing linear functions
  - Writing equations from data
  
  AI checks against Common Core and flags:
  ✅ COVERED: Solve linear equations
  ✅ COVERED: Model with linear functions
  ❌ MISSING: Systems of equations
  ❌ MISSING: Interpret slope and intercept in context
  
  AI suggests: "You've covered 7 of 10 Grade 8 Algebra standards. 
  Would you like suggestions for fitting in systems and slope interpretation?"
  ```
- **Teacher decides:** Adds suggested units or defers to next term
- **Why useful:** Ensures curriculum completeness; prevents gaps; auditable compliance

### Capability 4: **Differentiation Prompt Assistant**
- **What it does:** AI asks probing questions to help teacher think through differentiation
- **Example:**
  ```
  Teacher is planning: "Analyzing Shakespeare for Grade 10"
  
  AI asks:
  - "How many ELL students are in this class? Difficulty level?"
  - "Do you have students with IEPs or 504 plans focusing on reading?"
  - "What's your classroom's Lexile range?"
  - "Have you considered graphic novel/audio versions of the text?"
  
  Based on answers, AI suggests:
  - "Consider pairing challenging soliloquies with modern video adaptations to model comprehension"
  - "Offer no more than 2-3 sentence chunks if reading level is <800L"
  - "Use think-pair-share before discussion to lower speaking anxiety for introverts"
  ```
- **Teacher's benefit:** More thoughtful differentiation; less time researching
- **Why useful:** Increases inclusive teaching practices; reduces cognitive load

### Capability 5: **Assessment Suggestion & Alignment**
- **What it does:** AI suggests formative + summative assessments aligned to objectives
- **Example:**
  ```
  For objective: "Students will solve quadratic equations using the quadratic formula"
  
  AI suggests assessments:
  
  Formative (during unit):
  - Exit ticket: "Solve this quadratic. What challenge did you face?"
  - Error analysis: "Find the mistake in this student's work"
  - 3-2-1 reflection: 3 problems solve independently, 2 things you got stuck on, 1 strategy that worked
  
  Summative (end of unit):
  - Short assessment: 5 problems varying by difficulty
  - Extended task: "Rocket launch scenario—when does it reach 200ft height?"
  - Presentation option: "Teach a peer your favorite method for solving quadratics"
  ```
- **Teacher customizes:** Changes difficulty, format, or criteria based on class
- **Why useful:** Better assessment design; balanced formative/summative; student agency

### 7.2 AI Constraints & Safety

**What AI Will NOT Do:**
- ❌ Generate student lesson content (e.g., "write a short story about...")
- ❌ Replace teacher judgment (AI suggests; teacher decides)
- ❌ Access student data or grades
- ❌ Create lesson video content
- ❌ Generate inappropriate content (vetted against teaching standards)

**Safety Guardrails:**
1. **Human review:** All AI suggestions are marked "AI Generated"; teacher must review before publishing
2. **Content filtering:** AI trained on vetted teaching resources; no misinformation engine
3. **Bias checking:** AI suggestions are regularly audited for bias/stereotypes
4. **Opt-out option:** Teachers can disable AI suggestions if they prefer manual planning
5. **Explainability:** AI shows *why* it's making a suggestion (e.g., "This aligns to Common Core 8.EE.A.1")

---

## 8. SUCCESS METRICS & KPIs

### 8.1 How to Know the System Solved the Problem

**Core Outcome Metrics (measure monthly):**

| Metric | Baseline | Target (6 months) | Target (12 months) | How to Measure |
|--------|----------|------------------|-------------------|----------------|
| **Teachers reporting plans never lost** | 0% | 85% | 95% | Survey: "Have you lost a plan due to technical failure?" |
| **Time spent planning per week** | 4.5 hours | 3 hours | 2.5 hours | Monthly survey (5-question pulse) |
| **Plan reuse rate** | 10% | 40% | 60% | Track: % of new plans imported from old ones |
| **Plans shared with colleagues** | 20% | 50% | 75% | Track: % of plans with ≥1 shared user |
| **Adoption rate** | 30% (early schools) | 70% | 90% | Active users / total users per school |
| **Curriculum coverage visibility** | Not tracked | 90% of coordinators report "know coverage status" | 100% | Coordinator survey; audit time metric |
| **Compliance audit time** | 4 hours | 1 hour | 30 minutes | Track actual time spent by admin/coordinator |

### 8.2 Product Health Metrics (operational)

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **System uptime** | 99.5% | Teachers trust it won't fail at critical moments |
| **Page load time** | <2 seconds | Friction = abandonment |
| **Support tickets per 100 users** | <5/month | Low = intuitive product; high = UX issues |
| **Feature adoption (each core feature)** | 70%+ | Ensure users discover and use each feature |
| **Plan completeness** | 80% full plans (vs. half-finished) | Indicates value perceived |
| **Churn rate by user role** | <5% of teachers leave; <10% of schools leave | Retention = product viability |

### 8.3 Business Metrics (sustainability)

| Metric | Target (Year 1) | Target (Year 2) |
|--------|-----------------|-----------------|
| **Revenue** | £10K-20K (20-30 schools) | £100K+ (100+ schools) |
| **Customer Acquisition Cost (CAC)** | <£300 (per school) | <£200 (viral coefficient improves) |
| **Customer Lifetime Value (LTV)** | £2,400 (3-year average) | £5,000+ (longer retention) |
| **Churn rate** | <8% annual | <5% annual |
| **Schools evaluating product** | 20 pilots | 100+ inbound demos |

---

## 9. MVP SPECIFICATION: WHAT TO BUILD FIRST

### 9.1 Phased Development Roadmap

**Sprint 1-2 (Weeks 1-4): Core Infrastructure**
- ✅ User authentication (email/password for MVP; OAuth later)
- ✅ School admin dashboard
- ✅ User role system (Teacher / Coordinator / Admin)
- ✅ Basic plan creation form

**Sprint 3-4 (Weeks 5-8): Core Planning Features**
- ✅ Complete plan CRUD (Create, Read, Update, Delete)
- ✅ Auto-save (no data loss)
- ✅ Organization by Grade/Subject/Term
- ✅ Basic sharing (view-only within school)

**Sprint 5 (Weeks 9-10): Reusability**
- ✅ Plan duplication / "Copy to New Term"
- ✅ Archive old plans (findable but not in main view)
- ✅ Plan templates (pre-built structures by subject)

**Sprint 6 (Weeks 11-12): Export & Coordination**
- ✅ PDF export
- ✅ Coordinator dashboard (grid view of all plans by grade/subject)
- ✅ Basic feedback/comments system

**Sprint 7 (Weeks 13-14): Polish & Testing**
- ✅ Mobile responsiveness
- ✅ Accessibility audit (WCAG 2.1 AA)
- ✅ Security testing
- ✅ Documentation & help content

**Timeline:** 14 weeks (3.5 months) from start to MVP launch

---

### 9.2 MVP Feature Scope (What's In / What's Out)

**INCLUDED in MVP:**

✅ Plan creation with structured form  
✅ Storage & organization (School > Subject > Grade > Term)  
✅ Plan reuse (copy/import from past terms)  
✅ Within-school sharing (view-only)  
✅ PDF export  
✅ Curriculum mapping dashboard (basic)  
✅ Comments/feedback on plans  
✅ Role-based access (Teacher/Coordinator/Admin)  
✅ Version history (all edits tracked)  
✅ Help documentation  

**EXCLUDED from MVP (Phase 2+):**

❌ Cross-school sharing  
❌ AI suggestions  
❌ Mobile app  
❌ Curriculum standards auto-alignment  
❌ Bulk upload of existing plans  
❌ Advanced analytics  
❌ Integration with SIS / Google Classroom  
❌ Student outcome tracking  

---

## 10. STRATEGIC RECOMMENDATIONS

### 10.1 Key Success Factors

**1. Nail the User Experience First**
- Education technology fails because of poor UX, not features
- Every teacher must create their first plan in <15 minutes without support
- Test relentlessly with actual teachers (not designers assuming what teachers want)
- **Action:** Run weekly user testing with target personas Months 1-3

**2. Prioritize Within-School Adoption Over Cross-School Features**
- The problem is solved when reuse happens *within a school* (Marcus shares with department, Sarah uses templates)
- Cross-school sharing adds complexity; can wait until product is solid
- Early users will be subject coordinators (Priya) and department leads
- **Action:** Market entry point is "Department coordination tools," not "school-wide planning"

**3. Make the First 48 Hours Effortless**
- New school signs up; they should have 1 complete term's plan within 2 hours of onboarding
- Provide "starter templates" for each subject; schools should customize, not build from scratch
- Admin should have a 15-minute setup wizard (upload roster → generate teacher accounts → assign templates)
- **Action:** Build a "school onboarding checklist" that takes <30 minutes

**4. Build Coordinator Dashboard as a Core Feature**
- This is the feature that gets school admin buy-in
- Coordinators have audit/compliance pressure; this system reduces their workload by 75%
- A good coordinator dashboard will drive adoption more than any teacher feature
- **Action:** Priya persona feedback should drive the coordinator dashboard design

**5. Focus on Retention, Not Acquisition**
- Education market has slow sales cycles (school budgets decided annually)
- Losing 1 pilot school to poor experience is worse than gaining 3 new ones
- Target: 95% retention of pilot schools → move to growth later
- **Action:** Monthly NPS surveys; support each pilot school with dedicated onboarding

**6. Data Privacy as a Competitive Advantage**
- schools are paranoid about data privacy
- "GDPR-compliant" and "encrypted" should be on your homepage
- **Action:** Get SOC 2 Type II audit completed by Month 9

---

### 10.2 Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Teachers don't adopt** (stick with Google Docs) | High | Fatal | Start with coordinators (forced adoption); make it 10x easier |
| **Feature pressure** (stakeholders ask for integration with SIS) | High | Medium | Clear roadmap; show what's Phase 2/3; say "no" sometimes |
| **Data loss** (plan deleted by accident; users blame system) | Medium | Critical | Soft delete + 30-day recovery; excellent backup; UI for confirmation |
| **Multi-school complexity** (schools request custom roles/workflows) | High | Medium | Strict scope; find 80% use case; save 20% customization for later |
| **Churn** (schools try for free trial; don't convert) | High | Medium | Nail onboarding; establish value in Week 1; offer phased pricing |

---

### 10.3 Resource & Timeline Summary

**Team Needed (MVP - 14 weeks):**
- 1 Product Manager (strategic decisions, user research, prioritization)
- 2 Full-stack engineers (backend + frontend)
- 1 QA/tester
- 1 UI/UX designer
- 0.5 DevOps (infrastructure setup)
- **Total:** ~5.5 FTE for 14 weeks

**Budget Estimate (Rough):**
- Team salary: £80K-100K × 5.5 people × 3.5 months = £115K-145K
- Infrastructure (AWS, domains, tools): £2-3K
- External tools (design, testing, DevOps): £5K
- **Total MVP:** ~£125K-155K

**Timeline to Revenue:**
- 14 weeks: MVP launch
- Weeks 15-20: Pilot with 1-2 schools (free); iterate
- Weeks 21-26: Soft launch with pricing (5-10 schools)
- **First Revenue:** Month 6; First £10K-20K ARR: Month 9-12

---

## 11. APPENDIX: GLOSSARY & DEFINITIONS

**Scheme of Work:** A long-term plan (usually 1 term or 1 year) showing what will be taught, when, and to whom; typically at unit/subject level.

**Lesson Plan:** A detailed plan for a single lesson or group of lessons (usually 1-5 weeks); includes objectives, activities, assessments, resources.

**Learning Objective:** A specific, measurable statement of what students should be able to do by the end of a lesson/unit.

**Curriculum Alignment/Coverage:** Ensuring that lessons/plans teach the required curriculum standards (e.g., Common Core, UK National Curriculum).

**Differentiation:** Varying teaching/assignments based on student needs (e.g., ELL, SEND, gifted).

**Scheme of Work vs. Lesson Plan:**
- **Scheme of Work:** "Year 8 English curriculum covers Shakespeare, Modern Lit, Poetry, Close Reading—in that order, this is how long each takes"
- **Lesson Plan:** "Week 1 of Shakespeare unit: read Act 1 of Macbeth, analyze characterization, exit ticket on themes"

---

## 12. CONCLUSION

The Digital Lesson Plan & Scheme of Work System solves a real, material problem: **teachers spending 40-50% of their planning time on format/organization instead of pedagogy, and losing plans to technical failures.**

### Why This Will Win:

1. **Solves a specific problem** (document loss + disorganization) → teachers will immediately feel relief
2. **Enables reuse** (copy last year's plans) → teachers save 2-3 hours/week
3. **Serves multiple personas** (from Sarah the new teacher to Priya the coordinator) → many entry points
4. **Measurable ROI** (planning time reduced, compliance audits faster, new teacher onboarding easier) → schools will pay
5. **Extensible** (AI suggestions, SIS integration, analytics) → long-term product roadmap
6. **No hardware/adoption risk** (web-based, works in existing school IT) → low barrier to deployment

### The Path Forward:

1. **Validate the problem** (user interviews with 5-10 teachers/coordinators) → confirm the pain is real
2. **Build MVP scrappily** (14-week sprint; resist feature creep)
3. **Pilot with 2 diverse schools** (primary + secondary) → get real feedback
4. **Obsess over onboarding** (first week determines retention)
5. **Build coordinator dashboard early** (this is the school admin's reason to buy)
6. **Focus on retention** (keep piloting schools happy) → word-of-mouth growth

This product is not technically hard; it's not a moonshot. **It's a straightforward solution to a real problem that schools will pay for if it works well.** The key to success is ruthless focus on UX, retention, and solving the core problem (reuse + no loss) before adding complexity.

The market is ready. Go build it.

---

**Document Version:** 1.0  
**Last Updated:** March 21, 2026  
**Next Review:** After pilot feedback (Month 4)
