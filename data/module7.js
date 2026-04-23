// ============================================================
// MODULE 7 CONTENT — NLP and Computer Vision
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module7.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_7_CONTENT = {

    "7-1": {
      title: "Text Preprocessing",
      subtitle: "Module 7, Class 1 — Tokenization, stemming, TF-IDF",
      sections: [
        { icon: "📝", title: "From Text to Numbers", content: `
<p>ML models need numbers. Text is not numbers. The entire pipeline of NLP starts with turning text into tensors.</p>
<h4>Tokenization</h4>
<p>Split text into tokens (usually words or subwords).</p>
<ul>
<li><strong>Whitespace tokenization</strong> — <code>"Salom dunyo".split()</code>. Naive but fast.</li>
<li><strong>Word tokenization</strong> — handles punctuation. NLTK <code>word_tokenize</code>.</li>
<li><strong>Subword (BPE, WordPiece, SentencePiece)</strong> — splits rare words into smaller pieces. Modern default. Handles any language gracefully.</li>
</ul>
` },
        { icon: "🧹", title: "Normalization", content: `
<ul>
<li><strong>Lowercasing</strong> — collapses "Tashkent" and "tashkent."</li>
<li><strong>Punctuation removal</strong> — usually helpful, sometimes not (sentiment "!" matters).</li>
<li><strong>Stop word removal</strong> — drop "the", "is", "and". Useful for bag-of-words, bad for context-sensitive tasks.</li>
<li><strong>Stemming</strong> — chop suffixes. <code>"running" → "run"</code>. Aggressive, lossy.</li>
<li><strong>Lemmatization</strong> — reduce to dictionary form. <code>"better" → "good"</code>. Smarter, slower.</li>
</ul>
<div class="info-box"><strong>Uzbek text</strong> — handle Latin/Cyrillic mixing, convert consistently. Watch for smart quotes and encoding issues when reading CSVs.</div>
` },
        { icon: "🔢", title: "TF-IDF", content: `
<p>Term Frequency-Inverse Document Frequency weights words by how distinctive they are.</p>
<p><code>TF-IDF = TF(word in doc) · log(N / DF(word))</code></p>
<p>Common words (the, is) get low weight. Rare-but-document-specific words (telecom, churn) get high weight.</p>
<div class="example-box"><pre>from sklearn.feature_extraction.text import TfidfVectorizer
vec = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
X = vec.fit_transform(documents)   # sparse matrix
model = LogisticRegression().fit(X, y)</pre></div>
<p>TF-IDF + logistic regression is a strong baseline for text classification. Beat it before reaching for transformers.</p>
` },
        { icon: "📺", title: "Watch: NLP Pipelines Explained", video: "https://www.youtube.com/watch?v=fNxaJsNG3-s", videoTitle: "Jay Alammar — Illustrated Word2Vec & NLP intro", content: `
<p>Jay Alammar's visual explanations of NLP concepts are the benchmark.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Tokenization:</div>
<ol class="quiz-options" type="A"><li>Encoding</li><li>Splitting text into tokens (words/subwords)</li><li>Removing stop words</li><li>Lowercasing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> First step of NLP preprocessing.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Stemming vs lemmatization:</div>
<ol class="quiz-options" type="A"><li>Identical</li><li>Stemming chops suffixes; lemmatization maps to dictionary form</li><li>Stemming is slower</li><li>Only for English</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Stemming is faster but lossier.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. TF-IDF downweights:</div>
<ol class="quiz-options" type="A"><li>Rare words</li><li>Common words appearing across many documents</li><li>Numbers</li><li>Long words</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Common words carry less distinctive signal.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Why NOT remove stop words for all tasks?</div>
<ol class="quiz-options" type="A"><li>Always remove them</li><li>Context-sensitive tasks (sentiment, machine translation) need them</li><li>They're cheap</li><li>They don't matter</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "Not good" vs "good" flips meaning.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Modern default tokenization approach:</div>
<ol class="quiz-options" type="A"><li>Whitespace</li><li>Subword (BPE, WordPiece, SentencePiece)</li><li>Character-level only</li><li>Regex</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Handles rare/unknown words gracefully.</div>
</div>
` }
      ]
    },

    "7-2": {
      title: "Word Embeddings",
      subtitle: "Module 7, Class 2 — Word2Vec, GloVe, semantic similarity",
      sections: [
        { icon: "🌐", title: "Words as Vectors", content: `
<p>TF-IDF treats each word as an independent index. It can't tell you that "king" and "queen" are related, or that "Tashkent" and "Samarkand" are cities.</p>
<p><strong>Word embeddings</strong> represent each word as a dense vector (usually 100-300 dimensions). Similar words end up near each other in the space.</p>
<p>The famous example: <code>king - man + woman ≈ queen</code>. Word vectors capture analogies as arithmetic.</p>
` },
        { icon: "📚", title: "How Embeddings Are Learned", content: `
<ul>
<li><strong>Word2Vec (skip-gram)</strong> — predict surrounding words given a target. Words appearing in similar contexts get similar vectors.</li>
<li><strong>GloVe</strong> — factorize a co-occurrence matrix. Similar outcome, different training.</li>
<li><strong>FastText</strong> — like Word2Vec but represents words as sums of character n-grams. Handles typos and unknown words.</li>
</ul>
<p>These are <strong>static</strong> embeddings — the vector for "bank" is the same whether it means riverbank or money. Modern contextual embeddings (BERT) fix this.</p>
<div class="example-box"><pre>import gensim.downloader as api
model = api.load("word2vec-google-news-300")
model.most_similar("king")
# [("queen", 0.65), ("prince", 0.62), ...]
model.most_similar(positive=["king", "woman"], negative=["man"])
# [("queen", 0.71), ...]</pre></div>
` },
        { icon: "🎯", title: "Using Embeddings in Models", content: `
<p>Three patterns:</p>
<ol>
<li><strong>Pretrained lookup</strong> — download Word2Vec/GloVe vectors, use them as features.</li>
<li><strong>Trainable embedding layer</strong> — initialize randomly or from pretrained, train end-to-end with your model.</li>
<li><strong>Contextual (BERT)</strong> — modern default. Different vector per occurrence based on context.</li>
</ol>
<div class="example-box"><pre># Keras embedding layer
model = Sequential([
    layers.Embedding(vocab_size, 100, input_length=max_len),
    layers.GlobalAveragePooling1D(),
    layers.Dense(1, activation="sigmoid")
])</pre></div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Word embedding purpose:</div>
<ol class="quiz-options" type="A"><li>Compression</li><li>Represent words as dense vectors capturing meaning</li><li>Encryption</li><li>Tokenization</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Semantic similarity shows up as geometric closeness.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Word2Vec skip-gram predicts:</div>
<ol class="quiz-options" type="A"><li>Next word only</li><li>Context words given a target</li><li>Sentiment</li><li>Part of speech</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "Train on surroundings" → words with similar contexts get similar vectors.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Static embeddings fail when:</div>
<ol class="quiz-options" type="A"><li>Words are rare</li><li>The same word has multiple meanings (bank, bat)</li><li>Text is long</li><li>Too many words</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> One vector for all meanings. Contextual embeddings fix this.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. FastText handles typos because:</div>
<ol class="quiz-options" type="A"><li>Spell check</li><li>It builds word vectors from character n-grams</li><li>Size</li><li>Deep learning</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Subword info → graceful fallback for unknown/misspelled words.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Analogies like king-man+woman≈queen work because:</div>
<ol class="quiz-options" type="A"><li>Coincidence</li><li>Consistent vector offsets encode relations</li><li>Dictionary</li><li>Clustering</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "Gender" vector ≈ same direction across pairs.</div>
</div>
` }
      ]
    },

    "7-3": {
      title: "Transformers and Attention",
      subtitle: "Module 7, Class 3 — Self-attention, BERT, GPT architecture",
      sections: [
        { icon: "🎯", title: "The Attention Mechanism", content: `
<p>RNNs process sequentially, one token at a time. Transformers process the whole sequence in parallel using <strong>attention</strong> — a mechanism that lets every token look at every other token to decide what's relevant.</p>
<p>The core operation: given query, key, and value matrices, compute:</p>
<p><code>Attention(Q, K, V) = softmax(QKᵀ / √d) · V</code></p>
<p>In plain terms: "score how well each position matches the others, weight the values accordingly."</p>
<p>Self-attention does this within a single sequence. Each position learns which other positions matter for understanding it.</p>
` },
        { icon: "🏗️", title: "Transformer Architecture", content: `
<ul>
<li><strong>Encoder</strong> — processes input sequence. Used in BERT.</li>
<li><strong>Decoder</strong> — generates output one token at a time. Used in GPT.</li>
<li><strong>Encoder-decoder</strong> — original Transformer paper, used for translation (T5, BART).</li>
</ul>
<h4>Key families</h4>
<ul>
<li><strong>BERT (2018)</strong> — bidirectional encoder, pretrained by masking random tokens. Great for classification, NER, Q&amp;A.</li>
<li><strong>GPT</strong> — decoder-only, pretrained to predict the next token. Great for generation.</li>
<li><strong>T5, FLAN</strong> — encoder-decoder, frame every task as text-to-text.</li>
</ul>
` },
        { icon: "🛠️", title: "Using Transformers in Practice", content: `
<p>Almost nobody trains transformers from scratch. Use Hugging Face:</p>
<div class="example-box"><pre>from transformers import pipeline

classifier = pipeline("sentiment-analysis")
classifier("I love this course!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Fine-tune for your data:
from transformers import AutoModelForSequenceClassification, AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=2
)</pre></div>
<div class="info-box"><strong>DistilBERT</strong> is smaller and faster than BERT. Usually the right tradeoff unless you need max accuracy.</div>
` },
        { icon: "📺", title: "Watch: Transformers Visually Explained", video: "https://www.youtube.com/watch?v=wjZofJX0v4M", videoTitle: "3Blue1Brown — Attention in Transformers", content: `
<p>The best visual explanation of self-attention. Makes Q, K, V tangible.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Attention lets each token:</div>
<ol class="quiz-options" type="A"><li>Ignore others</li><li>Attend to every other token with learned weights</li><li>Replicate</li><li>Average</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Weighted connections to all positions.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. BERT is:</div>
<ol class="quiz-options" type="A"><li>Decoder only</li><li>Encoder only, bidirectional</li><li>Encoder-decoder</li><li>RNN-based</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Encoder, pretrained by masked language modeling.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. GPT is:</div>
<ol class="quiz-options" type="A"><li>Encoder only</li><li>Decoder only, autoregressive</li><li>Encoder-decoder</li><li>CNN</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Trained to predict next token.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Why transformers beat RNNs for NLP?</div>
<ol class="quiz-options" type="A"><li>Smaller</li><li>Parallelizable, capture long-range dependencies via attention</li><li>Simpler</li><li>Older</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Attention solves both problems at once.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. In production, start with:</div>
<ol class="quiz-options" type="A"><li>Scratch-trained transformer</li><li>Pretrained via Hugging Face, fine-tune</li><li>RNN</li><li>Word2Vec</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Transfer learning dominates NLP.</div>
</div>
` }
      ]
    },

    "7-4": {
      title: "Computer Vision Fundamentals",
      subtitle: "Module 7, Class 4 — Object detection, segmentation, YOLO",
      sections: [
        { icon: "👁️", title: "Beyond Classification", content: `
<p>Classification answers "what's in this image?" Computer vision has deeper questions:</p>
<ul>
<li><strong>Object detection</strong> — "what's here AND where?" Output: bounding boxes with labels.</li>
<li><strong>Semantic segmentation</strong> — per-pixel class labels. "This pixel is road, that pixel is car."</li>
<li><strong>Instance segmentation</strong> — per-object masks. Distinguishes individual cars, not just "car pixels."</li>
<li><strong>Keypoint detection</strong> — find specific points (face landmarks, pose joints).</li>
</ul>
` },
        { icon: "🎯", title: "Object Detection Architectures", content: `
<ul>
<li><strong>Two-stage (Faster R-CNN)</strong> — propose regions, classify. Accurate, slower.</li>
<li><strong>One-stage (YOLO, SSD)</strong> — predict boxes in a single forward pass. Fast, real-time.</li>
<li><strong>Transformer-based (DETR)</strong> — use attention for detection. Increasingly the modern default.</li>
</ul>
<p>YOLO is the default for practical work — real-time, good accuracy, well-supported.</p>
<div class="example-box"><pre>from ultralytics import YOLO
model = YOLO("yolov8n.pt")   # nano version, ~6MB
results = model("street_photo.jpg")
results[0].show()</pre></div>
` },
        { icon: "🖼️", title: "Segmentation", content: `
<ul>
<li><strong>U-Net</strong> — encoder-decoder with skip connections, the go-to for medical imaging.</li>
<li><strong>Mask R-CNN</strong> — adds a mask head to Faster R-CNN for instance segmentation.</li>
<li><strong>Segment Anything (SAM)</strong> — a recent foundation model that segments arbitrary objects from a single click.</li>
</ul>
<div class="info-box"><strong>For a Tashkent application:</strong> counting cars at intersections via YOLO on CCTV footage, segmenting cotton fields from satellite imagery via U-Net. Both are practical and well-documented.</div>
` },
        { icon: "📺", title: "Watch: YOLO Explained", video: "https://www.youtube.com/watch?v=svn9-xV7wjk", videoTitle: "YOLO object detection crash course", content: `
<p>Practical overview of YOLO with code and real detections.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Object detection outputs:</div>
<ol class="quiz-options" type="A"><li>One class per image</li><li>Bounding boxes with class labels</li><li>Pixel masks</li><li>Keypoints</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "What and where."</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Semantic vs instance segmentation:</div>
<ol class="quiz-options" type="A"><li>Identical</li><li>Semantic labels pixels by class; instance distinguishes individual objects</li><li>Only for video</li><li>Instance is faster</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Semantic: "car pixels." Instance: "car #1, car #2."</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. YOLO is:</div>
<ol class="quiz-options" type="A"><li>Two-stage</li><li>Single-stage, real-time</li><li>Transformer</li><li>Classifier only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> "You Only Look Once."</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. U-Net is famous for:</div>
<ol class="quiz-options" type="A"><li>Classification</li><li>Segmentation, especially medical imaging</li><li>Object detection</li><li>GANs</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Encoder-decoder with skip connections.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Counting cars at intersections, real-time — pick:</div>
<ol class="quiz-options" type="A"><li>U-Net</li><li>YOLO</li><li>ResNet classifier</li><li>DETR</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Fast, accurate, easy to deploy.</div>
</div>
` }
      ]
    },

    "7-5": {
      title: "LLMs and Prompt Engineering",
      subtitle: "Module 7, Class 5 — Working with large language models",
      sections: [
        { icon: "🧠", title: "What LLMs Are Good At", content: `
<p>Large Language Models (GPT-4, Claude, Gemini, Llama) are decoder transformers with billions of parameters, pretrained on trillions of tokens. They can:</p>
<ul>
<li>Summarize, rewrite, translate.</li>
<li>Answer questions given context.</li>
<li>Generate code, SQL, JSON.</li>
<li>Classify or extract when you describe the task.</li>
<li>Follow multi-step instructions.</li>
</ul>
<p>What they're bad at (out of the box):</p>
<ul>
<li>Arithmetic beyond a few digits.</li>
<li>Knowing recent facts — training cutoff limits them.</li>
<li>Citing sources they didn't see.</li>
<li>Doing exactly what you meant (vs what you said).</li>
</ul>
` },
        { icon: "💬", title: "Prompt Engineering Basics", content: `
<ul>
<li><strong>Be specific.</strong> "Summarize in 3 bullet points, under 50 words each" &gt; "summarize this."</li>
<li><strong>Provide examples (few-shot).</strong> Show 2-3 examples of input→output. Accuracy jumps.</li>
<li><strong>Assign a role.</strong> "You are an experienced Uzbek customer support agent" anchors style and tone.</li>
<li><strong>Break complex tasks</strong> into steps. Chain of thought: "Let's think step by step" often improves reasoning.</li>
<li><strong>Specify output format.</strong> "Return JSON with fields: intent, sentiment, confidence." Easier to parse downstream.</li>
</ul>
` },
        { icon: "🔗", title: "RAG and Tools", content: `
<p>Two patterns that extend what LLMs can do:</p>
<ul>
<li><strong>Retrieval-Augmented Generation (RAG)</strong> — fetch relevant documents from a vector store, give them to the LLM as context. Grounded answers with citations.</li>
<li><strong>Tool use / function calling</strong> — LLM decides to call a calculator, database, or API. Handles tasks LLMs can't do alone.</li>
</ul>
<div class="case-study"><h4>This course's bot</h4><p>The <a href="https://t.me/lossfunction_bot" target="_blank">@lossfunction_bot</a> is RAG-based: it retrieves from the course materials and uses an LLM to guide students (not answer directly) when they ask concept questions.</p></div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. LLMs are decoder transformers trained on:</div>
<ol class="quiz-options" type="A"><li>Code only</li><li>Trillions of tokens of web text and more</li><li>Labeled datasets</li><li>Images</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Massive pretraining → general language understanding.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Few-shot prompting means:</div>
<ol class="quiz-options" type="A"><li>Short prompts</li><li>Providing a few input→output examples in the prompt</li><li>Low-rank fine-tuning</li><li>Small model</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Demonstrations steer behavior at inference time.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. LLM can't do arithmetic well. Solution?</div>
<ol class="quiz-options" type="A"><li>Retrain</li><li>Give it a calculator tool via function calling</li><li>Bigger model</li><li>Nothing</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Tool use outsources the task to a deterministic system.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. RAG stands for:</div>
<ol class="quiz-options" type="A"><li>Random Attention Gradient</li><li>Retrieval-Augmented Generation</li><li>Recurrent Attention Gate</li><li>Rich Answer Generator</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Retrieve → augment prompt → generate.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best way to ensure parseable output:</div>
<ol class="quiz-options" type="A"><li>Ask nicely</li><li>Specify exact output format (JSON schema)</li><li>Post-process</li><li>Use bigger model</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Explicit format in prompt drastically improves reliability.</div>
</div>
` }
      ]
    },

    "7-6": {
      title: "Lab: NLP or CV Project",
      subtitle: "Module 7, Class 6 — Sentiment analysis or object detection",
      sections: [
        { icon: "🎯", title: "Choose Your Path", content: `
<p>Pick one of two labs. Work individually or in pairs.</p>
<div class="tool-grid">
<a class="tool-card" href="https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews" target="_blank" rel="noopener"><h5>NLP Path — Sentiment Analysis</h5><p>50k IMDB reviews. Train a transformer to classify positive/negative. Target 90%+ accuracy.</p></a>
<a class="tool-card" href="https://cocodataset.org" target="_blank" rel="noopener"><h5>CV Path — Object Detection</h5><p>Use pretrained YOLO to detect objects in 20 street photos of Tashkent. Count vehicles vs people.</p></a>
</div>
` },
        { icon: "📝", title: "NLP Tasks", content: `
<ol>
<li>Load data. Baseline: TF-IDF + LogisticRegression. Record accuracy.</li>
<li>Load DistilBERT via Hugging Face. Tokenize. Fine-tune for 2-3 epochs.</li>
<li>Evaluate on test set. Compare to baseline.</li>
<li>Inspect 20 misclassifications. What trips the model up?</li>
<li>Write: when is TF-IDF "good enough"? When is a transformer worth the cost?</li>
</ol>
` },
        { icon: "📝", title: "CV Tasks", content: `
<ol>
<li>Collect 20 street photos (your own, or download Tashkent street images).</li>
<li>Run YOLOv8n on each. Save annotated output images.</li>
<li>Count detections per class per image.</li>
<li>Find 3 failure cases: what objects were missed? False positives?</li>
<li>Write: for a real deployment (traffic counting), what additional data/training would you need?</li>
</ol>
` },
        { icon: "📋", title: "Checkpoint Quiz", content: `
<div class="quiz-item">
<div class="quiz-q">1. Why run a TF-IDF baseline before a transformer?</div>
<ol class="quiz-options" type="A"><li>Tradition</li><li>Know the simple baseline so you can justify the transformer's cost</li><li>Required</li><li>Faster training</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Don't pay for complexity you don't need.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. DistilBERT vs BERT:</div>
<ol class="quiz-options" type="A"><li>Identical</li><li>Smaller, faster, ~97% of BERT performance</li><li>Bigger</li><li>Older</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Usually the right tradeoff.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. YOLOv8n "n" means:</div>
<ol class="quiz-options" type="A"><li>New</li><li>Nano — smallest, fastest variant</li><li>Normal</li><li>Noisy</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Scaling suffix: n, s, m, l, x.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Misclassification inspection reveals:</div>
<ol class="quiz-options" type="A"><li>Nothing useful</li><li>Failure modes, label errors, data gaps</li><li>Overfitting only</li><li>Speed issues</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Always instructive.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Pretrained YOLO on Tashkent streets: what might go wrong?</div>
<ol class="quiz-options" type="A"><li>Nothing</li><li>Domain shift — COCO classes miss local vehicles/signs</li><li>Too fast</li><li>Too accurate</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Pretraining data matters. Plan for local fine-tuning.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_7_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[7] = true;
})();
