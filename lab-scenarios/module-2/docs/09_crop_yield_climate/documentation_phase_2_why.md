# Documentation — Phase 2: WHY

> **Purpose.** Justify the technical decisions you made in Phase 1 for **Agriculture — Crop Yield from Soil & Weather**.
> Every choice in your stack must be traceable to a reason. Vague answers ("it was easy", "everyone uses it") fail this document.

---

## Team

| Role | Name |
|---|---|
| Team lead | |
| Member 2 | |
| Member 3 | |

---

## 1. Why this scenario?

In 3–5 sentences, explain why your team picked **Agriculture — Crop Yield from Soil & Weather** over the other 9 scenarios. What about the problem appeals to you, what skills will you build, and what is the practical impact if you solve it well?

> *(write here)*

---

## 2. Methodological Justification

For each method you listed in Phase 1, explain **why it is the right method for this specific dataset and question**.

### 2.1 Why this analytical approach?
- *(e.g.)* "We chose ranked correlation over Pearson because the relationship between dropped calls and churn is monotonic but not linear — confirmed by an early scatter plot."

### 2.2 Why this aggregation level?
- *(e.g. why monthly vs daily, why per-route vs per-state, why per-customer vs per-transaction)*

### 2.3 Why these features and not others?
- *(name the kept features and the dropped ones — justify each in one line)*

### 2.4 Limits of the method
- 2 cases where your conclusion would be invalid — name them.

---

## 3. Tooling Selection

For each tool you proposed in Phase 1, justify the choice over the alternative.

### 3.1 Why this library / package?
- *(e.g.)* "We chose `pandas` over raw Python loops because the dataset has 1M+ rows and any per-row Python overhead would make the cleaning step take hours."
- ...

### 3.2 Why this visualization tool?
- *(why `seaborn` over `matplotlib`, or vice versa, or why `plotly` instead — justify based on the chart type and audience)*

### 3.3 Why this storage / format?
- *(why CSV vs Parquet vs SQLite; why Jupyter vs script; why GitHub vs Drive)*

### 3.4 Why this validation reference?
- *(when you check your numbers — what trusted reference do you compare against and why? `scipy`, `statsmodels`, `networkx`, etc.)*

---

## 4. What did you NOT pick — and why?

Name 2 tools or methods you considered but rejected, with one sentence each on why.

1. *(rejected option)* — *(reason)*
2. ...

---

## 5. Submission Checklist

- [ ] Phase 1 doc completed and signed off
- [ ] This Phase 2 doc completed
- [ ] Both pushed to your group repo at `module-2/class_6/lab-scenarios/09_crop_yield_climate/` (or your team's submissions folder)
- [ ] Mentor approval received before any code is written

**Mentor signature / date:**
