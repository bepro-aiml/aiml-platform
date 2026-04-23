// ============================================================
// MODULE 5 CONTENT — Unsupervised Learning
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module5.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_5_CONTENT = {

    "5-1": {
      title: "Introduction to Clustering",
      subtitle: "Module 5, Class 1 — Why unsupervised? Distance metrics",
      sections: [
        { icon: "🔍", title: "What is Unsupervised Learning?", content: `
<p>Supervised learning needs labels. Unsupervised learning finds structure without them.</p>
<p>Two main tasks:</p>
<ul>
<li><strong>Clustering</strong> — group similar items together.</li>
<li><strong>Dimensionality reduction</strong> — compress features while preserving structure.</li>
</ul>
<h4>When to use unsupervised</h4>
<ul>
<li><strong>Customer segmentation</strong> — you don't know what segments exist; the data reveals them.</li>
<li><strong>Anomaly detection</strong> — label "normal" patterns, flag outliers.</li>
<li><strong>Exploration</strong> — what groupings exist in this dataset?</li>
<li><strong>Pretraining</strong> — in deep learning, unsupervised pretraining teaches useful representations.</li>
</ul>
` },
        { icon: "📏", title: "Distance Metrics", content: `
<p>Clustering decides "similar" based on distance. Choose carefully.</p>
<ul>
<li><strong>Euclidean</strong> — straight-line distance. Default. Sensitive to scale — always standardize first.</li>
<li><strong>Manhattan</strong> — sum of absolute differences. More robust to outliers.</li>
<li><strong>Cosine</strong> — angle between vectors, ignores magnitude. Use for text/high-dimensional data.</li>
</ul>
<div class="info-box"><strong>Scaling matters enormously.</strong> If "age" ranges 0-100 and "income" ranges 0-100M, income dominates every distance. Standardize before clustering.</div>
` },
        { icon: "🎯", title: "Evaluating Without Labels", content: `
<p>No ground truth → can't compute accuracy. Use:</p>
<ul>
<li><strong>Silhouette score</strong> — how well each point fits its cluster vs the next-closest. Range [-1, 1], higher is better.</li>
<li><strong>Davies-Bouldin index</strong> — lower is better.</li>
<li><strong>Inertia (within-cluster sum of squares)</strong> — for K-Means, combined with the elbow method.</li>
<li><strong>Domain inspection</strong> — do the clusters make sense to a human expert? Often the truest test.</li>
</ul>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Supervised vs unsupervised — the difference?</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>Supervised uses labels, unsupervised doesn't</li><li>Different libraries</li><li>Dataset size</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Labels vs no labels.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Before clustering, you must:</div>
<ol class="quiz-options" type="A"><li>Label data</li><li>Scale features</li><li>Train a classifier</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Otherwise large-range features dominate distances.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Cosine distance ignores:</div>
<ol class="quiz-options" type="A"><li>Direction</li><li>Magnitude</li><li>Both</li><li>Neither</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Only angle matters. Useful for text where doc length varies.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Silhouette score of 0.8 means:</div>
<ol class="quiz-options" type="A"><li>Bad clustering</li><li>Strong separation, points fit their clusters well</li><li>Random</li><li>Overlapping</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Near 1 = well-separated clusters.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Ultimate test of cluster quality:</div>
<ol class="quiz-options" type="A"><li>Silhouette</li><li>Do clusters make sense to a domain expert?</li><li>Inertia</li><li>Speed</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Statistics don't care about business meaning. Humans do.</div>
</div>
` }
      ]
    },

    "5-2": {
      title: "K-Means Clustering",
      subtitle: "Module 5, Class 2 — Algorithm, choosing K, convergence",
      sections: [
        { icon: "🎯", title: "The Algorithm", content: `
<p>K-Means partitions data into K clusters by iteratively minimizing within-cluster variance.</p>
<ol>
<li>Pick K random points as initial centroids.</li>
<li>Assign each data point to the nearest centroid.</li>
<li>Update each centroid to the mean of its assigned points.</li>
<li>Repeat until assignments stop changing.</li>
</ol>
<div class="example-box"><pre>from sklearn.cluster import KMeans
km = KMeans(n_clusters=5, n_init=10, random_state=42)
labels = km.fit_predict(X_scaled)
km.cluster_centers_</pre></div>
<p><code>n_init=10</code> runs the algorithm 10 times with different random starts and keeps the best — K-Means is sensitive to initialization.</p>
` },
        { icon: "🎚️", title: "Choosing K", content: `
<h4>Elbow method</h4>
<p>Plot inertia vs K. Look for the "elbow" where additional clusters stop meaningfully reducing inertia.</p>
<div class="example-box"><pre>inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    km.fit(X_scaled)
    inertias.append(km.inertia_)
plt.plot(range(1, 11), inertias, marker="o")</pre></div>
<h4>Silhouette method</h4>
<p>Try several K values; pick the one with highest average silhouette.</p>
<div class="info-box"><strong>Reality:</strong> the elbow is often ambiguous. Try multiple K values, inspect clusters with domain knowledge, pick what makes business sense.</div>
` },
        { icon: "⚠️", title: "Limitations", content: `
<ul>
<li><strong>Assumes spherical clusters</strong> of similar size. Fails on elongated or nested shapes — use DBSCAN or hierarchical for those.</li>
<li><strong>Sensitive to outliers</strong> — one extreme point pulls the centroid.</li>
<li><strong>Must pick K in advance</strong>.</li>
<li><strong>Random initialization</strong> → different runs can give different results. Always use <code>n_init &gt; 1</code>.</li>
</ul>
<p>Still the default first algorithm to try — fast, simple, widely understood.</p>
` },
        { icon: "📺", title: "Watch: K-Means Clearly Explained", video: "https://www.youtube.com/watch?v=4b5d3muPQmA", videoTitle: "StatQuest — K-Means Clustering", content: `
<p>Visual walkthrough of the algorithm, elbow method, and limitations.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. K-Means minimizes:</div>
<ol class="quiz-options" type="A"><li>Training time</li><li>Within-cluster variance (inertia)</li><li>Number of features</li><li>Silhouette</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Sum of squared distances to each point's centroid.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why <code>n_init=10</code>?</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>Algorithm is sensitive to initialization — run multiple times, keep best</li><li>Required</li><li>Parallelism</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> K-Means can fall into local minima.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Elbow method plots:</div>
<ol class="quiz-options" type="A"><li>Accuracy vs K</li><li>Inertia vs K</li><li>Silhouette vs K</li><li>Time vs K</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Look for the bend where marginal improvement drops.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. K-Means fails when clusters are:</div>
<ol class="quiz-options" type="A"><li>Spherical</li><li>Non-convex, elongated, or nested</li><li>Equal size</li><li>Labeled</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> K-Means assumes spherical, similar-size clusters.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Outliers affect K-Means because:</div>
<ol class="quiz-options" type="A"><li>They slow training</li><li>They pull centroids toward themselves</li><li>They confuse the user</li><li>They don't</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Mean is sensitive to extremes. Consider K-Medoids for robustness.</div>
</div>
` }
      ]
    },

    "5-3": {
      title: "Hierarchical Clustering",
      subtitle: "Module 5, Class 3 — Dendrograms, agglomerative methods",
      sections: [
        { icon: "🌲", title: "Bottom-Up Clustering", content: `
<p>Hierarchical clustering builds a tree of clusters. <strong>Agglomerative</strong> (bottom-up) is the common approach:</p>
<ol>
<li>Start with each point as its own cluster.</li>
<li>Merge the two closest clusters.</li>
<li>Repeat until one cluster remains.</li>
</ol>
<p>You get a <strong>dendrogram</strong> — a tree diagram showing the full merge history. Cut at any height to get K clusters.</p>
<p>Unlike K-Means, you don't pick K in advance. You explore the dendrogram and decide.</p>
` },
        { icon: "🔗", title: "Linkage Criteria", content: `
<p>How do you measure the distance between two <em>clusters</em> (not points)?</p>
<ul>
<li><strong>Single linkage</strong> — distance between closest pair of points. Produces long "chains."</li>
<li><strong>Complete linkage</strong> — farthest pair. Compact spherical clusters.</li>
<li><strong>Average linkage</strong> — mean pairwise distance. Balanced.</li>
<li><strong>Ward's method</strong> — minimize increase in total variance. Usually the best default.</li>
</ul>
<div class="example-box"><pre>from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram, linkage

Z = linkage(X_scaled, method="ward")
dendrogram(Z)

# Or get cluster labels directly
ag = AgglomerativeClustering(n_clusters=5, linkage="ward")
labels = ag.fit_predict(X_scaled)</pre></div>
` },
        { icon: "⚖️", title: "When to Use Each", content: `
<ul>
<li><strong>K-Means</strong> — fast, large data, known K, roughly spherical clusters.</li>
<li><strong>Hierarchical</strong> — small-to-medium data, exploring structure, want full dendrogram.</li>
<li><strong>DBSCAN</strong> — arbitrary shapes, automatic K, identifies outliers.</li>
</ul>
<p>Hierarchical scales poorly — O(n³) or O(n² log n). Fine for &lt;10k points, painful beyond that.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Agglomerative clustering starts with:</div>
<ol class="quiz-options" type="A"><li>One big cluster</li><li>Each point as its own cluster</li><li>Random K clusters</li><li>Labeled data</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Bottom-up: merge from singletons.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Dendrogram shows:</div>
<ol class="quiz-options" type="A"><li>Confusion matrix</li><li>Merge history with distances</li><li>Feature importance</li><li>Data distribution</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Tree showing which clusters joined at what distance.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Best default linkage:</div>
<ol class="quiz-options" type="A"><li>Single</li><li>Ward</li><li>Complete</li><li>Centroid</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Ward minimizes variance and usually gives clean clusters.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Do you need to pick K upfront?</div>
<ol class="quiz-options" type="A"><li>Yes, always</li><li>No — pick it after seeing the dendrogram</li><li>Only for small datasets</li><li>Only Ward needs K</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Dendrogram lets you decide visually.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. When NOT to use hierarchical?</div>
<ol class="quiz-options" type="A"><li>Small datasets</li><li>Million-row datasets (too slow)</li><li>Exploring structure</li><li>Medium datasets</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> O(n²) or worse — doesn't scale.</div>
</div>
` }
      ]
    },

    "5-4": {
      title: "Dimensionality Reduction",
      subtitle: "Module 5, Class 4 — PCA, t-SNE, visualization",
      sections: [
        { icon: "📐", title: "Principal Component Analysis (PCA)", content: `
<p>PCA finds new axes (principal components) that maximize variance. Project your high-D data onto the first few components and you've compressed the data while keeping most of the information.</p>
<h4>What PCA does</h4>
<ul>
<li>Each PC is a linear combination of original features.</li>
<li>PCs are orthogonal (uncorrelated).</li>
<li>PC1 captures the most variance, PC2 the next-most, etc.</li>
</ul>
<div class="example-box"><pre>from sklearn.decomposition import PCA
pca = PCA(n_components=0.95)   # keep enough PCs to retain 95% variance
X_reduced = pca.fit_transform(X_scaled)
pca.explained_variance_ratio_.cumsum()</pre></div>
<div class="info-box"><strong>Always scale before PCA.</strong> PCA chases variance; unscaled features with large ranges dominate.</div>
` },
        { icon: "🌈", title: "t-SNE and UMAP", content: `
<p>Non-linear reductions for <strong>visualization</strong>, not modeling:</p>
<ul>
<li><strong>t-SNE</strong> — preserves local structure. Points near each other in high-D stay near in 2D.</li>
<li><strong>UMAP</strong> — similar to t-SNE but faster and often preserves global structure better.</li>
</ul>
<p>Both are for human inspection — squint at a 2D plot and see if clusters are visually obvious. Don't feed t-SNE output to a downstream model; the distances between clusters aren't meaningful.</p>
<div class="example-box"><pre>from sklearn.manifold import TSNE
X_2d = TSNE(n_components=2, perplexity=30, random_state=42).fit_transform(X)
plt.scatter(X_2d[:, 0], X_2d[:, 1], c=cluster_labels, cmap="tab10")</pre></div>
` },
        { icon: "📺", title: "Watch: PCA Clearly Explained", video: "https://www.youtube.com/watch?v=FgakZw6K1QQ", videoTitle: "StatQuest — PCA Step by Step", content: `
<p>Best explanation of PCA on YouTube. Josh shows how PCs come from eigenvectors of the covariance matrix without diving into the math.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. PC1 is:</div>
<ol class="quiz-options" type="A"><li>First feature</li><li>Direction of maximum variance</li><li>Mean of features</li><li>Target variable</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Axis along which data varies most.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. PCs are:</div>
<ol class="quiz-options" type="A"><li>Correlated</li><li>Orthogonal (uncorrelated)</li><li>Random</li><li>Identical</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Orthogonality is how PCA removes redundancy.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Why scale before PCA?</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>PCA chases variance; unscaled large-range features dominate</li><li>Required by library</li><li>Removes outliers</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Critical.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. t-SNE output is good for:</div>
<ol class="quiz-options" type="A"><li>Feeding to a classifier</li><li>Visualization of local structure</li><li>Feature importance</li><li>Regression</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Visualization only. Distances between clusters aren't meaningful.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. <code>PCA(n_components=0.95)</code> means:</div>
<ol class="quiz-options" type="A"><li>Keep 95 components</li><li>Keep enough components to retain 95% variance</li><li>Drop 95% of features</li><li>Confidence level</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Variance-based cutoff.</div>
</div>
` }
      ]
    },

    "5-5": {
      title: "Anomaly Detection",
      subtitle: "Module 5, Class 5 — Finding outliers, fraud, network intrusions",
      sections: [
        { icon: "🔍", title: "The Anomaly Detection Problem", content: `
<p>An anomaly is a rare event that differs from "normal" behavior. Examples: fraud, equipment failure, cyberattack, medical emergency.</p>
<p>Why supervised classification usually fails:</p>
<ul>
<li><strong>Extreme class imbalance</strong> — fraud is &lt;0.1% of transactions.</li>
<li><strong>Rare events have few labels</strong> — you may have seen 100 examples total.</li>
<li><strong>Novel anomalies</strong> — new attack patterns have zero history.</li>
</ul>
<p>Unsupervised anomaly detection: learn what normal looks like, flag deviations.</p>
` },
        { icon: "🎛️", title: "Common Methods", content: `
<ul>
<li><strong>Isolation Forest</strong> — randomly split features; anomalies get isolated in fewer splits. Fast, scales well.</li>
<li><strong>One-Class SVM</strong> — learns a boundary around normal data. Good for small, clean training sets.</li>
<li><strong>Local Outlier Factor (LOF)</strong> — compares density around a point to its neighbors.</li>
<li><strong>Autoencoders</strong> — train a neural net to reconstruct normal data; high reconstruction error = anomaly.</li>
</ul>
<div class="example-box"><pre>from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.01, random_state=42)
preds = iso.fit_predict(X)   # -1 for anomaly, 1 for normal
scores = iso.score_samples(X)   # the lower, the more anomalous</pre></div>
` },
        { icon: "⚖️", title: "Hybrid Approach in Production", content: `
<p>Real fraud systems combine:</p>
<ol>
<li><strong>Rule-based filter</strong> — catches known patterns with low latency.</li>
<li><strong>Supervised classifier</strong> — trained on labeled fraud cases.</li>
<li><strong>Unsupervised anomaly detector</strong> — catches novel patterns the supervised model hasn't seen.</li>
<li><strong>Human review</strong> — for borderline cases.</li>
</ol>
<p>Each layer catches what the others miss.</p>
<div class="info-box"><strong>Concept drift:</strong> fraudsters change tactics weekly. Plan for retraining from day one.</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Why is anomaly detection hard with supervised learning?</div>
<ol class="quiz-options" type="A"><li>Too easy</li><li>Extreme class imbalance, few labels, novel patterns unseen</li><li>Requires GPUs</li><li>Too slow</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> All three reasons.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Isolation Forest flags anomalies by:</div>
<ol class="quiz-options" type="A"><li>Proximity to centroids</li><li>How few random splits isolate them</li><li>Feature importance</li><li>Accuracy</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Anomalies are easier to isolate than normal points.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. <code>contamination=0.01</code> means:</div>
<ol class="quiz-options" type="A"><li>1% training set</li><li>Expect roughly 1% of data to be anomalous</li><li>Learning rate</li><li>Regularization</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Prior on anomaly rate.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Autoencoder-based anomaly detection flags points with:</div>
<ol class="quiz-options" type="A"><li>Low loss</li><li>High reconstruction error</li><li>Random values</li><li>Negative values</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> The autoencoder learned "normal"; it can't reconstruct anomalies well.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Why hybrid (rules + supervised + unsupervised) in production?</div>
<ol class="quiz-options" type="A"><li>Fashion</li><li>Each layer catches what others miss, including novel attacks</li><li>Required by regulation</li><li>Speed</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Defense in depth.</div>
</div>
` }
      ]
    },

    "5-6": {
      title: "Lab: Customer Segmentation",
      subtitle: "Module 5, Class 6 — Cluster real customer data",
      sections: [
        { icon: "🎯", title: "Objective", content: `
<p>Use K-Means and hierarchical clustering to segment customers. Defend your choice of K with evidence. Describe each segment in business terms.</p>
<div class="tool-grid">
<a class="tool-card" href="https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python" target="_blank" rel="noopener"><h5>Mall Customer Dataset</h5><p>200 customers, 5 features. Good starter for clustering.</p></a>
</div>
` },
        { icon: "📝", title: "Tasks", content: `
<ol>
<li>Load and do basic EDA.</li>
<li>Scale numeric features with StandardScaler.</li>
<li>Run K-Means for K = 2..10. Plot elbow curve.</li>
<li>Run K-Means for K = 2..10. Plot silhouette scores.</li>
<li>Pick a K. Justify with evidence from both plots.</li>
<li>Run hierarchical clustering. Show dendrogram. Does it suggest the same K?</li>
<li>Reduce to 2D with PCA. Color by cluster label. Visually check separation.</li>
<li>Name each cluster in business terms (e.g., "Young high-spenders").</li>
</ol>
` },
        { icon: "📐", title: "Deliverable", content: `
<ul>
<li>Notebook with all 8 tasks.</li>
<li>Written segment profiles: for each cluster, mean values of key features + one-sentence persona.</li>
<li>Recommendation: how would a marketing team use these segments?</li>
</ul>
` },
        { icon: "📋", title: "Checkpoint Quiz", content: `
<div class="quiz-item">
<div class="quiz-q">1. First step before clustering:</div>
<ol class="quiz-options" type="A"><li>Train model</li><li>Scale features</li><li>Label data</li><li>Split train/test</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Unscaled features distort distances.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. You get the same K from elbow and silhouette. Does that prove it's right?</div>
<ol class="quiz-options" type="A"><li>Yes</li><li>Strong evidence but ultimate test is business meaning</li><li>No</li><li>Only if silhouette &gt; 0.7</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Statistics help; human interpretation decides.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Why PCA for visualization?</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>Reduce 5+ features to 2D so humans can see separation</li><li>Required</li><li>Remove outliers</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Humans see in 2D, not 5D.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. How to name clusters?</div>
<ol class="quiz-options" type="A"><li>Cluster_0, Cluster_1</li><li>Descriptive business personas based on feature means</li><li>By ID</li><li>Doesn't matter</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "Young high-spenders" communicates more than "Cluster_3."</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Clustering output's real purpose:</div>
<ol class="quiz-options" type="A"><li>Pretty charts</li><li>Inform a business action (targeted marketing, different service tiers)</li><li>Test ML skills</li><li>Win Kaggle</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Segments exist to be acted on.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_5_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[5] = true;
})();
