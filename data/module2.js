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
        { icon: "💻", title: "The Terminal — your direct line to the computer", content: `
<p>A <strong>terminal</strong> is a black window where you type commands and the computer runs them. Instead of clicking buttons, you type words. Every ML engineer uses the terminal every day — most ML tools have no buttons, only commands.</p>
<h4>How to open it</h4>
<ul>
<li><strong>Mac:</strong> press <code>⌘ + Space</code>, type <em>Terminal</em>, press Enter.</li>
<li><strong>Windows:</strong> install <a href="https://gitforwindows.org" target="_blank">Git Bash</a> — it gives you a Mac/Linux-style terminal. Or use <em>PowerShell</em> built into Windows.</li>
<li><strong>No install needed:</strong> open any GitHub repo and press <code>.</code> (the dot key) — you get a full VS Code + terminal in your browser, free.</li>
</ul>
<h4>Your first 5 commands</h4>
<div class="example-box"><pre>pwd             # print working directory — "where am I?"
ls              # list files in the current folder
cd Desktop      # change directory → go into the Desktop folder
cd ..           # go UP one folder
mkdir projects  # make a new folder called "projects"</pre></div>
<p>The terminal is just a conversation: you type, it answers. Try each command — nothing you type here can break your computer.</p>
<div class="warning-box"><strong>Gotcha — spaces in names</strong>Use quotes around file names with spaces: <code>cd "My Project"</code> works. <code>cd My Project</code> does NOT — the terminal thinks <em>My</em> and <em>Project</em> are two separate arguments and errors.</div>
` },
        { icon: "📂", title: "Git — your project's memory", content: `
<p><strong>Git</strong> is a tool that remembers every version of your code. Like <em>Save</em>, but better — you can go back to any version from yesterday, last week, or 3 months ago. It is installed on your computer.</p>
<p>Without Git, you end up saving files like: <code>report.py</code>, then <code>report_v2.py</code>, then <code>report_FINAL.py</code>, then <code>report_FINAL_fixed.py</code>. Git replaces that mess with a clean history.</p>
<h4>The 3 commands that matter</h4>
<div class="example-box"><pre>git init                     # start tracking this folder with Git
git add my_file.py           # stage a file — "I want to save this one"
git commit -m "first draft"  # save a snapshot with a short message</pre></div>
<p>Think of it like a photo album:</p>
<ul>
<li><code>git init</code> = buy the album</li>
<li><code>git add</code> = choose which photo to put in</li>
<li><code>git commit</code> = glue it in with a caption</li>
</ul>
<p>Every commit is a permanent snapshot you can return to.</p>
` },
        { icon: "🌐", title: "GitHub — where Git lives online", content: `
<p><strong>GitHub</strong> is a website (<a href="https://github.com" target="_blank">github.com</a>) where teams upload their Git projects so everyone can see them and work together.</p>
<div class="info-box"><strong>Git vs GitHub</strong><br>— <strong>Git</strong> = the tool on your computer that tracks versions.<br>— <strong>GitHub</strong> = the website that stores copies of everyone's Git projects so teams can share them.</div>
<p>This is where our course repos live: <code>bepro-aiml/boraq</code>, <code>semurq</code>, <code>lochin</code>, <code>burgut</code>. When you upload your assignment, it lands on GitHub. When the mentor reviews it, they see your file there.</p>
<h4>The 2 commands that connect Git ↔ GitHub</h4>
<div class="example-box"><pre>git push    # upload your local commits to GitHub
git pull    # download the latest from GitHub to your computer</pre></div>
<div class="example-box"><pre>YOUR COMPUTER                 GITHUB (the internet)
   [Git]   ← — — pull — — —   [same project, everyone sees]
   [Git]   — — push — — →     [your changes appear for others]</pre></div>
<p>If you don't want to learn the terminal yet, you can also do all of this through GitHub's website by clicking <em>"Add file → Upload files"</em> — that is what you did for your first assignments. The terminal is faster once you learn it, but the website works fine.</p>
` },
        { icon: "🔀", title: "Branches & Pull Requests", content: `
<p>A <strong>branch</strong> is a parallel version of the project. The <code>main</code> branch is the real one. When you want to try something new, you make a branch, work there, and only merge it back to <code>main</code> when it is ready.</p>
<div class="example-box"><pre>main   ●———————●———————●———————●   ← real project
                \\               /
branch           ●——●——●——●——●     ← your assignment
                 (your work)         lives here until
                                     the mentor merges</pre></div>
<p>This is <em>why</em> you cannot push directly to <code>main</code> in our course. Every assignment goes into its own branch. The mentor reviews it, says OK, then the branch merges into <code>main</code>.</p>
<h4>How to make a branch — both ways</h4>
<div class="example-box"><pre># Terminal way:
git checkout -b my-assignment    # make a new branch AND switch to it
# ... edit, add, commit ...
git push -u origin my-assignment # upload the branch to GitHub</pre></div>
<p><strong>Website way:</strong> when you click <em>"Add file → Upload files"</em> on GitHub, scroll to the bottom of the upload page — GitHub gives you the option <em>"Create a new branch for this commit and start a pull request."</em> That's the same thing, no terminal needed.</p>
<h4>Pull Request (PR)</h4>
<p>A <strong>Pull Request</strong> is a formal way to say: <em>"please review my branch and merge it into main."</em> The mentor reads your PR, leaves comments if something needs fixing, and clicks <em>Merge</em> when it's ready. This is the entire submission flow for this course.</p>
<div class="warning-box"><strong>Why review matters</strong>If every student could merge their own PR, one wrong file would pollute the group's repo for everyone. Branch protection makes sure only the mentor can merge. You open the PR, the mentor merges it.</div>
` },
        { icon: "🍴", title: "Forking — your own copy", content: `
<p>A <strong>fork</strong> is your personal copy of someone else's GitHub repo. You fork when you don't have permission to write to the original repo, but you still want to propose changes.</p>
<div class="example-box"><pre>ORIGINAL REPO           YOUR FORK
(someone else owns)  →  (lives in your GitHub account)
                              ↓
                        edit freely, branch, commit
                              ↓
                        open a PR back to the original</pre></div>
<h4>Do you need to fork in this course?</h4>
<p><strong>No.</strong> The mentor added each of you as a <em>collaborator</em> on your group's repo, so you can push branches directly. Fork is for the next step — when you graduate and contribute to open-source projects (scikit-learn, PyTorch, etc.) that you don't own.</p>
<p>One click on <em>Fork</em> (top-right of any GitHub repo) creates the copy. It is the same as a branch, but lives in your own account instead of the original project's.</p>
` },
        { icon: "🧭", title: "Your workflow for every assignment", content: `
<p>Here is exactly what to do for every assignment in this course. If you follow these steps, nothing breaks.</p>
<ol>
<li>Go to your group's repo on GitHub (e.g. <code>bepro-aiml/burgut</code>).</li>
<li>Navigate to <code>module-N/class_X/submissions/</code> — that's where your file goes.</li>
<li>Click <strong>"Add file → Upload files"</strong> and drop your <code>.pdf</code>, <code>.docx</code>, <code>.ipynb</code>, or <code>.md</code>.</li>
<li>Rename it like <code>YourName_ClassN.ext</code>. No <em>"Document1.docx"</em>, no duplicates like <em>"file (1).pdf"</em>.</li>
<li>Scroll down → choose <strong>"Create a new branch for this commit and start a pull request"</strong>.</li>
<li>Fill in the PR template checklist (module, class, path, format).</li>
<li>Click <strong>"Create pull request"</strong>.</li>
<li>Wait. Two things happen automatically:
  <ul>
    <li>A robot (CI) checks your file path and format in ~15 seconds — it posts ✅ or a list of ❌ problems.</li>
    <li>The mentor gets a notification to review.</li>
  </ul>
</li>
<li>If ❌ → fix it (upload a corrected file to the same branch) → the robot re-runs automatically.</li>
<li>If ✅ → the mentor reviews → merges → your assignment is officially on <code>main</code>.</li>
</ol>
<div class="info-box"><strong>You don't need the terminal to pass this course.</strong> The GitHub website alone is enough. But learn a little terminal + Git now and it will make your whole ML career 10× easier.</div>
` },
        { icon: "📋", title: "Quick Check — Git & GitHub", content: `
<div class="quiz-item">
<div class="quiz-q">1. What is the difference between Git and GitHub?</div>
<ol class="quiz-options" type="A"><li>They are the same thing</li><li>Git is a tool on your computer; GitHub is a website that stores Git projects</li><li>Git is only for Python, GitHub is for everything else</li><li>Git is free, GitHub costs money</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> Git = tool on your computer. GitHub = website that stores Git projects for teams to share.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. They work together but they are different things. Git is older (2005); GitHub is a website built around Git (2008).</li>
<li><strong>C</strong> — no. Git works with any type of file — Python, Word docs, images, anything.</li>
<li><strong>D</strong> — no. Both are free for public repos. GitHub has paid plans for extra features.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. You made a branch and committed your assignment to it. Other team members cannot see your work yet. To make them see it, you need to:</div>
<ol class="quiz-options" type="A"><li>Push the branch to GitHub</li><li>Fork the repo first</li><li>Delete the main branch</li><li>Email the files</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ A.</strong> <code>git push</code> uploads your local branch to GitHub. Only after the push does anyone else see it.</p>
<ul class="quiz-why">
<li><strong>B</strong> — no. Forking is for when you do not have write access. You are a collaborator on your group's repo, so push works directly.</li>
<li><strong>C</strong> — no. Never delete the main branch. It has everyone's work in it.</li>
<li><strong>D</strong> — no. Email does not sync with Git. The whole point of GitHub is that nobody has to email files.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Why can you not merge your own Pull Request in this course?</div>
<ol class="quiz-options" type="A"><li>GitHub is broken</li><li>Branch protection requires a mentor to approve before anything reaches main</li><li>You need to pay for GitHub</li><li>The mentor forgot to give you permission</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> The main branch is protected. Only the mentor team can merge — so bad or wrong submissions never pollute the group's repo.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. GitHub works correctly. The rule is the mentor's choice for this course.</li>
<li><strong>C</strong> — no. Branch protection is free on public repos.</li>
<li><strong>D</strong> — no. This was set on purpose. Even if you had full write permission, protection would still block self-merge.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. In the terminal, what does <code>cd ..</code> do?</div>
<ol class="quiz-options" type="A"><li>Deletes the current folder</li><li>Copies the current folder</li><li>Go UP one folder (to the parent)</li><li>Print the current folder's contents</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C.</strong> <code>cd</code> = change directory. <code>..</code> = the parent folder. So <code>cd ..</code> moves you one folder up.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. To delete a folder you use <code>rm -rf foldername</code> — and be very careful, there is no undo.</li>
<li><strong>B</strong> — no. To copy you use <code>cp</code>.</li>
<li><strong>D</strong> — no. That is <code>ls</code>.</li>
</ul>
</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. You want to test an experimental change to the code without breaking the main version. The right move is to:</div>
<ol class="quiz-options" type="A"><li>Push directly to main</li><li>Email the code to yourself as a backup</li><li>Create a new branch and work there</li><li>Fork the repo and never merge back</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C.</strong> That is exactly what branches are for — a safe place to experiment without touching <code>main</code>. If the experiment works, merge the branch back. If not, throw it away.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. Branch protection blocks this, and even without protection, it would break the stable version for everyone.</li>
<li><strong>B</strong> — no. Git itself is your backup. Every commit is permanent history.</li>
<li><strong>D</strong> — no. Forking is for when you do not have permission on the original. You already have permission here.</li>
</ul>
</div>
</div>
` },
        { icon: "📋", title: "Quick Check", content: `
<div class="quiz-item">
<div class="quiz-q">1. <code>[1, 2, 3][-1]</code> is:</div>
<ol class="quiz-options" type="A"><li>1</li><li>3</li><li>-1</li><li>IndexError</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> 3 — negative indices count from the end.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Which is immutable?</div>
<ol class="quiz-options" type="A"><li>list</li><li>dict</li><li>set</li><li>tuple</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>D.</strong> tuple.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. <code>{1, 2, 2, 3, 1}</code> evaluates to:</div>
<ol class="quiz-options" type="A"><li><code>{1, 2, 2, 3, 1}</code></li><li><code>{1, 2, 3}</code></li><li><code>[1, 2, 3]</code></li><li>SyntaxError</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Sets dedupe automatically.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Why avoid <code>def f(x=[])</code>?</div>
<ol class="quiz-options" type="A"><li>Syntax error</li><li>The same list is shared across calls</li><li>Slower than None</li><li>Not allowed in Py3</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Mutable defaults are evaluated once at definition time. Use <code>x=None</code>.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Best way to test membership in 1M items queried thousands of times?</div>
<ol class="quiz-options" type="A"><li>List <code>in</code></li><li>Manual loop</li><li>Convert to set, then test</li><li>Sort first</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>C.</strong> Sets use hashing — O(1) membership vs O(n) for lists.</div>
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
<div class="quiz-answer"><strong>B.</strong> Start inclusive, end exclusive, step 2.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. An array of shape (4, 3) has what size?</div>
<ol class="quiz-options" type="A"><li>3</li><li>4</li><li>7</li><li>12</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>D.</strong> 4 × 3 = 12.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Why is NumPy faster than a Python loop?</div>
<ol class="quiz-options" type="A"><li>Runs on GPU</li><li>Uses less RAM</li><li>Vectorized ops execute in compiled C with no per-element overhead</li><li>Python is single-threaded</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>C.</strong> C-level iteration avoids the per-iteration interpreter overhead.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Shape (5, 3) + shape (3,) =</div>
<ol class="quiz-options" type="A"><li>(5, 3)</li><li>(3,)</li><li>(5,)</li><li>ValueError</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>A.</strong> Broadcasting stretches (3,) across every row.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. Reshape a 12-elem array into 3 cols without computing rows:</div>
<ol class="quiz-options" type="A"><li><code>reshape(4, 3)</code></li><li><code>reshape(-1, 3)</code></li><li><code>reshape(3, auto)</code></li><li><code>reshape(?, 3)</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> <code>-1</code> means "compute automatically."</div>
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
<div class="quiz-answer"><strong>B.</strong> Labels vs integer positions.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Correct filter for adults in Tashkent?</div>
<ol class="quiz-options" type="A"><li><code>df[df.age &gt;= 18 and df.city == "T"]</code></li><li><code>df[(df.age &gt;= 18) &amp; (df.city == "T")]</code></li><li><code>df[df.age &gt;= 18 &amp;&amp; df.city == "T"]</code></li><li><code>df.filter(...)</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> <code>&amp;</code> with parentheses.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. <code>df.groupby("city")["age"].mean()</code> returns:</div>
<ol class="quiz-options" type="A"><li>DataFrame</li><li>Series indexed by city</li><li>List</li><li>Scalar</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> One agg on one column → Series keyed by group.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Left join: unmatched left rows become:</div>
<ol class="quiz-options" type="A"><li>Dropped</li><li>Kept with NaN on right</li><li>Error</li><li>Duplicated</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Left join keeps all left rows.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. 5GB CSV crashes your laptop. First move?</div>
<ol class="quiz-options" type="A"><li>Buy RAM</li><li><code>chunksize=</code> or Parquet</li><li>Ignore</li><li>Split in Excel</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Chunked iteration or columnar format.</div>
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
<div class="quiz-answer"><strong>C.</strong> Histogram.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. What does Seaborn add over Matplotlib?</div>
<ol class="quiz-options" type="A"><li>Different engine</li><li>Shorter syntax, DataFrame-native stat plots</li><li>Interactive</li><li>3D</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Higher-level wrapper for statistical plots.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Compare age distribution between churned and non-churned customers:</div>
<ol class="quiz-options" type="A"><li>Line</li><li>Pie</li><li>Box plot split by churn</li><li>Heatmap</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>C.</strong> Box/violin plots show distribution shape per group.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Anscombe's quartet teaches:</div>
<ol class="quiz-options" type="A"><li>Stats are always enough</li><li>Identical summary stats can hide different shapes — always plot</li><li>Four is the minimum</li><li>Correlation = causation</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Always plot.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. When to use log scale on y-axis?</div>
<ol class="quiz-options" type="A"><li>Always</li><li>When data spans orders of magnitude</li><li>Only time series</li><li>Never</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> When linear compresses most points.</div>
</div>
` }
      ]
    },

    "2-6": {
      title: "Lab: Exploratory Data Analysis",
      subtitle: "Module 2, Class 6 — Hands-on EDA on a real dataset",
      brokenState: { type: 'chaos', physicsDisabled: true, grayscale: true, description: 'Full system failure — physics AND vision down. EDA is how you diagnose both.' },
      sections: [
        { icon: "🎯", title: "What is EDA?", content: `
<p>Exploratory Data Analysis = deliberately poking at a dataset until you understand what's in it. Before training any model, answer:</p>
<ul>
<li>What columns exist? What types?</li>
<li>How much data is missing, and where?</li>
<li>What are the distributions? Any outliers?</li>
<li>How do features relate to the target?</li>
<li>Any duplicates, leakage, or encoding issues?</li>
</ul>
<div class="info-box"><strong>Budget:</strong> 90 minutes. Work in pairs or solo. Submit a Jupyter notebook with all findings.</div>
` },
        { icon: "📊", title: "Pick a Dataset", content: `
<div class="tool-grid">
<a class="tool-card" href="https://www.kaggle.com/datasets/blastchar/telco-customer-churn" target="_blank" rel="noopener">
<h5>Option A — Telco Churn</h5><p>7,043 customers, 21 columns. Mix of categorical and numeric. Good for groupby and filtering practice.</p></a>
<a class="tool-card" href="https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud" target="_blank" rel="noopener">
<h5>Option B — Credit Card Fraud</h5><p>284k transactions, 0.17% fraud. Severe class imbalance. Good for distribution plots and learning why accuracy fails.</p></a>
</div>
` },
        { icon: "📝", title: "Seven EDA Tasks", content: `
<ol>
<li><strong>Load and peek:</strong> <code>df.shape</code>, <code>df.dtypes</code>, <code>df.head()</code>.</li>
<li><strong>Missing values:</strong> <code>df.isna().sum()</code>. Which columns, what fraction?</li>
<li><strong>Target distribution:</strong> balanced or imbalanced? Plot it.</li>
<li><strong>Numeric features:</strong> histograms for 3+ columns. Skew? Outliers? Log transform?</li>
<li><strong>Categorical features:</strong> <code>value_counts()</code>. Rare categories to group into "other"?</li>
<li><strong>Feature vs target:</strong> box/violin plot for 2+ features across target classes.</li>
<li><strong>Correlation:</strong> heatmap of numeric columns. Any pairs with |r| &gt; 0.9?</li>
</ol>
<div class="info-box"><strong>Rule:</strong> after every plot, one sentence — what did you observe, what would you do differently when building a model?</div>
` },
        { icon: "📋", title: "Checkpoint Quiz", content: `
<div class="quiz-item">
<div class="quiz-q">1. A column where 99% of rows have the same value is:</div>
<ol class="quiz-options" type="A"><li>Highly predictive</li><li>Near-zero variance, almost useless</li><li>The target</li><li>A bug</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Nothing to learn from. Drop or inspect.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">2. Two features correlate 0.97. What do you do?</div>
<ol class="quiz-options" type="A"><li>Keep both</li><li>Drop one</li><li>Add them</li><li>Ignore</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Redundant information. Keep the more interpretable or higher-quality one.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">3. Target is 0.2% positive. A model predicting "no" always gets 99.8% accuracy. This shows:</div>
<ol class="quiz-options" type="A"><li>The model is great</li><li>Accuracy is wrong metric for imbalanced data</li><li>Data is broken</li><li>Need more data</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Use precision/recall/F1/AUC.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">4. Column is 60% missing. First move?</div>
<ol class="quiz-options" type="A"><li>Drop</li><li>Fill with 0</li><li>Investigate whether missingness carries signal</li><li>Fill with mean</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>C.</strong> Missingness often encodes information.</div>
</div>
<div class="quiz-item">
<div class="quiz-q">5. You find <code>churn_recorded_at</code> in a dataset predicting <code>churned</code>. Do what?</div>
<ol class="quiz-options" type="A"><li>Use as feature</li><li>Drop — data leakage</li><li>Convert to Unix</li><li>Fill "unknown"</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Only exists after the label is known — perfect leakage.</div>
</div>
` }
      ]
    }

  };

  Object.assign(COURSE_DATA.classContent, MODULE_2_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[2] = true;
})();
