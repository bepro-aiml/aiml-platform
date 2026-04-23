// ============================================================
// MODULE 1 CONTENT — Introduction to AI and ML (5 classes)
// Loaded dynamically by app.js when the student opens Module 1.
// Registers class content onto COURSE_DATA.classContent.
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module1.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_1_CONTENT = {
  "1-1": {
    title: "What is AI?",
    subtitle: "Module 1, Class 1 — History, AI vs ML vs DL, types of ML",
    sections: [
      {
        icon: "🚀",
        title: "Your First ML Model",
        video: "aircAruvnKk",
        videoTitle: "3Blue1Brown — But what is a neural network?",
        content: `
<p>Before any theory, let's see ML in action. In our live session, we open Google Colab and paste five lines of Python code:</p>
<div class="info-box">
<strong>The 5-line demo:</strong> Load a small dataset, split it, train a Random Forest classifier, make predictions on new data, and print the results. Total time: under 60 seconds.
</div>
<p>What just happened in those five lines?</p>
<ol>
<li><strong>We loaded data</strong> — input examples with known answers (labeled data)</li>
<li><strong>We trained a model</strong> — the algorithm found patterns on its own, without us writing any rules</li>
<li><strong>We made predictions</strong> — the model applied what it learned to data it had never seen</li>
</ol>
<p>You don't fully understand it yet, and that's completely fine. By Module 4, you'll build this from scratch and know exactly what every line does. For now, the takeaway: ML is not magic. It's data in, patterns found, predictions out.</p>
`
      },
      {
        icon: "🤖",
        title: "What is AI?",
        video: "f_uwKZIAeM0",
        videoTitle: "What is Machine Learning?",
        content: `
<p><strong>Artificial Intelligence</strong> is the broad field of building systems that perform tasks normally requiring human intelligence: perception, reasoning, learning, decision-making, and language understanding.</p>
<p>Key insight: AI is not a single technology. It's an umbrella term covering everything from simple rule-based systems to self-driving cars. It exists on a spectrum:</p>
<ul>
<li><strong>Narrow AI (where we are today)</strong> — systems that do one specific task well. Your phone's face unlock, Gmail's spam filter, Google Translate, YouTube recommendations. Each is impressive at its job but useless at anything else. Your spam filter cannot drive a car.</li>
<li><strong>General AI (theoretical)</strong> — a system with human-level reasoning across all domains. It could write code, compose music, diagnose diseases, and hold a conversation — all with one model. This does not exist yet, and there is serious debate about whether it ever will.</li>
</ul>
<p>When people hear "AI," they often think of movie AI — Terminator, JARVIS, HAL 9000. Real-world AI is less dramatic but far more useful: keyboard predictions, search engines, navigation apps, recommendation systems. You probably used AI a dozen times today without noticing.</p>
`
      },
      {
        icon: "📅",
        title: "AI Timeline",
        video: "UwsrzCVZAb8",
        videoTitle: "The Future of AI",
        content: `
<p>AI has a long and bumpy history. Understanding the timeline helps you see why the field moves in waves of hype and disappointment.</p>
<div class="timeline">
<div class="timeline-item">
<div class="timeline-year">1950</div>
<div class="timeline-text"><strong>Turing Test</strong> — Alan Turing publishes "Computing Machinery and Intelligence," asking: "Can machines think?" He proposes a test: if a human can't tell whether they're chatting with a person or a machine, the machine is "intelligent."</div>
</div>
<div class="timeline-item">
<div class="timeline-year">1956</div>
<div class="timeline-text"><strong>Dartmouth Conference</strong> — AI gets its name. Researchers gather and declare that every aspect of learning can, in principle, be described precisely enough for a machine to simulate it. Massive optimism follows.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">1960s-70s</div>
<div class="timeline-text"><strong>Early optimism</strong> — Rule-based systems, early natural language processing. Researchers predict human-level AI within 20 years. They were wrong.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">1974-1980</div>
<div class="timeline-text"><strong>First AI Winter</strong> — Funding dries up. Systems couldn't handle real-world complexity. Overpromised, underdelivered. A painful lesson for the field.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">1980s</div>
<div class="timeline-text"><strong>Expert Systems</strong> — A brief boom in systems encoding human expert knowledge as rules. Banks, hospitals, and factories adopt them. Then the limitations appear, and the second winter arrives.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">1997</div>
<div class="timeline-text"><strong>Deep Blue</strong> — IBM's chess computer defeats world champion Garry Kasparov. A landmark moment, but Deep Blue was brute-force search, not learning.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">2012</div>
<div class="timeline-text"><strong>AlexNet</strong> — A deep neural network crushes the ImageNet competition, cutting error rates nearly in half. Deep learning goes mainstream. The GPU revolution begins.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">2016</div>
<div class="timeline-text"><strong>AlphaGo</strong> — DeepMind's system beats world champion Lee Sedol at Go, a game with more possible positions than atoms in the universe. Unlike chess, this required genuine intuition-like pattern recognition.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">2022</div>
<div class="timeline-text"><strong>ChatGPT</strong> — OpenAI launches ChatGPT, bringing large language models to the mainstream. Reaches 100 million users faster than any product in history. The LLM revolution begins.</div>
</div>
<div class="timeline-item">
<div class="timeline-year">2024-2026</div>
<div class="timeline-text"><strong>The Current Wave</strong> — GPT-4o, Claude (Opus, Sonnet, Haiku), Gemini, Llama 3, and dozens more. Reasoning models, agentic AI, multimodal systems. AI is no longer a niche research topic — it's infrastructure.</div>
</div>
</div>
<p>Notice the pattern: hype, disappointment, real progress. Each "winter" was followed by a breakthrough that exceeded earlier expectations. Today we're in the biggest boom yet — but the fundamentals still matter more than the hype.</p>
`
      },
      {
        icon: "🇺🇿",
        title: "AI in Uzbekistan",
        content: `
<p>AI isn't just a Silicon Valley story. It's already here in Uzbekistan, and growing fast:</p>
<ul>
<li><strong>Government policy:</strong> Presidential decree on AI development (2023) set a national strategy. Digital transformation is a stated priority, with e-government portals and digital ID systems already in production.</li>
<li><strong>Telecom (Uztelecom):</strong> AI-powered chatbots handling customer queries in Uzbek and Russian. Churn prediction models flag at-risk subscribers daily for the retention team. Network monitoring uses anomaly detection.</li>
<li><strong>Banking (Kapitalbank, Uzum):</strong> Fraud detection on digital payments. Credit scoring models. Transaction monitoring across Payme, Click, and Uzum Bank.</li>
<li><strong>Agriculture:</strong> Satellite imagery analysis for crop monitoring. Predictive models for irrigation timing and yield estimation. Uzbekistan's cotton sector is a prime candidate for ML optimization.</li>
<li><strong>Opportunity:</strong> Uzbekistan has a young, tech-literate population and growing internet penetration. The country is in a position to adopt AI practices without legacy baggage — learning from other countries' mistakes rather than repeating them.</li>
</ul>
<p>By the end of this course, you'll have the skills to contribute to these real projects happening right now in Uzbekistan.</p>
`
      },
      {
        icon: "🎯",
        title: "AI vs ML vs Deep Learning",
        video: "4RixMPF4xis",
        videoTitle: "AI vs ML vs Deep Learning — Simplilearn",
        content: `
<p>These three terms are often used interchangeably, but they are not the same. Think of them as nested circles:</p>
<div class="info-box">
<strong>AI</strong> (outermost circle) — Any system that performs tasks requiring human intelligence. Includes rule-based systems, search algorithms, robotics, and everything below.<br><br>
<strong>Machine Learning</strong> (middle circle) — A subset of AI where systems learn from data instead of following hardcoded rules. You don't program the answer — you give it examples and let it find the pattern.<br><br>
<strong>Deep Learning</strong> (innermost circle) — A subset of ML that uses neural networks with many layers. Powers image recognition, speech processing, language models, and most recent breakthroughs.
</div>
<p>The key relationship: <strong>All deep learning is machine learning, and all machine learning is AI — but not the other way around.</strong></p>
<p>A rule-based spam filter ("if email contains 'free money,' mark as spam") is AI but not ML. A spam filter that learns from thousands of emails which patterns indicate spam — that's ML. A spam filter using a transformer architecture trained on millions of emails — that's deep learning.</p>
<p>In this course, we'll spend most of our time in the ML circle, with Module 6 diving into the deep learning circle.</p>
`
      },
      {
        icon: "🔀",
        title: "Three Types of Machine Learning",
        video: "1rDNKIJdSaA",
        videoTitle: "Types of Machine Learning — StatQuest Intro",
        content: `
<p>All machine learning approaches fall into three categories, defined by the type of data they learn from and the feedback they receive:</p>

<h4>1. Supervised Learning — Learning with a Teacher</h4>
<p>You give the model <strong>labeled data</strong>: inputs paired with correct answers. The model learns the mapping from input to output.</p>
<ul>
<li><strong>Analogy:</strong> A teacher shows you 1,000 photos of cats and dogs, each labeled. After studying them, you can classify new photos.</li>
<li><strong>Examples:</strong> Spam detection (email → spam/not spam), house price prediction (features → price), medical diagnosis (symptoms → disease), churn prediction (customer data → will churn/won't churn).</li>
<li><strong>Key point:</strong> You need labels, and getting labels is expensive. Someone had to manually label those 1,000 photos.</li>
</ul>

<h4>2. Unsupervised Learning — Finding Patterns Alone</h4>
<p>No labels. The model gets <strong>raw data</strong> and must find structure, patterns, or groupings on its own.</p>
<ul>
<li><strong>Analogy:</strong> Given 1,000 unlabeled animal photos, the model groups similar-looking ones together. It doesn't know they're "cats" and "dogs" — it just sees two clusters of similar images.</li>
<li><strong>Examples:</strong> Customer segmentation (group users by behavior), anomaly detection (find unusual transactions), topic modeling (discover themes in documents).</li>
<li><strong>Key point:</strong> Useful when you don't have labels or don't even know what categories exist in your data.</li>
</ul>

<h4>3. Reinforcement Learning — Trial and Error with Rewards</h4>
<p>An agent takes actions in an environment and receives <strong>rewards or penalties</strong>. It learns the strategy that maximizes total reward over time.</p>
<ul>
<li><strong>Analogy:</strong> A child learning to ride a bicycle. No one explains the physics — they try, fall, adjust, try again. Staying upright = reward. Falling = penalty.</li>
<li><strong>Examples:</strong> AlphaGo (learning Go strategy), self-driving cars (navigating traffic), robotics (learning to walk), game AI (learning to beat levels).</li>
<li><strong>Key point:</strong> Requires an environment to interact with and a clear reward signal. Powerful but hard to set up.</li>
</ul>

<div class="info-box">
<strong>Quick test:</strong> If you have labeled data → supervised. If you have unlabeled data and want structure → unsupervised. If you have an environment with rewards → reinforcement.
</div>
`
      },
      {
        icon: "🧭",
        title: "How to Choose",
        content: `
<p>When you face a new ML problem, here's the decision logic:</p>
<ol>
<li><strong>Do you have labeled data?</strong>
  <ul>
  <li>Yes → <strong>Supervised learning.</strong> Are you predicting a category (spam/not spam) or a number (house price)? Category = classification. Number = regression.</li>
  <li>No → Go to step 2.</li>
  </ul>
</li>
<li><strong>Do you want to find groups or patterns?</strong>
  <ul>
  <li>Yes → <strong>Unsupervised learning.</strong> Clustering, dimensionality reduction, or anomaly detection.</li>
  <li>No → Go to step 3.</li>
  </ul>
</li>
<li><strong>Do you have an environment with actions and feedback?</strong>
  <ul>
  <li>Yes → <strong>Reinforcement learning.</strong></li>
  <li>No → You may need to rethink the problem or collect different data.</li>
  </ul>
</li>
</ol>
<div class="example-box">
<strong>Uzbekistan examples:</strong><br>
"Predict which Uztelecom customers will churn" → supervised (classification, you have historical labels).<br>
"Group Uzum shoppers by purchasing behavior" → unsupervised (no predefined groups).<br>
"Train a robot to navigate a warehouse" → reinforcement (environment + rewards).
</div>
`
      },
      {
        icon: "💬",
        title: "Discussion Questions",
        content: `
<div class="discussion-box">
<h4>Think about these before next class:</h4>
<ol>
<li>Name three AI systems you used today. Were they narrow or general AI?</li>
<li>Why did AI have "winters"? What changed to end them?</li>
<li>Pick one sector in Uzbekistan. How could ML improve it?</li>
<li>A friend says "AI will take all our jobs." How do you respond?</li>
<li>What's the difference between a rule-based system and a machine learning system? When would you prefer each?</li>
</ol>
</div>
`
      }
    ]
  },

  "1-2": {
    title: "Foundations",
    subtitle: "Module 1, Class 2 — Probability, statistics, gradient descent, ML workflow",
    sections: [
      {
        icon: "🧮",
        title: "Why Math Matters",
        content: `
<p>ML is powered by math under the hood. But here's the good news: you need <strong>intuition, not formulas</strong>.</p>
<p>Think of it like driving a car. You don't need to be a mechanical engineer who can build an engine from scratch. But knowing that the car burns fuel, that brakes work through friction, and that tires grip differently on wet roads — that makes you a much better driver.</p>
<p>Same with ML. You don't need to derive gradient descent equations by hand. But understanding <em>what</em> a model is doing and <em>why</em> it works (or doesn't) — that's what separates someone who uses ML tools from someone who understands ML.</p>
<p>Today is the appetizer. Module 2 is the full meal, where you'll code these concepts in Python. For now, we build the mental models.</p>
`
      },
      {
        icon: "🎲",
        title: "Probability",
        video: "pYxNSUDSFH4",
        videoTitle: "StatQuest — Probability is not Likelihood",
        content: `
<p>Every ML prediction is fundamentally a <strong>confidence score</strong>, not a yes/no answer.</p>
<p>Probability runs from 0 (impossible) to 1 (certain), with 0.5 being a coin flip — maximum uncertainty.</p>
<ul>
<li><strong>Gmail spam filter:</strong> "This email is 87% likely to be spam." Not a binary decision — a confidence level. Gmail decides the threshold (usually ~95%) above which it moves the email to spam.</li>
<li><strong>Weather app:</strong> "70% chance of rain tomorrow." That means: out of many days with similar atmospheric conditions, about 70% had rain.</li>
<li><strong>Face unlock:</strong> "Match confidence: 94%." Your phone decides what threshold is secure enough.</li>
<li><strong>Uztelecom churn model:</strong> "This customer is 82% likely to leave in the next 30 days." The retention team decides which probability threshold triggers an intervention call.</li>
</ul>
<div class="info-box">
<strong>Everyday intuition:</strong> If the weather app says 30% chance of rain, do you bring an umbrella? Your brain already does probability math all day. ML models do the same thing — faster, at scale, on thousands of variables simultaneously.
</div>
`
      },
      {
        icon: "📊",
        title: "Distributions",
        video: "rzFX5NWojp0",
        videoTitle: "StatQuest — The Normal Distribution",
        content: `
<p>A distribution describes <strong>the shape of your data</strong> — how values are spread out. The shape tells you how to model the data.</p>
<ul>
<li><strong>Uniform distribution:</strong> Every outcome equally likely. Rolling a fair die — each number (1-6) has a 1/6 chance. Rare in real data.</li>
<li><strong>Normal distribution (bell curve):</strong> Most values cluster near the average, with fewer and fewer values as you move away. Human heights, test scores, measurement errors. The most common distribution in nature.</li>
<li><strong>Skewed distribution:</strong> A long tail on one side. Income, call durations, YouTube views, city populations. A few extreme values pull the tail out.</li>
</ul>
<div class="example-box">
<strong>Real example:</strong> Most Uztelecom customer calls last under 3 minutes. But some calls — usually complaints or technical support — last 30-60 minutes. That long tail is a skewed distribution. If you ignore the skew and just look at the average, you'll design your call center wrong.
</div>
<p>Similarly, most Uzum orders are small (groceries, snacks), but a few are large electronics purchases. The shape of this distribution affects how you build a recommendation engine, how you detect fraud, and how you set business thresholds.</p>
`
      },
      {
        icon: "📏",
        title: "Mean vs Median",
        video: "qBigTkBLU6g",
        videoTitle: "StatQuest — Histograms",
        content: `
<p><strong>Mean</strong> = add everything up, divide by the count. The "average" people usually refer to.</p>
<p><strong>Median</strong> = sort all values, pick the middle one. The value where half are above and half are below.</p>
<p>They often tell very different stories:</p>
<div class="example-box">
<strong>Uzbekistan salary example:</strong><br>
Mean monthly salary: ~8 million soum<br>
Median monthly salary: ~4.5 million soum<br><br>
Why the gap? A small number of high earners (executives, IT specialists, business owners) pull the mean upward. The median stays grounded — it represents what the typical person actually earns.
</div>
<p>Here's a thought experiment: if Elon Musk walks into a small Tashkent cafe with 10 people, the "average" net worth inside instantly jumps to billions. Did everyone suddenly get richer? No. The median barely moves — still reflecting reality.</p>
<p><strong>Rule of thumb:</strong> For skewed data (income, house prices, company sizes), always report the median. For symmetric data (test scores, heights), mean and median are similar, and either works.</p>
<p>In ML, this matters when you preprocess data. If you fill in missing salary values with the mean, you're inserting an inflated number. The median is often safer.</p>
`
      },
      {
        icon: "📐",
        title: "Standard Deviation",
        content: `
<p>Standard deviation (SD) measures <strong>how spread out</strong> values are around the mean. Small SD = values clustered tight. Large SD = values scattered wide.</p>
<div class="example-box">
<strong>Two classrooms, same average test score of 70:</strong><br><br>
<strong>Class A:</strong> Everyone scored between 65 and 75. Tight cluster. Small SD.<br>
<strong>Class B:</strong> Half scored around 30, half scored around 100. Same mean of 70, but wildly different reality. Large SD.
</div>
<p>If someone tells you "the average is 70," your first question should be: "What's the spread?" Without SD, the mean is only half the picture.</p>
<p>In ML, standard deviation helps you:</p>
<ul>
<li><strong>Detect outliers:</strong> Values more than 2-3 SDs from the mean are unusual and worth investigating.</li>
<li><strong>Normalize features:</strong> When one feature ranges 0-1 and another ranges 0-1,000,000, the model gets confused. Scaling by SD puts features on equal footing.</li>
<li><strong>Evaluate model confidence:</strong> A model with low SD in its predictions is consistent. High SD means it's unreliable.</li>
</ul>
`
      },
      {
        icon: "🔗",
        title: "Correlation vs Causation",
        video: "xZ_z8KWkhXE",
        videoTitle: "StatQuest — Correlation vs Causation",
        content: `
<p><strong>Correlation</strong> measures how strongly two variables move together. Scale from -1 to +1:</p>
<ul>
<li><strong>+1:</strong> Perfectly move together (height and shoe size)</li>
<li><strong>-1:</strong> Perfectly move opposite (speed and travel time)</li>
<li><strong>0:</strong> No relationship (shoe size and math grades)</li>
</ul>
<p>ML models hunt for correlations in data to make predictions. But here's the critical trap:</p>
<div class="case-study">
<h4>Correlation is NOT causation</h4>
<p>Ice cream sales and drowning deaths both rise in summer. Does ice cream cause drowning? Obviously not. The hidden variable is <strong>hot weather</strong> — it makes people both eat ice cream and go swimming.</p>
<p>Always ask: <strong>"What third thing could explain both?"</strong></p>
</div>
<p>This matters in ML because models find correlations, not causes. A model might discover that people who own boats have higher incomes — but buying someone a boat won't make them rich. The model is technically correct (boat ownership correlates with income) but the interpretation is wrong.</p>
<div class="info-box">
<strong>Fun resource:</strong> <a href="https://www.tylervigen.com/spurious-correlations" target="_blank">tylervigen.com/spurious-correlations</a> — a collection of absurd but real correlations, like the near-perfect correlation between US spending on science and suicides by hanging. Obviously unrelated, but the data says otherwise.
</div>
`
      },
      {
        icon: "⛰️",
        title: "Gradient Descent",
        video: "IHZwWFHWa-w",
        videoTitle: "3Blue1Brown — Gradient Descent",
        content: `
<p>This is how ML models actually learn. The analogy:</p>
<div class="info-box">
<strong>Imagine you're blindfolded on a hilly landscape.</strong> Your goal: find the lowest valley. Strategy: feel the slope beneath your feet, take a step in the downhill direction, and repeat. Eventually, step by step, you reach the bottom.
</div>
<p>In ML terms:</p>
<ul>
<li>The <strong>"landscape"</strong> is the error surface — a mathematical representation of how wrong the model's predictions are for different parameter values.</li>
<li>The <strong>"height"</strong> at any point is the prediction error (called the loss function). Higher = worse predictions.</li>
<li>The <strong>"slope"</strong> is the gradient — the direction of steepest increase. You want to go the opposite way.</li>
<li>The <strong>"step size"</strong> is the learning rate — too big and you overshoot the valley, too small and it takes forever.</li>
<li>The <strong>"valley"</strong> is the optimal model — the parameter values that minimize prediction error.</li>
</ul>
<p>ML models do this with math, taking thousands of steps per second across landscapes with millions of dimensions. That's what "training" a model means: running gradient descent until the error stops decreasing.</p>
<div class="info-box">
<strong>Try it yourself:</strong> <a href="https://playground.tensorflow.org" target="_blank">playground.tensorflow.org</a> — an interactive neural network visualization where you can watch gradient descent happen in real time.
</div>
`
      },
      {
        icon: "🔄",
        title: "The ML Workflow",
        video: "BSpAWkQLlgM",
        videoTitle: "YouTube Recommendation Algorithm",
        content: `
<p>Every ML project follows the same six steps. This is the workflow you'll use for every project in this course and in your career:</p>
<ol>
<li><strong>Define the Problem</strong> — What are you predicting? Who will use it? What does success look like?
  <div class="example-box">Bad: "We want to use AI." Good: "Predict which subscribers will cancel within 30 days so the retention team can intervene."</div>
</li>
<li><strong>Collect Data</strong> — Where does it come from? Databases, APIs, sensors, surveys, web scraping? Is it enough? Is it representative?</li>
<li><strong>Prepare the Data</strong> — Clean, transform, engineer features. This step takes <strong>60-80% of total project time</strong>. No exceptions. Real data is messy: "Tashkent," "tashkent," "Tosh.," and "Тошкент" are the same city in four different formats.</li>
<li><strong>Build the Model</strong> — Pick an algorithm, train it on your prepared data. Start simple — a basic model often beats a fancy one. Complexity is not a goal.</li>
<li><strong>Evaluate</strong> — Test on data the model has never seen. <strong>Golden rule: never evaluate on training data.</strong> Split: 80% train, 20% test. Measure accuracy, precision, recall (details in Module 4).</li>
<li><strong>Deploy</strong> — A model in a Jupyter notebook is useless. Deploy means putting it on a server where real applications can query it in real time. Then monitor: models degrade as the world changes — retrain regularly.</li>
</ol>
<div class="info-box">
<strong>Important:</strong> This is not a linear process. You loop back constantly. Evaluation reveals problems that send you back to data preparation. Deployment reveals issues that send you back to modeling. Expect iteration, not a straight line.
</div>

<h4>Real Case: Uztelecom Churn Pipeline</h4>
<ul>
<li><strong>Problem:</strong> Predict who cancels within 30 days</li>
<li><strong>Data:</strong> Call logs, billing records, complaints, top-up history, plan type</li>
<li><strong>Prep:</strong> Clean records, create features like "days since last activity," "average monthly spend trend"</li>
<li><strong>Model:</strong> Supervised classification (Module 4)</li>
<li><strong>Evaluate:</strong> Test on last month's actual churners</li>
<li><strong>Deploy:</strong> Daily batch run → generates list of 1,000 at-risk customers → retention team calls them → save customers</li>
</ul>
`
      },
      {
        icon: "💬",
        title: "Discussion Questions",
        content: `
<div class="discussion-box">
<h4>Before next class:</h4>
<ol>
<li>A model has 95% accuracy on training data but 60% on test data. What happened?</li>
<li>Why does data preparation take 60-80% of the time?</li>
<li>Give an example of correlation that isn't causation from Uzbekistan context.</li>
<li>Watch: <a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank">3Blue1Brown gradient descent video</a> (21 min)</li>
<li>Play: <a href="https://playground.tensorflow.org" target="_blank">playground.tensorflow.org</a> (try the circle dataset)</li>
</ol>
</div>
`
      }
    ]
  },

  "1-3": {
    title: "ITES Applications",
    subtitle: "Module 1, Class 3 — Recommendations, fraud detection, chatbots, churn prediction",
    sections: [
      {
        icon: "🛒",
        title: "Recommendation Systems",
        video: "9gBC9R-msAE",
        videoTitle: "How Netflix Recommendations Work",
        content: `
<p>When Netflix suggests a show, when Uzum recommends a product, when Spotify creates your Discover Weekly — that's a recommendation system. These are among the most commercially valuable ML applications in the world.</p>

<h4>How It Works</h4>
<p>Two main approaches:</p>
<ul>
<li><strong>Collaborative filtering:</strong> "Users like you also liked..." The system finds people with similar tastes and recommends what they enjoyed. It doesn't need to understand the content at all — just patterns of who liked what.</li>
<li><strong>Content-based filtering:</strong> "Because you watched/bought this..." The system analyzes the properties of items you liked (genre, actors, price range) and finds similar items. It understands the content but not the social patterns.</li>
</ul>
<p>Modern systems use <strong>hybrid approaches</strong> that combine both, plus deep learning models that can capture complex patterns neither method alone would find.</p>

<h4>Why It Matters</h4>
<ul>
<li>Amazon: 35% of revenue comes from recommendations</li>
<li>Netflix: Estimates recommendations save $1 billion/year in customer retention</li>
<li>YouTube: 70% of watch time comes from recommended videos</li>
</ul>

<h4>What Makes It Hard</h4>
<ul>
<li><strong>Cold start problem:</strong> A new user has no history. A new product has no ratings. What do you recommend? You have zero signal to work with.</li>
<li><strong>Filter bubbles:</strong> The system shows you more of what you already like, narrowing your exposure. A news recommendation system might lock you into one political perspective.</li>
<li><strong>Data sparsity:</strong> Most users interact with a tiny fraction of available products. The user-product matrix is 99%+ empty.</li>
</ul>

<h4>Uzbekistan Example</h4>
<p><strong>Uzum</strong> (Uzbekistan's largest marketplace) faces all these challenges. With millions of products and rapidly growing users, their recommendation engine must handle Uzbek and Russian queries, understand local purchasing patterns (seasonal demand for non/bread, regional food preferences), and deal with the cold start problem as new sellers constantly join the platform.</p>
<p>Other local applications: <strong>Korzinka Go</strong> (grocery delivery recommendations), local streaming platforms, and even government service portals that could recommend relevant services based on citizen profiles.</p>
`
      },
      {
        icon: "🛡️",
        title: "Fraud Detection",
        video: "xoI6M4RSKmw",
        videoTitle: "Anomaly Detection Visualization",
        content: `
<p>Every time you tap your card or send money through Payme, an ML model decides in milliseconds whether the transaction is legitimate or fraudulent.</p>

<h4>How It Works</h4>
<p>The model learns patterns of normal transactions for each user: typical amounts, usual merchants, regular times, geographic patterns. When a transaction deviates significantly from the established pattern, it's flagged.</p>
<p>Two approaches:</p>
<ul>
<li><strong>Anomaly detection (unsupervised):</strong> Learn what "normal" looks like, flag anything unusual. No need for labeled fraud examples.</li>
<li><strong>Supervised classification:</strong> Train on labeled examples of fraud and legitimate transactions. More accurate but requires labeled data.</li>
</ul>
<p>The decision must happen in <strong>real-time</strong> — milliseconds between card swipe and approval. A model that takes 10 seconds is useless.</p>

<h4>Why It Matters</h4>
<p>Global card fraud exceeded $30 billion in 2023. For banks, every dollar of fraud costs roughly $3.50 when you include investigation, chargebacks, and customer service costs.</p>

<h4>What Makes It Hard</h4>
<ul>
<li><strong>Class imbalance:</strong> Fraud is rare — roughly 0.1% of transactions. A model that just says "not fraud" for everything would be 99.9% accurate but completely useless. You need specialized techniques to handle this imbalance.</li>
<li><strong>False positives:</strong> Blocking a legitimate transaction frustrates customers. Block too many and customers switch banks. The cost of a false positive is real.</li>
<li><strong>Adversarial attacks:</strong> Fraudsters are not static. They study detection methods and adapt. It's an arms race — the model improves, fraudsters adjust, the model must improve again.</li>
</ul>

<h4>Uzbekistan Example</h4>
<p>Digital payments in Uzbekistan are growing rapidly through <strong>Payme, Click, and Uzum Bank</strong>. As transaction volumes increase, so does the attack surface for fraud. These platforms need ML models that understand local transaction patterns — for instance, the pattern of small frequent top-ups that's common in Uzbekistan's prepaid-heavy mobile market looks very different from credit card usage in Western markets. A fraud model trained on US data would produce massive false positive rates in Uzbekistan.</p>
`
      },
      {
        icon: "💬",
        title: "Chatbots",
        video: "TqnYgKIQqSY",
        videoTitle: "Uzbek Chatbot Examples",
        content: `
<p>Chatbots are one of the most visible AI applications. They range from simple rule-following scripts to sophisticated language models that can hold open-ended conversations.</p>

<h4>How It Works — Three Generations</h4>
<ul>
<li><strong>Rule-based (1st generation):</strong> Decision trees. "If user says X, respond with Y." Simple, predictable, but rigid. Can only handle scenarios the developer anticipated.</li>
<li><strong>ML-based (2nd generation):</strong> Intent classification + entity extraction using NLP. The model understands the user's intent ("check balance," "report problem") and extracts key information (account number, date). More flexible, handles variations in phrasing.</li>
<li><strong>LLM-based (3rd generation):</strong> Large language models like GPT and Claude that can handle open-ended conversation, understand context across multiple messages, and generate natural responses. Powerful but expensive and harder to control.</li>
</ul>

<h4>Why It Matters</h4>
<ul>
<li>Available 24/7, no lunch breaks, no holidays</li>
<li>Handles 60-80% of routine queries without human intervention</li>
<li>Dramatically reduces cost per interaction</li>
<li>Scales instantly — handles 10 or 10,000 simultaneous conversations</li>
</ul>

<h4>What Makes It Hard</h4>
<ul>
<li><strong>Language complexity:</strong> Uzbek presents unique challenges — Latin and Cyrillic scripts, code-switching between Uzbek and Russian mid-sentence, regional dialects.</li>
<li><strong>Ambiguity:</strong> "My internet doesn't work" could mean the router is off, the subscription expired, there's a network outage, or the speed is slow. The bot needs to disambiguate.</li>
<li><strong>Emotional handling:</strong> Frustrated customers need empathy, not robotic responses. Knowing when to escalate to a human agent is critical.</li>
</ul>

<h4>Uzbekistan Example</h4>
<p><strong>Uztelecom's AI chatbot</strong> handles thousands of customer queries daily in both Uzbek and Russian. It answers questions about tariff plans, processes bill inquiries, and troubleshoots basic internet issues. The biggest challenge: understanding Uzbek text that mixes Latin and Cyrillic characters, often with transliteration inconsistencies ("o'z" vs "oʻz" vs "o'z" vs "oz"). Building NLP for Uzbek requires specialized preprocessing that doesn't exist in standard libraries.</p>
`
      },
      {
        icon: "📉",
        title: "Churn Prediction",
        video: "8_hLXRCdIis",
        videoTitle: "Churn Prediction Tutorial",
        content: `
<p>Churn prediction asks: <strong>"Which customers are about to leave?"</strong> — and answers it early enough for the business to do something about it.</p>

<h4>How It Works</h4>
<p>Supervised classification. The model takes customer features as input and predicts a churn probability (0 to 1) as output.</p>
<p>Common features:</p>
<ul>
<li><strong>Usage trends:</strong> Declining call minutes, fewer data sessions, reduced top-up frequency</li>
<li><strong>Billing patterns:</strong> Late payments, plan downgrades, balance depletion</li>
<li><strong>Customer service:</strong> Complaint frequency, unresolved issues, long wait times</li>
<li><strong>Tenure:</strong> New customers churn more than long-term ones</li>
<li><strong>Demographics:</strong> Age, location, plan type</li>
</ul>
<p>The model assigns a churn probability to each customer. The retention team then takes action on high-risk customers: discount offers, plan upgrades, personal calls.</p>

<h4>Why It Matters</h4>
<p>Acquiring a new customer costs <strong>5-7x more</strong> than retaining an existing one. Even a small improvement in retention rate has massive financial impact.</p>

<h4>What Makes It Hard</h4>
<ul>
<li><strong>Defining "churn":</strong> Canceled contract? Inactive for 30 days? Reduced usage by 50%? The definition changes the entire model.</li>
<li><strong>Prepaid vs postpaid:</strong> Postpaid customers have contracts that create clear churn events. Prepaid customers just stop using the service — there's no formal cancellation. In Uzbekistan, where prepaid dominates, this makes churn much harder to define and detect.</li>
<li><strong>Data leakage:</strong> If you accidentally include information that wouldn't be available at prediction time (like "customer canceled" as a feature), the model cheats.</li>
<li><strong>Actionability:</strong> Predicting churn is useless if the business can't act on it. The model needs to predict early enough for intervention to matter.</li>
</ul>

<h4>Uzbekistan Example</h4>
<p>The <strong>Uzbekistan telecom market (Uztelecom, Beeline, Ucell)</strong> is competitive and price-sensitive. Customers switch providers frequently for better tariff plans. Uztelecom's churn model runs daily, scoring every active subscriber. The top 1,000 at-risk customers get flagged for the retention team, who make personal calls with targeted offers. The model reduced monthly churn by an estimated 15-20% in the first year of deployment.</p>
`
      },
      {
        icon: "💬",
        title: "Discussion Questions",
        content: `
<div class="discussion-box">
<h4>Think about these:</h4>
<ol>
<li>You're building a recommendation system for a new Uzbek streaming platform. You have 500 users and 2,000 shows. What's your biggest challenge?</li>
<li>A fraud detection model blocks 5% of legitimate transactions. The bank says accuracy is 99.5%. Is this acceptable? Why or why not?</li>
<li>Why is building an Uzbek-language chatbot harder than building an English one?</li>
<li>If a churn prediction model tells you a customer is 60% likely to leave, should you act? What about 40%? Where do you draw the line?</li>
<li>Which of these four applications (recommendations, fraud, chatbots, churn) would have the biggest impact for a company in Uzbekistan? Why?</li>
</ol>
</div>
`
      }
    ]
  },

  "1-4": {
    title: "Ethics in AI",
    subtitle: "Module 1, Class 4 — Bias, fairness, privacy, and responsible AI",
    sections: [
      {
        icon: "⚖️",
        title: "The Power to Help or Harm",
        content: `
<p>AI systems make decisions affecting millions of people: who gets hired, who gets a loan, who gets flagged by police, what medical treatment is recommended. These are not theoretical concerns — they are happening right now.</p>
<p>The same ML model that saves a bank millions in fraud prevention can also systematically deny loans to qualified applicants from certain neighborhoods. The same facial recognition system that helps find missing children can enable mass surveillance of political dissidents.</p>
<p><strong>"Move fast and break things" doesn't work when you're breaking people's lives.</strong></p>
<p>As future ML practitioners, you have a responsibility to understand these issues deeply — not as an afterthought, but as a core part of your technical practice. Ethics isn't a checkbox; it's a design constraint.</p>
`
      },
      {
        icon: "🔍",
        title: "Four Types of AI Bias",
        video: "QwwS7PxYpzo",
        videoTitle: "Amazon AI Resume Screening — What Went Wrong",
        content: `
<p>AI doesn't create bias from thin air. It inherits bias from data, design choices, and the world we live in. Understanding where bias comes from is the first step to addressing it.</p>
<ul>
<li><strong>Data bias:</strong> Your training data reflects historical discrimination. If you train a hiring model on 10 years of data from a company that mostly hired men, the model learns that being male is a predictor of being hired. The model is "correct" about the historical pattern but perpetuates the injustice.</li>
<li><strong>Selection bias:</strong> Your data doesn't represent the full population. A medical AI trained mostly on data from European patients may perform poorly on patients from Central Asia because it's never seen that population.</li>
<li><strong>Measurement bias:</strong> What you measure isn't what you think you're measuring. Using arrest rates as a proxy for crime rates conflates police behavior with criminal behavior — areas with more police naturally have more arrests.</li>
<li><strong>Algorithmic bias:</strong> Design choices in the model itself can favor certain outcomes. The choice of which features to include, which metrics to optimize, and which errors to tolerate — all are human decisions embedded in the algorithm.</li>
</ul>
<div class="info-box">
<strong>The pipeline:</strong> Biased world → biased data → biased model → biased decisions → reinforces biased world. This cycle doesn't break itself. It requires conscious, deliberate intervention at every stage.
</div>
`
      },
      {
        icon: "📋",
        title: "Case Studies",
        content: `
<p>Six real cases that illustrate what happens when AI goes wrong:</p>

<div class="case-study">
<h4>1. Amazon's Hiring Tool (2018)</h4>
<p>Amazon built an AI to screen job applicants for technical roles. It was trained on 10 years of hiring data — which reflected the tech industry's gender imbalance (mostly male hires).</p>
<p>The model learned to penalize resumes containing the word "women's" — as in "women's chess club captain" or "women's college." It downgraded graduates of all-women's colleges entirely.</p>
<p>Amazon's own engineers couldn't fully remove the gender bias. The tool was scrapped in 2018. <strong>Lesson:</strong> Historical data encodes historical discrimination. Training on biased data guarantees biased output.</p>
</div>

<div class="case-study">
<h4>2. COMPAS — Criminal Justice Algorithm</h4>
<p>COMPAS is an algorithm used in US courts to predict whether a defendant will re-offend (recidivism). Judges used its risk scores when setting bail and sentencing.</p>
<p>ProPublica's 2016 investigation found: Black defendants were <strong>twice as likely</strong> to be falsely flagged as high-risk. White defendants were more likely to be falsely labeled as low-risk.</p>
<p>The algorithm's developers argued it was "equally accurate" across races — and they were technically right. The accuracy was similar. But the <em>types</em> of errors were distributed unequally. <strong>Lesson:</strong> Overall accuracy can mask unfair error distribution.</p>
</div>

<div class="case-study">
<h4>3. Facial Recognition — Who Gets Seen?</h4>
<p>MIT's Gender Shades study (2018) tested commercial facial recognition systems from Microsoft, IBM, and Face++. The results:</p>
<p>Error rates for lighter-skinned men: ~1%. Error rates for darker-skinned women: up to ~35%. A 35x difference in performance.</p>
<p>Cause: Training data dominated by lighter-skinned faces (mostly scraped from the internet, where Western content dominates). The system literally couldn't see certain people accurately.</p>
<p>Real-world impact: Multiple wrongful arrests in the US based on faulty facial recognition matches. Several cities banned government use of the technology. <strong>Lesson:</strong> If your training data doesn't represent everyone, your model doesn't work for everyone.</p>
</div>

<div class="case-study">
<h4>4. YouTube's Recommendation Algorithm</h4>
<p>YouTube's recommendation engine is optimized to maximize watch time. It discovered that increasingly extreme, sensational, and emotionally provocative content keeps people watching longer.</p>
<p>Result: Users who watch one political video get recommended progressively more extreme content. Conspiracy theories, radicalization content, and misinformation spread through recommendations, not through active search.</p>
<p><strong>Lesson:</strong> Optimizing for one metric (engagement) without considering broader impact can cause societal harm at scale.</p>
</div>

<div class="case-study">
<h4>5. Uber Surge Pricing</h4>
<p>Uber's dynamic pricing algorithm raises prices during high demand. On paper, this is efficient market economics — prices balance supply and demand.</p>
<p>In practice: During emergencies (storms, evacuations, mass shootings), prices surge dramatically. People who can least afford it — low-income riders without cars — are priced out of transportation when they need it most.</p>
<p><strong>Lesson:</strong> Algorithms that work well on average can cause severe harm at the margins, especially for vulnerable populations.</p>
</div>

<div class="case-study">
<h4>6. China's Social Credit System</h4>
<p>Various Chinese cities and provinces have implemented AI-driven systems that score citizens based on behavior: financial reliability, legal compliance, social conduct, and online activity.</p>
<p>Consequences of low scores include: restricted travel (no flights or trains), limited access to good schools for children, public shaming on billboards and websites, and difficulty getting loans or government jobs.</p>
<p><strong>Lesson:</strong> AI-enabled scoring systems can become tools of social control. The distance between "credit score" and "citizen obedience score" is shorter than it seems.</p>
</div>
`
      },
      {
        icon: "⚖️",
        title: "Three Definitions of Fairness",
        video: "8_hLXRCdIis",
        videoTitle: "COMPAS Criminal Justice Algorithm",
        content: `
<p>What does "fair" mean for an AI system? It turns out there are multiple valid definitions — and they contradict each other.</p>
<ul>
<li><strong>Equal accuracy:</strong> The model is equally accurate for all demographic groups. Same overall precision and recall.</li>
<li><strong>Equal error rates:</strong> The model makes the same types of mistakes at the same rate across groups. Same false positive rate and false negative rate.</li>
<li><strong>Demographic parity:</strong> The model produces the same proportion of positive outcomes across groups. If 10% of men are approved, 10% of women should be too.</li>
</ul>
<div class="case-study">
<h4>The Impossibility Result</h4>
<p>Researchers have mathematically proven that <strong>you cannot satisfy all three fairness criteria simultaneously</strong> (except in trivial cases where the groups have identical base rates).</p>
<p>This means every AI system must choose which definition of fairness to prioritize — and that choice is a <strong>human value judgment</strong>, not a technical decision. There is no objectively "fair" algorithm. There are only algorithms that are fair by one definition at the expense of another.</p>
</div>
<p>This is why ethics in AI is hard. It's not about finding the "right answer" — it's about understanding tradeoffs and making deliberate, transparent choices about which values to prioritize.</p>
`
      },
      {
        icon: "🔒",
        title: "Privacy",
        video: "0cGB8dCDf3c",
        videoTitle: "AI in Central Asia — China Social Credit",
        content: `
<p>ML models are hungry for data — often personal data. The question is: what's the cost?</p>

<h4>What Data Is Being Collected</h4>
<ul>
<li><strong>Location data:</strong> Your phone tracks where you go, how long you stay, and what routes you take. This data trains navigation, retail analytics, and surveillance systems.</li>
<li><strong>Purchase history:</strong> Every transaction builds a profile of your preferences, income level, habits, and health conditions (pharmacy purchases, alcohol purchases).</li>
<li><strong>Browsing behavior:</strong> Every click, scroll, and hover is tracked. This feeds ad targeting, recommendation, and content personalization systems.</li>
<li><strong>Voice recordings:</strong> Smart speakers and voice assistants process your voice to improve speech recognition — but also store recordings of private conversations.</li>
<li><strong>Facial data:</strong> Facial recognition systems are often trained on photos scraped from social media without consent. Your face may be in a training dataset right now.</li>
</ul>

<h4>Privacy Risks</h4>
<ul>
<li>Data breaches expose personal information</li>
<li>Re-identification: "Anonymous" data can often be traced back to individuals</li>
<li>Function creep: Data collected for one purpose gets used for another</li>
<li>Consent is often buried in Terms of Service that nobody reads</li>
</ul>

<h4>Uzbekistan Context</h4>
<p>Uzbekistan is rapidly digitizing government services and financial infrastructure. This creates immense opportunity — but also risk. Questions the country faces:</p>
<ul>
<li>What data protection laws should govern AI systems?</li>
<li>How should digital ID data be protected and limited?</li>
<li>What consent mechanisms work for a population that's rapidly coming online?</li>
<li>How do you balance security needs with privacy rights?</li>
</ul>
<p>The regulatory framework is still forming. Decisions made now — including by practitioners like you — will set precedents for decades.</p>
`
      },
      {
        icon: "🏗️",
        title: "Responsible AI Framework",
        content: `
<p>Five principles for building AI responsibly:</p>
<div class="principle-grid">
<div class="principle-card">
<div class="p-icon">👁️</div>
<h5>Transparency</h5>
<p>People should know when AI makes decisions about them and understand why.</p>
</div>
<div class="principle-card">
<div class="p-icon">🎯</div>
<h5>Accountability</h5>
<p>Someone must be responsible when AI causes harm. "The algorithm did it" is not an answer.</p>
</div>
<div class="principle-card">
<div class="p-icon">⚖️</div>
<h5>Fairness</h5>
<p>Actively test for and mitigate bias. Don't assume your model is fair — prove it.</p>
</div>
<div class="principle-card">
<div class="p-icon">🔒</div>
<h5>Privacy</h5>
<p>Collect only what you need. Protect what you have. Respect consent.</p>
</div>
<div class="principle-card">
<div class="p-icon">🤝</div>
<h5>Human Oversight</h5>
<p>Keep humans in the loop for high-stakes decisions. AI advises, humans decide.</p>
</div>
</div>

<h4>Uzbekistan Considerations</h4>
<ul>
<li><strong>Rapidly growing digital infrastructure</strong> — decisions made now set precedents for years to come.</li>
<li><strong>Uzbek/Russian bilingual data</strong> — whose language gets priority in AI systems? Which dialect? Which script?</li>
<li><strong>Rural vs urban digital divide</strong> — AI trained on Tashkent data may not work in Navoi or Karakalpakstan. Rural populations risk being invisible to AI systems.</li>
<li><strong>Young population</strong> — Uzbekistan's demographics skew young. These are the people most affected by AI decisions in education, employment, and services. They should have a voice in how AI is governed.</li>
<li><strong>Opportunity</strong> — Uzbekistan can learn from the mistakes of early adopters. You don't have to repeat Amazon's bias, COMPAS's unfairness, or the surveillance overreach of other governments.</li>
</ul>
`
      },
      {
        icon: "🗣️",
        title: "Discussion Scenarios",
        content: `
<p>No right answers here — just important questions. Discuss in groups:</p>
<div class="scenario-card">
<h4>Scenario A: Loan Model Bias</h4>
<p>Your bank's loan approval model rejects more women than men. Overall accuracy is the same for both groups. Is the model "fair"? What would you do?</p>
</div>
<div class="scenario-card">
<h4>Scenario B: Student Dropout Prediction</h4>
<p>A school wants to use AI to predict which students will drop out, so they can offer early support. Sounds positive — but what happens when a student is labeled "high risk"? Do teachers treat them differently? Does the prediction become self-fulfilling?</p>
</div>
<div class="scenario-card">
<h4>Scenario C: Metro Surveillance</h4>
<p>The government wants to install real-time facial recognition in Tashkent metro stations for security. What are the benefits? What are the risks? Where do you draw the line?</p>
</div>
<div class="scenario-card">
<h4>Scenario D: Data Monetization</h4>
<p>A telecom uses customer data to predict churn and then sells retention target lists to third-party marketing companies. Customers never consented to this specific use. Is it acceptable? Does it matter that the purpose is "retention"?</p>
</div>
`
      },
      {
        icon: "✏️",
        title: "Quiz — Test Your Understanding",
        content: `
<div class="quiz-item">
<div class="quiz-q">1. Amazon's hiring tool was biased because:</div>
<ol class="quiz-options" type="A">
<li>The algorithm was intentionally programmed to be sexist</li>
<li>It was trained on historical hiring data that reflected gender imbalance</li>
<li>Women are inherently worse at tech jobs</li>
<li>The tool used random selection</li>
</ol>
<button class="quiz-reveal" onclick="toggleAnswer(this)">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> The model learned from 10 years of hiring data where most hires were male. It reflected historical patterns, not truth. The data was biased, so the model was biased.</div>
</div>

<div class="quiz-item">
<div class="quiz-q">2. The COMPAS algorithm controversy showed that:</div>
<ol class="quiz-options" type="A">
<li>AI should never be used in criminal justice</li>
<li>Equal overall accuracy can mask unequal error rates across groups</li>
<li>The algorithm was more accurate than human judges</li>
<li>Racial bias in AI is impossible to measure</li>
</ol>
<button class="quiz-reveal" onclick="toggleAnswer(this)">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> COMPAS had similar overall accuracy across races, but the types of errors were distributed unequally — Black defendants were more likely to be falsely flagged as high-risk.</div>
</div>

<div class="quiz-item">
<div class="quiz-q">3. The impossibility result in fairness states that:</div>
<ol class="quiz-options" type="A">
<li>AI can never be fair</li>
<li>All three common fairness criteria cannot be satisfied simultaneously</li>
<li>Only one definition of fairness exists</li>
<li>Fairness only matters in criminal justice</li>
</ol>
<button class="quiz-reveal" onclick="toggleAnswer(this)">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Equal accuracy, equal error rates, and demographic parity cannot all be achieved at the same time (except in trivial cases). This means choosing a fairness definition is a human value judgment.</div>
</div>

<div class="quiz-item">
<div class="quiz-q">4. MIT's Gender Shades study found that facial recognition error rates were:</div>
<ol class="quiz-options" type="A">
<li>Equal across all demographics</li>
<li>Highest for lighter-skinned men</li>
<li>Up to 35% for darker-skinned women vs ~1% for lighter-skinned men</li>
<li>Only problematic for non-human faces</li>
</ol>
<button class="quiz-reveal" onclick="toggleAnswer(this)">Show Answer</button>
<div class="quiz-answer"><strong>C.</strong> The error rate gap was massive — approximately 35x difference — because training data was dominated by lighter-skinned faces.</div>
</div>

<div class="quiz-item">
<div class="quiz-q">5. Which is NOT one of the five responsible AI principles discussed?</div>
<ol class="quiz-options" type="A">
<li>Transparency</li>
<li>Profitability</li>
<li>Fairness</li>
<li>Human oversight</li>
</ol>
<button class="quiz-reveal" onclick="toggleAnswer(this)">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> The five principles are: Transparency, Accountability, Fairness, Privacy, and Human Oversight. Profitability is a business goal, not an ethical principle.</div>
</div>
`
      },
      {
        icon: "🔗",
        title: "Interactive Tools and Resources",
        content: `
<h4>Try These</h4>
<div class="tool-grid">
<a href="https://implicit.harvard.edu/implicit/" target="_blank" class="tool-card">
<h5>Harvard Implicit Bias Test</h5>
<p>Discover your own unconscious biases through this research-backed assessment. Takes 10 minutes.</p>
</a>
<a href="https://www.moralmachine.net/" target="_blank" class="tool-card">
<h5>MIT Moral Machine</h5>
<p>A platform exploring the moral dilemmas faced by self-driving cars. Who should the car save?</p>
</a>
<a href="https://www.tylervigen.com/spurious-correlations" target="_blank" class="tool-card">
<h5>Spurious Correlations</h5>
<p>Hilarious and sobering examples of meaningless correlations that look compelling in data.</p>
</a>
<a href="https://incidentdatabase.ai/" target="_blank" class="tool-card">
<h5>AI Incident Database</h5>
<p>A searchable collection of real-world AI failures and harms. Essential reading for practitioners.</p>
</a>
</div>

<h4>Watch and Read</h4>
<ul>
<li><strong>Coded Bias</strong> (Netflix documentary) — Follows Joy Buolamwini's fight against biased facial recognition systems.</li>
<li><strong>The Social Dilemma</strong> (Netflix documentary) — Tech insiders reveal how social media algorithms manipulate behavior.</li>
<li><strong>ProPublica COMPAS Investigation:</strong> <a href="https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing" target="_blank">"Machine Bias"</a> — The landmark investigation into algorithmic bias in criminal justice.</li>
<li><strong>Reuters on Amazon:</strong> <a href="https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G" target="_blank">"Amazon scraps secret AI recruiting tool"</a> — The story of Amazon's biased hiring model.</li>
<li><strong>Gender Shades:</strong> <a href="http://gendershades.org/" target="_blank">gendershades.org</a> — Full results of MIT's facial recognition audit.</li>
</ul>
`
      }
    ]
  },

  "1-5": {
    title: "Lab: Research-Driven ML Problem Framing",
    subtitle: "Module 1, Class 5 — 6 real Uzbekistan scenarios. Research. Frame. Defend.",
    sections: [
      {
        icon: "🎯",
        title: "What is Problem Framing?",
        content: `
<p>Before writing a single line of code, every ML project starts with <strong>problem framing</strong> — translating a vague business question into a precise ML problem definition.</p>
<p>This is the hardest and most important step. Most ML projects fail not because of bad algorithms, but because they solve the wrong problem.</p>
<div class="example-box">
<strong>Management says:</strong> "We're losing customers. Can AI help?"<br><br>
<strong>That's not a problem definition.</strong> Before you can build anything, you need to answer: What exactly is "losing"? Who counts as "lost"? What would a useful prediction look like? What data do you have? What action would the business take based on the prediction?
</div>
<p>In your career, you will rarely be told "build this ML model." You will be told "we have a business problem, figure it out." The single most important skill is <strong>researching the problem before writing any code</strong>. Today you practice that.</p>
<p>You will <strong>not build a model today</strong>. You will not write code. You will research, think, frame, and defend your approach. This is what senior ML engineers spend 80% of their time doing.</p>
`
      },
      {
        icon: "👥",
        title: "Lab Format — Groups, Time, and Research Process",
        content: `
<h4>Group Formation (5 min)</h4>
<p>Count the students present, then form groups of 3-4:</p>
<ul>
<li>12 students → 3 groups of 4</li>
<li>15 students → 4 groups (three of 4, one of 3)</li>
<li>16 students → 4 groups of 4</li>
<li>19 students → 5 groups (four of 4, one of 3)</li>
<li>20 students → 5 groups of 4</li>
</ul>
<p>Each group picks <strong>ONE scenario</strong>. No two groups take the same scenario. First come, first served.</p>

<h4>Research Process (45 min per group)</h4>
<ol>
<li><strong>Understand the business (5 min)</strong> — Read the scenario twice. What does the company actually want to achieve? Who uses the result and how?</li>
<li><strong>Find real examples (10 min)</strong> — Search for companies that solved similar problems. Look for case studies, blog posts, research papers. Use the links in your scenario as starting points.</li>
<li><strong>Frame the ML problem (10 min)</strong> — Supervised, unsupervised, or reinforcement? Regression or classification? What data do you need? What features matter?</li>
<li><strong>Check the data reality (10 min)</strong> — Where would the data come from <em>in Uzbekistan</em>? What would be hard to collect? What privacy/legal issues exist?</li>
<li><strong>Consider the ethics (5 min)</strong> — Who benefits? Who could be harmed? What decision would you escalate to a human?</li>
<li><strong>Present (5 min per group)</strong> — 3-minute presentation, 2-minute Q&amp;A from other groups and mentor.</li>
</ol>

<h4>Research Tools You Should Use</h4>
<div class="tool-grid">
<a class="tool-card" href="https://scholar.google.com" target="_blank" rel="noopener"><h5>Google Scholar</h5><p>Academic papers</p></a>
<a class="tool-card" href="https://paperswithcode.com" target="_blank" rel="noopener"><h5>Papers With Code</h5><p>ML papers + code</p></a>
<a class="tool-card" href="https://www.kaggle.com" target="_blank" rel="noopener"><h5>Kaggle</h5><p>Datasets + notebooks</p></a>
<a class="tool-card" href="https://towardsdatascience.com" target="_blank" rel="noopener"><h5>Towards Data Science</h5><p>Industry articles</p></a>
<a class="tool-card" href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener"><h5>Google ML Crash Course</h5><p>Concept explanations</p></a>
<a class="tool-card" href="https://www.youtube.com/@statquest" target="_blank" rel="noopener"><h5>StatQuest YouTube</h5><p>Video explanations</p></a>
<a class="tool-card" href="https://t.me/lossfunction_bot" target="_blank" rel="noopener"><h5>@lossfunction_bot</h5><p>Ask about concepts</p></a>
</div>
<div class="info-box">
<strong>Rule:</strong> Every claim in your presentation must be backed by a source. Write down links as you research. If you cannot get the data in Uzbekistan, your model is useless here. <strong>Think locally.</strong>
</div>
`
      },
      {
        icon: "🔬",
        title: "Research Scenarios — Pick One Per Group",
        content: `
<p>Below are six real scenarios drawn from the Uzbekistan tech landscape. Click <em>Reveal Mentor Hints</em> on the scenario your group picks to unlock senior-engineer guidance.</p>

<div class="quiz-item">
<div class="quiz-q">Scenario 1 — Uztelecom Customer Churn</div>
<p><strong>Business problem:</strong> Uztelecom is losing 3-5% of subscribers every month. Management wants to predict who will leave in the next 30 days so the retention team can offer deals before customers cancel.</p>
<p><strong>Research mission:</strong> Frame this as an ML problem. Define what "churn" actually means. List what data you would need. Consider privacy and fairness.</p>
<h4>Start your research here</h4>
<ul>
<li><a href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn" target="_blank" rel="noopener">Kaggle Telco Churn dataset</a></li>
<li><a href="https://towardsdatascience.com/hands-on-predict-customer-churn-5c2a42806266" target="_blank" rel="noopener">Customer churn industry article</a></li>
<li><a href="https://www.youtube.com/watch?v=yIYKR4sgzI8" target="_blank" rel="noopener">StatQuest — Logistic Regression</a></li>
<li><a href="https://uztelecom.uz" target="_blank" rel="noopener">Uztelecom public info</a></li>
<li><a href="https://scholar.google.com/scholar?q=telecom+customer+churn+prediction" target="_blank" rel="noopener">Research papers on churn</a></li>
</ul>
<h4>Hard questions to answer</h4>
<ul>
<li>Does "churn" mean they canceled the contract, or just stopped using data?</li>
<li>A prepaid customer who did not top up in 60 days — churned or not?</li>
<li>If you flag low-income users as high churn risk and the retention team calls them aggressively, is that ethical?</li>
<li>What is the class imbalance? (Hint: not 50/50)</li>
</ul>
<button class="quiz-reveal">Reveal Mentor Hints</button>
<div class="quiz-answer">
<strong>Mentor hints:</strong> If your group can define "churn" in under 2 minutes, you did not think hard enough — the definition IS the problem. Prepaid dominates in Uzbekistan, so "no top-up in N days" is your operational label. Don't list features you wish you had — list features a real telecom actually collects (usage velocity, payment timeliness, complaint patterns, data consumption trends). Evaluation: accuracy is useless with ~5% churn — use precision/recall or AUC. Ethics: flagging by income is a proxy for protected attributes.
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">Scenario 2 — Uzum Marketplace Product Recommendations</div>
<p><strong>Business problem:</strong> Uzum wants to increase sales by showing each customer products they are likely to buy. Currently, the homepage shows the same products to everyone.</p>
<p><strong>Research mission:</strong> Design a recommendation system. Decide between content-based filtering, collaborative filtering, or a hybrid approach. Handle the cold-start problem for new users.</p>
<h4>Start your research here</h4>
<ul>
<li><a href="https://research.netflix.com/research-area/recommendations" target="_blank" rel="noopener">Netflix recommendation research</a></li>
<li><a href="https://developers.google.com/machine-learning/recommendation" target="_blank" rel="noopener">Google — Recommendation basics</a></li>
<li><a href="https://towardsdatascience.com/recommendation-systems-explained-a42fc60591ed" target="_blank" rel="noopener">Towards Data Science guide</a></li>
<li><a href="https://www.youtube.com/watch?v=BSpAWkQLlgM" target="_blank" rel="noopener">YouTube algorithm explainer</a></li>
<li><a href="https://uzum.uz" target="_blank" rel="noopener">Uzum marketplace</a></li>
</ul>
<h4>Hard questions to answer</h4>
<ul>
<li>How do you recommend products to a brand new user with zero history? (cold start)</li>
<li>How do you balance showing popular items vs diverse items?</li>
<li>What happens if the algorithm creates filter bubbles (only shows similar products)?</li>
<li>How do you measure success — clicks, purchases, or something else?</li>
</ul>
<button class="quiz-reveal">Reveal Mentor Hints</button>
<div class="quiz-answer">
<strong>Mentor hints:</strong> Cold start is the real problem, not the algorithm. For new users, start with popularity + category signals from signup. For new items, use content similarity (title, category, brand). Hybrid beats pure approaches in every case study. Don't optimize for clicks — users click clickbait; purchases and repeat visits are better. Filter bubbles are a product concern, not a technical one: inject diversity on purpose (10% exploration).
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">Scenario 3 — Fraud Detection for Payme / Click</div>
<p><strong>Business problem:</strong> Mobile payment platforms process millions of transactions daily. A tiny fraction are fraudulent — stolen cards, account takeovers, money laundering. Fraud must be caught in real-time, in under 1 second.</p>
<p><strong>Research mission:</strong> Design a fraud detection system. Decide between supervised classification, unsupervised anomaly detection, or a hybrid. Handle the severe class imbalance (fraud is less than 0.1% of transactions).</p>
<h4>Start your research here</h4>
<ul>
<li><a href="https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud" target="_blank" rel="noopener">Kaggle Credit Card Fraud dataset</a></li>
<li><a href="https://www.youtube.com/watch?v=xoI6M4RSKmw" target="_blank" rel="noopener">Fraud detection in banking</a></li>
<li><a href="https://scikit-learn.org/stable/modules/outlier_detection.html" target="_blank" rel="noopener">Anomaly detection methods</a></li>
<li><a href="https://www.youtube.com/watch?v=FheTB3Y7bAk" target="_blank" rel="noopener">SMOTE for imbalanced data</a></li>
<li><a href="https://payme.uz" target="_blank" rel="noopener">Payme</a></li>
</ul>
<h4>Hard questions to answer</h4>
<ul>
<li>If the model blocks a legitimate transaction, what happens to the customer? Is that worse than missing fraud?</li>
<li>How do you handle concept drift (fraudsters change tactics every week)?</li>
<li>What features can you compute in 500 milliseconds? (transaction velocity, geographic distance from usual)</li>
<li>Is it ethical to flag transactions based on location? What about ethnicity (inferred from name)?</li>
</ul>
<button class="quiz-reveal">Reveal Mentor Hints</button>
<div class="quiz-answer">
<strong>Mentor hints:</strong> Hybrid wins here: supervised model for known fraud patterns + unsupervised anomaly detector for novel attacks. Blocking a real transaction has high customer cost — tune the threshold for recall but with human review for borderline cases. Concept drift is constant — plan weekly retraining from day one. Features must be precomputed: user's average basket, distance from last transaction, time since last login. Flagging by ethnicity is illegal and ineffective.
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">Scenario 4 — Cotton Crop Yield Prediction in Fergana Valley</div>
<p><strong>Business problem:</strong> Uzbekistan is a major cotton producer. A company wants to predict cotton yield per hectare 3 months before harvest, based on satellite imagery, weather data, and soil data. Accurate predictions help with export contracts and pricing.</p>
<p><strong>Research mission:</strong> Frame this as an ML problem. Decide what data to use. Think about how to validate predictions on farms you have never seen.</p>
<h4>Start your research here</h4>
<ul>
<li><a href="https://data.nasa.gov" target="_blank" rel="noopener">NASA satellite data for agriculture</a></li>
<li><a href="https://www.kaggle.com/datasets?tags=agriculture" target="_blank" rel="noopener">Kaggle agriculture datasets</a></li>
<li><a href="https://towardsdatascience.com/remote-sensing-for-beginners-10f7094dfa7c" target="_blank" rel="noopener">Remote sensing with ML</a></li>
<li><a href="https://earthengine.google.com" target="_blank" rel="noopener">Google Earth Engine (free for research)</a></li>
<li><a href="https://scholar.google.com/scholar?q=cotton+yield+prediction+satellite" target="_blank" rel="noopener">Research papers</a></li>
</ul>
<h4>Hard questions to answer</h4>
<ul>
<li>Is this a regression problem (predict a number) or classification (high/medium/low yield)?</li>
<li>How do you handle years with unusual weather (drought, floods)?</li>
<li>What is the unit of prediction — per hectare, per farm, per region?</li>
<li>Who benefits from accurate predictions? Who loses?</li>
</ul>
<button class="quiz-reveal">Reveal Mentor Hints</button>
<div class="quiz-answer">
<strong>Mentor hints:</strong> Regression at the farm level. Temporal validation is critical — you must test on future years your model has never seen, not a random 20% split (data leakage across time). Drought years are outliers but are the exact cases you care about — don't remove them. Features: NDVI from satellite (crop greenness), cumulative rainfall, soil moisture, sowing date. Who loses? Small farmers with unpredictable land may get worse loan terms if banks trust the model.
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">Scenario 5 — Hospital Patient Triage in Samarkand</div>
<p><strong>Business problem:</strong> A regional hospital in Samarkand wants to predict which emergency room patients need urgent care versus those who can wait. Currently, a nurse makes this judgment in under 2 minutes. An ML assistant could help — but it must NEVER delay critical care.</p>
<p><strong>Research mission:</strong> Frame this as an ML problem. This is <strong>high-stakes</strong> — a wrong answer can kill someone. Think hard about human oversight and failure modes.</p>
<h4>Start your research here</h4>
<ul>
<li><a href="https://www.nature.com/articles/s41746-020-00341-z" target="_blank" rel="noopener">Clinical decision support systems</a></li>
<li><a href="https://physionet.org/content/mimiciii/1.4/" target="_blank" rel="noopener">MIMIC-III medical dataset</a></li>
<li><a href="https://www.coursera.org/learn/ethics-ai" target="_blank" rel="noopener">Medical AI ethics course</a></li>
<li><a href="https://www.youtube.com/results?search_query=healthcare+AI+triage" target="_blank" rel="noopener">Healthcare AI case studies</a></li>
<li><a href="https://scholar.google.com/scholar?q=emergency+triage+machine+learning" target="_blank" rel="noopener">Research papers</a></li>
</ul>
<h4>Hard questions to answer</h4>
<ul>
<li>What happens when the model is wrong and a patient dies?</li>
<li>Should the model be autonomous or advisory to a nurse?</li>
<li>How do you handle patients whose symptoms the model has never seen?</li>
<li>Is it ethical to use this in rural areas where hospitals are understaffed?</li>
<li>Privacy — medical data is extremely sensitive</li>
</ul>
<button class="quiz-reveal">Reveal Mentor Hints</button>
<div class="quiz-answer">
<strong>Mentor hints:</strong> This is <em>advisory only</em> — the nurse always has final say. The model's job is to flag patients the nurse might have missed, not replace the nurse. Out-of-distribution detection matters as much as accuracy: if the model says "I don't know," escalate to human immediately. Failure mode analysis is the deliverable here, not the model. Rural areas need <em>more</em> human oversight, not less — understaffed does not mean unsupervised. Privacy: data stays on-premise, never leaves the hospital.
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">Scenario 6 — Tashkent Metro Traffic Flow Optimization</div>
<p><strong>Business problem:</strong> Tashkent metro is expanding. The city wants to predict rider demand at each station for every hour of the day so they can adjust train frequency. Fewer trains at low-demand times saves electricity and wear. More trains at high-demand times reduces crowding.</p>
<p><strong>Research mission:</strong> Frame this as an ML problem. Decide between time-series forecasting, clustering, or reinforcement learning. Consider how to handle special events (holidays, concerts, weather).</p>
<h4>Start your research here</h4>
<ul>
<li><a href="https://www.youtube.com/watch?v=e8Yw4alG16Q" target="_blank" rel="noopener">Time series forecasting with ML</a></li>
<li><a href="https://www.kaggle.com/datasets?search=transportation" target="_blank" rel="noopener">Kaggle transportation datasets</a></li>
<li><a href="https://scholar.google.com/scholar?q=metro+passenger+flow+prediction" target="_blank" rel="noopener">Traffic prediction research</a></li>
<li><a href="https://developers.google.com/transit" target="_blank" rel="noopener">Google Transit data</a></li>
<li><a href="https://metro.tashkent.uz" target="_blank" rel="noopener">Tashkent metro info</a></li>
</ul>
<h4>Hard questions to answer</h4>
<ul>
<li>Is this supervised (predict a number) or reinforcement (optimize train schedule)?</li>
<li>What features matter? (time of day, day of week, weather, holidays, school schedule)</li>
<li>How do you predict demand for a new station that just opened?</li>
<li>Can this model accidentally encourage surveillance of riders?</li>
</ul>
<button class="quiz-reveal">Reveal Mentor Hints</button>
<div class="quiz-answer">
<strong>Mentor hints:</strong> Two layers: supervised forecasting predicts demand (the easy part), then a scheduling layer optimizes frequency (the hard part). Start with supervised only — RL is tempting but 10x harder to get right. Special events are where simple models break — build a calendar of known events as features. New stations: use transfer learning from similar stations (population density, nearby destinations). Surveillance risk: aggregate only, never per-rider data.
</div>
</div>
`
      },
      {
        icon: "📝",
        title: "The Framing Template (Every Group Fills This In)",
        content: `
<p>Every group submits the same template, tailored to their chosen scenario. This is your deliverable.</p>
<pre style="background:var(--card);border:1px solid var(--card-border);border-radius:8px;padding:18px;overflow-x:auto;font-size:0.85rem;line-height:1.6;color:var(--text);">
[Scenario Name] — ML Problem Framing

Group members:

Business objective:
[What does the organization actually want? 1-2 sentences.]

Target variable:
[What are you predicting? How do you define it precisely?]

ML problem type:
[Classification / Regression / Clustering / Anomaly Detection /
 Reinforcement Learning — and why]

Input features (minimum 10):
1. [feature name] — [why it matters]
2. ...

Evaluation metric:
[Accuracy / Precision / Recall / F1 / RMSE / AUC — which and why?]

Class imbalance or distribution:
[If classification, what is the class ratio?
 If regression, is the target skewed?]

Ethical considerations:
[Who could be harmed? What is the worst-case failure?]

Data availability in Uzbekistan:
[Where does the data come from?
 What is hard to get? What are the privacy issues?]

Human oversight:
[When does a human override the model?
 When is the model autonomous?]

Research sources (at least 3 links):
1.
2.
3.
</pre>

<h4>Presentation (5 min per group)</h4>
<ol>
<li>What is the problem? (20 sec)</li>
<li>What did you find in research? (60 sec)</li>
<li>How did you frame it? (60 sec)</li>
<li>What are the ethical risks? (30 sec)</li>
<li>What would you do differently in Uzbekistan? (30 sec)</li>
</ol>

<h4>Grading</h4>
<ul>
<li>Completeness of template: <strong>40%</strong></li>
<li>Quality of research (relevance and depth of sources): <strong>30%</strong></li>
<li>Ethical reasoning: <strong>20%</strong></li>
<li>Presentation clarity: <strong>10%</strong></li>
</ul>
<div class="info-box"><strong>No right answers today.</strong> We judge thinking, not memorization.</div>
`
      },
      {
        icon: "🎓",
        title: "Module 1 Complete",
        video: "f_uwKZIAeM0",
        videoTitle: "What is Machine Learning? — Review",
        content: `
<p>You've completed Module 1. Here's what you now know:</p>
<ul>
<li><strong>What AI, ML, and DL are</strong> — and how they relate as nested concepts</li>
<li><strong>Three types of ML</strong> — supervised, unsupervised, reinforcement — and when to use each</li>
<li><strong>The ML workflow</strong> — six steps from problem definition to deployment, with 60-80% of time spent on data</li>
<li><strong>Real-world applications</strong> — recommendations, fraud detection, chatbots, and churn prediction in both global and Uzbekistan contexts</li>
<li><strong>Why ethics is not optional</strong> — bias, fairness impossibility, privacy, and the responsibility that comes with building AI systems</li>
<li><strong>How to frame an ML problem through research</strong> — turning "can AI help?" into a precise, defensible plan grounded in real sources</li>
</ul>

<div class="info-box">
<strong>Module 2 preview:</strong> Python crash course — data types, functions, control flow. Then NumPy and Pandas — the tools you'll use every day. Data visualization with Matplotlib and Seaborn. Come ready to code.
</div>
`
      }
    ]
  }
  };

  Object.assign(COURSE_DATA.classContent, MODULE_1_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[1] = true;
})();
