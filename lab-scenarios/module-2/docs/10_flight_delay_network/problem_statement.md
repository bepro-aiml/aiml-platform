# Aviation — U.S. Flight Delay Network

| | |
|---|---|
| **Industry** | Aviation / Operations Research |
| **Module** | 2 — Python and Data Foundations |
| **Lab type** | Final lab — student-defined approach |

---

## 1. Business Problem

5.8M+ US flights for 1 year. Build a network view of which airports propagate delay to which other airports, and quantify the spillover. Name the 5 most 'infectious' airports in the network.

---

## 2. Dataset

- **Source:** Kaggle [*US Flights 2015*](https://www.kaggle.com/datasets/usdot/flight-delays)
- **Volume:** 5,819,079 flights

### 2.1 Columns to keep
`YEAR`, `MONTH`, `DAY`, `AIRLINE`, `FLIGHT_NUMBER`, `TAIL_NUMBER`, `ORIGIN_AIRPORT`, `DESTINATION_AIRPORT`, `SCHEDULED_DEPARTURE`, `DEPARTURE_DELAY`, `ARRIVAL_DELAY`, `DISTANCE`

### 2.2 Columns to drop
Any column >40% null (`CANCELLATION_REASON`, `AIR_SYSTEM_DELAY` if not needed)

### 2.3 Data hygiene — noise to handle
- Times stored as `HHMM` integer (`'845'` = 08:45)
- Cancelled flights have negative delays
- Tail numbers occasionally null

> **Hygiene rule:** clean once, document the rule in code, never silently drop rows. Print row-count before and after every cleaning step. The cleaned dataset must follow the same column conventions as the platform's standard CSVs (lowercase column names, ISO timestamps, explicit `NaN` for missing values).

---

## 3. Deliverable

Top 5 most delay-propagating airports, with a network chart and a one-paragraph recommendation.

---

## 4. Today's Two Documents

You are NOT writing code today. You are designing the solution.

1. Open `documentation_phase_1_what.md` — describe **WHAT** tools, libraries, and methods you propose to use.
2. Open `documentation_phase_2_why.md` — explain **WHY** each of those tools and methods is the right choice for this specific scenario.

Both docs are submitted as part of the team's first-week deliverable.
