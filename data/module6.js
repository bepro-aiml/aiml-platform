// ============================================================
// MODULE 6 CONTENT — Neural Networks and Deep Learning
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module6.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_6_CONTENT = {

    "6-1": {
      title: "Perceptrons and Activation Functions",
      subtitle: "Module 6, Class 1 — The building block of neural networks",
      sections: [
        { icon: "🧠", title: "The Perceptron", content: `
<p>The perceptron is a single artificial neuron. It computes a weighted sum of inputs, adds a bias, and applies an activation function:</p>
<p><code>output = activation(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)</code></p>
<p>Stack many of these in layers → a neural network. Stack many layers → "deep" learning.</p>
<p>Historical note: the perceptron was invented in 1958. It couldn't learn XOR, which delayed neural net research by 20 years. The fix (multi-layer networks with backprop) came in the 1980s.</p>
` },
        { icon: "⚡", title: "Activation Functions", content: `
<p>Without non-linear activations, stacked layers collapse to a single linear transformation. Non-linearity is what makes deep networks powerful.</p>
<ul>
<li><strong>Sigmoid</strong> — <code>1/(1+e⁻ˣ)</code>. Output [0, 1]. Legacy; causes vanishing gradients in deep nets.</li>
<li><strong>Tanh</strong> — output [-1, 1]. Similar issues.</li>
<li><strong>ReLU</strong> — <code>max(0, x)</code>. Default for hidden layers. Simple, fast, avoids vanishing gradients.</li>
<li><strong>Leaky ReLU</strong> — <code>max(0.01x, x)</code>. Fixes "dying ReLU" problem.</li>
<li><strong>Softmax</strong> — used at the output layer for multi-class classification. Produces probabilities summing to 1.</li>
</ul>
<div class="info-box"><strong>Rule of thumb:</strong> ReLU in hidden layers, softmax for multi-class output, sigmoid for binary output.</div>
` },
        { icon: "🏗️", title: "Building Networks", content: `
<div class="example-box"><pre>import tensorflow as tf
from tensorflow.keras import layers, Sequential

model = Sequential([
    layers.Dense(128, activation="relu", input_shape=(20,)),
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax")
])

model.compile(optimizer="adam", loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
model.fit(X_train, y_train, epochs=10, batch_size=32)</pre></div>
<p>A <code>Dense</code> layer = fully connected perceptron layer. The first number is neurons; <code>input_shape</code> only needed on first layer.</p>
` },
        { icon: "📺", title: "Watch: Neural Networks Visualized", video: "https://www.youtube.com/watch?v=aircAruvnKk", videoTitle: "3Blue1Brown — But what is a neural network?", content: `
<p>Grant Sanderson's visualization is the best introduction to neural networks on YouTube. Watch this entire 4-part series if you have time.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. A perceptron computes:</div>
<ol class="quiz-options" type="A"><li>Random output</li><li>Weighted sum + bias, then activation</li><li>Average of inputs</li><li>Max input</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Classic formulation.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why activation functions?</div>
<ol class="quiz-options" type="A"><li>Cosmetic</li><li>Non-linearity — without them, deep nets collapse to linear</li><li>Faster</li><li>Regularization</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Non-linearity is what makes networks expressive.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Best default for hidden layers:</div>
<ol class="quiz-options" type="A"><li>Sigmoid</li><li>ReLU</li><li>Softmax</li><li>Linear</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Simple, fast, avoids vanishing gradients.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Softmax is for:</div>
<ol class="quiz-options" type="A"><li>Hidden layers</li><li>Multi-class output — turns logits into probabilities</li><li>Regression output</li><li>Dropout</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Output layer for K-class classification.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. "Dying ReLU" problem:</div>
<ol class="quiz-options" type="A"><li>Model crashes</li><li>Neurons stuck outputting 0 for all inputs</li><li>GPU overheats</li><li>Loss goes to infinity</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Large negative input permanently zeros the neuron. Leaky ReLU fixes it.</div>
</div>
` }
      ]
    },

    "6-2": {
      title: "Backpropagation",
      subtitle: "Module 6, Class 2 — How networks learn, chain rule, gradient flow",
      sections: [
        { icon: "🔄", title: "The Learning Loop", content: `
<p>Networks learn in four steps, repeated for every batch:</p>
<ol>
<li><strong>Forward pass</strong> — compute predictions.</li>
<li><strong>Loss</strong> — measure how wrong.</li>
<li><strong>Backward pass</strong> — compute gradient of loss with respect to every weight.</li>
<li><strong>Update</strong> — adjust weights in the direction that reduces loss.</li>
</ol>
<p>The backward pass is where the magic happens. It uses the <strong>chain rule</strong> from calculus to efficiently compute how each weight contributes to the final loss.</p>
` },
        { icon: "🔗", title: "Chain Rule and Gradient Flow", content: `
<p>If <code>L = f(g(h(x)))</code>, then <code>dL/dx = (dL/dg)·(dg/dh)·(dh/dx)</code>.</p>
<p>In a neural network, each layer is a function. Backprop multiplies gradients layer by layer, from output back to input.</p>
<h4>Vanishing and exploding gradients</h4>
<p>Multiplying many small numbers → vanishing gradient (early layers barely learn). Multiplying many large numbers → exploding gradient (weights blow up). Both plagued early deep networks.</p>
<h4>Modern fixes</h4>
<ul>
<li><strong>ReLU</strong> — gradient is 0 or 1, doesn't vanish in positive region.</li>
<li><strong>Batch normalization</strong> — keeps activations in a stable range.</li>
<li><strong>Residual connections</strong> (skip connections) — give gradients a shortcut path.</li>
<li><strong>Gradient clipping</strong> — cap the norm of gradients per step.</li>
</ul>
` },
        { icon: "🎚️", title: "Optimizers", content: `
<p>Gradient descent updates: <code>w_new = w - α · ∂L/∂w</code>. Real-world optimizers improve on this:</p>
<ul>
<li><strong>SGD with momentum</strong> — accumulates velocity, smooths updates.</li>
<li><strong>Adam</strong> — adaptive per-parameter learning rates. The default for most tasks.</li>
<li><strong>AdamW</strong> — Adam with proper weight decay. Preferred in modern deep learning.</li>
</ul>
<div class="info-box"><strong>Start with Adam at learning rate 1e-3.</strong> If it diverges, drop to 1e-4. If it plateaus, try SGD with momentum for a fine-tuning phase.</div>
` },
        { icon: "📺", title: "Watch: Backpropagation Visualized", video: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", videoTitle: "3Blue1Brown — What is backpropagation really doing?", content: `
<p>Part 3 of the 3Blue1Brown series. Makes the chain rule and weight updates visual.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Backprop computes:</div>
<ol class="quiz-options" type="A"><li>Predictions</li><li>Gradient of loss w.r.t. each weight</li><li>Accuracy</li><li>Validation error</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Then optimizer uses gradients to update weights.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Vanishing gradient affects:</div>
<ol class="quiz-options" type="A"><li>Output layer</li><li>Early layers — they barely learn</li><li>Random layers</li><li>No layers</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Gradients shrink as they flow back.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Residual connections help by:</div>
<ol class="quiz-options" type="A"><li>Reducing params</li><li>Providing a shortcut for gradient flow</li><li>Regularization</li><li>Speed</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Gradients can flow through identity skip paths.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Default optimizer for most tasks:</div>
<ol class="quiz-options" type="A"><li>SGD</li><li>Adam / AdamW</li><li>RMSProp</li><li>Momentum</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Adaptive learning rates work well out of the box.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Training loss goes to NaN. Likely cause?</div>
<ol class="quiz-options" type="A"><li>Dataset too small</li><li>Exploding gradients — lower LR or clip</li><li>Too many features</li><li>Wrong loss function</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Exploding gradients produce NaN.</div>
</div>
` }
      ]
    },

    "6-3": {
      title: "Convolutional Neural Networks",
      subtitle: "Module 6, Class 3 — Image recognition, filters, pooling",
      sections: [
        { icon: "🖼️", title: "Why CNNs for Images?", content: `
<p>A 224×224 RGB image has 150,528 pixel values. A fully-connected first layer with 1024 neurons would have 150M parameters. Unaffordable and unnecessary — most pixel relationships are local.</p>
<p>CNNs exploit two image properties:</p>
<ul>
<li><strong>Locality</strong> — nearby pixels matter more.</li>
<li><strong>Translation invariance</strong> — a cat in the top-left is still a cat.</li>
</ul>
<p>Both come from <strong>convolution</strong> — a small filter slides across the image applying the same weights everywhere.</p>
` },
        { icon: "🔲", title: "Building Blocks", content: `
<ul>
<li><strong>Conv layer</strong> — applies N filters (e.g., 3×3) across the image, producing N feature maps. Weights are shared across spatial positions.</li>
<li><strong>Pooling layer</strong> — downsample by taking max or mean in 2×2 windows. Reduces spatial size, adds translation invariance.</li>
<li><strong>Fully connected</strong> — at the end, flatten and feed into Dense layers for classification.</li>
</ul>
<div class="example-box"><pre>model = Sequential([
    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation="relu"),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax")
])</pre></div>
` },
        { icon: "🏛️", title: "Landmark Architectures", content: `
<ul>
<li><strong>LeNet (1998)</strong> — first successful CNN, handwritten digits.</li>
<li><strong>AlexNet (2012)</strong> — won ImageNet, sparked the deep learning revolution.</li>
<li><strong>VGG (2014)</strong> — simpler, deeper, very uniform structure.</li>
<li><strong>ResNet (2015)</strong> — introduced skip connections, allowed hundreds of layers.</li>
<li><strong>EfficientNet, ConvNeXt</strong> — modern efficient designs.</li>
</ul>
<p>In practice you rarely design a CNN from scratch. Transfer learning from a pretrained ResNet or EfficientNet is the default.</p>
` },
        { icon: "📺", title: "Watch: CNNs Explained", video: "https://www.youtube.com/watch?v=HGwBXDKFk9I", videoTitle: "StatQuest — Convolutional Neural Networks", content: `
<p>Walk-through of filters, pooling, and feature maps without heavy math.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Convolution exploits:</div>
<ol class="quiz-options" type="A"><li>Parallelism</li><li>Locality and translation invariance</li><li>RAM size</li><li>GPU cores</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Both properties of natural images.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Max pooling does what?</div>
<ol class="quiz-options" type="A"><li>Increases resolution</li><li>Downsamples by taking max in each window</li><li>Normalization</li><li>Dropout</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Reduces spatial size, adds some invariance.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Weight sharing in CNNs means:</div>
<ol class="quiz-options" type="A"><li>Faster training</li><li>Same filter applied at every spatial position</li><li>Fewer layers</li><li>Dropout</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Massively reduces parameters vs. fully connected.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. What made ResNet significant?</div>
<ol class="quiz-options" type="A"><li>More params</li><li>Skip connections enabled very deep networks to train</li><li>Pooling</li><li>Softmax</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Residual connections solved the vanishing gradient in deep nets.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Default approach for real image tasks:</div>
<ol class="quiz-options" type="A"><li>Train CNN from scratch</li><li>Transfer learning from a pretrained model</li><li>Use dense layers only</li><li>PCA</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Almost always better than training from scratch on limited data.</div>
</div>
` }
      ]
    },

    "6-4": {
      title: "Recurrent Neural Networks",
      subtitle: "Module 6, Class 4 — Sequences, LSTM, time series",
      sections: [
        { icon: "🔁", title: "Handling Sequences", content: `
<p>CNNs assume fixed-size input. But language, time series, and audio are sequences of variable length.</p>
<p>An RNN processes inputs one at a time, maintaining a hidden state that carries information forward:</p>
<p><code>h_t = f(x_t, h_{t-1})</code></p>
<p>The same weights are reused at every time step. The network learns to encode "what have we seen so far."</p>
` },
        { icon: "🧠", title: "LSTM and GRU", content: `
<p>Vanilla RNNs forget long-range dependencies because of vanishing gradients through time.</p>
<p><strong>LSTM (Long Short-Term Memory)</strong> adds gates that control what to remember, forget, and output. This solves the long-range problem.</p>
<ul>
<li><strong>Forget gate</strong> — what to drop from memory.</li>
<li><strong>Input gate</strong> — what new information to store.</li>
<li><strong>Output gate</strong> — what to emit as the new hidden state.</li>
</ul>
<p><strong>GRU</strong> is a simpler variant with only two gates. Often similar performance, fewer parameters.</p>
<div class="example-box"><pre>model = Sequential([
    layers.LSTM(64, input_shape=(sequence_length, num_features)),
    layers.Dense(1)  # regression output
])</pre></div>
` },
        { icon: "📉", title: "When to Use RNNs", content: `
<p>Originally RNNs dominated NLP and time-series. Then transformers (Module 7) arrived and ate NLP. RNNs are still useful for:</p>
<ul>
<li><strong>Short sequences</strong> where transformers are overkill.</li>
<li><strong>Streaming data</strong> — RNNs process one step at a time; transformers need the whole sequence.</li>
<li><strong>Low-resource environments</strong> — LSTMs are much smaller than transformers.</li>
<li><strong>Univariate time series</strong> — demand forecasting, sensor data.</li>
</ul>
<div class="info-box"><strong>For Tashkent metro demand forecasting</strong> (from Module 1 lab): an LSTM with hourly demand + calendar features is a reasonable starting point.</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. RNN hidden state carries:</div>
<ol class="quiz-options" type="A"><li>Random noise</li><li>Summary of prior inputs</li><li>Weight gradients</li><li>Layer count</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Compressed memory of what's been seen.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Vanilla RNNs fail at:</div>
<ol class="quiz-options" type="A"><li>Short sequences</li><li>Long-range dependencies</li><li>Classification</li><li>Regression</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Gradients vanish through many time steps.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. LSTM gates control:</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>What to remember, forget, output</li><li>Accuracy</li><li>Training order</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Forget, input, output gates.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. GRU vs LSTM:</div>
<ol class="quiz-options" type="A"><li>GRU is bigger</li><li>GRU is simpler (2 gates), often comparable performance</li><li>GRU is older</li><li>Identical</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Fewer parameters, similar results in many tasks.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. For NLP today, prefer:</div>
<ol class="quiz-options" type="A"><li>RNN</li><li>Transformer</li><li>CNN</li><li>Decision tree</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Transformers dominate NLP (Module 7).</div>
</div>
` }
      ]
    },

    "6-5": {
      title: "Transfer Learning",
      subtitle: "Module 6, Class 5 — Using pre-trained models, fine-tuning",
      sections: [
        { icon: "🎁", title: "Standing on Giants' Shoulders", content: `
<p>Training a CNN from scratch on ImageNet takes weeks on multi-GPU clusters. You don't need to — someone already did it and published the weights.</p>
<p><strong>Transfer learning</strong> takes a pretrained model and adapts it to your task. Works because lower layers learn generic features (edges, textures, shapes) that transfer across image tasks.</p>
<h4>Two strategies</h4>
<ul>
<li><strong>Feature extraction</strong> — freeze the pretrained backbone, add a new classification head, train only the head. Fast, low data requirements.</li>
<li><strong>Fine-tuning</strong> — unfreeze some or all layers, continue training with a small learning rate. Better accuracy if you have enough data.</li>
</ul>
` },
        { icon: "🔧", title: "Practical Recipe", content: `
<div class="example-box"><pre>from tensorflow.keras.applications import ResNet50

base = ResNet50(weights="imagenet", include_top=False, input_shape=(224,224,3))
base.trainable = False   # freeze

model = Sequential([
    base,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(num_classes, activation="softmax")
])
model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
              loss="sparse_categorical_crossentropy", metrics=["accuracy"])
model.fit(train_ds, epochs=10, validation_data=val_ds)

# Then unfreeze top layers and fine-tune with low LR
base.trainable = True
for layer in base.layers[:-20]:
    layer.trainable = False
model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), ...)
model.fit(train_ds, epochs=5, validation_data=val_ds)</pre></div>
<div class="info-box"><strong>Classification head:</strong> drop the pretrained classifier (<code>include_top=False</code>) and add your own. The old head predicted 1000 ImageNet classes — you probably want 2-10.</div>
` },
        { icon: "🌍", title: "Beyond Images", content: `
<p>Transfer learning isn't just for vision. It's how modern NLP works:</p>
<ul>
<li>BERT, GPT, T5 pretrained on web text.</li>
<li>Fine-tune for classification, summarization, Q&amp;A on your domain.</li>
</ul>
<p>In practice: Hugging Face's <code>transformers</code> library makes loading a pretrained model a one-liner.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Why does transfer learning work?</div>
<ol class="quiz-options" type="A"><li>Speed</li><li>Lower layers learn generic features that transfer</li><li>More params</li><li>Regularization</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Edges and textures matter for most vision tasks.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Feature extraction means:</div>
<ol class="quiz-options" type="A"><li>Train from scratch</li><li>Freeze backbone, train only new head</li><li>Feature engineering</li><li>PCA</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Fast and data-efficient.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Fine-tuning uses:</div>
<ol class="quiz-options" type="A"><li>Same LR as pretraining</li><li>Much smaller LR to avoid destroying pretrained weights</li><li>No optimizer</li><li>Random init</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Typically 10-100x smaller LR.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. <code>include_top=False</code> in Keras:</div>
<ol class="quiz-options" type="A"><li>Drops the top feature maps</li><li>Drops the pretrained classification head so you can add your own</li><li>Removes the input layer</li><li>Disables training</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Drops the 1000-class ImageNet head.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Small dataset, few GPU hours — what to do?</div>
<ol class="quiz-options" type="A"><li>Train huge model from scratch</li><li>Transfer learning with feature extraction</li><li>Give up</li><li>Use more features</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> The right tool for limited data.</div>
</div>
` }
      ]
    },

    "6-6": {
      title: "Lab: Image Classifier",
      subtitle: "Module 6, Class 6 — Build a CNN with TensorFlow/Keras",
      sections: [
        { icon: "🎯", title: "Objective", content: `
<p>Build an image classifier using transfer learning. Target at least 90% validation accuracy.</p>
<div class="tool-grid">
<a class="tool-card" href="https://www.tensorflow.org/datasets/catalog/cats_vs_dogs" target="_blank" rel="noopener"><h5>Cats vs Dogs</h5><p>23k images, binary classification, Keras-ready.</p></a>
<a class="tool-card" href="https://www.kaggle.com/datasets/alessiocorrado99/animals10" target="_blank" rel="noopener"><h5>Animals-10</h5><p>28k images across 10 animal classes. Multi-class option.</p></a>
</div>
` },
        { icon: "📝", title: "Tasks", content: `
<ol>
<li>Load the dataset. Visualize 16 random examples with labels.</li>
<li>Split into train/val/test (60/20/20). Apply data augmentation (random flip, rotation, zoom) to the training set.</li>
<li>Load a pretrained backbone (ResNet50 or MobileNetV2) without its classifier head.</li>
<li>Add your classification head: GlobalAveragePooling2D → Dense(128, ReLU) → Dropout(0.3) → Dense(num_classes, softmax).</li>
<li>Freeze the backbone. Train for 10 epochs. Plot train/val loss curves.</li>
<li>Unfreeze the top 20 layers. Fine-tune with a much smaller learning rate for 5 epochs.</li>
<li>Evaluate on the test set. Report accuracy.</li>
<li>Show 10 misclassified examples. What failure modes do you see?</li>
</ol>
` },
        { icon: "📐", title: "Deliverable", content: `
<ul>
<li>Notebook with all 8 tasks, including training curves and misclassification grid.</li>
<li>Saved model as <code>classifier.h5</code>.</li>
<li>Short writeup: which backbone, final test accuracy, most common failure mode, one idea for further improvement.</li>
</ul>
` },
        { icon: "📋", title: "Checkpoint Quiz", content: `
<div class="quiz-item">
<div class="quiz-q">1. Why data augmentation?</div>
<ol class="quiz-options" type="A"><li>Faster training</li><li>Artificially grow the dataset, reduce overfitting</li><li>Required</li><li>Fewer parameters</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Especially valuable on small datasets.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Why freeze backbone first, then fine-tune?</div>
<ol class="quiz-options" type="A"><li>Faster</li><li>Head needs to train before its gradients are safe to backprop into backbone</li><li>Required</li><li>Convention</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Randomly initialized head would destroy pretrained weights with its initial gradients.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. GlobalAveragePooling2D replaces:</div>
<ol class="quiz-options" type="A"><li>Softmax</li><li>Flatten, with fewer parameters and better translation invariance</li><li>Conv layers</li><li>Dropout</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Averages each feature map to one number.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Val loss goes up while train loss goes down:</div>
<ol class="quiz-options" type="A"><li>Normal</li><li>Overfitting — add regularization, augmentation, or early stopping</li><li>Underfitting</li><li>Data leak</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Classic overfitting signature.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Inspecting misclassifications is worth it because:</div>
<ol class="quiz-options" type="A"><li>Curiosity</li><li>Reveals failure modes, data issues, label errors</li><li>Required</li><li>Improves accuracy automatically</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> You often find mislabeled training examples.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_6_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[6] = true;
})();
