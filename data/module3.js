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
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Column is 60% missing. First move?</div>
<ol class="quiz-options" type="A"><li>Drop</li><li>Fill with 0</li><li>Investigate the cause</li><li>Fill with mean</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>C.</strong> Missingness often carries signal.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Dedupe by specific column:</div>
<ol class="quiz-options" type="A"><li><code>drop_duplicates()</code></li><li><code>drop_duplicates(subset=["id"])</code></li><li><code>dedupe("id")</code></li><li><code>unique("id")</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> <code>subset</code> picks the key.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. IQR outlier rule flags values outside:</div>
<ol class="quiz-options" type="A"><li>Mean ± 1 SD</li><li>Q1 - 1.5·IQR to Q3 + 1.5·IQR</li><li>Min to max</li><li>Median ± 10%</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Tukey's rule.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Why not delete fraud outliers?</div>
<ol class="quiz-options" type="A"><li>Always errors</li><li>They're the signal</li><li>Deleting is slow</li><li>Forbidden</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Outliers = fraud.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best imputation for categorical column?</div>
<ol class="quiz-options" type="A"><li>Mean</li><li>Mode</li><li>Zero</li><li>Random</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Mode (most common value).</div>
</div>
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
      title: "Lab: End-to-End Data Prep",
      subtitle: "Module 3, Class 6 — Clean and prepare a real-world dataset",
      sections: [
        { icon: "🎯", title: "Objective", content: `
<p>Take a raw, messy dataset and produce a model-ready feature matrix. Submit a scikit-learn Pipeline that can be saved and reused.</p>
<div class="tool-grid">
<a class="tool-card" href="https://www.kaggle.com/competitions/titanic/data" target="_blank" rel="noopener"><h5>Dataset: Titanic</h5><p>12 columns, missing values, categorical, numeric. Classic starter.</p></a>
</div>
` },
        { icon: "📝", title: "Tasks", content: `
<ol>
<li><strong>Load and audit</strong> — shape, dtypes, missing counts.</li>
<li><strong>Handle missing</strong> — median for Age, mode for Embarked, drop Cabin (too missing).</li>
<li><strong>Feature engineering</strong> — <code>family_size = SibSp + Parch + 1</code>, extract title from Name, bucket Age.</li>
<li><strong>Encode categoricals</strong> — OneHot for Sex, Embarked, Title.</li>
<li><strong>Scale numerics</strong> — StandardScaler on Age, Fare.</li>
<li><strong>Build a ColumnTransformer</strong> wrapping all the above.</li>
<li><strong>Save the pipeline</strong> with joblib.</li>
</ol>
` },
        { icon: "📐", title: "Deliverable", content: `
<ul>
<li>Jupyter notebook with all seven steps + commentary.</li>
<li>Saved <code>pipeline.pkl</code>.</li>
<li>One-page <code>findings.md</code> — what surprised you, what you'd do differently.</li>
</ul>
<h4>Rubric</h4>
<ul>
<li>All steps: 50%</li>
<li>Feature engineering quality: 25%</li>
<li>Pipeline correctness (no leakage): 20%</li>
<li>Code readability: 5%</li>
</ul>
` },
        { icon: "📋", title: "Checkpoint Quiz", content: `
<div class="quiz-item">
<div class="quiz-q">1. Why drop Cabin?</div>
<ol class="quiz-options" type="A"><li>Too long</li><li>~77% missing, hard to interpret</li><li>String</li><li>Target</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> At that missingness, imputation is guessing.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. <code>family_size = SibSp + Parch + 1</code> is:</div>
<ol class="quiz-options" type="A"><li>Imputation</li><li>Feature engineering (aggregation)</li><li>Scaling</li><li>Encoding</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Combining raw columns.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Extracting Title from Name:</div>
<ol class="quiz-options" type="A"><li>Noise</li><li>Text feature extraction</li><li>Label encoding</li><li>Scaling</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Title correlates with age and social class.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Scaling order in a pipeline:</div>
<ol class="quiz-options" type="A"><li>Before impute</li><li>After encoding, before model</li><li>After model</li><li>Anywhere</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Impute → encode → scale → model.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Fit on train, transform on test. Why?</div>
<ol class="quiz-options" type="A"><li>Faster</li><li>Prevents leakage</li><li>Required</li><li>Vanity</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Test must be unseen.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_3_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[3] = true;
})();
