---
title: "BePro AI/ML — Olist Compound Curriculum"
subtitle: "One dataset, one project, six modules of compounding work, one resume-grade portfolio piece"
author: "Saidazam — Mentor & Product Owner"
date: "2026-05-04"
---

# Olist Compound Curriculum (Modules 3 → 8)

> **Premise.** Every student walks out of the program with **one real GitHub repository** that demonstrates an end-to-end ML system on the Olist Brazilian e-commerce dataset. Each module adds one layer to the same project. By the end, the project is a CV bullet, not a homework folder.

---

## 0. Why this design

### 0.1 What was broken

- Each module had its own toy dataset → no continuity, no compounding skill.
- Cleaning class used a clean dataset (theatre).
- Capstone-style assignments only existed at M8 → too late for portfolio building.
- Students with weak English / first-time laptop users (Type 2) drowned because every module asked them to learn a new domain.
- Strong students (Type 1) felt the work was repetitive because new domain ≠ new skill.

### 0.2 What changes

- **Single dataset, locked from M3 on:** Olist Brazilian E-Commerce (Kaggle).
- **Cumulative work product:** the cleaned dataset from M3 feeds the M4 classifier feeds the M5 segmentation feeds the M6 neural net feeds the M7 NLP layer feeds the M8 deployed API.
- **Two assignment tiers, same dataset:** Bronze (Type 2 — A2 English, beginner laptop) and Gold (Type 1 — comfortable, wants stretch). Same rubric, different depth. Bronze never feels stupid. Gold never feels under-challenged.
- **Every class previews the assignment 1-2 weeks ahead** so students know *why* today matters.

### 0.3 What stays the same

- The 8-module topic structure is unchanged.
- Module 1 (concepts) and Module 2 (Python tooling) stay as written. Olist enters at M3.
- Class hours, exam dates, lab format unchanged.
- Submission workflow (PR per assignment) unchanged.

---

## 1. The dataset — Olist Brazilian E-Commerce

**Source:** [https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
**License:** CC BY-NC-SA 4.0 (free for educational / non-commercial use)
**Size:** ~50 MB, 9 CSV files
**Period covered:** 2016-09 → 2018-10

### 1.1 Files students get

| File | Rows | Why we use it |
|---|---|---|
| `olist_customers_dataset.csv` | 99,441 | Customer ID linking, geography |
| `olist_orders_dataset.csv` | 99,441 | Core order timestamps + status (the spine) |
| `olist_order_items_dataset.csv` | 112,650 | Per-product line items, freight, prices |
| `olist_order_payments_dataset.csv` | 103,886 | Payment method, value, instalments |
| `olist_order_reviews_dataset.csv` | 99,224 | **5-star rating + free-text review (Portuguese)** — the M7 NLP source |
| `olist_products_dataset.csv` | 32,951 | Category, dimensions, weight |
| `olist_sellers_dataset.csv` | 3,095 | Seller geography |
| `olist_geolocation_dataset.csv` | 1,000,163 | Lat/lon for distance calculations |
| `product_category_name_translation.csv` | 71 | Portuguese → English category names |

### 1.2 Why Olist specifically (over telco, retail, etc.)

- **Genuinely dirty.** Mixed date formats. Missing delivery dates (~3% — these are the *interesting* rows: orders that never arrived). Inconsistent state-code casing. NaN review comments. Real noise that real cleaning skills fix.
- **Has all three data shapes.** Numeric (price, freight), categorical (state, payment_type), text (review_comment_message), datetime (5+ timestamps per order). One dataset → covers M3-M7 needs.
- **Multi-table relational.** Forces students to learn merging properly (M2 skill) before they can model.
- **Multiple targets to choose from** — covered in §2.
- **Distance calculation works.** Brazil is huge, geolocation is real, Haversine over customer × seller cities is a real signal. Perfect for M3 feature engineering.
- **Resume-friendly headline.** "Built an end-to-end ML system on a 100k-order Brazilian e-commerce dataset" beats "predicted churn on a synthetic telco dataset" every time. Hiring managers know Olist.

---

## 2. Targets — what we predict / segment / explain

| Target | Type | Modules where used |
|---|---|---|
| `is_late` (delivered_customer_date > estimated_delivery_date) | Binary | M4 (classifier), M6 (neural net) |
| `review_score` (1-5 stars) | Multi-class | M4 stretch, M6 stretch |
| `customer_segment` (clusters of customer behaviour) | Unsupervised | M5 |
| `review_sentiment` (positive / negative / neutral from review text) | NLP-derived | M7 |
| `will_repurchase` (customer_unique_id appears > 1 time within 90 days) | Binary | M5 stretch, M8 capstone |

The **headline target for the compound project is `is_late`** — chosen because:
- Imbalanced (~7% late) → forces M4 students to confront accuracy-as-wrong-metric.
- Real business value → "predict which orders will arrive late so support can warn customers."
- Improves with every layer: clean data → classifier → embedded neural net → enriched with review sentiment → deployed.

---

## 3. Module-by-module compounding

```
            Raw 9-CSV Olist dump
                    │
                    ▼
    ┌──────────────────────────────────────┐
M3  │ Clean + merge + feature-engineer     │ → olist_clean.parquet (the spine output)
    │ One canonical analytical table       │
    └────────────────┬─────────────────────┘
                     │
                     ▼
    ┌──────────────────────────────────────┐
M4  │ Train classifier on is_late          │ → model_v1.pkl + evaluation report
    │ Logistic, Trees, Random Forest       │
    └────────────────┬─────────────────────┘
                     │
                     ▼
    ┌──────────────────────────────────────┐
M5  │ Customer segmentation                │ → customer_clusters.csv + 4 named cohorts
    │ K-Means, dimensionality reduction    │
    └────────────────┬─────────────────────┘
                     │
                     ▼
    ┌──────────────────────────────────────┐
M6  │ Neural net classifier                │ → model_v2_nn.pkl + comparison
    │ Beat or match M4 baseline            │
    └────────────────┬─────────────────────┘
                     │
                     ▼
    ┌──────────────────────────────────────┐
M7  │ Review-text sentiment + add to model │ → model_v3_with_text.pkl
    │ TF-IDF / embeddings → enriched data  │
    └────────────────┬─────────────────────┘
                     │
                     ▼
    ┌──────────────────────────────────────┐
M8  │ Deploy as Flask/FastAPI dashboard    │ → live URL + GitHub repo + README
    │ Capstone presentation                │
    └──────────────────────────────────────┘
```

### 3.1 Module 3 — Data Preparation & Feature Engineering

**Lecture topic stays:** cleaning, encoding, feature engineering, feature selection, pipelines, EDA lab.

**What's new:**
- Every class uses raw Olist tables.
- Every assignment writes one piece of `clean_olist.py`.
- The Module 3 lab (Class 6) outputs **`olist_clean.parquet`** — the file every subsequent module loads as input.

**Cumulative deliverable at end of M3:** a single Parquet file (~50 MB) containing one row per order, with columns: `order_id, customer_id, customer_state, seller_state, distance_km, freight_value, num_items, total_price, payment_type, review_score, delivered_days, estimated_days, is_late, purchase_hour, purchase_dayofweek, purchase_month`.

**Type 2 (Bronze) homework version:** "Here's a notebook with all the cleaning code; run it, fix the 5 TODOs, and produce the Parquet."
**Type 1 (Gold) homework version:** "Given the 9 raw CSVs, build the same cleaning + feature pipeline yourself, document each decision."

### 3.2 Module 4 — Supervised Learning

**Lecture topic stays:** linear regression, logistic regression, trees & random forests, evaluation metrics, overfitting, classifier lab.

**What's new:**
- Every example, every assignment loads `olist_clean.parquet` from M3.
- Class 4-1 (Linear Regression) → predict `freight_value` from `distance_km` (concrete, intuitive).
- Class 4-2 (Logistic Regression) → predict `is_late` (the headline target).
- Class 4-3 (Trees / Random Forest) → improve the `is_late` baseline.
- Class 4-4 (Evaluation) → confront accuracy on the imbalanced `is_late` (only 7% positives) → introduce precision/recall/F1/ROC-AUC.
- Class 4-5 (Overfitting) → cross-validation on the same task; compare M4-3 RF vs cross-validated RF.
- Class 4-6 (Lab) → ship `model_v1.pkl` + a 1-page report.

**Cumulative deliverable at end of M4:** trained model, evaluation report, and a comparison table (Logistic vs Tree vs Random Forest with metrics).

### 3.3 Module 5 — Unsupervised Learning

**Lecture topic stays:** clustering intro, K-Means, hierarchical, dimensionality reduction, anomaly detection, segmentation lab.

**What's new:**
- Class 5-1 (clustering intro) → why segment Olist customers?
- Class 5-2 (K-Means) → cluster customers by RFM (Recency from `order_purchase_timestamp`, Frequency = order count, Monetary = sum of `total_price`). Output: 4 named cohorts.
- Class 5-3 (hierarchical) → repeat with hierarchical, compare dendrograms.
- Class 5-4 (PCA / t-SNE) → visualise the cohorts in 2D.
- Class 5-5 (anomaly detection) → find unusual orders (very high freight relative to value, etc.).
- Class 5-6 (lab) → output `customer_clusters.csv` joining cluster ID back to the M3 Parquet.

**Cumulative deliverable:** customer_clusters.csv + a one-page cohort write-up ("Cohort A: high-value, low-frequency luxury buyers; recommend X").

### 3.4 Module 6 — Neural Networks & Deep Learning

**Lecture topic stays:** perceptrons, backprop, CNNs, RNNs, transfer learning, image classifier lab.

**What's new (key adaptation — most NN topics fit Olist tabular data weirdly, so we tier the assignments):**
- Class 6-1 (perceptrons) → build a 1-layer NN that matches logistic regression on `is_late`. Prove the theoretical equivalence.
- Class 6-2 (backprop) → train a 3-layer MLP on `is_late`. Compare to M4 random forest.
- Class 6-3 (CNNs) → demo on **product photo** task (Olist product images dataset is available as a separate Kaggle download). Optional for Bronze, required for Gold.
- Class 6-4 (RNNs) → demo on **review text sequences** (briefly — the heavier text work is in M7).
- Class 6-5 (transfer learning) → fine-tune a small pretrained model on the product images (Gold only).
- Class 6-6 (lab) → ship `model_v2_nn.pkl` for tabular `is_late` + a head-to-head comparison with M4 random forest.

**Cumulative deliverable:** trained NN, comparison report (which model wins, why).

### 3.5 Module 7 — NLP & Computer Vision

**Lecture topic stays:** text preprocessing, embeddings, transformers, computer vision, working with LLMs, sentiment/object lab.

**What's new:**
- Class 7-1 (text preprocessing) → clean and tokenise the **`review_comment_message`** column from Olist (Portuguese).
- Class 7-2 (embeddings) → TF-IDF and Word2Vec on the reviews.
- Class 7-3 (transformers) → use a pre-trained multilingual sentiment model (e.g. `distilbert-base-multilingual-cased`) to score each review.
- Class 7-4 (computer vision) → CV pivot: classify Olist product images by category. (Different sub-dataset, same project narrative.)
- Class 7-5 (working with LLMs) → use an LLM API to summarise the top complaints per product category.
- Class 7-6 (lab) → output `model_v3_with_text.pkl` — the M4 model enriched with `review_sentiment` as a new feature.

**Cumulative deliverable:** sentiment-enriched model + lift comparison (does adding text help?).

### 3.6 Module 8 — Capstone & Deployment

**Lecture topic stays:** project planning, model dev sprint, Flask/FastAPI deployment, MLOps, demo prep, final presentations.

**What's new:**
- Class 8-1 (planning) → write a 1-page architecture doc for the deployed system (input → model → output).
- Class 8-2 (model dev sprint) → consolidate M4-M7 outputs into one polished model.
- Class 8-3 (deployment) → wrap the model as a Flask/FastAPI endpoint. Input: order JSON. Output: `is_late` probability + reason.
- Class 8-4 (MLOps) → add basic logging + a `/health` endpoint + a re-train script.
- Class 8-5 (demo prep) → record a 3-minute video walkthrough.
- Class 8-6 (final presentations) → live demo in front of the cohort.

**Final cumulative deliverable:** a public GitHub repo + a deployed URL + a 3-minute video.

---

## 4. The compound resume bullet

Every student at end of program can write this on their CV (with their own results filled in):

> **Olist E-commerce Delivery & Reviews Intelligence Platform** (BePro AI/ML, 2026)
> Built an end-to-end ML system on the Olist Brazilian e-commerce dataset (100k+ orders).
> Engineered a relational analytical table (15 features) from 9 raw CSVs. Trained gradient-boosted classifier predicting late deliveries (ROC-AUC X.XX). Segmented customers into 4 RFM cohorts. Replaced the classifier with a 3-layer neural net for a Y% lift in F1. Enriched the model with review-text sentiment from a multilingual transformer for an additional Z% gain. Deployed the final model as a FastAPI endpoint with logging and re-train pipeline.
> Stack: Python · Pandas · NumPy · scikit-learn · TensorFlow · Hugging Face · FastAPI · Docker.
> Repo: github.com/<student>/olist-delivery-intelligence

This bullet sells. Hiring managers can read it.

---

## 5. Two-tier assignments — Bronze vs Gold

Every assignment from M3 onwards has both versions, **same dataset, same rubric, different depth**.

| Aspect | Bronze (Type 2) | Gold (Type 1) |
|---|---|---|
| Code skeleton | 50% pre-filled with `# TODO` markers | Empty notebook + spec only |
| Steps | Numbered, in order | Free choice of order + approach |
| Hints | Inline comments explaining each line | None — discover via docs |
| Deliverable | The expected output file | Same output file + a written justification of design choices |
| Time budget | 1.5 × the gold version | 1× |
| Grading | Same rubric. Bronze max grade is 90% (10% reserved for extension work students self-select). | Full 100% available. |

**Student picks their own tier each assignment.** Switching tiers between assignments is allowed (encouraged — Bronze students aim for Gold by M5).

---

## 6. Implementation timeline (mentor-side)

| Week | Milestone | Status |
|---|---|---|
| Week 0 (this week) | Master plan written + M3 content rewritten | 🟢 in progress |
| Week 1 | M3 lab data ready (clean Olist Parquet generation script in repo) | 🔴 not started |
| Week 2 | M4 content rewritten with Olist-grounded examples | 🔴 |
| Week 3 | M4 lab handout + Bronze/Gold versions | 🔴 |
| Week 4 (mid-term week) | Pause, mid-term covers M1-M4 | scheduled |
| Week 5-6 | M5 rewrite (segmentation on the M3 Parquet) | 🔴 |
| Week 7-8 | M6 rewrite (NN on the M3 Parquet) | 🔴 |
| Week 9-10 | M7 rewrite (NLP on Olist reviews + CV on product photos) | 🔴 |
| Week 11-12 | M8 rewrite (deployment of the compound model) | 🔴 |
| Week 13 | Final exam + demo day | scheduled |

---

## 7. Repository structure (per cohort, going forward)

```
bepro-aiml/<cohort>/
├── olist_data/                              ← single canonical dataset, committed once
│   ├── olist_customers_dataset.csv
│   ├── olist_orders_dataset.csv
│   ├── ...
│   └── README.md (license, source, schema)
├── olist_pipeline/                          ← grows module by module
│   ├── module_3_clean.py                    ← M3 lab output: cleans 9 CSVs → olist_clean.parquet
│   ├── module_4_classifier.py               ← M4: trains on olist_clean.parquet
│   ├── module_5_segments.py                 ← M5: clusters customers
│   ├── module_6_nn.py                       ← M6: replaces classifier with NN
│   ├── module_7_text.py                     ← M7: adds sentiment feature
│   └── module_8_deploy/                     ← M8: FastAPI app + Dockerfile
├── module-3/class_X/submissions/<Name>/...  ← (existing structure)
└── ...
```

Students fork or clone this. By M8 their fork is a deployable repo.

---

## 8. What each student type sees

### 8.1 Type 2 (A2 English, first-time laptop)

- Bronze assignment is a Colab notebook with code already written, 5 specific TODOs to fill in.
- Each TODO has 2-3 sentence inline explanation in plain English.
- Worked example linked to the equivalent YouTube tutorial, timestamped to the relevant 3-minute clip (not the full 30-minute video).
- "Why this matters" 60-second video at top of every assignment, recorded in Russian/Uzbek by the mentor (one-time recording, reusable).

### 8.2 Type 1 (comfortable, wants stretch)

- Gold assignment is a problem statement and the dataset.
- Encouraged to skip the lecture videos and self-study from docs.
- Stretch: contribute one extension (e.g. *try XGBoost*, *add a calibration plot*, *propose an alternative target*) and write 200 words on the result.
- Public credit on the website's "Contributors" page if their extension is merged into the cohort's pipeline.

---

## 9. Risks & how we mitigate

| Risk | Mitigation |
|---|---|
| One dataset gets boring | We don't change the dataset — we change the **lens**. M5 looks at customers, M7 looks at reviews, M8 looks at deployment. Same data, different angles. |
| Olist is non-Uzbek | Add 1-slide context per module connecting Olist insight to a local equivalent (e.g. "if Uzum had this data..."). |
| Some students prefer their own dataset for capstone | M8 capstone has an opt-out: students who want their own dataset can use one, but must demonstrate the same 6-stage pipeline. |
| Brazilian Portuguese in reviews | M7 explicitly uses a multilingual model. Translation isn't required — the embedding handles it. |
| Olist data quality changes (Kaggle removes the dataset) | Mirror the data once into the cohort repo's `olist_data/` folder. We're already doing this — see §7. |

---

## 10. Decision log

- **2026-05-04** — locked Olist as the compound dataset. Reason: dirty, multi-shape (numeric/cat/text/dates), has photos for M6/M7, multi-table for M2 merge skills, recognised name on CVs.
- **2026-05-04** — primary headline target = `is_late`. Reason: imbalanced, business-relevant, improves with every module.
- **2026-05-04** — assignments two-tiered (Bronze / Gold) starting M3. Reason: solves the Type 1 / Type 2 split without splitting cohorts.
- **TBD** — mid-term covers M1-M4 only. Final covers everything. (Confirm with program partner.)
- **TBD** — final exam includes a live demo of the deployed M8 system. (Pending faculty buy-in.)

---

*This document is the contract. Any deviation in module rewrites should be flagged here.*
