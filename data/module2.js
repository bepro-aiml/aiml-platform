// ============================================================
// MODULE 2 CONTENT — Python and Data Foundations
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module2.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_2_CONTENT = {

    "2-1": {
      title: "Python Basics",
      subtitle: "Module 2, Class 1 — Variables, data types, control flow",
      brokenState: { type: 'static', physicsDisabled: true, description: 'Gravity failure — the Foundry blocks have lost their anchor. Write the Python logic that pins them.' },
      sections: [
        { icon: "🐍", title: "Why Python for ML?", content: `
<p>Python dominates ML not because it's fast, but because of its <strong>ecosystem</strong>: NumPy, Pandas, scikit-learn, PyTorch, TensorFlow. Every major tool has a first-class Python API.</p>
<p>It also reads like pseudocode. When you're iterating on a model twenty times a day, the language shouldn't get in your way.</p>
<div class="info-box"><strong>What you need:</strong> variables, types, control flow, functions, standard data structures. You'll learn metaclasses and async only when a specific problem demands them.</div>
` },
        { icon: "📦", title: "Variables and Data Types", content: `
<p>Python is dynamically typed — you don't declare types, they're inferred.</p>
<div class="example-box"><pre>x = 42            # int
price = 19.99     # float
name = "Uzum"     # str
active = True     # bool
nothing = None    # NoneType</pre></div>
<h4>Five types you'll use constantly</h4>
<ul>
<li><strong>int</strong> — whole numbers, arbitrary precision.</li>
<li><strong>float</strong> — IEEE 754 double. <code>0.1 + 0.2 == 0.3</code> is <strong>False</strong>.</li>
<li><strong>str</strong> — text. Single, double, or triple quotes.</li>
<li><strong>bool</strong> — True or False (capital T/F).</li>
<li><strong>None</strong> — "nothing." Check with <code>is None</code>, not <code>==</code>.</li>
</ul>
<div class="warning-box"><strong>Gotcha — truthy strings</strong><code>bool("False")</code> is <code>True</code>. Any non-empty string is truthy in Python — it only looks at whether the string is empty, not at its content.</div>

<div class="warning-box"><strong>Gotcha — mutability</strong>Lists and dicts are <em>mutable</em>: if you assign <code>b = a</code>, both names point to the same list. Changing <code>b</code> also changes <code>a</code>. Use <code>a.copy()</code> (or <code>list(a)</code>) when you need an independent copy. Never use a mutable default argument in a function (<code>def f(x=[])</code>) — it's reused across calls.</div>
` },
        { icon: "🔀", title: "Control Flow", content: `
<p>Three tools: <code>if</code>, <code>for</code>, <code>while</code>. Python uses 4-space indentation instead of braces.</p>
<div class="example-box"><pre>if age &gt;= 18:
    print("adult")
elif age &gt;= 13:
    print("teen")
else:
    print("child")

for name in ["Ali", "Zara", "Jasur"]:
    print(f"Hello, {name}")

for i in range(5):        # 0..4
    print(i)

while balance &gt; 0:
    balance -= 15000</pre></div>

<div class="warning-box"><strong>Gotcha — indentation is the syntax</strong>Python uses whitespace to define code blocks — not <code>{}</code> braces. Every block must be indented <em>exactly</em> the same amount. Never mix tabs and spaces in the same file: the interpreter will raise <code>IndentationError</code> or, worse, run silently with the wrong block structure. Use 4 spaces per level.</div>

<p><code>break</code> exits the loop. <code>continue</code> skips to the next iteration. Training loops over epochs with early-stopping <code>break</code> is the pattern you'll see everywhere in ML.</p>
` },
        { icon: "📺", title: "Watch: Python Crash Course", video: "https://www.youtube.com/watch?v=rfscVS0vtbw", videoTitle: "freeCodeCamp — Python for Beginners", content: `
<p>First 60 minutes cover everything you need. Play at 1.5x if the pace feels slow.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. What does <code>type(3.14)</code> return?</div>
<ol class="quiz-options" type="A"><li>int</li><li>float</li><li>decimal</li><li>number</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. float</strong> — numbers with a dot are <code>float</code>.</p>
<ul class="quiz-why">
<li><strong>A. int</strong> — no. <code>int</code> is for whole numbers like <code>3</code>, not <code>3.14</code>.</li>
<li><strong>C. decimal</strong> — no. <code>decimal</code> exists, but you must import it first.</li>
<li><strong>D. number</strong> — no. Python has no type called "number".</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. <code>0.1 + 0.2 == 0.3</code> is:</div>
<ol class="quiz-options" type="A"><li>True</li><li>False</li><li>Error</li><li>Depends on version</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. False</strong> — the real result is <code>0.30000000000000004</code>. Computers can't store <code>0.1</code> exactly in binary. Use <code>math.isclose(a, b)</code> to compare floats.</p>
<ul class="quiz-why">
<li><strong>A. True</strong> — no. The numbers look equal, but they are a tiny bit different inside.</li>
<li><strong>C. Error</strong> — no. Python does not show an error. It just gives the wrong-looking number.</li>
<li><strong>D. Depends on version</strong> — no. This happens in every Python, on every computer.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. <code>bool("False")</code> is:</div>
<ol class="quiz-options" type="A"><li>True</li><li>False</li><li>Error</li><li>None</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ A. True</strong> — <code>bool()</code> on a string only checks if it is empty. Any string with letters is <code>True</code>. Only <code>""</code> is <code>False</code>.</p>
<ul class="quiz-why">
<li><strong>B. False</strong> — no. Python does not read the word "False". It only checks if the string is empty.</li>
<li><strong>C. Error</strong> — no. <code>bool()</code> always works. It never gives an error.</li>
<li><strong>D. None</strong> — no. <code>bool()</code> always returns <code>True</code> or <code>False</code>, never <code>None</code>.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. <code>range(5)</code> produces:</div>
<ol class="quiz-options" type="A"><li>1..5</li><li>0..4</li><li>0..5</li><li>[5]</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. 0..4</strong> — <code>range(5)</code> starts at <code>0</code> and stops before <code>5</code>. So: 0, 1, 2, 3, 4 (five numbers).</p>
<ul class="quiz-why">
<li><strong>A. 1..5</strong> — no. Python counts from <code>0</code>, not <code>1</code>.</li>
<li><strong>C. 0..5</strong> — no. The stop number is <em>not</em> included. This is a very common mistake.</li>
<li><strong>D. [5]</strong> — no. <code>range(5)</code> gives five numbers, not a list with one item.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Correct way to check for None?</div>
<ol class="quiz-options" type="A"><li><code>x == None</code></li><li><code>x is None</code></li><li><code>x.equals(None)</code></li><li><code>type(x) == "None"</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. <code>x is None</code></strong> — <code>is</code> means "same object". Python has only one <code>None</code>, so this is the correct way.</p>
<ul class="quiz-why">
<li><strong>A. <code>x == None</code></strong> — it works, but it can break for some classes. Style checkers tell you not to use it.</li>
<li><strong>C. <code>x.equals(None)</code></strong> — no. That is Java style. Python has no <code>.equals()</code> method.</li>
<li><strong>D. <code>type(x) == "None"</code></strong> — no. <code>type(x)</code> gives a class, not a text string.</li>
</ul>
</div>
</div>
` }
      ]
    },

    "2-2": {
      title: "Functions and Data Structures",
      subtitle: "Module 2, Class 2 — Functions, lists, dicts, comprehensions",
      brokenState: { type: 'vision', grayscale: true, description: 'Sensor blindness — the Foundry cameras see only grayscale. Re-label the data stream to recalibrate.' },
      sections: [
        { icon: "👁️", title: "Scenario — The Broken Eye", content: `
<div class="warning-box"><strong>The Foundry is offline.</strong>The Foundry's visual sensors can't tell a <code>cat</code> from a <code>dog</code>, because no one labelled the training images. Functions and data structures are how you feed labelled examples back into the pipeline.</div>
<p>In the real world, 80% of ML engineering is moving data between <em>structures</em> (lists, dicts) using <em>functions</em> (tiny, reusable, pure). By the end of this class you'll build the re-calibration routine — a function that takes a raw image batch and returns a list of labelled observations.</p>

<div class="cv-labeler" data-task="2-2-recalibrate">
  <div class="cv-labeler-header">
    <div class="cv-labeler-title">Sensor Re-calibration · 5 samples</div>
    <div class="cv-labeler-progress"><b class="cv-done">0</b>/5 labelled</div>
  </div>
  <div class="cv-labeler-samples">
    <div class="cv-sample" data-truth="cat"><div class="cv-thumb"><img src="assets/img/cv-samples/cv-sample-1-cat.webp" alt="cat" loading="lazy"></div><div class="cv-choices"><button data-pick="cat">cat</button><button data-pick="dog">dog</button></div></div>
    <div class="cv-sample" data-truth="dog"><div class="cv-thumb"><img src="assets/img/cv-samples/cv-sample-2-dog.webp" alt="dog" loading="lazy"></div><div class="cv-choices"><button data-pick="cat">cat</button><button data-pick="dog">dog</button></div></div>
    <div class="cv-sample" data-truth="cat"><div class="cv-thumb"><img src="assets/img/cv-samples/cv-sample-3-cat.webp" alt="cat" loading="lazy"></div><div class="cv-choices"><button data-pick="cat">cat</button><button data-pick="dog">dog</button></div></div>
    <div class="cv-sample" data-truth="dog"><div class="cv-thumb"><img src="assets/img/cv-samples/cv-sample-4-dog.webp" alt="dog" loading="lazy"></div><div class="cv-choices"><button data-pick="cat">cat</button><button data-pick="dog">dog</button></div></div>
    <div class="cv-sample" data-truth="dog"><div class="cv-thumb"><img src="assets/img/cv-samples/cv-sample-5-dog.webp" alt="dog" loading="lazy"></div><div class="cv-choices"><button data-pick="cat">cat</button><button data-pick="dog">dog</button></div></div>
  </div>
  <div class="cv-labeler-status">The sensors see only grayscale. Label every sample to recalibrate them.</div>
</div>
` },
        { icon: "🔧", title: "Functions", content: `
<div class="example-box"><pre>def greet(name, greeting="Salom"):
    return f"{greeting}, {name}!"

greet("Ali")                  # "Salom, Ali!"
greet("Ali", greeting="Hi")   # "Hi, Ali!"</pre></div>
<ul>
<li><strong>Positional args</strong> — passed in order.</li>
<li><strong>Default values</strong> — never use a mutable default (<code>x=[]</code>).</li>
<li><strong>Keyword args</strong> — self-documenting.</li>
<li><strong>*args, **kwargs</strong> — variable arguments, used when wrapping other functions.</li>
</ul>
<p>Return multiple values as a tuple: <code>return x, y</code>. Unpack with <code>a, b = my_func()</code>.</p>
<div class="info-box"><strong>Rule of thumb:</strong> if a function is longer than your screen, it should be two functions.</div>
` },
        { icon: "📜", title: "Lists, Tuples, Dicts, Sets", content: `
<p><strong>Lists</strong> — ordered, mutable. <strong>Tuples</strong> — ordered, immutable. <strong>Dicts</strong> — key→value map. <strong>Sets</strong> — unordered unique values.</p>
<div class="example-box"><pre>fruits = ["apple", "grape", "fig"]   # list
point = (3, 5)                       # tuple
user = {"name": "Zara", "age": 22}   # dict
numbers = {1, 2, 3}                  # set</pre></div>
<h4>Most common ops</h4>
<ul>
<li><code>fruits[-1]</code> — last element. <code>fruits[1:3]</code> — slice.</li>
<li><code>"apple" in fruits</code> — membership (O(n) for lists, O(1) for sets/dicts).</li>
<li><code>user.get("email", "n/a")</code> — safe dict lookup.</li>
<li><code>user.keys()</code>, <code>user.values()</code>, <code>user.items()</code>.</li>
</ul>
<div class="info-box"><strong>Set for deduplication:</strong> <code>unique_users = set(user_ids)</code> is the fastest way to collapse duplicates in millions of rows.</div>
` },
        { icon: "✨", title: "Comprehensions", content: `
<div class="example-box"><pre>squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
prices_usd = {k: v / 12500 for k, v in prices.items()}</pre></div>
<p>Compact way to build a list, dict, or set from another iterable. If the expression is longer than one line or has nested conditionals, use a regular <code>for</code> loop — readability wins.</p>
<div class="info-box"><strong>Coming up:</strong> NumPy/Pandas will replace most numeric comprehensions with vectorized operations.</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. <code>[1, 2, 3][-1]</code> is:</div>
<ol class="quiz-options" type="A"><li>1</li><li>3</li><li>-1</li><li>IndexError</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. 3.</strong> Python supports negative indices — <code>-1</code> is the last element, <code>-2</code> the second-to-last, and so on. You'll use this constantly for "give me the newest record" patterns.</p>
<ul class="quiz-why">
<li><strong>A. 1</strong> — no. That is <code>list[0]</code>, the first element. Python indexes from 0, not 1.</li>
<li><strong>C. -1</strong> — no. The <code>-1</code> inside the brackets is an index, not a value. Python looks up position <code>-1</code> and returns what is stored there.</li>
<li><strong>D. IndexError</strong> — no. <code>IndexError</code> only fires when the index is out of range (e.g. <code>list[10]</code> on a 3-item list). Any index between <code>-len(list)</code> and <code>len(list) - 1</code> is valid.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Which is immutable?</div>
<ol class="quiz-options" type="A"><li>list</li><li>dict</li><li>set</li><li>tuple</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ D. tuple.</strong> A tuple is ordered and <strong>frozen at creation</strong> — you cannot add, remove, or replace items after. This is exactly what makes tuples hashable, which is why they can serve as dictionary keys and set members.</p>
<ul class="quiz-why">
<li><strong>A. list</strong> — no. Lists are the canonical mutable sequence in Python. <code>x.append()</code>, <code>x[0] = y</code>, <code>x.pop()</code> all mutate in place.</li>
<li><strong>B. dict</strong> — no. Dicts are mutable too. <code>d[k] = v</code> assigns; <code>d.pop(k)</code> removes. Only the keys must be immutable — the dict itself is not.</li>
<li><strong>C. set</strong> — no. Sets are mutable (<code>s.add()</code>, <code>s.discard()</code>). The "frozen" variant is <code>frozenset</code>, which is immutable and hashable.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. <code>{1, 2, 2, 3, 1}</code> evaluates to:</div>
<ol class="quiz-options" type="A"><li><code>{1, 2, 2, 3, 1}</code></li><li><code>{1, 2, 3}</code></li><li><code>[1, 2, 3]</code></li><li>SyntaxError</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. <code>{1, 2, 3}</code>.</strong> Sets deduplicate automatically — a set is a mathematical set, and by definition cannot contain duplicates. This is the idiomatic Python way to strip repeats from a list: <code>set(my_list)</code>.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. Sets never store duplicates, even in the literal syntax. Python silently drops them while constructing the set.</li>
<li><strong>C</strong> — no. Square brackets <code>[]</code> create a list. Curly braces <code>{}</code> with comma-separated values create a set. Different data structures.</li>
<li><strong>D</strong> — no. <code>{1, 2, 2, 3, 1}</code> is perfectly valid Python syntax — duplicates are allowed at parse time; they simply disappear at construction.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Why avoid <code>def f(x=[])</code>?</div>
<ol class="quiz-options" type="A"><li>Syntax error</li><li>The same list is shared across calls</li><li>Slower than None</li><li>Not allowed in Py3</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. The same list is shared across calls.</strong> Default arguments are evaluated <em>once</em>, at function-definition time — not at each call. So every call to <code>f()</code> sees the same list object, carrying any mutations from previous calls. <strong>Classic Python bug source.</strong> Use <code>x=None</code> and <code>if x is None: x = []</code> inside the body.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. Syntactically valid. That is what makes this bug so dangerous — the interpreter accepts it silently.</li>
<li><strong>C</strong> — no. Speed is not the issue; correctness is. Using <code>None</code> is about avoiding shared mutable state, not performance.</li>
<li><strong>D</strong> — no. Still allowed in Python 3, still dangerous. The language keeps this behaviour for backward compatibility and because linters will flag it for you.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best way to test membership in 1M items queried thousands of times?</div>
<ol class="quiz-options" type="A"><li>List <code>in</code></li><li>Manual loop</li><li>Convert to set, then test</li><li>Sort first</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C. Convert to set, then test.</strong> Sets use hashing — each <code>in</code> test is <strong>O(1) on average</strong> regardless of size. Converting costs O(n) once; every subsequent lookup is constant-time. For 1M items queried thousands of times, this is thousands of times faster than scanning a list.</p>
<ul class="quiz-why">
<li><strong>A. List <code>in</code></strong> — no. Python walks the list item-by-item until it finds a match. That is O(n) per query. 1M × 1000 queries = 10⁹ comparisons. Takes seconds or minutes.</li>
<li><strong>B. Manual loop</strong> — no. That is what <code>list in</code> does already, just slower because you wrote the loop in Python instead of C.</li>
<li><strong>D. Sort first</strong> — no. Sorted lists allow O(log n) binary search — better than O(n), but still worse than set's O(1). You would also pay O(n log n) for the sort up front.</li>
</ul>
</div>
</div>
` }
      ]
    },

    "2-3": {
      title: "NumPy Fundamentals",
      subtitle: "Module 2, Class 3 — Arrays, vectorization, linear algebra basics",
      brokenState: { type: 'math', physicsDisabled: true, description: 'Vector math offline — blocks drift because linear algebra is down.' },
      sections: [
        { icon: "🧮", title: "Why NumPy?", content: `
<p>Plain Python loops are slow for numeric work — 10-50x slower than NumPy for a million floats. Every ML library is built on NumPy or something NumPy-shaped.</p>
<ul>
<li><strong>ndarray</strong> — homogeneous, fixed-size, multi-dimensional, contiguous memory.</li>
<li><strong>Vectorized ops</strong> — <code>arr * 2</code> doubles every element, no Python loop.</li>
<li><strong>Broadcasting</strong> — rules for ops between different-shape arrays.</li>
<li><strong>Linear algebra</strong> — matmul, decompositions, solvers, all in C.</li>
</ul>
<div class="info-box"><strong>Convention:</strong> <code>import numpy as np</code>. The <code>np</code> alias is universal.</div>
` },
        { icon: "📊", title: "Creating and Indexing Arrays", content: `
<div class="example-box"><pre>a = np.array([1, 2, 3])              # from list
b = np.zeros(5)
c = np.ones((2, 3))
d = np.arange(0, 10, 2)              # [0 2 4 6 8]
e = np.linspace(0, 1, 5)             # 5 evenly-spaced points
f = np.random.rand(3, 3)             # random floats [0, 1)</pre></div>
<p>Key attributes: <code>arr.shape</code>, <code>arr.dtype</code>, <code>arr.ndim</code>, <code>arr.size</code>.</p>
<h4>Indexing forms</h4>
<pre>arr[1, 2]                    # row 1, col 2
arr[:, 0]                    # first column
arr[ages &gt;= 18]              # boolean mask
arr[[0, 2, 4]]               # fancy indexing</pre>
<div class="info-box"><strong>View vs copy:</strong> basic slices return views (share memory). Boolean and fancy indexing return copies.</div>
` },
        { icon: "⚡", title: "Vectorization and Broadcasting", content: `
<div class="example-box"><pre>a + b      # element-wise
a * b
np.sqrt(a)
(preds - targets) ** 2      # MSE in one line</pre></div>
<h4>Broadcasting rules</h4>
<ol>
<li>Align shapes from the right.</li>
<li>Dimensions of size 1 are stretched to match.</li>
<li>Missing dimensions on the left are treated as size 1.</li>
</ol>
<p>Shape <code>(3, 4) + (4,)</code> → <code>(3, 4)</code>. Shape <code>(3, 1) + (1, 4)</code> → <code>(3, 4)</code> grid.</p>
<p><strong>Why vectorize?</strong> Computing squared error for 1M predictions: Python loop ~200ms, NumPy ~2ms. 100x faster.</p>
` },
        { icon: "📺", title: "Watch: Complete NumPy Tutorial", video: "https://www.youtube.com/watch?v=GB9ByFAIAH4", videoTitle: "Keith Galli — NumPy in Jupyter", content: `
<p>Best single-video NumPy walkthrough on YouTube. Keith shows real output for everything.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. <code>np.arange(0, 10, 2)</code> produces:</div>
<ol class="quiz-options" type="A"><li>[0..9]</li><li>[0 2 4 6 8]</li><li>[0 2 4 6 8 10]</li><li>[2 4 6 8]</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. [0 2 4 6 8].</strong> <code>np.arange(start, stop, step)</code> follows the same rule as Python's built-in <code>range</code>: <strong>start is inclusive, stop is exclusive</strong>. The walk is 0, 2, 4, 6, 8 — the next would be 10, which is equal to stop, so it's excluded.</p>
<ul class="quiz-why">
<li><strong>A. [0..9]</strong> — no. That would be <code>np.arange(0, 10)</code> with the default step of 1. The <code>2</code> argument makes this a stride-of-2 sequence.</li>
<li><strong>C. [0 2 4 6 8 10]</strong> — no. Including 10 would require an <em>inclusive</em> stop. If you need endpoints on both sides, use <code>np.linspace(0, 10, 6)</code>.</li>
<li><strong>D. [2 4 6 8]</strong> — no. Start is 0, not 2. Confusing start with the first non-zero element is the classic beginner slip.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. An array of shape (4, 3) has what size?</div>
<ol class="quiz-options" type="A"><li>3</li><li>4</li><li>7</li><li>12</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ D. 12.</strong> The <code>size</code> of an ndarray is the <strong>product of its shape dimensions</strong> — the total element count. For shape <code>(4, 3)</code> that's 4 × 3 = 12. Use <code>arr.size</code> when you need total elements; use <code>arr.shape</code> when you need per-axis counts.</p>
<ul class="quiz-why">
<li><strong>A. 3</strong> — no. 3 is the number of <em>columns</em>, which is <code>arr.shape[1]</code>, not the total element count.</li>
<li><strong>B. 4</strong> — no. 4 is the number of <em>rows</em>, which is <code>arr.shape[0]</code>. Again, not the total.</li>
<li><strong>C. 7</strong> — no. Adding 4 + 3 never applies to array sizes. Memory allocation is by multiplication because storage is row-major.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Why is NumPy faster than a Python loop?</div>
<ol class="quiz-options" type="A"><li>Runs on GPU</li><li>Uses less RAM</li><li>Vectorized ops execute in compiled C with no per-element overhead</li><li>Python is single-threaded</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C. Vectorized ops execute in compiled C with no per-element overhead.</strong> A Python <code>for</code> loop pays interpreter cost for every iteration: type-checking, bytecode dispatch, reference counting. NumPy pushes the whole loop into a single C call, so you pay that overhead <em>once</em> for the whole operation. <strong>Typical speedup: 50×–200×.</strong></p>
<ul class="quiz-why">
<li><strong>A. Runs on GPU</strong> — no. Standard NumPy runs on CPU only. For GPU execution you use CuPy, PyTorch, or JAX — which all mimic NumPy's API for this reason.</li>
<li><strong>B. Uses less RAM</strong> — no. NumPy often uses <em>more</em> RAM than a Python list because it preallocates contiguous memory for the whole array. The speed comes from that layout, not from size.</li>
<li><strong>D. Python is single-threaded</strong> — no. That's a real limitation (the GIL), but it's not why NumPy is fast. NumPy sidesteps the GIL by running in C; that's a consequence of vectorization, not the cause.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Shape (5, 3) + shape (3,) =</div>
<ol class="quiz-options" type="A"><li>(5, 3)</li><li>(3,)</li><li>(5,)</li><li>ValueError</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ A. (5, 3).</strong> Broadcasting aligns shapes <em>from the right</em>. The <code>(3,)</code> array matches the trailing dimension of <code>(5, 3)</code>, so NumPy stretches it along the leading axis — the same 3-element row is added to each of the 5 rows. Output stays <code>(5, 3)</code>.</p>
<ul class="quiz-why">
<li><strong>B. (3,)</strong> — no. The result always takes the <em>broadcast shape</em>, never one of the operands' smaller shapes. Only a reduction (like <code>sum(axis=0)</code>) would collapse a dimension.</li>
<li><strong>C. (5,)</strong> — no. This would require collapsing the column axis, which broadcasting never does. Broadcasting stretches; only reductions shrink.</li>
<li><strong>D. ValueError</strong> — no. Shapes are compatible because the trailing dims match (both are 3). You'd only get a ValueError if the trailing dims disagreed, like <code>(5, 3) + (4,)</code>.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Reshape a 12-elem array into 3 cols without computing rows:</div>
<ol class="quiz-options" type="A"><li><code>reshape(4, 3)</code></li><li><code>reshape(-1, 3)</code></li><li><code>reshape(3, auto)</code></li><li><code>reshape(?, 3)</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. <code>reshape(-1, 3)</code>.</strong> NumPy treats <code>-1</code> as "<strong>infer this axis from the total element count</strong>". Here NumPy knows the total is 12 and the other axis is 3, so it computes 12 / 3 = 4 and returns shape <code>(4, 3)</code>. <strong>Use <code>-1</code> whenever your row count depends on runtime data.</strong></p>
<ul class="quiz-why">
<li><strong>A. <code>reshape(4, 3)</code></strong> — no. Works for this exact 12-element case, but breaks the moment your data changes size. <code>-1</code> is the more maintainable pattern.</li>
<li><strong>C. <code>reshape(3, auto)</code></strong> — no. <code>auto</code> is not a NumPy keyword. The placeholder is specifically the integer <code>-1</code>.</li>
<li><strong>D. <code>reshape(?, 3)</code></strong> — no. Question marks are not valid in Python. You'll get a SyntaxError before NumPy sees the call.</li>
</ul>
</div>
</div>
` }
      ]
    },

    "2-4": {
      title: "Pandas for Data Analysis",
      subtitle: "Module 2, Class 4 — DataFrames, filtering, groupby, merging",
      brokenState: { type: 'data', physicsDisabled: true, description: 'DataFrame integrity lost — records scatter until you restore the index.' },
      sections: [
        { icon: "🐼", title: "Series and DataFrames", content: `
<p>Pandas is a programmable spreadsheet. <strong>Series</strong> = one labeled column. <strong>DataFrame</strong> = 2D labeled table with an index.</p>
<div class="example-box"><pre>import pandas as pd

df = pd.DataFrame({
    "name": ["Ali", "Zara", "Jasur"],
    "age":  [22, 28, 31],
    "city": ["Tashkent", "Samarkand", "Bukhara"]
})</pre></div>
<p>90% of ML work starts with loading, cleaning, and engineering features in a DataFrame.</p>
` },
        { icon: "📂", title: "Loading and Exploring", content: `
<div class="example-box"><pre>df = pd.read_csv("customers.csv")
df = pd.read_csv("data.csv", parse_dates=["created_at"])

df.head()          # first 5 rows
df.shape           # (rows, cols)
df.info()          # dtypes + non-null counts
df.describe()      # summary stats
df.isna().sum()    # missing count per col</pre></div>
<p>Also: <code>read_excel</code>, <code>read_json</code>, <code>read_parquet</code>, <code>read_sql</code>. For huge CSVs, use <code>chunksize=</code> or switch to Parquet.</p>
` },
        { icon: "🔍", title: "Filtering, GroupBy, Merging", content: `
<h4>Selection</h4>
<pre>df["age"]                       # Series
df[["name", "age"]]             # DataFrame
df.loc[0]                       # by label
df.iloc[0]                      # by position
df[(df.age &gt;= 18) &amp; (df.city == "Tashkent")]</pre>
<p>Use <code>&amp;</code> and <code>|</code> (not <code>and</code>/<code>or</code>). Parentheses around each condition are mandatory.</p>
<h4>GroupBy: split-apply-combine</h4>
<pre>df.groupby("city")["age"].mean()
df.groupby("city").agg({"age": "mean", "name": "count"})</pre>
<h4>Merging (SQL-style)</h4>
<pre>pd.merge(customers, orders, on="id", how="left")</pre>
<p>Joins: <code>inner</code> (intersection), <code>left</code>, <code>right</code>, <code>outer</code>. Wrong join silently drops or duplicates rows.</p>
` },
        { icon: "📺", title: "Watch: Solving Real Problems with Pandas", video: "https://www.youtube.com/watch?v=vmEHCJofslg", videoTitle: "Keith Galli — Pandas end-to-end", content: `
<p>Keith works through Kaggle-style problems with commentary. Better than any docs for building intuition.</p>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. <code>loc</code> vs <code>iloc</code>?</div>
<ol class="quiz-options" type="A"><li>Identical</li><li><code>loc</code> by label, <code>iloc</code> by position</li><li><code>loc</code> faster</li><li><code>iloc</code> is columns-only</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. <code>loc</code> by label, <code>iloc</code> by integer position.</strong> <code>df.loc["customer_123"]</code> finds the row whose index label is that string; <code>df.iloc[0]</code> finds the first row regardless of label. <strong>Pick <code>loc</code> when your index carries meaning, <code>iloc</code> when you want positional slicing.</strong></p>
<ul class="quiz-why">
<li><strong>A. Identical</strong> — no. They behave identically only when your index happens to be <code>0, 1, 2, …</code>. The moment you set a meaningful index (date, customer ID), they diverge sharply.</li>
<li><strong>C. <code>loc</code> faster</strong> — no. Speed is roughly the same for both. Pick based on semantics, not performance.</li>
<li><strong>D. <code>iloc</code> is columns-only</strong> — no. Both work for rows AND columns: <code>df.iloc[0, 2]</code> is row 0, column 2. Both accept slices on either axis.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Correct filter for adults in Tashkent?</div>
<ol class="quiz-options" type="A"><li><code>df[df.age &gt;= 18 and df.city == "T"]</code></li><li><code>df[(df.age &gt;= 18) &amp; (df.city == "T")]</code></li><li><code>df[df.age &gt;= 18 &amp;&amp; df.city == "T"]</code></li><li><code>df.filter(...)</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. <code>(df.age &gt;= 18) &amp; (df.city == "T")</code>.</strong> Pandas requires <strong><code>&amp;</code> for element-wise AND</strong> (and <code>|</code> for OR) on boolean Series, plus <strong>parentheses around each condition</strong> — because <code>&amp;</code> has higher operator precedence than <code>&gt;=</code>, so without parens Python evaluates it wrong.</p>
<ul class="quiz-why">
<li><strong>A. <code>and</code></strong> — no. Python's <code>and</code> evaluates Series truthiness, which raises <code>ValueError: The truth value of a Series is ambiguous</code>. A Series is an array, not a single True/False.</li>
<li><strong>C. <code>&amp;&amp;</code></strong> — no. That is JavaScript/C/Java syntax. Python has no <code>&amp;&amp;</code> operator — it's a SyntaxError before the code even runs.</li>
<li><strong>D. <code>df.filter(...)</code></strong> — no. <code>df.filter</code> selects by column/index <em>name</em>, not by row predicate. For row-level filtering you always use boolean indexing.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. <code>df.groupby("city")["age"].mean()</code> returns:</div>
<ol class="quiz-options" type="A"><li>DataFrame</li><li>Series indexed by city</li><li>List</li><li>Scalar</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. Series indexed by city.</strong> <code>groupby("city")</code> buckets rows by city; <code>["age"]</code> selects one column; <code>.mean()</code> reduces to a single number per bucket. The result is a <strong>Series whose index is the unique city values</strong> and whose values are the per-city mean ages.</p>
<ul class="quiz-why">
<li><strong>A. DataFrame</strong> — no. You'd get a DataFrame only if you applied the reduction to <em>multiple</em> columns, e.g. <code>df.groupby("city")[["age", "income"]].mean()</code> or passed a dict to <code>.agg()</code>.</li>
<li><strong>C. List</strong> — no. Pandas never returns a raw Python list from <code>groupby().agg()</code>. You could call <code>.tolist()</code> on the Series to convert, but you'd lose the city labels.</li>
<li><strong>D. Scalar</strong> — no. A scalar would be the result of <code>df["age"].mean()</code> (no groupby). The groupby call adds a per-group dimension, giving a Series.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Left join: unmatched left rows become:</div>
<ol class="quiz-options" type="A"><li>Dropped</li><li>Kept with NaN on right</li><li>Error</li><li>Duplicated</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. Kept with NaN on the right.</strong> A left join guarantees <strong>every row from the left DataFrame appears in the output</strong>. When no matching key exists on the right, the right-side columns fill with <code>NaN</code>. Use this when the left table is your "source of truth" (e.g., every customer must appear, even those with no orders).</p>
<ul class="quiz-why">
<li><strong>A. Dropped</strong> — no. That is an <em>inner</em> join, which only keeps rows with matches on BOTH sides.</li>
<li><strong>C. Error</strong> — no. Merges with unmatched keys are normal and expected. Pandas never errors on missing matches.</li>
<li><strong>D. Duplicated</strong> — no. Rows duplicate only when the key is non-unique on the <em>right</em> side (one-to-many join). That's a separate concern from left-vs-inner.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. 5GB CSV crashes your laptop. First move?</div>
<ol class="quiz-options" type="A"><li>Buy RAM</li><li><code>chunksize=</code> or Parquet</li><li>Ignore</li><li>Split in Excel</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. <code>chunksize=</code> or switch to Parquet.</strong> <code>pd.read_csv(path, chunksize=100_000)</code> returns an iterator that processes the file in chunks, so you never hold the whole 5GB in RAM. Better: convert once to <strong>Parquet</strong> (columnar + compressed), and subsequent reads are 10–50× faster and load only the columns you need.</p>
<ul class="quiz-why">
<li><strong>A. Buy RAM</strong> — no. Scaling hardware is the last resort. The skill you want is making the software fit the hardware — chunking and columnar formats work on any machine.</li>
<li><strong>C. Ignore</strong> — no. Real datasets in Uzbek telecom / fintech routinely hit GB scale. If you can't handle them, you can't work there.</li>
<li><strong>D. Split in Excel</strong> — no. Excel can't open files above its row limit, and manual splitting loses row integrity across the seams.</li>
</ul>
</div>
</div>
` }
      ]
    },

    "2-5": {
      title: "Data Visualization",
      subtitle: "Module 2, Class 5 — Matplotlib, Seaborn, telling stories with charts",
      brokenState: { type: 'vision', grayscale: true, description: 'Display calibration failed — visualization layer rendering in monochrome.' },
      sections: [
        { icon: "📈", title: "Exploratory vs Explanatory", content: `
<p>Two jobs for viz:</p>
<ul>
<li><strong>Exploratory</strong> — for yourself. Ugly is fine, speed matters.</li>
<li><strong>Explanatory</strong> — for others. Beauty matters, one message per chart.</li>
</ul>
<p>Anscombe's quartet: four datasets with identical summary stats look completely different when plotted. Summary stats lie; charts don't.</p>
<div class="info-box"><strong>Before training any model:</strong> plot the target distribution and every feature vs target. You catch leakage and outliers 10x faster with plots.</div>
` },
        { icon: "🎨", title: "Matplotlib and Seaborn", content: `
<div class="example-box"><pre>import matplotlib.pyplot as plt
import seaborn as sns

plt.hist(df["age"], bins=20)
plt.scatter(df["x"], df["y"])

sns.histplot(df, x="age", kde=True)
sns.boxplot(df, x="churned", y="avg_topup")
sns.scatterplot(df, x="calls", y="data", hue="churned")
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")</pre></div>
<p>Reach for Seaborn first. Drop to Matplotlib when you need fine control. Every Seaborn plot is a Matplotlib figure you can annotate.</p>
<h4>OO Matplotlib for anything non-trivial</h4>
<pre>fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(x, y)
ax.set_xlabel("x"); ax.set_title("Squares")
fig.savefig("out.png", dpi=150)</pre>
` },
        { icon: "🗣️", title: "Five Rules for Honest Charts", content: `
<ol>
<li><strong>Label axes with units.</strong> "Revenue (million soum)" not "Revenue."</li>
<li><strong>Bar charts start y-axis at zero.</strong> Cutting the axis exaggerates differences.</li>
<li><strong>Right chart type.</strong> Bar for categories. Line for time. Histogram for distributions. Scatter for relationships. Pie charts: almost never.</li>
<li><strong>Remove chartjunk.</strong> 3D, shadows, rainbow colorbars — all must earn their place.</li>
<li><strong>One message per chart.</strong> If you need a legend with 8 items, you have 8 messages. Split.</li>
</ol>
<div class="case-study"><h4>Log scale moment</h4><p>Plotting income linearly with a few billionaires flattens everyone else. <code>plt.yscale("log")</code> reveals the true distribution shape. Knowing when to reach for log separates junior from senior.</p></div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. Distribution of a numeric column — best chart?</div>
<ol class="quiz-options" type="A"><li>Bar</li><li>Pie</li><li>Histogram</li><li>Scatter</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C. Histogram.</strong> A histogram <strong>buckets continuous values into bins</strong> and shows how many fall in each — the clearest way to read a distribution's shape, centre, and tails. First plot before training: <code>sns.histplot(df, x="age", kde=True)</code>.</p>
<ul class="quiz-why">
<li><strong>A. Bar</strong> — no. Bar charts are for <em>categorical</em> data (one bar per category). For continuous numeric data, a bar chart would either collapse too many values or create one bar per unique number — unreadable.</li>
<li><strong>B. Pie</strong> — no. Pie charts show <em>parts of a whole</em> for a few discrete categories. They are almost never the right answer for ML work, and never for a continuous variable.</li>
<li><strong>D. Scatter</strong> — no. Scatter plots show the relationship between <em>two</em> variables. For one variable you lose half the axis.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. What does Seaborn add over Matplotlib?</div>
<ol class="quiz-options" type="A"><li>Different engine</li><li>Shorter syntax, DataFrame-native stat plots</li><li>Interactive</li><li>3D</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. Shorter syntax and DataFrame-native statistical plots.</strong> Seaborn is a <strong>high-level wrapper over Matplotlib</strong> — one line of Seaborn does what 5–10 lines of Matplotlib would. It understands DataFrames natively (<code>sns.boxplot(df, x="group", y="value")</code>) and includes statistical overlays (KDE, regression lines, confidence bands) out of the box.</p>
<ul class="quiz-why">
<li><strong>A. Different engine</strong> — no. Every Seaborn plot IS a Matplotlib figure underneath. You can grab the axis with <code>plt.gca()</code> and customize with Matplotlib commands.</li>
<li><strong>C. Interactive</strong> — no. Seaborn is static. For interactivity (zoom, hover, click), you'd use Plotly, Bokeh, or Altair.</li>
<li><strong>D. 3D</strong> — no. Neither Matplotlib nor Seaborn is primarily for 3D. 3D is rarely useful for data viz anyway — it obscures more than it reveals.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Compare age distribution between churned and non-churned customers:</div>
<ol class="quiz-options" type="A"><li>Line</li><li>Pie</li><li>Box plot split by churn</li><li>Heatmap</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C. Box (or violin) plot split by churn.</strong> You need to see two distributions <em>side-by-side</em>. A box plot per group shows median, quartiles, and outliers at a glance — you can tell in one second whether churners skew younger or older. Violin plots add distribution shape on top.</p>
<ul class="quiz-why">
<li><strong>A. Line</strong> — no. Line charts are for a value changing over an ordered axis (typically time). They don't work for comparing two independent distributions.</li>
<li><strong>B. Pie</strong> — no. Pies show composition, not distribution shape. You'd lose every statistical property of the data.</li>
<li><strong>D. Heatmap</strong> — no. Heatmaps visualize a 2D matrix (typically correlations or 2D histograms). For a 1D distribution comparison, it's overkill and hard to read.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Anscombe's quartet teaches:</div>
<ol class="quiz-options" type="A"><li>Stats are always enough</li><li>Identical summary stats can hide different shapes — always plot</li><li>Four is the minimum</li><li>Correlation = causation</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. Identical summary stats can hide completely different shapes — always plot.</strong> Anscombe constructed four datasets with identical mean, variance, correlation, and regression line. Plotted, they are wildly different (one is a clean line, one is a curve, one has an outlier, one is a vertical line). <strong>Summary statistics lie. Charts don't.</strong></p>
<ul class="quiz-why">
<li><strong>A. Stats are always enough</strong> — no. That is exactly the belief Anscombe's quartet was designed to destroy. Anyone trusting only the summary would draw identical conclusions from four very different datasets.</li>
<li><strong>C. Four is the minimum</strong> — no. The "four" is just how many datasets Anscombe created to demonstrate the point. There is no magical minimum — you could illustrate the same lesson with two.</li>
<li><strong>D. Correlation = causation</strong> — no. That is a different (also true) statistical caution, but Anscombe's quartet specifically attacks <em>summary-stat reliance</em>, not causal inference.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. When to use log scale on y-axis?</div>
<ol class="quiz-options" type="A"><li>Always</li><li>When data spans orders of magnitude</li><li>Only time series</li><li>Never</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B. When data spans orders of magnitude.</strong> A linear y-axis assigns equal visual space to equal <em>differences</em>. When values range from 1 to 1,000,000, that squashes small values into invisibility. A log axis assigns equal space to equal <em>ratios</em>, so 1 → 10 occupies the same visual distance as 100,000 → 1,000,000.</p>
<ul class="quiz-why">
<li><strong>A. Always</strong> — no. For bounded or roughly-linear data (e.g., percentages, temperatures), log scale <em>distorts</em> the shape and confuses readers.</li>
<li><strong>C. Only time series</strong> — no. Log scale has nothing to do with whether the x-axis is time. It's about the y-axis value range, regardless of x.</li>
<li><strong>D. Never</strong> — no. It is the correct call for population counts, income distributions, compute/memory scaling, or anything growing exponentially.</li>
</ul>
</div>
</div>
` }
      ]
    },

    "2-6": {
      title: "Lab: Exploratory Data Analysis",
      subtitle: "Module 2, Class 6 — Hands-on EDA on a real dataset",
      brokenState: { type: 'chaos', physicsDisabled: true, grayscale: true, description: 'Full system failure — physics AND vision down. EDA is how you diagnose both.' },
      sections: [
        { icon: "🎯", title: "Final Lab — 10 Industry-Grade Scenarios", content: `
<p>The Module 2 capstone is a <strong>3-developer team project</strong>. Today's task is to <strong>pick ONE scenario, download the dataset, clean it</strong> using the platform's hygiene rules, and write up two design documents — Phase 1 (<em>WHAT</em> tools/methods you propose) and Phase 2 (<em>WHY</em> each choice is right).</p>

<div class="info-box"><strong>Today, no code.</strong> Just dataset + cleaning + the two markdown docs. Mentor sign-off required before any implementation.</div>

<p style="margin: 12px 0;">📖 <strong>Click any scenario below to read its full brief.</strong> Each one expands to show the business problem, dataset spec, hygiene rules, and deliverable. Three buttons at the bottom of each scenario take you to the dataset, Doc 1 template, and Doc 2 template.</p>

<style>
  /* Force dark text on the (light) lecture-card surface — the site's global
     CSS styles strong/em/h-tags for dark-mode and they inherit poorly here. */
  details.scenario { border: 1px solid #cfd6dd; border-radius: 8px; padding: 14px 18px; margin: 10px 0; background: #f6f8fa; color: #1a1f2e !important; }
  details.scenario[open] { border-color: #2563eb; background: #ffffff; }
  details.scenario summary { cursor: pointer; font-weight: 700; padding: 6px 0; list-style: none; outline: none; color: #1a1f2e !important; font-size: 1.02em; }
  details.scenario summary * { color: #1a1f2e !important; }
  details.scenario summary::-webkit-details-marker { display: none; }
  details.scenario summary::before { content: "▶  "; color: #555 !important; opacity: 0.85; }
  details.scenario[open] summary::before { content: "▼  "; }
  details.scenario summary .meta { font-weight: 400; font-size: 0.93em; color: #5a6471 !important; }
  details.scenario .scenario-body { padding: 6px 0 4px; line-height: 1.6; }
  details.scenario .scenario-body,
  details.scenario .scenario-body p,
  details.scenario .scenario-body ul,
  details.scenario .scenario-body li,
  details.scenario .scenario-body span,
  details.scenario .scenario-body strong,
  details.scenario .scenario-body em { color: #1a1f2e !important; }
  details.scenario .scenario-body h6 { margin: 14px 0 4px; color: #1d4ed8 !important; font-size: 1em; font-weight: 700; }
  details.scenario .scenario-body code { background: #eef0f3; color: #b91c1c !important; padding: 1px 5px; border-radius: 3px; font-size: 0.92em; }
  details.scenario .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; padding-top: 12px; border-top: 1px solid #d8dde3; }
  details.scenario .actions a { display: inline-block; padding: 8px 14px; border-radius: 6px; text-decoration: none !important; font-size: 0.92em; font-weight: 600; color: #ffffff !important; transition: opacity 0.15s; }
  details.scenario .actions .btn-data { background: #2563eb; }
  details.scenario .actions .btn-doc1 { background: #d97706; }
  details.scenario .actions .btn-doc2 { background: #059669; }
  details.scenario .actions a:hover { opacity: 0.88; }
</style>

<details class="scenario">
<summary>1. Renewable Energy Grid Optimization <span class="meta">— Energy / Smart Grid · ~7M rows</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> A national grid operator runs 200+ wind and solar plants. Power output is volatile (clouds, wind gusts), and the operator must pre-dispatch coal capacity to balance shortfalls. Analyse 1 year of 15-minute-interval generation data to find <em>when</em> and <em>where</em> renewables fall short.</p>
<h6>Dataset</h6>
<p>Open Power System Data — 15-min time series (or Kaggle's Wind Turbine SCADA Dataset). ~7M rows: 200 plants × 35,000 timesteps.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> timestamp, plant_id, region, tech (solar/wind), generation_mwh, capacity_mw, wind_speed, irradiance, temperature_c.<br/><strong>Drop:</strong> forecast columns, telemetry health flags, plant metadata strings.</p>
<h6>Hygiene challenges</h6>
<ul><li>Mixed timestamp formats</li><li>Negative generation values from sensor faults</li><li>NaN blocks during maintenance windows</li></ul>
<h6>Deliverable</h6>
<p>Recommend 3 regions that need backup capacity, with evidence (charts + tables) showing when shortfalls occur.</p>
<div class="actions">
<a class="btn-data" href="https://data.open-power-system-data.org/time_series/" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/01_renewable_energy_grid/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/01_renewable_energy_grid/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>2. Logistics &amp; Last-Mile Delivery Chain <span class="meta">— E-commerce / Logistics · 100k+ orders</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> A regional courier handles 1.5M parcel events/year across 12 warehouses. Late deliveries cost reputation and refunds. Find the routes, hubs, and times of day that drive late delivery.</p>
<h6>Dataset</h6>
<p>Olist Brazilian E-Commerce — 6 tables, 100k+ orders.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> order_id, order_purchase_timestamp, order_delivered_customer_date, order_estimated_delivery_date, customer_state, seller_state, freight_value, product_weight_g, product_volume_cm3.<br/><strong>Drop:</strong> review text, raw lat/lon, product photo URLs.</p>
<h6>Hygiene challenges</h6>
<ul><li>~3% delivered date is NaN (parcel lost in transit)</li><li>Date columns stored as strings</li><li>Inconsistent state casing — must standardise</li></ul>
<h6>Deliverable</h6>
<p>List the 3 worst routes with quantified late-rate, and a one-line recommendation per route.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/02_logistics_delivery_chain/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/02_logistics_delivery_chain/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>3. Health Informatics — Hospital Readmission Risk <span class="meta">— Healthcare · 101k admissions</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> A hospital network wants to know which diabetes patients return within 30 days and what their treatment patterns look like. 101k anonymised admissions across 130 US hospitals over 10 years.</p>
<h6>Dataset</h6>
<p>UCI Diabetes 130-US Hospitals — 101,766 rows × 50 columns.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> encounter_id, patient_nbr, age, gender, admission_type_id, time_in_hospital, num_lab_procedures, num_medications, diabetesMed, A1Cresult, readmitted.<br/><strong>Drop:</strong> weight (97% missing), payer_code (40% missing), free-text fields.</p>
<h6>Hygiene challenges</h6>
<ul><li>'?' placeholders for missing categorical values</li><li>age stored as ranges (e.g. '[70-80)')</li><li>ICD-9 diagnosis codes need decoding into disease groups</li></ul>
<h6>Deliverable</h6>
<p>Ranked list of 5 features most associated with 30-day readmission, each with a one-line clinical interpretation.</p>
<div class="actions">
<a class="btn-data" href="https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/03_hospital_readmission/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/03_hospital_readmission/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>4. Algorithmic Trading Backtest (Equities) <span class="meta">— Financial Markets · 1.2M rows</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> Build the analytical layer of a momentum-trading backtester. Use 10 years of daily OHLCV for the S&amp;P 500 to characterise factor returns and drawdowns. Report best sector regime, worst drawdown, and Sharpe ratio.</p>
<h6>Dataset</h6>
<p>S&amp;P 500 Stocks (Daily Updated) on Kaggle — ~1.2M rows: 500 tickers × 10 years.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> Date, Symbol, Open, High, Low, Close, Volume, Sector.<br/><strong>Drop:</strong> adjusted-close (compute it yourself), share splits, dividends file.</p>
<h6>Hygiene challenges</h6>
<ul><li>Trading-day gaps (weekends, holidays)</li><li>De-listed tickers mid-period — drop survivorship bias cleanly</li></ul>
<h6>Deliverable</h6>
<p>Trading-strategy report: sector regime, drawdown chart, Sharpe ratio, plus 3 sentences on what worked and what didn't.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/andrewmvd/sp-500-stocks" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/04_trading_backtest/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/04_trading_backtest/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>5. Telecom Churn &amp; Network Quality <span class="meta">— Telecommunications · 250k subscriber-days</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> A national telecom (think Uztelecom) wants to find the network conditions that best predict churn. Combine call-detail records (CDR) with daily customer status to score 250k subscribers across 6 months.</p>
<h6>Dataset</h6>
<p>Telco Customer Churn (IBM) merged with CDR Synthetic Dataset — ~250k subscriber-days.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> customer_id, tenure, monthly_charges, total_charges, contract, payment_method, dropped_calls_per_day, data_throughput_mbps, avg_call_duration_sec, cell_handovers, Churn.<br/><strong>Drop:</strong> address strings, social ID, raw timestamps.</p>
<h6>Hygiene challenges</h6>
<ul><li>total_charges is a string with whitespace and blanks</li><li>Tenure 0 for new customers</li><li>Duplicates from system retries</li></ul>
<h6>Deliverable</h6>
<p>Top 3 actionable network features for the retention team, with quantified evidence and a one-line action per feature.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/05_telco_churn_network/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/05_telco_churn_network/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>6. E-commerce Customer Lifetime Value (RFM) <span class="meta">— Retail / E-commerce · 1M+ transactions</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> An online retailer wants to segment its 1M+ orders into RFM cohorts (Recency, Frequency, Monetary value) and visualise lifetime value by cohort. Pick the top 3 cohorts to target with reactivation.</p>
<h6>Dataset</h6>
<p>UCI Online Retail II — 1,067,371 transactions across 2 years.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> Invoice, StockCode, Description, Quantity, InvoiceDate, Price, Customer ID, Country.<br/><strong>Drop:</strong> rows with Customer ID NaN, refunds (negative quantity) — but report counts dropped.</p>
<h6>Hygiene challenges</h6>
<ul><li>Thousands of free-text product descriptions</li><li>Some prices are 0</li><li>Inconsistent UK/EU date formats</li></ul>
<h6>Deliverable</h6>
<p>Top 3 RFM cohorts ranked by reactivation potential, with a recommended marketing offer per cohort.</p>
<div class="actions">
<a class="btn-data" href="https://archive.ics.uci.edu/dataset/502/online+retail+ii" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/06_customer_lifetime_value/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/06_customer_lifetime_value/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>7. Smart City Air Quality &amp; Traffic <span class="meta">— IoT / Public Sector · 420k+ readings</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> A city deploys 50 air-quality sensors and 30 traffic counters. Find which roads' traffic best predicts which sensors' air quality, lagged by minutes — and the best lag value.</p>
<h6>Dataset</h6>
<p>Beijing PM2.5 Multi-Site (420k+ rows × 12 sites).</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> datetime, station, PM2.5, PM10, NO2, CO, temp, wind_speed, traffic_count.<br/><strong>Drop:</strong> station metadata, columns >50% null.</p>
<h6>Hygiene challenges</h6>
<ul><li>Sensor outages create long NaN runs</li><li>One station in UTC, others in local time</li><li>Wind direction in degrees needs sin/cos encoding</li></ul>
<h6>Deliverable</h6>
<p>Identify the road most predictive of which sensor's PM2.5, and the time lag in minutes. One paragraph for the city traffic department.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/sid321axn/beijing-multisite-airquality-data-set" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/07_smart_city_air_quality/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/07_smart_city_air_quality/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>8. Sports Analytics — Football Match Performance <span class="meta">— Sports · 25k matches</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> Match-level events from a top European football league across 5 seasons. Build a 'form curve' per team and identify the events most correlated with winning streaks. Surface the team most over-performing this season.</p>
<h6>Dataset</h6>
<p>European Soccer Database (Kaggle) — 25k matches + 11k players (SQLite).</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> match_api_id, date, home_team_api_id, away_team_api_id, home_team_goal, away_team_goal, B365H, B365D, B365A, plus the 50+ in-match event columns.<br/><strong>Drop:</strong> raw XML player attributes, unused odds providers.</p>
<h6>Hygiene challenges</h6>
<ul><li>SQL date strings</li><li>A few seasons missing odds</li><li>Team IDs change in some rows</li></ul>
<h6>Deliverable</h6>
<p>Name the team most over-performing this season, with a one-paragraph explanation backed by 2 charts.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/hugomathien/soccer" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/08_football_match_analytics/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/08_football_match_analytics/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>9. Agriculture — Crop Yield from Soil &amp; Weather <span class="meta">— AgriTech · 1.2M rows</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> 10 years of monthly soil moisture, temperature, and precipitation across 1,000 districts plus annual yield. Surface the climate factors most predictive of yield. Report top 3 climate features per region.</p>
<h6>Dataset</h6>
<p>FAOSTAT Crop &amp; Climate (Kaggle) + NASA POWER monthly time series.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> Year, Country, District, Crop, yield_hg_per_ha, avg_temp, precipitation, soil_moisture, pesticides_tonnes.<br/><strong>Drop:</strong> crops with &lt;100 observations; non-cereal exotic crops.</p>
<h6>Hygiene challenges</h6>
<ul><li>Mixed units (kg vs tonnes)</li><li>Some districts have 2 names (admin merger)</li><li>Precipitation has clear sensor-error spikes</li></ul>
<h6>Deliverable</h6>
<p>Top 3 climate features per region driving yield, with charts and a one-paragraph policy implication.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/patelris/crop-yield-prediction-dataset" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/09_crop_yield_climate/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/09_crop_yield_climate/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<details class="scenario">
<summary>10. Aviation — U.S. Flight Delay Network <span class="meta">— Aviation · 5.8M flights</span></summary>
<div class="scenario-body">
<p><strong>Business problem.</strong> 5.8M+ US flights for 1 year. Build a network view of which airports propagate delay to which others. Quantify spillover and name the 5 most "infectious" airports.</p>
<h6>Dataset</h6>
<p>US Flights 2015 (Kaggle / BTS) — 5,819,079 flights.</p>
<h6>Keep / Drop</h6>
<p><strong>Keep:</strong> YEAR, MONTH, DAY, AIRLINE, FLIGHT_NUMBER, TAIL_NUMBER, ORIGIN_AIRPORT, DESTINATION_AIRPORT, SCHEDULED_DEPARTURE, DEPARTURE_DELAY, ARRIVAL_DELAY, DISTANCE.<br/><strong>Drop:</strong> any column &gt;40% null.</p>
<h6>Hygiene challenges</h6>
<ul><li>Times stored as HHMM integer ('845' = 08:45)</li><li>Cancelled flights have negative delays</li><li>Tail numbers occasionally null</li></ul>
<h6>Deliverable</h6>
<p>Top 5 most delay-propagating airports, with a network chart and a one-paragraph recommendation.</p>
<div class="actions">
<a class="btn-data" href="https://www.kaggle.com/datasets/usdot/flight-delays" target="_blank" rel="noopener">📥 Dataset</a>
<a class="btn-doc1" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/10_flight_delay_network/documentation_phase_1_what.docx" target="_blank" rel="noopener">📝 Doc 1: WHAT</a>
<a class="btn-doc2" href="https://raw.githubusercontent.com/bepro-aiml/aiml-platform/main/lab-scenarios/module-2/docs/10_flight_delay_network/documentation_phase_2_why.docx" target="_blank" rel="noopener">📝 Doc 2: WHY</a>
</div>
</div>
</details>

<h4 style="margin-top: 22px;">Workflow today</h4>
<ol>
<li>Form a team of 3 (Logic, Data Engineering, Visualization).</li>
<li>Read all 10 scenarios above. Pick ONE together.</li>
<li>Click <strong>📥 Dataset</strong> to download. Clean it using the platform's hygiene conventions (lowercase columns, ISO timestamps, explicit <code>NaN</code>).</li>
<li>Click <strong>📝 Doc 1: WHAT</strong> to open the Phase 1 template. Copy it, fill it in completely.</li>
<li>Click <strong>📝 Doc 2: WHY</strong> to open the Phase 2 template. Copy it, fill it in.</li>
<li>Push both completed docs to your group repo at <code>module-2/class_6/submissions/&lt;TeamName&gt;/</code>. Request mentor sign-off.</li>
</ol>

<div class="warning-box"><strong>No code today.</strong> The mentor will not approve any implementation until both phase docs are complete and signed off. The lab grade weighs <em>justification</em> at least as much as code.</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_2_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[2] = true;
})();
