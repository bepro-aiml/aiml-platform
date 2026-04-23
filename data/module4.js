// ============================================================
// MODULE 4 CONTENT — Supervised Learning Algorithms
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module4.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_4_CONTENT = {

    "4-1": {
      title: "Linear Regression",
      subtitle: "Module 4, Class 1 — Predicting continuous values, cost functions",
      sections: [
        { icon: "📏", title: "The Simplest ML Model", content: `
<p>Linear regression fits a straight line (or hyperplane) through data. The model:</p>
<p><code>y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ + ε</code></p>
<p>Each β is a weight the model learns. The β₀ is the intercept.</p>
<p>It's the first model you reach for when the target is a continuous number: house price, temperature, revenue. It's interpretable, fast, and a strong baseline.</p>
<div class="info-box"><strong>When to use:</strong> continuous target, approximately linear relationship, interpretability matters. Not when relationships are non-linear — use trees then.</div>
` },
        { icon: "💰", title: "Cost Function and Gradient Descent", content: `
<p>The model learns by minimizing the <strong>mean squared error</strong>:</p>
<p><code>MSE = (1/n) · Σ (y_true - y_pred)²</code></p>
<p>Gradient descent iteratively updates weights in the direction that reduces MSE fastest. For each weight:</p>
<p><code>β_new = β_old - α · ∂MSE/∂β</code></p>
<p>α is the learning rate. Too big → overshoot; too small → slow convergence.</p>
<div class="example-box"><pre>from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
preds = model.predict(X_test)

model.coef_         # the β values
model.intercept_    # β₀</pre></div>
` },
        { icon: "📺", title: "Watch: Linear Regression Clearly Explained", video: "https://www.youtube.com/watch?v=nk2CQITm_eo", videoTitle: "StatQuest — Linear Regression", content: `
<p>Josh Starmer's StatQuest is the gold standard for building intuition. Watch this before touching sklearn.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Linear regression predicts:</div>
<ol class="quiz-options" type="A"><li>Categories</li><li>Continuous numbers</li><li>Probabilities</li><li>Rankings</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Continuous targets.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. MSE penalizes:</div>
<ol class="quiz-options" type="A"><li>Linearly</li><li>Errors squared — big errors much worse than small</li><li>Absolute value</li><li>Only positive errors</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Squared loss heavily penalizes large errors.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Learning rate too large causes:</div>
<ol class="quiz-options" type="A"><li>Slow learning</li><li>Overshooting, divergence</li><li>Memorization</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Updates jump past the minimum.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. <code>model.coef_</code> returns:</div>
<ol class="quiz-options" type="A"><li>Predictions</li><li>Feature weights (β values)</li><li>Errors</li><li>Intercept</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Weight per feature. Intercept is <code>model.intercept_</code>.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. When NOT to use linear regression?</div>
<ol class="quiz-options" type="A"><li>Continuous target</li><li>Clearly non-linear relationships</li><li>Interpretability needed</li><li>Fast baseline needed</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Non-linear patterns — use trees or neural nets.</div>
</div>
` }
      ]
    },

    "4-2": {
      title: "Logistic Regression",
      subtitle: "Module 4, Class 2 — Classification, sigmoid, decision boundaries",
      sections: [
        { icon: "🎯", title: "From Regression to Classification", content: `
<p>Despite the name, logistic regression is for <strong>classification</strong> — predicting a category (spam/not spam, churn/stay).</p>
<p>The trick: wrap a linear combination in a <strong>sigmoid function</strong> that squashes any real number to [0, 1]:</p>
<p><code>σ(z) = 1 / (1 + e^(-z))</code> where <code>z = β₀ + β₁x₁ + ...</code></p>
<p>The output is the probability of the positive class. Default threshold of 0.5 turns it into a binary decision, but you can tune that threshold.</p>
` },
        { icon: "📐", title: "Decision Boundary and Log Loss", content: `
<p>The decision boundary is where <code>σ(z) = 0.5</code>, i.e., <code>z = 0</code>. For two features, it's a line. For three, a plane. For n, a hyperplane.</p>
<h4>Loss function: binary cross-entropy</h4>
<p><code>Loss = -[y · log(p) + (1-y) · log(1-p)]</code></p>
<p>Heavily penalizes confident wrong predictions (log goes to -∞). Log loss is the right metric when you care about calibrated probabilities, not just correct labels.</p>
<div class="example-box"><pre>from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
probs = model.predict_proba(X_test)[:, 1]   # P(positive class)
preds = (probs &gt; 0.5).astype(int)           # tune threshold for imbalanced data</pre></div>
` },
        { icon: "📺", title: "Watch: Logistic Regression Clearly Explained", video: "https://www.youtube.com/watch?v=yIYKR4sgzI8", videoTitle: "StatQuest — Logistic Regression", content: `
<p>Covers sigmoid, log loss, and maximum likelihood without heavy math.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Logistic regression is for:</div>
<ol class="quiz-options" type="A"><li>Continuous targets</li><li>Classification</li><li>Clustering</li><li>Ranking</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Despite the name.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Sigmoid squashes input to:</div>
<ol class="quiz-options" type="A"><li>[-1, 1]</li><li>[0, 1]</li><li>[0, ∞)</li><li>(-∞, ∞)</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Always in [0, 1] — interpretable as probability.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Default decision threshold:</div>
<ol class="quiz-options" type="A"><li>0.0</li><li>0.5</li><li>1.0</li><li>Depends</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> 0.5 — but you should tune it for imbalanced data.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. <code>predict_proba</code> returns:</div>
<ol class="quiz-options" type="A"><li>Labels</li><li>Probability of each class</li><li>Confidence score</li><li>Distance to boundary</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Array with P(class 0), P(class 1), etc.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Log loss heavily penalizes:</div>
<ol class="quiz-options" type="A"><li>Small errors</li><li>Confident wrong predictions</li><li>Correct predictions</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Confident-and-wrong is the worst case.</div>
</div>
` }
      ]
    },

    "4-3": {
      title: "Decision Trees and Random Forests",
      subtitle: "Module 4, Class 3 — Splitting criteria, ensembles, bagging",
      sections: [
        { icon: "🌳", title: "Decision Trees", content: `
<p>A tree learns a sequence of if-else questions that partition data into pure regions. Each node asks about one feature; each leaf gives a prediction.</p>
<h4>Splitting</h4>
<p>For classification, the tree picks the split that maximally reduces <strong>Gini impurity</strong> or <strong>entropy</strong>. For regression, it minimizes variance within each child.</p>
<p>Trees are invariant to feature scaling. They handle non-linearities, interactions, and mixed types natively. They overfit aggressively — a deep single tree memorizes training noise.</p>
<div class="example-box"><pre>from sklearn.tree import DecisionTreeClassifier
tree = DecisionTreeClassifier(max_depth=5)  # limit depth to prevent overfitting
tree.fit(X_train, y_train)</pre></div>
` },
        { icon: "🌲", title: "Random Forests", content: `
<p>The fix for single-tree overfitting: train many trees and average. <strong>Random Forest</strong> adds two sources of randomness:</p>
<ol>
<li><strong>Bagging</strong> — each tree sees a different bootstrap sample of the data.</li>
<li><strong>Random feature subsets</strong> — at each split, each tree considers only a random subset of features.</li>
</ol>
<p>Result: many diverse weak learners whose average is strong. Random Forests are the safest default for tabular data — usually in the top 3 algorithms before you've tuned anything.</p>
<div class="example-box"><pre>from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=200, max_depth=15, n_jobs=-1)
rf.fit(X_train, y_train)
rf.feature_importances_</pre></div>
` },
        { icon: "📺", title: "Watch: Random Forests Clearly Explained", video: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ", videoTitle: "StatQuest — Random Forests", content: `
<p>Josh shows how bagging + random features produce uncorrelated trees that average into a strong model.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. A single deep decision tree tends to:</div>
<ol class="quiz-options" type="A"><li>Underfit</li><li>Overfit</li><li>Converge slowly</li><li>Require scaling</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Deep trees memorize training noise.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Random Forest reduces overfitting by:</div>
<ol class="quiz-options" type="A"><li>Pruning</li><li>Averaging many diverse trees</li><li>More depth</li><li>Scaling features</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Ensemble of uncorrelated learners.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Do trees need feature scaling?</div>
<ol class="quiz-options" type="A"><li>Yes, always</li><li>No — trees split on individual feature thresholds</li><li>Only for continuous</li><li>Only for categoricals</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Trees are scale-invariant.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Bagging = ?</div>
<ol class="quiz-options" type="A"><li>Boosting errors</li><li>Training on bootstrap samples</li><li>Grid search</li><li>Bagging features</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Bootstrap Aggregating — each tree sees a random resample.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best default for tabular data?</div>
<ol class="quiz-options" type="A"><li>Neural network</li><li>Random Forest or gradient boosting</li><li>K-Means</li><li>SVM</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Tree ensembles dominate tabular ML.</div>
</div>
` }
      ]
    },

    "4-4": {
      title: "Model Evaluation",
      subtitle: "Module 4, Class 4 — Accuracy, precision, recall, F1, confusion matrix",
      sections: [
        { icon: "📊", title: "The Confusion Matrix", content: `
<p>For binary classification, four outcomes:</p>
<table style="margin:12px 0;width:100%;border-collapse:collapse;">
<tr><td></td><td style="padding:8px;background:var(--card);font-weight:600;">Predicted: 0</td><td style="padding:8px;background:var(--card);font-weight:600;">Predicted: 1</td></tr>
<tr><td style="padding:8px;background:var(--card);font-weight:600;">Actual: 0</td><td style="padding:8px;border:1px solid var(--card-border);">True Negative</td><td style="padding:8px;border:1px solid var(--card-border);">False Positive</td></tr>
<tr><td style="padding:8px;background:var(--card);font-weight:600;">Actual: 1</td><td style="padding:8px;border:1px solid var(--card-border);">False Negative</td><td style="padding:8px;border:1px solid var(--card-border);">True Positive</td></tr>
</table>
<p>Every metric is built from these four numbers.</p>
` },
        { icon: "🎯", title: "Metrics That Matter", content: `
<ul>
<li><strong>Accuracy</strong> = (TP + TN) / total. Useless with imbalance (99.9% for always-say-no on fraud).</li>
<li><strong>Precision</strong> = TP / (TP + FP). "When I flagged positive, how often was I right?"</li>
<li><strong>Recall (Sensitivity)</strong> = TP / (TP + FN). "Of all true positives, how many did I catch?"</li>
<li><strong>F1</strong> = harmonic mean of precision and recall. Balanced single number.</li>
<li><strong>ROC-AUC</strong> = probability that a random positive ranks above a random negative. Threshold-independent.</li>
</ul>
<div class="case-study"><h4>Which metric to pick?</h4><p><strong>Fraud detection:</strong> recall first — missing fraud is expensive. Then tune precision to keep false alarms manageable.<br><strong>Medical screening:</strong> recall first — missing a disease is worse than a false positive that triggers a second test.<br><strong>Spam filter:</strong> precision first — marking legitimate email as spam is worse than letting some spam through.</p></div>
` },
        { icon: "📺", title: "Watch: Confusion Matrix Explained", video: "https://www.youtube.com/watch?v=Kdsp6soqA7o", videoTitle: "StatQuest — Confusion Matrix + ROC", content: `
<p>Everything you need on metrics in one video. Josh makes precision vs recall intuitive.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Precision =</div>
<ol class="quiz-options" type="A"><li>TP / (TP+FN)</li><li>TP / (TP+FP)</li><li>TN / total</li><li>(TP+TN) / total</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Of what I flagged positive, how much was right.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Recall =</div>
<ol class="quiz-options" type="A"><li>TP / (TP+FN)</li><li>TP / (TP+FP)</li><li>FN / total</li><li>TN / (TN+FP)</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>A.</strong> Of all true positives, how many I caught.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. F1 score is:</div>
<ol class="quiz-options" type="A"><li>Arithmetic mean of precision/recall</li><li>Harmonic mean of precision/recall</li><li>Accuracy</li><li>AUC</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Harmonic mean. Low if either precision or recall is low.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Fraud detection, what to optimize?</div>
<ol class="quiz-options" type="A"><li>Accuracy</li><li>Recall first (don't miss fraud), then precision</li><li>F1 only</li><li>Speed</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Missing fraud is expensive.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. AUC = 0.5 means:</div>
<ol class="quiz-options" type="A"><li>Perfect</li><li>Random — no discrimination</li><li>Worse than random</li><li>Balanced</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> AUC 0.5 = random guessing. 1.0 = perfect. 0.0 = perfectly inverted.</div>
</div>
` }
      ]
    },

    "4-5": {
      title: "Overfitting and Regularization",
      subtitle: "Module 4, Class 5 — Train/test split, cross-validation, bias-variance",
      sections: [
        { icon: "⚖️", title: "Bias-Variance Tradeoff", content: `
<ul>
<li><strong>High bias</strong> (underfitting) — model too simple. Training and test errors both high.</li>
<li><strong>High variance</strong> (overfitting) — model too complex. Training error low, test error high.</li>
<li><strong>Sweet spot</strong> — moderate complexity, both errors acceptable and close.</li>
</ul>
<p>The gap between training and test performance tells you which side you're on. Monitor both, always.</p>
` },
        { icon: "🔀", title: "Train/Test Split and Cross-Validation", content: `
<pre>from sklearn.model_selection import train_test_split, cross_val_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# K-fold cross-validation
scores = cross_val_score(model, X, y, cv=5, scoring="f1")
print(scores.mean(), scores.std())</pre>
<p>Use <code>stratify=y</code> for classification to preserve class balance across splits.</p>
<p>Cross-validation gives a more reliable estimate than a single split, especially on small data. 5-fold is the standard.</p>
<div class="info-box"><strong>Time-series data:</strong> never use random split. Use <code>TimeSeriesSplit</code> — you can't train on the future to predict the past.</div>
` },
        { icon: "🛡️", title: "Regularization", content: `
<p>Penalize model complexity during training:</p>
<ul>
<li><strong>L2 (Ridge)</strong> — adds <code>λ · Σβ²</code> to loss. Shrinks all weights toward zero.</li>
<li><strong>L1 (Lasso)</strong> — adds <code>λ · Σ|β|</code>. Shrinks weak weights exactly to zero (feature selection).</li>
<li><strong>Elastic Net</strong> — combination. Useful when features are correlated.</li>
</ul>
<p>For trees: <code>max_depth</code>, <code>min_samples_leaf</code>, <code>max_features</code> control complexity.</p>
<p>For neural nets: dropout, early stopping, weight decay.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Training error very low, test error very high =</div>
<ol class="quiz-options" type="A"><li>Underfitting</li><li>Overfitting</li><li>Balanced</li><li>Data leak</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Classic high-variance symptom.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why <code>stratify=y</code> in train_test_split?</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>Preserve class balance across splits</li><li>Shuffle</li><li>Required</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Critical for imbalanced datasets.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. L1 regularization produces:</div>
<ol class="quiz-options" type="A"><li>Small but non-zero weights</li><li>Sparse weights — many exactly zero</li><li>No effect</li><li>Random weights</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Sparse solutions → automatic feature selection.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Time-series data, how to split?</div>
<ol class="quiz-options" type="A"><li>Random 80/20</li><li>Temporal split — train on past, test on future</li><li>K-fold random</li><li>Any way</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Random split leaks future info into training.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. 5-fold CV gives you:</div>
<ol class="quiz-options" type="A"><li>One score</li><li>5 scores — mean + std</li><li>5× faster training</li><li>Better model</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> 5 scores. Use mean + std to judge reliability.</div>
</div>
` }
      ]
    },

    "4-6": {
      title: "Lab: Build a Classifier",
      subtitle: "Module 4, Class 6 — End-to-end supervised learning project",
      sections: [
        { icon: "🎯", title: "Objective", content: `
<p>Build a complete classifier for the Telco Churn dataset. Pipeline from raw data to evaluated model with confusion matrix and ROC curve.</p>
<div class="tool-grid">
<a class="tool-card" href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn" target="_blank" rel="noopener"><h5>Telco Customer Churn</h5><p>7,043 customers, 21 features, binary target.</p></a>
</div>
` },
        { icon: "📝", title: "Tasks", content: `
<ol>
<li>Load, handle missing values, engineer features (tenure buckets, service counts).</li>
<li>Encode categoricals, scale numerics, all in a ColumnTransformer.</li>
<li>Split 80/20 with <code>stratify=y</code>.</li>
<li>Train three models: LogisticRegression, RandomForest, GradientBoosting.</li>
<li>Evaluate each with 5-fold cross-validated F1. Pick the winner.</li>
<li>On the winner, compute confusion matrix, precision, recall, F1, AUC on test set.</li>
<li>Plot ROC curve.</li>
<li>Tune the decision threshold to prioritize recall (catch more churners).</li>
</ol>
` },
        { icon: "📐", title: "Deliverable", content: `
<ul>
<li>Notebook with all 8 tasks.</li>
<li>Final saved pipeline as <code>best_model.pkl</code>.</li>
<li>Short writeup: which model won, by how much, and what threshold you'd deploy in production. Justify the tradeoff.</li>
</ul>
` },
        { icon: "📋", title: "Checkpoint Quiz", content: `
<div class="quiz-item">
<div class="quiz-q">1. Compare 3 models — use:</div>
<ol class="quiz-options" type="A"><li>Single test score</li><li>Cross-validated mean + std</li><li>Training accuracy</li><li>Intuition</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> CV gives reliability info single splits don't.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Churn prediction — most important metric?</div>
<ol class="quiz-options" type="A"><li>Accuracy</li><li>Recall + precision balance (business cost-driven)</li><li>Speed</li><li>Number of params</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Depends on retention team capacity. Too many false positives wastes outreach; too few true positives loses customers.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Threshold lowering (0.5 → 0.3) effect:</div>
<ol class="quiz-options" type="A"><li>Precision up, recall down</li><li>Recall up, precision down</li><li>Both up</li><li>No change</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Flagging more cases → more true positives AND more false positives.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Why pickle the pipeline, not just the model?</div>
<ol class="quiz-options" type="A"><li>Smaller file</li><li>Preserves all preprocessing for consistent inference</li><li>Required</li><li>Faster load</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Production needs the same transforms applied to new data.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Stratified split matters because:</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>Keeps churn/non-churn ratio consistent in train and test</li><li>Bigger dataset</li><li>Sklearn needs it</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Avoids getting a test set with almost no positive examples.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_4_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[4] = true;
})();
