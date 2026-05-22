// ============================================================
// MODULE 3 CONTENT — Data Preparation and Feature Engineering
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module3.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_3_CONTENT = {

    "3-1": {
      title: "Data Quality and Cleaning",
      subtitle: "Module 3, Class 1 — Missing values, duplicates, outliers",
      sections: [
        { icon: "🧹", title: "The 80% Rule", content: `
<p>Data prep takes 80% of ML project time. A model trained on dirty data gives confident wrong answers — worse than no model.</p>
<p>Three things ruin datasets: missing values, duplicates, outliers.</p>
<div class="info-box"><strong>Golden rule:</strong> never delete data silently. Log what you dropped and why.</div>
` },
        { icon: "🕳️", title: "Missing Values", content: `
<pre>df.isna().sum()                # count per column
df.isna().sum() / len(df)      # fraction per column</pre>
<h4>Strategies (in order of preference)</h4>
<ol>
<li><strong>Investigate the cause.</strong> "Missing" often means "didn't answer survey" or "sensor offline" — that itself is a feature.</li>
<li><strong>MissingIndicator</strong> column, then impute: <code>df["age_was_missing"] = df["age"].isna()</code>.</li>
<li><strong>Impute:</strong> median for numeric, mode for categorical.</li>
<li><strong>Drop</strong> if &gt;50% missing and inexplicable.</li>
</ol>
<div class="case-study"><h4>Real example</h4><p>In a telecom dataset, <code>data_usage_gb</code> was missing for 30% of customers — only for prepaid users on old plans where usage wasn't tracked. That missingness perfectly identified a customer segment.</p></div>
` },
        { icon: "🎯", title: "Duplicates and Outliers", content: `
<pre>df.duplicated().sum()
df = df.drop_duplicates(subset=["user_id"])</pre>
<p>Fuzzy duplicates (typos) need normalization first: lowercase, strip whitespace.</p>
<h4>Outlier detection</h4>
<ul>
<li><strong>IQR:</strong> flag outside Q1 - 1.5·IQR or Q3 + 1.5·IQR.</li>
<li><strong>Z-score:</strong> more than 3 SDs from mean.</li>
</ul>
<div class="info-box"><strong>Don't reflexively delete outliers.</strong> A fraud transaction IS an outlier — it's what you want to detect. Winsorize (cap) or log-transform first.</div>
` },
        { icon: "📺", title: "Watch: Pandas Data Cleaning", video: "https://www.youtube.com/watch?v=ZOX18HfLHGQ", videoTitle: "Corey Schafer — cleaning techniques", content: `
<p>Walkthrough of common cleaning operations on real messy data.</p>
` },
        { icon: "💻", title: "Classwork", content: `
<p>Hands-on lab for today: clean a deliberately dirty customer dataset — missing values, duplicates, inconsistent text, wrong dtypes, and outliers all in one file.</p>
<p><strong>File:</strong> <code>m3_c1_classwork.ipynb</code> — find it in your group repo at <code>module-3/class_1/</code>. Self-contained: generates its own dirty dataset, no download needed.</p>
<p><strong>What you'll build:</strong> a step-by-step cleaning pipeline that produces a clean, model-ready table. Every section ends with a <em>Try It Yourself</em> tweak.</p>
<div class="info-box"><strong>How to run:</strong> open the notebook in Google Colab (drag-drop) or locally with Jupyter. Run cells top-to-bottom with Shift+Enter.</div>
` }
      ]
    },

    "3-2": {
      title: "Data Encoding and Transformation",
      subtitle: "Module 3, Class 2 — Categorical encoding, scaling, normalization",
      sections: [
        { icon: "🔤", title: "Categorical Encoding", content: `
<p>Models need numbers. Three main techniques:</p>
<ul>
<li><strong>One-hot</strong> — one binary column per category. Good for ≤15 categories. <code>pd.get_dummies(df, columns=["city"])</code>.</li>
<li><strong>Label encoding</strong> — integer per category. OK for trees, bad for linear models (implies false order).</li>
<li><strong>Target encoding</strong> — replace with mean target. Powerful but leakage-prone; compute on training folds only.</li>
</ul>
<div class="info-box"><strong>High cardinality (1000+ categories):</strong> one-hot explodes. Use target encoding, frequency encoding, or embeddings.</div>
` },
        { icon: "📐", title: "Scaling and Normalization", content: `
<p>Different scales break distance-based models (KNN, SVM, K-Means) and slow gradient descent.</p>
<ul>
<li><strong>StandardScaler</strong> — zero mean, unit variance. Default choice.</li>
<li><strong>MinMaxScaler</strong> — range [0, 1]. Sensitive to outliers.</li>
<li><strong>RobustScaler</strong> — uses median and IQR. Use when outliers present.</li>
</ul>
<div class="example-box"><pre>from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)   # transform only!</pre></div>
<div class="info-box"><strong>Fit the scaler on train only.</strong> Fitting on test leaks information.</div>
` },
        { icon: "🔄", title: "Non-Linear Transforms", content: `
<ul>
<li><strong>Log transform</strong> — compresses right-skewed data. Use <code>np.log1p(x)</code> to handle zeros.</li>
<li><strong>Box-Cox / Yeo-Johnson</strong> — automated power transforms.</li>
<li><strong>Binning</strong> — continuous → categorical (age → age_bucket). Loses info, helps non-linearity.</li>
</ul>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. "city" column with 5 values — best encoding?</div>
<ol class="quiz-options" type="A"><li>Label</li><li>One-hot</li><li>Drop</li><li>String</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Low cardinality → one-hot.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why is label encoding bad for linear models?</div>
<ol class="quiz-options" type="A"><li>Slow</li><li>Implies false ordinal relationship</li><li>Loses info</li><li>Can't handle nulls</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Integers imply order where there is none.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. StandardScaler produces features with:</div>
<ol class="quiz-options" type="A"><li>Range [0,1]</li><li>Mean 0, var 1</li><li>Range [-1,1]</li><li>Sum 1</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Zero mean, unit variance.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Where do you call <code>.fit()</code> on a scaler?</div>
<ol class="quiz-options" type="A"><li>All data</li><li>Train only</li><li>Test only</li><li>Doesn't matter</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Fit on train, transform both. Otherwise leakage.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Right-skewed distribution — which transform?</div>
<ol class="quiz-options" type="A"><li>Square</li><li>Log / log1p</li><li>Reverse</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Log compresses the tail.</div>
</div>
` }
      ]
    },

    "3-3": {
      title: "Feature Engineering",
      subtitle: "Module 3, Class 3 — Creating meaningful features from raw data",
      sections: [
        { icon: "🛠️", title: "What Is Feature Engineering?", content: `
<p>Constructing new variables that make the pattern easier for the model. The highest-leverage activity in classical ML.</p>
<p>A senior with good features and a simple model usually beats a junior with raw data and XGBoost.</p>
<h4>Core categories</h4>
<ul>
<li><strong>Aggregations</strong> — per-user sums, means, counts.</li>
<li><strong>Time-based</strong> — day of week, hour, recency, rolling averages.</li>
<li><strong>Ratios and differences</strong> — <code>spend / income</code>, <code>current - previous</code>.</li>
<li><strong>Interactions</strong> — feature products that capture combined effect.</li>
<li><strong>Text features</strong> — length, word count, keyword flags.</li>
</ul>
` },
        { icon: "💡", title: "Real Patterns", content: `
<h4>Telecom churn</h4>
<ul>
<li><code>avg_topup_last_30d / avg_topup_all_time</code> — is spending dropping?</li>
<li><code>days_since_last_call</code> — recency.</li>
<li><code>complaint_count_last_90d</code> — trouble signal.</li>
</ul>
<h4>Fraud detection</h4>
<ul>
<li><code>transaction_amount / user_avg</code> — anomaly ratio.</li>
<li><code>time_since_last_txn</code> — velocity.</li>
<li><code>distance_km_from_last_txn</code> — geographic jump.</li>
<li><code>hour_of_day</code> cyclic: <code>sin(2π·h/24)</code>, <code>cos(2π·h/24)</code>.</li>
</ul>
<div class="info-box"><strong>Domain knowledge beats brute force.</strong> Talk to someone who understands the business before engineering features.</div>
` },
        { icon: "📺", title: "Watch: Feature Engineering", video: "https://www.youtube.com/watch?v=6WDFfaYtN6s", videoTitle: "Krish Naik — feature engineering techniques", content: `
<p>Aggregations, datetime features, and interaction features on real datasets.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Which is a ratio feature?</div>
<ol class="quiz-options" type="A"><li>Age</li><li>Spend / income</li><li>City</li><li>Gender</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Ratios capture combined effects.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why encode hour-of-day as sin/cos?</div>
<ol class="quiz-options" type="A"><li>Faster</li><li>23:00 and 00:00 stay close cyclically</li><li>sklearn requires it</li><li>Memory</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Raw hour treats 23 and 0 as far apart.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. "Days since last transaction" is:</div>
<ol class="quiz-options" type="A"><li>Scaling</li><li>Recency feature</li><li>One-hot</li><li>Imputation</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Classic recency signal.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. What beats XGBoost with raw data?</div>
<ol class="quiz-options" type="A"><li>More XGBoost</li><li>Simple model + engineered features</li><li>Deep learning</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Features &gt; model choice in most business problems.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best source of feature ideas?</div>
<ol class="quiz-options" type="A"><li>Random sklearn</li><li>Domain experts</li><li>AutoML</li><li>Kaggle</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Talk to someone who knows the business.</div>
</div>
` }
      ]
    },

    "3-4": {
      title: "Feature Selection",
      subtitle: "Module 3, Class 4 — Choosing the right features, dimensionality reduction",
      sections: [
        { icon: "✂️", title: "Why Select Features?", content: `
<p>More features is not always better:</p>
<ul>
<li><strong>Curse of dimensionality</strong> — distances blur in high-D, models overfit.</li>
<li><strong>Noise</strong> — irrelevant features add variance.</li>
<li><strong>Interpretability</strong> — 5 features you understand &gt; 500 you don't.</li>
<li><strong>Training time and inference cost</strong>.</li>
</ul>
` },
        { icon: "🎛️", title: "Selection Methods", content: `
<ul>
<li><strong>Filter</strong> — rank by correlation, chi-squared, mutual information. Fast, model-agnostic.</li>
<li><strong>Wrapper</strong> — Recursive Feature Elimination: train, drop weakest, repeat.</li>
<li><strong>Embedded</strong> — Lasso (L1) shrinks weak coefficients to zero. Tree-based importance.</li>
</ul>
<div class="example-box"><pre>from sklearn.feature_selection import SelectKBest, f_classif
selector = SelectKBest(f_classif, k=10)
X_new = selector.fit_transform(X, y)

rf = RandomForestClassifier().fit(X, y)
importances = pd.Series(rf.feature_importances_, index=X.columns)
importances.nlargest(20).plot.barh()</pre></div>
` },
        { icon: "📉", title: "Dimensionality Reduction", content: `
<p>Different from selection — creates new combined features:</p>
<ul>
<li><strong>PCA</strong> — linear projection to directions of max variance. Scale features first.</li>
<li><strong>t-SNE, UMAP</strong> — non-linear, for visualization (2D/3D).</li>
</ul>
<div class="info-box"><strong>When to reduce:</strong> &gt;100 features on a small dataset, or for visualization. Trees handle high-D fine without reduction.</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Curse of dimensionality:</div>
<ol class="quiz-options" type="A"><li>Slow training</li><li>Distances blur in high-D</li><li>Missing data</li><li>Outliers</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Points become roughly equidistant.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. L1 (Lasso) regularization does what?</div>
<ol class="quiz-options" type="A"><li>Squares weights</li><li>Shrinks weak weights to zero</li><li>Doubles them</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Sparse solutions → automatic selection.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. PCA is:</div>
<ol class="quiz-options" type="A"><li>Selection</li><li>Creation via linear projection</li><li>Encoding</li><li>Scaling</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Creates orthogonal features along max-variance directions.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Before PCA you should:</div>
<ol class="quiz-options" type="A"><li>Scale</li><li>One-hot</li><li>Drop missing</li><li>All of above</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>D.</strong> All three; scaling matters most.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Random Forest feature importance:</div>
<ol class="quiz-options" type="A"><li><code>rf.coef_</code></li><li><code>rf.feature_importances_</code></li><li><code>rf.weights</code></li><li><code>rf.scores</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> <code>feature_importances_</code>.</div>
</div>
` }
      ]
    },

    "3-5": {
      title: "Data Pipelines",
      subtitle: "Module 3, Class 5 — Building reproducible preprocessing workflows",
      sections: [
        { icon: "🔗", title: "Why Pipelines?", content: `
<p>Manual preprocessing looks fine in a notebook. In production it's a nightmare:</p>
<ul>
<li>Same transforms applied differently to train vs test → silent bugs.</li>
<li>New data arrives → repeat every step by hand.</li>
<li>Deployment engineer asks what you did → you can't remember.</li>
</ul>
<p>A pipeline encapsulates steps as code that runs identically every time.</p>
` },
        { icon: "⚙️", title: "sklearn Pipelines", content: `
<div class="example-box"><pre>from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression())
])
pipe.fit(X_train, y_train)
pipe.predict(X_test)</pre></div>
<h4>ColumnTransformer for mixed types</h4>
<pre>from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

preproc = ColumnTransformer([
    ("num", StandardScaler(), numeric_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)
])
pipe = Pipeline([("pre", preproc), ("model", LogisticRegression())])</pre>
` },
        { icon: "💾", title: "Saving and Deploying", content: `
<pre>import joblib
joblib.dump(pipe, "pipeline_2026-04-19.pkl")
pipe = joblib.load("pipeline_2026-04-19.pkl")
predictions = pipe.predict(new_data)</pre>
<p>The saved pipeline contains all preprocessing + model. Only sane way to deploy.</p>
<div class="info-box"><strong>Versioning:</strong> name pipeline files with git commit or date. When debugging a production bug, you need to know which version ran.</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Why use a Pipeline?</div>
<ol class="quiz-options" type="A"><li>Faster</li><li>Same transforms for train/test, reproducible</li><li>Smaller code</li><li>Required</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Reproducibility and consistency.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. ColumnTransformer is for:</div>
<ol class="quiz-options" type="A"><li>Renaming</li><li>Different transforms per column group</li><li>Merging</li><li>Scaling only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Numeric → StandardScaler, categorical → OneHotEncoder, etc.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. What's in a saved .pkl pipeline?</div>
<ol class="quiz-options" type="A"><li>Model only</li><li>All preprocessing + model</li><li>Training data</li><li>Parameters only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Entire fitted pipeline.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Unseen categorical in production — OneHotEncoder default:</div>
<ol class="quiz-options" type="A"><li>Crash</li><li>With <code>handle_unknown="ignore"</code>, all zeros</li><li>Random</li><li>Skip row</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Set <code>handle_unknown="ignore"</code> at fit time.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Why version pipeline files?</div>
<ol class="quiz-options" type="A"><li>Vanity</li><li>Know which version served a bad prediction</li><li>Storage</li><li>Required</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Production debuggability.</div>
</div>
` }
      ]
    },

    "3-6": {
      title: "Lab: Choose Your Team Scenario",
      subtitle: "Module 3, Class 6 \u2014 Pick one scenario. Stay with it through M7.",
      sections: [
        { icon: "\ud83c\udfaf", title: "15 Real-World Scenarios", content: `
<style>
.scenario-chooser { max-width: 100%; }
.scenario-chooser .sc-intro {
  color: var(--text-muted, #9aa0aa);
  font-size: 1.02rem;
  margin-bottom: 28px;
  max-width: 72ch;
}
.scenario-chooser .sc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.scenario-chooser .sc-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}
.scenario-chooser .sc-card:hover {
  background: rgba(255,255,255,0.06);
  border-color: var(--accent-color, #6366f1);
  transform: translateY(-2px);
}
.scenario-chooser .sc-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}
.scenario-chooser .sc-num {
  font-size: 0.78rem;
  color: var(--text-muted, #9aa0aa);
  font-weight: 500;
  letter-spacing: 0.06em;
}
.scenario-chooser .sc-domain {
  background: rgba(99,102,241,0.15);
  color: var(--accent-color, #818cf8);
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.scenario-chooser .sc-title {
  font-size: 1.22rem;
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}
.scenario-chooser .sc-manager {
  font-size: 0.88rem;
  color: var(--text-muted, #9aa0aa);
  margin: 0 0 12px;
}
.scenario-chooser .sc-quote {
  border-left: 3px solid var(--accent-color, #6366f1);
  padding: 4px 0 4px 14px;
  margin: 0 0 16px;
  font-size: 0.94rem;
  font-style: italic;
  color: inherit;
}
.scenario-chooser .sc-build {
  font-size: 0.9rem;
  color: var(--text-muted, #9aa0aa);
  margin: 0 0 20px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.scenario-chooser .sc-build strong { color: inherit; font-style: normal; }
.scenario-chooser .sc-btns { margin-top: auto; display: flex; gap: 10px; }
.scenario-chooser .sc-view, .scenario-chooser .sc-pdf {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s ease, color 0.15s ease;
}
.scenario-chooser .sc-view {
  background: transparent;
  color: var(--accent-color, #6366f1);
  border: 1.5px solid var(--accent-color, #6366f1);
}
.scenario-chooser .sc-view:hover {
  background: var(--accent-color, #6366f1);
  color: white;
}
.scenario-chooser .sc-pdf {
  background: var(--accent-color, #6366f1);
  color: white;
  border: 1.5px solid var(--accent-color, #6366f1);
}
.scenario-chooser .sc-pdf:hover { background: #4f46e5; border-color: #4f46e5; }
</style>
<div class="scenario-chooser">
  <p class="sc-intro">Pick one scenario for your team. Your team will work on the same dataset from Module 3 through Module 7. Read each card, then open the full guide online or download the PDF.</p>
  <div class="sc-grid">
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 01</span><span class="sc-domain">E-commerce</span></div>
  <h3 class="sc-title">Brazilian E-commerce — Late Deliveries</h3>
  <p class="sc-manager"><strong>Beatriz</strong>, Head of Logistics at Olist</p>
  <p class="sc-quote">7% of our 100,000 monthly orders arrive late. Build me a tool that says &#39;this order has a 70% chance of being late&#39; so we can send the customer an apology email BEFORE they get angry.</p>
  <p class="sc-build"><strong>What you build:</strong> Turn 9 messy CSV files into one clean dataset. Engineer the Haversine distance between buyer and seller. Build a Pipeline that predicts late delivery risk.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/01_olist_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/01_olist_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 02</span><span class="sc-domain">Travel</span></div>
  <h3 class="sc-title">Airbnb NYC — Listing Price</h3>
  <p class="sc-manager"><strong>Marcus</strong>, Head of Host Operations at Airbnb NYC</p>
  <p class="sc-quote">Some hosts over-price and get no bookings, others under-price and lose money. Build me a price-recommendation tool that tells new hosts: &#39;similar listings in your area charge $X per night.&#39;</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 40,000 NYC listings. Engineer distance to Times Square. Build a Pipeline that predicts log-price from listing features and host metadata.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/02_airbnb_nyc_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/02_airbnb_nyc_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 03</span><span class="sc-domain">Food &amp; Reviews</span></div>
  <h3 class="sc-title">Yelp Restaurants — Star Rating</h3>
  <p class="sc-manager"><strong>Priya</strong>, VP of Local Search Quality at Yelp</p>
  <p class="sc-quote">When a new restaurant opens, our search ranking has no rating yet. We lose 30% of new restaurants in the first 90 days. Build a model that predicts the star rating from category, price, and location.</p>
  <p class="sc-build"><strong>What you build:</strong> Parse Yelp's nested JSON business data. Engineer cuisine and attribute features. Build a Pipeline that predicts the star rating before the first review arrives.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/03_yelp_restaurants_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/03_yelp_restaurants_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 04</span><span class="sc-domain">Travel</span></div>
  <h3 class="sc-title">TripAdvisor — Hotel Review Rating</h3>
  <p class="sc-manager"><strong>Emma</strong>, Head of Hotel Partnerships at TripAdvisor EMEA</p>
  <p class="sc-quote">Hotel managers get 100 reviews a month and zero time to read them. Read each review and predict the star rating + main complaint topic. Auto-tag for the manager dashboard.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 20,000 hotel reviews. Engineer text features (length, caps, sentiment lexicon). Build a Pipeline that predicts rating from review text alone.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/04_tripadvisor_hotels_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/04_tripadvisor_hotels_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 05</span><span class="sc-domain">E-commerce</span></div>
  <h3 class="sc-title">Amazon Beauty — Helpful Reviews</h3>
  <p class="sc-manager"><strong>Daniel</strong>, Reviews Quality Team Lead at Amazon</p>
  <p class="sc-quote">Each product has hundreds of reviews. Some help shoppers decide. Some are useless. Build me a model that ranks reviews so we surface the helpful ones at the top.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 370,000 beauty product reviews. Engineer text quality signals. Build a Pipeline that predicts whether other shoppers will mark a review as helpful.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/05_amazon_beauty_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/05_amazon_beauty_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 06</span><span class="sc-domain">Entertainment</span></div>
  <h3 class="sc-title">IMDB Movies — Rating Prediction</h3>
  <p class="sc-manager"><strong>Sofia</strong>, Content Acquisitions Director at a streaming service</p>
  <p class="sc-quote">We have $5 million to license movies this quarter. Out of 10,000 candidates we pick 200. Build a tool that predicts the IMDb rating from director, cast, genre, plot.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 85,000 movies. Parse multi-value genres and multi-author casts. Build a Pipeline that predicts the average vote from movie metadata and plot.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/06_imdb_movies_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/06_imdb_movies_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 07</span><span class="sc-domain">Social Media</span></div>
  <h3 class="sc-title">Twitter US Airlines — Complaint Routing</h3>
  <p class="sc-manager"><strong>James</strong>, Director of Customer Operations at American Airlines</p>
  <p class="sc-quote">We get 10,000 angry tweets a day. My team of 12 can answer 500. Build a tool that reads each tweet and routes it: &#39;urgent complaint&#39; to a human, &#39;praise&#39; to marketing, &#39;late flight&#39; to operations.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 14,000 airline tweets. Engineer text-shape and timing features. Build a Pipeline that classifies tweets as positive, neutral, or negative.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/07_twitter_airlines_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/07_twitter_airlines_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 08</span><span class="sc-domain">Tech Community</span></div>
  <h3 class="sc-title">Stack Overflow — Answer Prediction</h3>
  <p class="sc-manager"><strong>Tom</strong>, Community Quality Manager at Stack Exchange</p>
  <p class="sc-quote">30% of new questions get no answer in 7 days. The user feels rejected and never posts again. Build a tool that reads a draft question BEFORE the user posts and warns them when it is unclear.</p>
  <p class="sc-build"><strong>What you build:</strong> Sample 100,000 questions. Strip HTML and extract code-block signals. Build a Pipeline that predicts whether a question will get an answer.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/08_stackoverflow_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/08_stackoverflow_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 09</span><span class="sc-domain">News &amp; Media</span></div>
  <h3 class="sc-title">BBC News — Article Routing</h3>
  <p class="sc-manager"><strong>Olivia</strong>, Head of Editorial Workflow Tech at BBC</p>
  <p class="sc-quote">Every day we get 10,000 articles from wire services. Each one needs to go to the right desk: Politics, Business, Sport, Tech, Entertainment. A human reads each title and routes — slow and tired. Build me a model that routes in 0.1 seconds.</p>
  <p class="sc-build"><strong>What you build:</strong> Load 2,200 articles from folder structure. Engineer text-only features (lexical diversity, named entities). Build a Pipeline that classifies articles into 5 sections.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/09_bbc_news_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/09_bbc_news_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 10</span><span class="sc-domain">Finance &amp; Gov</span></div>
  <h3 class="sc-title">CFPB — Consumer Complaint Routing</h3>
  <p class="sc-manager"><strong>Diana</strong>, Director of Consumer Response at CFPB</p>
  <p class="sc-quote">Citizens send us 10,000 complaints daily about banks, credit cards, loans. A human takes 5 minutes per complaint. We are 6 months behind. Build a model that reads the narrative and routes to the right department automatically.</p>
  <p class="sc-build"><strong>What you build:</strong> Sample 200,000 complaints. Target-encode 5,000 companies. Build a Pipeline that classifies complaints into 10 product departments from text.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/10_cfpb_complaints_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/10_cfpb_complaints_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 11</span><span class="sc-domain">Books</span></div>
  <h3 class="sc-title">Goodreads — Book Rating Prediction</h3>
  <p class="sc-manager"><strong>Ravi</strong>, VP of Editorial at a publishing house</p>
  <p class="sc-quote">We get 1,000 manuscript submissions per year and publish only 50. A wrong pick costs us $200,000 per book. Read the proposed book&#39;s metadata and predict the rating it will get on Goodreads.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 11,000 books. Parse messy publication dates. Engineer author-history and engagement-ratio features. Build a Pipeline that predicts average rating.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/11_goodreads_books_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/11_goodreads_books_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 12</span><span class="sc-domain">HR &amp; Jobs</span></div>
  <h3 class="sc-title">Glassdoor — Would Recommend</h3>
  <p class="sc-manager"><strong>Linda</strong>, Director of Insights at Glassdoor</p>
  <p class="sc-quote">When workers leave the &#39;would recommend?&#39; field empty, we sell incomplete reports to HR teams. Read the pros, cons, and advice text. Predict whether the worker would recommend — even when they did not click.</p>
  <p class="sc-build"><strong>What you build:</strong> Sample 100,000 reviews. Engineer features from 4 separate text columns. Build a Pipeline that fills the missing recommend field from review text.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/12_glassdoor_reviews_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/12_glassdoor_reviews_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 13</span><span class="sc-domain">Trust &amp; Safety</span></div>
  <h3 class="sc-title">Fake Job Posting Detection</h3>
  <p class="sc-manager"><strong>Carlos</strong>, Head of Trust &amp; Safety at a job-search platform</p>
  <p class="sc-quote">Every week 200 fake postings slip through. They steal money from desperate job seekers. Build a model that detects fake postings BEFORE we publish them — but do not block REAL jobs by mistake.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 18,000 postings. Engineer scam-fingerprint signals (phone in text, missing fields, exclamation density). Build a Pipeline tuned for an imbalanced fraud problem.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/13_fake_jobs_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/13_fake_jobs_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 14</span><span class="sc-domain">Gaming</span></div>
  <h3 class="sc-title">Steam — Game Recommendations</h3>
  <p class="sc-manager"><strong>Erik</strong>, Steam Reviews Product Lead at Valve</p>
  <p class="sc-quote">Every game has thousands of reviews. A &#39;NOT recommended&#39; review is more valuable to a shopper — it warns them. We want to find the smart critics. Predict the recommend label from the text.</p>
  <p class="sc-build"><strong>What you build:</strong> Filter 6.4M reviews to English, sample 100,000. Engineer hours-played and review-quality signals. Build a Pipeline that predicts the recommend label from text and behavior.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/14_steam_reviews_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/14_steam_reviews_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
<div class="sc-card">
  <div class="sc-head"><span class="sc-num">SCENARIO 15</span><span class="sc-domain">Healthcare</span></div>
  <h3 class="sc-title">Drug Reviews — Effectiveness Mining</h3>
  <p class="sc-manager"><strong>Dr. Anya</strong>, Director of Patient Insights at a pharma analytics company</p>
  <p class="sc-quote">When a new medication is approved, the FDA only sees clinical trials. Real-world side effects appear in patient reviews. Build a model that reads patient reviews and predicts the rating — finding side effects 6 months earlier.</p>
  <p class="sc-build"><strong>What you build:</strong> Clean 215,000 patient reviews. Engineer side-effect keyword counts and condition buckets. Build a Pipeline that predicts the rating from text and metadata.</p>
  <div class="sc-btns">
    <a class="sc-view" href="lab-scenarios/module-3/15_drug_reviews_m3_lab.html">View Online</a>
    <a class="sc-pdf"  href="lab-scenarios/module-3/15_drug_reviews_m3_lab.pdf" target="_blank" rel="noopener">PDF</a>
  </div>
</div>
  </div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_3_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[3] = true;
})();
