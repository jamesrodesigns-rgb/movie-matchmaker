# Movie Matchmaker — Golden Path (v2.0)

A concise, buildable flow from first open to “watch now,” optimized for a 60–90 second happy path.

---

## Steps

### GP-01 — Onboarding / Sign in
- **trigger:** User opens the app
- **screen:** `/` (SignInCard)
- **action:** Create account or continue with provider. If returning, fetch last session.
- **data:** `User{id, displayName, avatarUrl?}`, auth token
- **states:** 
  - success → GP-02
  - empty → show “Continue as guest” if enabled
  - error → inline auth error
- **next:** GP-02

### GP-02 — Baseline quiz and streaming services
- **trigger:** Successful sign in or guest continue
- **screen:** `/quiz` (QuizSwiper, StreamingServiceSelector)
- **action:** Capture quick taste baseline (5–7 items) and select streaming services
- **data:** `QuizResponse{answers[]}`, `User.streamingServices[]`
- **states:** 
  - success → GP-03
  - empty → disable Continue until min answers met
  - error → retry save
- **next:** GP-03

### GP-03 — Groups dashboard and create group
- **trigger:** Quiz completion
- **screen:** `/groups` (GroupList, CreateGroupDialog, GroupCard)
- **action:** Show existing groups. Create new group with name and invite options.
- **data:** `Group{id, name, members[], settings}`, `GroupInvite{link, phone?}`
- **states:** 
  - success → GP-04
  - empty → show “Create your first group”
  - error → inline create error
- **next:** GP-04

### GP-04 — Criteria selection
- **trigger:** Group created or chosen
- **screen:** `/group/:id/filters` (FilterPanel)
- **action:** Choose genres, release window, runtime cap, services (prefill from user), optional fairness toggle
- **data:** `FilterCriteria{genres[], yearRange, runtimeMax?, services[], fairnessMode?}`
- **states:** 
  - success → GP-05
  - empty → allow Skip with sensible defaults
  - error → inline save error
- **next:** GP-05

### GP-05 — Swiping and rating
- **trigger:** Filters saved or skipped
- **screen:** `/group/:id/swipe` (MovieCardSwiper, VoteBar, MovieInfoDrawer)
- **action:**  
  - Each member rates a limited set (20–30) using Yes / No only.  
  - Every MovieCard shows a **confidence score** (0–100%).  
  - Each MovieCard includes a **“Why this?” button** → opens modal/drawer with reasons (e.g., “3/4 members like this genre; on Netflix; high critic rating”).  
- **data:**  
  - `Vote{groupId, memberId, movieId, value, weight, createdAt}`  
  - `RecommendationMeta{movieId, confidence: number, reasons: string[]}`  
- **states:** 
  - success → GP-06 once member completes quota
  - empty → load more titles if exhausted early
  - error → retry vote submission
- **next:** GP-06

### GP-06 — Finalists waiting room
- **trigger:** Member completes quota
- **screen:** `/group/:id/finalists` (FinalistsView, Progress Meter)
- **action:** Show top 2 based on current votes. If others still rating, show progress with playful animation.
- **data:** `MatchResult{topPicks:[{movieId, score, reasons[]}] , breakdownByMember}`
- **states:** 
  - success → GP-07 when quorum reached
  - empty → fallback to top pick for available members after timeout
  - error → recompute on the fly
- **next:** GP-07

### GP-07 — Final pick
- **trigger:** Quorum or timeout
- **screen:** `/result` (WinnerCard, SpinWheel optional)
- **action:** Group selects 1 of the finalists or spins a wheel for fair tiebreak. Provide CTA to “Open on TV” or “Copy link.”
- **data:** `Winner{movieId, decidedBy: 'vote'|'spin', timestamp}`
- **states:** 
  - success → show watch CTA
  - empty → suggest top 3 list
  - error → revert to top-ranked
- **next:** End

---

## Acceptance Criteria (MVP)

1. A signed-in or guest user can complete a 5–7 item quiz and pick streaming services before seeing groups.  
2. A user can create a group, see an invite link, and at least one other person can join via link.  
3. Filters can be applied or skipped; defaults produce sensible candidates.  
4. Each member can rate a finite set and see visible progress toward a group quorum.  
5. Each movie card displays a **confidence score** and has a **“Why this?” button** opening a modal/drawer with reasons.  
6. The app produces at least two finalists from votes and shows simple reasons.  
7. The group can confirm a winner or use a fair tiebreaker and immediately see a “watch now” CTA.  
8. All steps are reachable with mock data and work offline in Storybook.  

---

## Path-to-Code Mapping

| GP | route                   | components                                          | types touched                            | Storybook stories                                   | test id     |
|----|-------------------------|-----------------------------------------------------|------------------------------------------|-----------------------------------------------------|-------------|
| 01 | `/`                     | SignInCard                                          | `User`                                    | Auth/SignInCard                                    | happy-GP-01 |
| 02 | `/quiz`                 | QuizSwiper, StreamingServiceSelector                | `QuizResponse`, `User.streamingServices[]`| Onboarding/Quiz Complete                            | happy-GP-02 |
| 03 | `/groups`               | GroupList, CreateGroupDialog, GroupCard             | `Group`, `GroupInvite`                    | Groups/Empty, Groups/WithItems                      | happy-GP-03 |
| 04 | `/group/:id/filters`    | FilterPanel                                         | `FilterCriteria`, `Group.settings`        | Group/Filters Defaults, Filters Applied             | happy-GP-04 |
| 05 | `/group/:id/swipe`      | MovieCardSwiper, VoteBar, **MovieInfoDrawer**       | `Movie`, `Vote`, `RecommendationMeta`     | Swipe/Deck Basic, Deck with Confidence, Drawer Open | happy-GP-05 |
| 06 | `/group/:id/finalists`  | FinalistsView, Progress Meter                       | `MatchResult`                             | Finalists/Waiting, Finalists/Ready                  | happy-GP-06 |
| 07 | `/result`               | WinnerCard, SpinWheel (optional), CTA bar           | `Winner`                                  | Result/Winner, Result/No-Consensus                  | happy-GP-07 |

---

## Data Contracts

### Core entities
```ts
type ID = string;

export type User = {
  id: ID;
  displayName: string;
  avatarUrl?: string;
  streamingServices: StreamingService[];
};

export type Member = {
  id: ID;
  displayName: string;
  avatarUrl?: string;
  preferences?: {
    favoriteGenres?: Genre[];
    dislikedGenres?: Genre[];
  };
};

export type Group = {
  id: ID;
  name: string;
  createdAt: string;
  members: Member[];
  settings: GroupSettings;
  currentSetMovieIds?: ID[];
};

export type GroupSettings = {
  fairnessMode?: 'off' | 'balance_minimax';
  maxRuntime?: number;
  services: StreamingService[];
  maturityRating?: 'G' | 'PG' | 'PG-13' | 'R' | 'NR';
};

export type GroupInvite = {
  link: string;
  phone?: string;
};

export type Movie = {
  id: ID;
  title: string;
  year: number;
  runtime: number;
  services: StreamingService[];
  genres: Genre[];
  posterUrl?: string;
  synopsis?: string;
};


---

## Notes for Build

### 1) Voting & Matching (binary)
- **Vote options:** `yes` / `no` only (no “meh”) to lower cognitive load and simplify scoring.
- **Quota:** Require each member to rate a minimum (e.g., **12 of 20**) before they’re considered “complete.”
- **Deck size:** Start with **20–30** cards per session; virtualize for performance.
- **Scoring v0 (group fairness-lite):**
  - Map `yes = 1`, `no = 0`.
  - Normalize per member so heavy raters don’t dominate (divide by each member’s total votes).
  - **Movie score** = sum of normalized yes across members.
  - **Tie-breakers:** (1) least variance of yes across members, (2) runtime closest to group’s max, (3) random.
- **Finalists:** Top **2** by score (after tie-breakers).
- **Winner:** Group picks one finalist or uses **SpinWheel** for fair tiebreak.

**TypeScript pseudocode**
```ts
type MemberTally = { yes: number; total: number };
type GroupTally = Record<MemberId, MemberTally>;

function scoreMovie(groupTally: GroupTally, votersForMovie: MemberId[]): number {
  return votersForMovie.reduce((sum, m) => {
    const t = groupTally[m];
    if (!t || t.total === 0) return sum;
    return sum + (t.yes / t.total); // normalized contribution
  }, 0);
}