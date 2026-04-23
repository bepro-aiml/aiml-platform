// ============================================================
// MODULE 8 CONTENT — Capstone Project and Deployment
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module8.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_8_CONTENT = {

    "8-1": {
      title: "Project Planning",
      subtitle: "Module 8, Class 1 — Scoping, data sourcing, architecture decisions",
      sections: [
        { icon: "🎯", title: "Scoping the Right Problem", content: `
<p>The most common reason capstone projects fail: wrong scope. Too ambitious → nothing works. Too small → nothing to show.</p>
<h4>Good capstone criteria</h4>
<ul>
<li><strong>Realistic dataset</strong> — 1k to 100k examples, preferably public or generated.</li>
<li><strong>Clear success metric</strong> — what does "working" mean numerically?</li>
<li><strong>End-to-end demo</strong> — from data in to prediction out, deployable.</li>
<li><strong>Uzbekistan connection preferred</strong> — uses local data or solves a local problem.</li>
</ul>
<h4>Example scopes (good)</h4>
<ul>
<li>Predict whether a Telegram message to a support channel is about billing, tech, or general — classifier with API endpoint.</li>
<li>Detect Uzbek-Latin vs Uzbek-Cyrillic text, convert automatically.</li>
<li>Cluster Payme-style transactions to flag top-100 anomalies daily.</li>
<li>Forecast daily metro ridership for the next 7 days from a year of historical data.</li>
</ul>
` },
        { icon: "📋", title: "Project Proposal Template", content: `
<pre style="background:var(--card);border:1px solid var(--card-border);border-radius:8px;padding:16px;overflow-x:auto;font-size:0.85rem;">
1. Problem statement (2 sentences)
2. Dataset: source, size, key columns
3. ML task type (classification / regression / clustering / ...)
4. Success metric and target value
5. Baseline — what's the dumbest model that works?
6. Planned architecture (model family, libraries)
7. Deployment plan (API? batch? dashboard?)
8. Risks and mitigations
9. Timeline (weekly milestones)
</pre>
<div class="info-box"><strong>Week 1 deliverable:</strong> this proposal, reviewed by mentor before you write any code.</div>
` },
        { icon: "⚠️", title: "Common Pitfalls", content: `
<ul>
<li><strong>Data not actually available.</strong> "We'll scrape it" rarely works in 2 weeks. Confirm data access first.</li>
<li><strong>Wrong target variable.</strong> Problem framing from Module 1 matters most here. Define the label precisely.</li>
<li><strong>No baseline.</strong> If you don't have a number to beat, you can't tell if the fancy model is working.</li>
<li><strong>No production plan.</strong> A Jupyter notebook is not a product. Plan for deployment from day one.</li>
<li><strong>Scope creep.</strong> Resist adding features mid-project. Ship the core first.</li>
</ul>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. First deliverable of capstone:</div>
<ol class="quiz-options" type="A"><li>Model</li><li>Proposal document</li><li>Demo</li><li>Slides</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Proposal before code.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why define a baseline?</div>
<ol class="quiz-options" type="A"><li>Fashion</li><li>Without it, you can't tell if your fancy model is actually working</li><li>Speed</li><li>Required</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Simple benchmark to compare against.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Biggest project-killer:</div>
<ol class="quiz-options" type="A"><li>Slow training</li><li>Data you can't actually access</li><li>Too many features</li><li>Python version</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Verify data availability before committing to the problem.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Success metric must be:</div>
<ol class="quiz-options" type="A"><li>Ambitious</li><li>Numerical with a target value</li><li>Vague</li><li>Optional</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "F1 &gt; 0.75 on held-out test," not "works well."</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Scope creep — handle by:</div>
<ol class="quiz-options" type="A"><li>Adding everything</li><li>Ship core first, extras after</li><li>Ignoring the proposal</li><li>Bigger team</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Minimum viable product principle.</div>
</div>
` }
      ]
    },

    "8-2": {
      title: "Model Development Sprint",
      subtitle: "Module 8, Class 2 — Building and iterating on your model",
      sections: [
        { icon: "🏃", title: "The Iteration Loop", content: `
<p>Good ML projects iterate fast. Bad ones spend weeks on a single model.</p>
<ol>
<li><strong>Baseline first</strong> — a trivial model, end-to-end, in a day. Logistic regression or random forest usually suffices.</li>
<li><strong>Measure</strong> — how far is baseline from target? What kind of errors does it make?</li>
<li><strong>Hypothesize</strong> — "if I add feature X" or "if I try model Y," what should improve?</li>
<li><strong>Try</strong> — one change at a time.</li>
<li><strong>Repeat</strong>.</li>
</ol>
<p>Most of your iterations should be on features and data quality, not model architecture. That's where the gains live in business problems.</p>
` },
        { icon: "📊", title: "Error Analysis", content: `
<p>Confusion matrix alone isn't enough. For every project, do:</p>
<ul>
<li><strong>Per-class metrics</strong> — which classes does the model struggle with?</li>
<li><strong>Per-segment metrics</strong> — does it underperform on certain user groups, regions, time periods?</li>
<li><strong>Inspect 50 misclassifications</strong> — categorize the failure modes.</li>
<li><strong>Calibration</strong> — are the predicted probabilities honest? Plot reliability diagrams.</li>
</ul>
<div class="info-box"><strong>Error analysis beats hyperparameter tuning.</strong> Fixing a systematic failure mode typically yields 5-10 points more than squeezing 0.5% from grid search.</div>
` },
        { icon: "🎚️", title: "Hyperparameter Tuning", content: `
<ul>
<li><strong>Grid search</strong> — exhaustive over a small grid. Simple but slow for many params.</li>
<li><strong>Random search</strong> — sample randomly. Often more effective than grid.</li>
<li><strong>Bayesian optimization (Optuna, Hyperopt)</strong> — learns which configs are worth trying. Best for expensive models.</li>
</ul>
<div class="example-box"><pre>import optuna
def objective(trial):
    n_estimators = trial.suggest_int("n_estimators", 50, 500)
    max_depth = trial.suggest_int("max_depth", 3, 20)
    rf = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    return cross_val_score(rf, X, y, cv=5).mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)</pre></div>
<p>Start simple: manual tuning of 2-3 key params usually gets you 80% of the way.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. First model should be:</div>
<ol class="quiz-options" type="A"><li>State-of-the-art</li><li>Trivial baseline, end-to-end, in one day</li><li>Deepest available</li><li>Pretrained only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Baseline establishes the target.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Change one thing at a time because:</div>
<ol class="quiz-options" type="A"><li>Required</li><li>Otherwise you can't tell which change helped</li><li>Speed</li><li>Memory</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Experimental hygiene.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Error analysis means:</div>
<ol class="quiz-options" type="A"><li>Read confusion matrix</li><li>Inspect misclassifications and categorize failure modes</li><li>Plot loss curve</li><li>Print accuracy</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Qualitative investigation of actual failures.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Bayesian optimization:</div>
<ol class="quiz-options" type="A"><li>Random</li><li>Learns which configs are promising to try next</li><li>Exhaustive</li><li>Deterministic</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Adaptive — efficient for expensive models.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Biggest gains usually come from:</div>
<ol class="quiz-options" type="A"><li>Hyperparameter tuning</li><li>Better features and data quality</li><li>Deeper networks</li><li>More epochs</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Features &gt; models in most business problems.</div>
</div>
` }
      ]
    },

    "8-3": {
      title: "Model Deployment",
      subtitle: "Module 8, Class 3 — Flask/FastAPI, Docker, cloud deployment",
      sections: [
        { icon: "🚀", title: "From Notebook to API", content: `
<p>A trained model sitting in a <code>.pkl</code> file is not useful. It needs to be callable.</p>
<div class="example-box"><pre>from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()
model = joblib.load("pipeline.pkl")

@app.post("/predict")
def predict(features: dict):
    df = pd.DataFrame([features])
    prob = model.predict_proba(df)[0, 1]
    return {"probability": float(prob), "prediction": int(prob &gt; 0.5)}</pre></div>
<p>Run with <code>uvicorn main:app --host 0.0.0.0 --port 8000</code>. Send a POST request and get a prediction.</p>
<p>FastAPI is preferred over Flask for new projects — async support, auto-generated OpenAPI docs, typed request/response.</p>
` },
        { icon: "🐳", title: "Docker", content: `
<p>Your laptop and the server are different. Python versions, library versions, system packages — all can differ. Docker packages your app + environment into a reproducible image.</p>
<div class="example-box"><pre># Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]</pre></div>
<pre>docker build -t churn-api .
docker run -p 8000:8000 churn-api</pre>
<p>Same image runs on your laptop, Oracle Cloud, AWS, or a colleague's machine.</p>
` },
        { icon: "☁️", title: "Where to Deploy", content: `
<ul>
<li><strong>Oracle Cloud Free Tier</strong> — 2 ARM VMs free forever. Used for this course's bot.</li>
<li><strong>Render, Railway, Fly.io</strong> — friendly for small projects. Push to Git, automatic deploy.</li>
<li><strong>AWS/GCP/Azure</strong> — production-grade, more complex. Managed services (Lambda, Cloud Run) abstract the VM.</li>
<li><strong>Hugging Face Spaces</strong> — free for demos, especially ML models.</li>
</ul>
<div class="info-box"><strong>For the capstone:</strong> Render or Oracle Free Tier is enough. Don't overengineer — ship something first.</div>
` },
        { icon: "📺", title: "Watch: FastAPI + Docker Deployment", video: "https://www.youtube.com/watch?v=tLKKmouUams", videoTitle: "FastAPI deployment walkthrough", content: `
<p>End-to-end: build a FastAPI app, containerize, deploy. Good reference for the capstone.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. FastAPI vs Flask for new projects:</div>
<ol class="quiz-options" type="A"><li>Identical</li><li>FastAPI — async, type-checked, auto-docs</li><li>Flask is newer</li><li>Flask is async</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> FastAPI is the modern default.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why Docker?</div>
<ol class="quiz-options" type="A"><li>Smaller files</li><li>Reproducible environment across machines</li><li>Speed</li><li>Required</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Kills "works on my laptop" bugs.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Free deployment option for a capstone demo:</div>
<ol class="quiz-options" type="A"><li>AWS production</li><li>Render, Hugging Face Spaces, or Oracle Free Tier</li><li>Custom data center</li><li>GCP VM</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Multiple free options — pick based on what you want to show.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. <code>uvicorn main:app --host 0.0.0.0</code> means:</div>
<ol class="quiz-options" type="A"><li>Local only</li><li>Listen on all network interfaces</li><li>IPv6</li><li>Disabled</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Accept connections from outside the machine.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. What to put in the Docker image with the model?</div>
<ol class="quiz-options" type="A"><li>Entire dataset</li><li>Preprocessing + model pipeline + API code</li><li>Git history</li><li>IDE</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Everything needed to serve predictions.</div>
</div>
` }
      ]
    },

    "8-4": {
      title: "Monitoring and MLOps",
      subtitle: "Module 8, Class 4 — Model drift, retraining, CI/CD for ML",
      sections: [
        { icon: "📉", title: "Why Models Decay", content: `
<p>ML models are not write-once. Performance degrades over time because the world changes:</p>
<ul>
<li><strong>Data drift</strong> — feature distributions shift. (New payment methods, new demographics.)</li>
<li><strong>Concept drift</strong> — the relationship between features and target changes. (Fraud patterns evolve weekly.)</li>
<li><strong>Label shift</strong> — class balance changes. (Seasonal churn spikes.)</li>
</ul>
<p>A model deployed today might be embarrassingly wrong in 6 months. Monitoring catches this before users notice.</p>
` },
        { icon: "📈", title: "What to Monitor", content: `
<ul>
<li><strong>Prediction distributions</strong> — are today's predictions similar to validation-time predictions?</li>
<li><strong>Input distributions</strong> — are incoming features drifting? Use KS tests or population stability index.</li>
<li><strong>Performance (when labels arrive)</strong> — accuracy, precision, recall on recent data.</li>
<li><strong>System metrics</strong> — latency, error rate, throughput.</li>
<li><strong>Business metrics</strong> — is the model still delivering value? Revenue lift, customer satisfaction.</li>
</ul>
<p>Tools: Evidently, Arize, WhyLabs, or simple dashboards with Grafana.</p>
` },
        { icon: "🔄", title: "Retraining Pipelines", content: `
<p>Automate the feedback loop:</p>
<ol>
<li>Log every prediction with features and request timestamp.</li>
<li>As ground truth arrives, join it to predictions.</li>
<li>On a schedule (daily/weekly/monthly) or on drift alert, retrain with fresh data.</li>
<li>Validate new model in shadow mode (predict but don't serve). Compare to current.</li>
<li>If better, swap. If worse, investigate.</li>
</ol>
<h4>CI/CD for ML</h4>
<p>Treat models like code:</p>
<ul>
<li>Git for code and config.</li>
<li>Model registry (MLflow, Weights &amp; Biases) for versioned artifacts.</li>
<li>Automated tests: unit tests for preprocessing, integration tests for the API, data validation for incoming features.</li>
</ul>
` },
        { icon: "📺", title: "Watch: MLOps in 10 Minutes", video: "https://www.youtube.com/watch?v=ZVWg18AXXuE", videoTitle: "MLOps overview and best practices", content: `
<p>Quick overview of the MLOps landscape and tooling. Good for orienting before deep-diving.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Data drift means:</div>
<ol class="quiz-options" type="A"><li>Training data moves</li><li>Production feature distributions shift over time</li><li>Labels change</li><li>Code drift</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Inputs evolve.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Concept drift:</div>
<ol class="quiz-options" type="A"><li>Same as data drift</li><li>Feature→target relationship changes</li><li>Changing model</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> The mapping itself moves. Classic in fraud.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Shadow mode deployment:</div>
<ol class="quiz-options" type="A"><li>Fast mode</li><li>New model predicts without serving, compare to current</li><li>Dark launch</li><li>Offline only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Safe evaluation before swap.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Model registry:</div>
<ol class="quiz-options" type="A"><li>GitHub repo</li><li>Versioned store for model artifacts + metadata</li><li>Serving framework</li><li>Monitoring</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> MLflow, W&amp;B, etc. Track experiments, promote models.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Most important monitoring metric:</div>
<ol class="quiz-options" type="A"><li>Accuracy only</li><li>Combination of data drift, performance, system metrics, business metrics</li><li>Latency</li><li>Uptime</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> No single metric is sufficient.</div>
</div>
` }
      ]
    },

    "8-5": {
      title: "Presentation Prep",
      subtitle: "Module 8, Class 5 — Demo day preparation, storytelling with data",
      sections: [
        { icon: "🎤", title: "Structure of a Great ML Demo", content: `
<p>10 minutes total. Same structure as a paper abstract:</p>
<ol>
<li><strong>Problem (60 sec)</strong> — what, why it matters, who uses the result.</li>
<li><strong>Data (60 sec)</strong> — source, size, key features. What was hard about it?</li>
<li><strong>Approach (90 sec)</strong> — model family, why this choice, baseline vs final.</li>
<li><strong>Results (90 sec)</strong> — metric + table. One key chart.</li>
<li><strong>Live demo (3 min)</strong> — feed in real-looking input, get prediction, explain.</li>
<li><strong>Limitations and next steps (60 sec)</strong> — what would you do with another month?</li>
<li><strong>Q&amp;A (2 min)</strong>.</li>
</ol>
<p>Don't skip the limitations section. Mentors will push on it during Q&amp;A; acknowledging upfront shows maturity.</p>
` },
        { icon: "📊", title: "Visualizing Results", content: `
<p>One hero chart per presentation. Not three, not ten. Choose:</p>
<ul>
<li><strong>Confusion matrix</strong> for classification.</li>
<li><strong>Predicted vs actual scatter</strong> for regression.</li>
<li><strong>Segment/cluster visualization</strong> for clustering.</li>
<li><strong>Before/after comparison</strong> with baseline — makes the value clear.</li>
</ul>
<p>Axes labeled. Units shown. Colorblind-friendly palette. No chartjunk. Rehearse what you'll say about the chart — a good chart earns 30 seconds of commentary.</p>
` },
        { icon: "🗣️", title: "Communicating to Non-Technical Stakeholders", content: `
<ul>
<li><strong>Skip model architecture details</strong> unless asked. "We used a gradient-boosted tree" is enough.</li>
<li><strong>Frame in business units.</strong> Not "F1 0.78" but "we can flag 78% of likely churners correctly."</li>
<li><strong>Show tradeoffs.</strong> "We could catch more fraud by raising sensitivity, but that would flag 3x more legitimate transactions."</li>
<li><strong>Prepare for the 'so what' question.</strong> Every metric ties to an outcome the audience cares about.</li>
</ul>
<div class="info-box"><strong>Practice:</strong> explain your project in 60 seconds to a non-engineer friend. If they don't get it, your pitch isn't ready.</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. How many hero charts per presentation?</div>
<ol class="quiz-options" type="A"><li>One</li><li>Three</li><li>Ten</li><li>As many as possible</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>A.</strong> One clear story.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Opening 60 seconds should cover:</div>
<ol class="quiz-options" type="A"><li>Architecture</li><li>The problem, why it matters, who uses the result</li><li>Dataset details</li><li>Team bios</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Problem framing first.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Why include limitations?</div>
<ol class="quiz-options" type="A"><li>Humility</li><li>Shows maturity; mentors will ask anyway</li><li>Required</li><li>Time filler</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Acknowledging constraints beats being cornered in Q&amp;A.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. For non-technical audience, metric framing:</div>
<ol class="quiz-options" type="A"><li>F1 = 0.78</li><li>"We catch 78% of likely churners correctly"</li><li>Tensor shapes</li><li>Gradient magnitude</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Business framing wins.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best rehearsal target:</div>
<ol class="quiz-options" type="A"><li>Mirror</li><li>Non-engineer friend in 60 seconds</li><li>Mentor only</li><li>No rehearsal</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> If they get it, anyone will.</div>
</div>
` }
      ]
    },

    "8-6": {
      title: "Demo Day",
      subtitle: "Module 8, Class 6 — Final presentations and course graduation",
      sections: [
        { icon: "🎓", title: "What Demo Day Looks Like", content: `
<p>Each student or pair presents their capstone. 10-minute talk + 2-minute Q&amp;A. Mentors, peers, and invited guests attend. After presentations, celebrate — you did it.</p>
<h4>Schedule</h4>
<ul>
<li><strong>Morning</strong> — setup, final rehearsals.</li>
<li><strong>Afternoon</strong> — back-to-back presentations.</li>
<li><strong>Evening</strong> — graduation, networking, group photo.</li>
</ul>
<p>Bring your laptop, adapter, backup slides (PDF), and a stable internet connection for any live API calls.</p>
` },
        { icon: "📋", title: "Final Submission Checklist", content: `
<ul>
<li><strong>GitHub repo</strong> with README, clear setup instructions, requirements.txt or Dockerfile.</li>
<li><strong>Working deployed endpoint</strong> (URL the audience can hit).</li>
<li><strong>Slides</strong> as PDF (backup for if live demo fails).</li>
<li><strong>Short video demo</strong> (1-2 min, also a backup).</li>
<li><strong>Written report</strong> (2-3 pages) — problem, approach, results, what you learned.</li>
<li><strong>Signed authorship statement</strong> if the work involved real-world data.</li>
</ul>
` },
        { icon: "🌱", title: "After the Course", content: `
<p>Graduation is a checkpoint, not a destination. Some directions:</p>
<ul>
<li><strong>Keep building</strong> — add features to your capstone, deploy it for real users.</li>
<li><strong>Contribute</strong> — open-source ML projects welcome PRs from newcomers.</li>
<li><strong>Certify</strong> — AWS ML Specialty, Google Cloud ML Engineer, TensorFlow Developer certs are recognized.</li>
<li><strong>Compete</strong> — Kaggle builds real skill if you work through full solutions.</li>
<li><strong>Get a job</strong> — entry-level ML roles exist in Uzbekistan (Uztelecom, Uzum, EPAM, EXADEL). Open to junior data analyst, data engineer, ML engineer titles.</li>
<li><strong>Mentor</strong> — next year's cohort needs people who just walked this path.</li>
</ul>
<div class="case-study"><h4>The course bot stays open</h4><p><a href="https://t.me/lossfunction_bot" target="_blank">@lossfunction_bot</a> remains available after graduation. Ask anything — it'll guide you to the right material.</p></div>
` },
        { icon: "📺", title: "Watch: What Makes a Great Data Science Presentation", video: "https://www.youtube.com/watch?v=Bwhf3HZqjT8", videoTitle: "Presenting data science work effectively", content: `
<p>Last video of the course. Watch before Demo Day. Key takeaway: story first, technique second.</p>
` },
        { icon: "📋", title: "Final Checkpoint", content: `
<div class="quiz-item">
<div class="quiz-q">1. Backup plan if live demo fails:</div>
<ol class="quiz-options" type="A"><li>Apologize</li><li>PDF slides + short video demo prepared in advance</li><li>Reschedule</li><li>Skip</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Always have a backup. Demo gods are cruel.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. README must include:</div>
<ol class="quiz-options" type="A"><li>Bio</li><li>Setup instructions, how to run, expected output</li><li>History of ML</li><li>Just a title</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> A stranger must be able to reproduce your work.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Best post-course move for an entry-level job seeker:</div>
<ol class="quiz-options" type="A"><li>Wait</li><li>Deploy capstone publicly, list it in CV with link</li><li>Re-take the course</li><li>Read papers only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Deployed work is the strongest portfolio signal.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Kaggle vs tutorials for skill-building:</div>
<ol class="quiz-options" type="A"><li>Tutorials only</li><li>Kaggle if you finish full solutions, not just copy kernels</li><li>Neither</li><li>Books only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Shallow Kaggle kernels don't teach much. Full end-to-end attempts do.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. What you learned this course in one sentence:</div>
<ol class="quiz-options" type="A"><li>How to train any model</li><li>How to frame an ML problem, prepare data, train, evaluate, deploy, and communicate</li><li>Python only</li><li>Neural nets only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> End-to-end competence. Congratulations — that's exactly what a junior ML engineer needs.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_8_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[8] = true;
})();
