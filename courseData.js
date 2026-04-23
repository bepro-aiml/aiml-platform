// ============================================================
// AI/ML COURSE DATA
// Single source of truth for all course content.
// Structure: COURSE_DATA -> modules -> classes -> sections/quiz
// To add Module 2-8 content: add entries to COURSE_DATA.classContent
// using keys like "2-1", "2-2", etc.
// ============================================================

const COURSE_DATA = {
  courseTitle: "AI/ML Fundamentals",
  courseSubtitle: "From zero to building real ML projects in 16 weeks",
  // Team — canonical list with explicit roles.
  // Roles drive UI styling: Mentor = violet gradient, Assistant = pink.
  team: [
    { name: "Saidazam Saidov",   role: "Mentor",    initials: "SS" },
    { name: "Ergashbaev Durbek", role: "Assistant", initials: "ED" }
  ],
  // Legacy flat array — still read by renderFooter() and any older code path.
  mentors: ["Saidazam Saidov", "Ergashbaev Durbek"],
  cohortSize: 80,
  botLink: "https://t.me/lossfunction_bot",

  // ==========================================================
  // MODULE METADATA — overview for each module
  // ==========================================================
  modules: [
  {
    id: 0, title: "The Toolkit", classes: 3, weeks: "Setup",
    status: "available",
    description: "Terminal, Git, and GitHub — the tools every engineer uses every day. Start here if you're new. If you already know Git, skip to Module 1.",
    classList: [
      { id: 1, title: "The Terminal", desc: "Your direct line to the computer", status: "available",
        keywords: ["terminal", "command line", "shell", "bash", "pwd", "ls", "cd", "mkdir", "powershell", "git bash"] },
      { id: 2, title: "Git — your project's memory", desc: "Version control on your laptop: init, add, commit", status: "available",
        keywords: ["git", "version control", "commit", "repository", "init", "add", "snapshot"] },
      { id: 3, title: "GitHub, Branches & Pull Requests", desc: "Remote hosting, teamwork, and your submission flow", status: "available",
        keywords: ["github", "pull request", "pr", "branch", "fork", "collaborator", "merge", "push", "pull", "workflow"] }
    ]
  },
  {
    id: 1, title: "Introduction to AI and ML", classes: 5, weeks: "1-2",
    status: "available",
    description: "What is AI? History, key concepts, real-world applications, ethics, and your first hands-on lab. No prerequisites.",
    classList: [
      { id: 1, title: "What is AI?", desc: "History, AI vs ML vs DL, types of ML", status: "available",
        keywords: ["artificial intelligence", "machine learning", "deep learning", "turing", "history", "supervised", "unsupervised", "reinforcement learning", "neural network"] },
      { id: 2, title: "Foundations", desc: "Probability, statistics, gradient descent, ML workflow", status: "available",
        keywords: ["probability", "statistics", "gradient descent", "loss function", "training", "workflow", "mean", "variance"] },
      { id: 3, title: "ITES Applications", desc: "Recommendations, fraud detection, chatbots, churn", status: "available",
        keywords: ["recommendation system", "fraud detection", "chatbot", "churn prediction", "business", "uzbekistan", "telecom", "uztelecom", "payme", "click"] },
      { id: 4, title: "Ethics in AI", desc: "Bias, fairness, privacy, case studies", status: "available",
        keywords: ["bias", "fairness", "privacy", "ethics", "amazon hiring", "compas", "gender shades", "responsible ai", "accountability"] },
      { id: 5, title: "Lab: Research-Driven Problem Framing", desc: "6 real Uzbekistan scenarios — research, frame, defend", status: "available",
        keywords: ["lab", "problem framing", "research", "scenarios", "group project", "uztelecom churn", "uzum recommendations", "payme fraud", "click fraud", "cotton yield", "fergana", "samarkand triage", "tashkent metro", "time series", "anomaly detection"] }
    ]
  },
  {
    id: 2, title: "Python and Data Foundations", classes: 6, weeks: "3-4",
    status: "available",
    description: "Python crash course, NumPy, Pandas, data visualization with Matplotlib and Seaborn. Build your coding toolkit.",
    classList: [
      { id: 1, title: "Python Basics", desc: "Variables, data types, control flow", status: "available" },
      { id: 2, title: "Functions and Data Structures", desc: "Functions, lists, dicts, comprehensions", status: "available" },
      { id: 3, title: "NumPy Fundamentals", desc: "Arrays, vectorization, linear algebra basics", status: "available" },
      { id: 4, title: "Pandas for Data Analysis", desc: "DataFrames, filtering, groupby, merging", status: "available" },
      { id: 5, title: "Data Visualization", desc: "Matplotlib, Seaborn, telling stories with charts", status: "available" },
      { id: 6, title: "Lab: Exploratory Data Analysis", desc: "Hands-on EDA on a real dataset", status: "available" }
    ]
  },
  {
    id: 3, title: "Data Preparation and Feature Engineering", classes: 6, weeks: "5-6",
    status: "available",
    description: "The hardest 80% of ML. Cleaning messy data, handling missing values, encoding, scaling, and creating features that matter.",
    classList: [
      { id: 1, title: "Data Quality and Cleaning", desc: "Missing values, duplicates, outliers", status: "available" },
      { id: 2, title: "Data Encoding and Transformation", desc: "Categorical encoding, scaling, normalization", status: "available" },
      { id: 3, title: "Feature Engineering", desc: "Creating meaningful features from raw data", status: "available" },
      { id: 4, title: "Feature Selection", desc: "Choosing the right features, dimensionality reduction", status: "available" },
      { id: 5, title: "Data Pipelines", desc: "Building reproducible preprocessing workflows", status: "available" },
      { id: 6, title: "Lab: End-to-End Data Prep", desc: "Clean and prepare a real-world dataset", status: "available" }
    ]
  },
  {
    id: 4, title: "Supervised Learning Algorithms", classes: 6, weeks: "7-8",
    status: "available",
    description: "Linear regression, logistic regression, decision trees, random forests, SVMs, and model evaluation metrics.",
    classList: [
      { id: 1, title: "Linear Regression", desc: "Predicting continuous values, cost functions", status: "available" },
      { id: 2, title: "Logistic Regression", desc: "Classification, sigmoid, decision boundaries", status: "available" },
      { id: 3, title: "Decision Trees and Random Forests", desc: "Splitting criteria, ensembles, bagging", status: "available" },
      { id: 4, title: "Model Evaluation", desc: "Accuracy, precision, recall, F1, confusion matrix", status: "available" },
      { id: 5, title: "Overfitting and Regularization", desc: "Train/test split, cross-validation, bias-variance", status: "available" },
      { id: 6, title: "Lab: Build a Classifier", desc: "End-to-end supervised learning project", status: "available" }
    ]
  },
  {
    id: 5, title: "Unsupervised Learning", classes: 6, weeks: "9-10",
    status: "available",
    description: "K-means clustering, hierarchical clustering, PCA, anomaly detection. Finding patterns without labels.",
    classList: [
      { id: 1, title: "Introduction to Clustering", desc: "Why unsupervised? Distance metrics", status: "available" },
      { id: 2, title: "K-Means Clustering", desc: "Algorithm, choosing K, convergence", status: "available" },
      { id: 3, title: "Hierarchical Clustering", desc: "Dendrograms, agglomerative methods", status: "available" },
      { id: 4, title: "Dimensionality Reduction", desc: "PCA, t-SNE, visualization", status: "available" },
      { id: 5, title: "Anomaly Detection", desc: "Finding outliers, fraud, network intrusions", status: "available" },
      { id: 6, title: "Lab: Customer Segmentation", desc: "Cluster real customer data", status: "available" }
    ]
  },
  {
    id: 6, title: "Neural Networks and Deep Learning", classes: 6, weeks: "11-12",
    status: "available",
    description: "Perceptrons, backpropagation, CNNs, RNNs, transfer learning. From single neurons to deep architectures.",
    classList: [
      { id: 1, title: "Perceptrons and Activation Functions", desc: "The building block of neural networks", status: "available" },
      { id: 2, title: "Backpropagation", desc: "How networks learn, chain rule, gradient flow", status: "available" },
      { id: 3, title: "Convolutional Neural Networks", desc: "Image recognition, filters, pooling", status: "available" },
      { id: 4, title: "Recurrent Neural Networks", desc: "Sequences, LSTM, time series", status: "available" },
      { id: 5, title: "Transfer Learning", desc: "Using pre-trained models, fine-tuning", status: "available" },
      { id: 6, title: "Lab: Image Classifier", desc: "Build a CNN with TensorFlow/Keras", status: "available" }
    ]
  },
  {
    id: 7, title: "NLP and Computer Vision", classes: 6, weeks: "13-14",
    status: "available",
    description: "Text processing, embeddings, transformers, attention mechanism. Object detection, image segmentation.",
    classList: [
      { id: 1, title: "Text Preprocessing", desc: "Tokenization, stemming, TF-IDF", status: "available" },
      { id: 2, title: "Word Embeddings", desc: "Word2Vec, GloVe, semantic similarity", status: "available" },
      { id: 3, title: "Transformers and Attention", desc: "Self-attention, BERT, GPT architecture", status: "available" },
      { id: 4, title: "Computer Vision Fundamentals", desc: "Object detection, segmentation, YOLO", status: "available" },
      { id: 5, title: "LLMs and Prompt Engineering", desc: "Working with large language models", status: "available" },
      { id: 6, title: "Lab: NLP or CV Project", desc: "Sentiment analysis or object detection", status: "available" }
    ]
  },
  {
    id: 8, title: "Capstone Project and Deployment", classes: 6, weeks: "15-16",
    status: "available",
    description: "Plan, build, and deploy a real ML project end-to-end. Model serving, APIs, monitoring, and final presentations.",
    classList: [
      { id: 1, title: "Project Planning", desc: "Scoping, data sourcing, architecture decisions", status: "available" },
      { id: 2, title: "Model Development Sprint", desc: "Building and iterating on your model", status: "available" },
      { id: 3, title: "Model Deployment", desc: "Flask/FastAPI, Docker, cloud deployment", status: "available" },
      { id: 4, title: "Monitoring and MLOps", desc: "Model drift, retraining, CI/CD for ML", status: "available" },
      { id: 5, title: "Presentation Prep", desc: "Demo day preparation, storytelling with data", status: "available" },
      { id: 6, title: "Demo Day", desc: "Final presentations and course graduation", status: "available" }
    ]
  }
],

  // ==========================================================
  // CLASS CONTENT — Full content for each class
  // Key format: "moduleId-classId" (e.g., "1-1", "2-3")
  // Add entries here as you build Modules 2-8
  // ==========================================================
  // CLASS CONTENT — loaded dynamically from /data/moduleN.js
  // Entries are inserted by the per-module loaders at runtime.
  classContent: {}
};

// Make COURSE_DATA globally available for index.html to use
// Backwards-compat: expose MODULES and CLASS_CONTENT for existing render code
const MODULES = COURSE_DATA.modules;
const CLASS_CONTENT = COURSE_DATA.classContent;

// ES module export (works if loaded as module; ignored in plain <script>)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { COURSE_DATA, MODULES, CLASS_CONTENT };
}
