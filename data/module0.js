// ============================================================
// MODULE 0 CONTENT — The Toolkit
// Terminal, Git, and GitHub. Prerequisite module (students may
// skip if they already know Git). Every code block has inline
// comments; every quiz explains why the correct answer is right
// AND why each wrong option is wrong.
// ============================================================
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('module0.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_0_CONTENT = {

    // ========================================================
    // CLASS 0-1 — The Terminal
    // ========================================================
    "0-1": {
      title: "The Terminal",
      subtitle: "Module 0, Class 1 — Your direct line to the computer",
      sections: [
        { icon: "💻", title: "What is a Terminal?", content: `
<p>A <strong>terminal</strong> is a black window where you type commands and the computer runs them. Instead of clicking buttons, you type words.</p>
<p>Every ML engineer uses a terminal every day. Most ML tools have no button to click — only a command to type. Git is one of those tools. Learning a little terminal now will pay off every day for the rest of your career.</p>
<div class="info-box"><strong>Don't worry:</strong> the terminal looks scary but it cannot break your computer. Every command you'll learn in this class is safe to try.</div>
` },

        { icon: "🪟", title: "How to open a terminal", content: `
<p>You need one terminal open to follow along with this class.</p>

<h4>macOS</h4>
<ol>
<li>Press <code>⌘ + Space</code> (Command + Space).</li>
<li>Type <em>Terminal</em> and press Enter.</li>
<li>A black or white window opens. You'll see something like <code>yourname@computer ~ %</code>. That is the <strong>prompt</strong>, waiting for your command.</li>
</ol>

<h4>Windows</h4>
<ol>
<li>Best option: install <a href="https://gitforwindows.org" target="_blank">Git Bash</a> — it gives Windows a Mac/Linux-style terminal. It also installs Git at the same time.</li>
<li>Or use <em>PowerShell</em>, which is already on every Windows computer. Click Start, type <em>PowerShell</em>, press Enter.</li>
</ol>

<h4>No install required (easiest)</h4>
<p>Open any GitHub repo in your browser and press the <code>.</code> (dot) key. GitHub opens a full editor with a terminal inside — completely free, no install, works on any computer including Chromebooks.</p>
` },

        { icon: "⌨️", title: "Your first 5 commands", content: `
<p>Open your terminal. Type each of these lines, then press Enter. Read what the terminal answers before typing the next one.</p>

<div class="example-box"><pre>pwd
# "print working directory"
# Shows where you are in the file system right now.
# Example output: /Users/saidazam

ls
# "list"
# Shows every file and folder in the current location.
# Example output: Desktop  Documents  Downloads  projects

cd Desktop
# "change directory"
# Move INTO the Desktop folder.
# After this runs, pwd will show .../Desktop

cd ..
# "go up one folder"
# The two dots always mean "the parent folder".
# After this runs, you're back in your home folder.

mkdir projects
# "make directory"
# Creates a new folder called "projects" where you are now.
# If a folder with that name already exists, mkdir will error.</pre></div>

<p>The terminal is just a conversation. You type, it answers. Try all 5 commands in your terminal right now — the rest of this class will make more sense once you've used them.</p>
` },

        { icon: "⚠️", title: "Common gotchas for beginners", content: `
<div class="warning-box"><strong>Gotcha 1 — spaces in file names</strong>Use quotes around names that contain a space:<br><code>cd "My Project"</code> works ✓<br><code>cd My Project</code> does NOT work ✗ — the terminal treats <em>My</em> and <em>Project</em> as two separate arguments and errors.</div>

<div class="warning-box"><strong>Gotcha 2 — case matters</strong>On Mac and Linux, <code>Desktop</code> and <code>desktop</code> are two different folders. Always match the exact capitalization. On Windows it's case-insensitive, but get into the habit — your first real server will be Linux.</div>

<div class="warning-box"><strong>Gotcha 3 — you cannot double-click to run</strong>Every command has to be typed or pasted into the terminal and finished with Enter. There is no mouse here.</div>

<div class="info-box"><strong>Tip — autocomplete</strong>Press <kbd>Tab</kbd> while typing a file or folder name. The terminal will finish it for you. <em>Saves</em> typing and avoids typos.</div>
` },

        { icon: "🛠️", title: "Four more commands you'll actually need", content: `
<div class="example-box"><pre>echo "Hello, Tashkent"
# Print a message. Used for testing that something works.
# Output: Hello, Tashkent

cat notes.txt
# Show the entire contents of a file in the terminal.
# Good for quickly checking what's inside a file.

cp source.txt copy.txt
# Copy a file. Creates "copy.txt" with the same contents.

mv old_name.txt new_name.txt
# Move OR rename a file. Same command for both.
# If "new_name.txt" is in a different folder, it moves.
# If it's the same folder, it renames.</pre></div>

<div class="warning-box"><strong>Careful with <code>rm</code></strong>The delete command is <code>rm filename</code>. There is NO undo. No trash can. The file is gone forever. Don't type <code>rm</code> unless you're 100% sure, and never type <code>rm -rf /</code> (deletes your whole computer).</div>
` },

        { icon: "📋", title: "Quick Check — Terminal", content: `
<div class="quiz-item">
<div class="quiz-q">1. What does <code>pwd</code> do?</div>
<ol class="quiz-options" type="A"><li>Sets a password</li><li>Prints the working directory — where you are right now</li><li>Prints every file</li><li>Opens a new terminal</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> <code>pwd</code> = "print working directory". It answers "where am I right now in the file system?"</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. <code>pwd</code> has nothing to do with passwords. Passwords on Mac/Linux use <code>passwd</code> (with two d's).</li>
<li><strong>C</strong> — no. That is <code>ls</code>, which lists files.</li>
<li><strong>D</strong> — no. <code>pwd</code> never opens a new terminal. You open terminals by clicking the terminal app.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">2. You are in <code>/Users/saidazam/Desktop/projects</code>. You type <code>cd ..</code> and press Enter. Where are you now?</div>
<ol class="quiz-options" type="A"><li><code>/Users/saidazam/Desktop</code></li><li><code>/Users/saidazam/Desktop/projects/..</code></li><li><code>/</code> (the root folder)</li><li>The command errors</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ A.</strong> <code>..</code> always means the parent folder. So <code>cd ..</code> moves you one level up, from <code>projects</code> to <code>Desktop</code>.</p>
<ul class="quiz-why">
<li><strong>B</strong> — no. <code>..</code> is a shortcut, not a literal path. The terminal resolves it and shows you the real parent path.</li>
<li><strong>C</strong> — no. <code>cd ..</code> only moves up ONE folder, not all the way to root. To go to root you'd type <code>cd /</code>.</li>
<li><strong>D</strong> — no. <code>cd ..</code> is a valid command and will not error from any folder except root (where there's no parent).</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">3. You type <code>cd My Project</code> (without quotes) and it errors. Why?</div>
<ol class="quiz-options" type="A"><li>The folder doesn't exist</li><li>The terminal reads <em>My</em> and <em>Project</em> as two separate arguments</li><li>You need to be administrator</li><li><code>cd</code> doesn't accept capital letters</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> Spaces separate arguments in a shell. <code>cd My Project</code> asks cd to receive two arguments: <code>My</code> and <code>Project</code>. <code>cd</code> only accepts one. Wrap the whole name in quotes: <code>cd "My Project"</code>.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. The folder may exist fine. The error is about how you typed the command, not whether the folder is there.</li>
<li><strong>C</strong> — no. <code>cd</code> doesn't need admin permission. You can move into any folder you have access to.</li>
<li><strong>D</strong> — no. Capital letters are totally fine. The problem is the space.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">4. You want to check the contents of a short text file. Which command?</div>
<ol class="quiz-options" type="A"><li><code>ls notes.txt</code></li><li><code>cat notes.txt</code></li><li><code>cd notes.txt</code></li><li><code>mkdir notes.txt</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> <code>cat filename</code> prints the full contents of a file to the terminal. For small files it's the fastest way to see what's inside.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. <code>ls</code> shows file names in a folder, not the contents of a file.</li>
<li><strong>C</strong> — no. <code>cd</code> is for changing directory. It won't read a file.</li>
<li><strong>D</strong> — no. <code>mkdir</code> creates a folder. It won't read a file either, and it would error because the name already exists.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">5. Which command would you almost never want to type, especially without thinking?</div>
<ol class="quiz-options" type="A"><li><code>ls</code></li><li><code>pwd</code></li><li><code>rm -rf /</code></li><li><code>echo hello</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C.</strong> <code>rm -rf /</code> tells the terminal to recursively, forcibly delete everything starting from the root folder. On Mac/Linux this can wipe your whole computer. There is no undo and no warning.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. <code>ls</code> just lists files. Completely safe.</li>
<li><strong>B</strong> — no. <code>pwd</code> just prints where you are. Safe.</li>
<li><strong>D</strong> — no. <code>echo</code> just prints the text you give it. Harmless.</li>
</ul>
</div>
</div>
` }
      ]
    },

    // ========================================================
    // CLASS 0-2 — Git
    // ========================================================
    "0-2": {
      title: "Git — your project's memory",
      subtitle: "Module 0, Class 2 — Local version control: init, add, commit",
      sections: [
        { icon: "📂", title: "What is Git?", content: `
<p><strong>Git</strong> is a tool that remembers every version of your code. Like <em>Save</em>, but much better — you can go back to any version you saved, from yesterday, last week, or three months ago.</p>
<p>Git runs on your computer. Nothing leaves your laptop unless you explicitly push it somewhere.</p>

<h4>The problem Git solves</h4>
<p>Without Git, you end up with files like:</p>
<div class="example-box"><pre>report.py
report_v2.py
report_FINAL.py
report_FINAL_fixed.py
report_FINAL_fixed_really.py   ← I lost track here</pre></div>
<p>Git replaces all of that with a single <code>report.py</code> plus a clean history you can view at any time. It also works across teams — everyone's changes merge together cleanly.</p>

<div class="info-box"><strong>Quick mental model — a photo album</strong><br>Git is a photo album for your code. Each time you're happy with a set of changes, you "take a photo" (called a <em>commit</em>) and glue it into the album with a short caption. Next week, you can flip back to any photo.</div>
` },

        { icon: "⚙️", title: "Install Git (if you haven't)", content: `
<p>If you typed <code>git --version</code> in the terminal and it said "command not found", install it:</p>

<ul>
<li><strong>macOS:</strong> run <code>xcode-select --install</code> once (comes with Git built in).</li>
<li><strong>Windows:</strong> install <a href="https://gitforwindows.org" target="_blank">Git Bash</a>. That gives you both Git and a proper Mac-style terminal.</li>
<li><strong>Linux:</strong> <code>sudo apt install git</code> (Ubuntu/Debian) or <code>sudo dnf install git</code> (Fedora).</li>
</ul>

<p>Then tell Git who you are — do this once, forever:</p>
<div class="example-box"><pre># Sets the name that appears on every commit you make.
git config --global user.name "Your Name"

# Sets the email that appears on every commit.
# Use the SAME email you use on GitHub.
git config --global user.email "you@example.com"</pre></div>
` },

        { icon: "🎯", title: "The 3 Git commands that matter", content: `
<p>90% of Git work on a laptop uses just three commands. Learn these first — everything else is optional.</p>

<div class="example-box"><pre># Step 1 — start tracking a folder with Git
# Run this ONCE inside any folder you want Git to watch.
# It creates a hidden .git/ subfolder — that's where Git
# keeps the version history.
git init

# Step 2 — mark files you want to save in your next snapshot
# You can stage one file or many.
git add report.py          # stage just one file
git add .                  # stage every changed file in the folder

# Step 3 — create a permanent snapshot with a short message
# The message should describe what you changed, not how.
git commit -m "first draft of churn report"</pre></div>

<p>In order:</p>
<ol>
<li><code>git init</code> = buy the photo album (do this once).</li>
<li><code>git add</code> = pick the photos you want to include in the next page.</li>
<li><code>git commit</code> = glue the selected photos in with a caption. The page is now permanent.</li>
</ol>

<div class="info-box"><strong>Why two steps instead of one?</strong> Sometimes you change 10 files but only want to commit 3 of them together (say, the 3 that fix one specific bug). <code>git add</code> lets you pick exactly which changes go into the next snapshot. The other 7 files stay uncommitted until you decide.</div>
` },

        { icon: "🔍", title: "Useful Git commands for seeing what's happening", content: `
<div class="example-box"><pre>git status
# Shows which files changed since the last commit,
# which are staged (ready to commit), and which aren't.
# If you're confused, type this. Always.

git log
# Shows the history of every commit in the current branch.
# Press q to exit the log view.

git log --oneline
# A compact one-line-per-commit version of log.

git diff
# Shows the exact lines you changed since the last commit.
# Good for reviewing your own work before committing.</pre></div>

<p><strong>Rule of thumb:</strong> type <code>git status</code> every time you sit down to work, and every time you're about to commit. It's Git's "where am I?" command.</p>
` },

        { icon: "✍️", title: "Writing good commit messages", content: `
<p>The message after <code>-m</code> is what you'll read in 6 months when you're trying to remember why you changed something. Bad messages hurt future-you.</p>

<div class="example-box"><pre># ❌ Bad — vague, no information
git commit -m "changes"
git commit -m "fix"
git commit -m "asdfasdf"

# ✅ Good — says what and why
git commit -m "add churn threshold to 30 days"
git commit -m "fix off-by-one error in train/test split"
git commit -m "rename dataset column 'total' to 'total_usd'"</pre></div>

<p>Convention: write the message as if it completes the sentence "If this commit is applied, it will ___".</p>
` },

        { icon: "📋", title: "Quick Check — Git", content: `
<div class="quiz-item">
<div class="quiz-q">1. What does <code>git init</code> do?</div>
<ol class="quiz-options" type="A"><li>Uploads your code to GitHub</li><li>Starts tracking the current folder with Git (creates the .git/ folder)</li><li>Deletes all previous versions</li><li>Creates a backup on the cloud</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> <code>git init</code> turns a plain folder into a Git repository by creating a hidden <code>.git/</code> subfolder. Git will now track every change you make in that folder.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. <code>init</code> is entirely local. It doesn't touch the internet. For upload you need GitHub and <code>git push</code>, which you'll learn next class.</li>
<li><strong>C</strong> — no. The opposite — <code>init</code> sets up Git so versions ARE remembered from now on.</li>
<li><strong>D</strong> — no. Again, this is local only. Backups live in the <code>.git/</code> folder on your laptop, not in the cloud.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">2. You changed 5 files but only want to commit 2 of them (the ones that fix a bug). What do you do?</div>
<ol class="quiz-options" type="A"><li><code>git commit -m "bug fix"</code> — it will figure it out</li><li><code>git add file1.py file2.py</code> then <code>git commit -m "bug fix"</code></li><li>Delete the other 3 files first</li><li>You can't — you have to commit all 5</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> Stage only the two files you want to include, then commit. The other 3 files stay as uncommitted changes, ready for a separate commit later.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. <code>git commit</code> only saves whatever you <code>git add</code>ed. Without staging, it commits nothing.</li>
<li><strong>C</strong> — no. Never delete files to work around Git. The whole point of staging is to pick what goes in a commit without touching the files.</li>
<li><strong>D</strong> — no. Splitting changes into multiple commits is a Git superpower. One commit per logical change is best practice.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">3. You don't remember what state your project is in. Which command gives you a quick overview?</div>
<ol class="quiz-options" type="A"><li><code>git init</code></li><li><code>git status</code></li><li><code>git commit</code></li><li><code>git add .</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> <code>git status</code> shows: which files changed since the last commit, which are staged, which are untracked. It's Git's "where am I?" command. Type it often.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. <code>git init</code> creates a new repository. Using it on an existing repo does nothing helpful.</li>
<li><strong>C</strong> — no. <code>git commit</code> creates a snapshot. It doesn't tell you what's going on — it changes what's going on.</li>
<li><strong>D</strong> — no. <code>git add .</code> stages every changed file. That's an action, not a check.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">4. Which of these is the BEST commit message?</div>
<ol class="quiz-options" type="A"><li><code>git commit -m "stuff"</code></li><li><code>git commit -m "update"</code></li><li><code>git commit -m "fix off-by-one error in train/test split"</code></li><li><code>git commit -m "."</code></li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C.</strong> Specific: says WHAT changed (train/test split), and implies WHY (it had a bug). Future-you can read this in 6 months and understand exactly what this commit did.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. "stuff" tells you nothing. In two weeks you won't remember what stuff meant.</li>
<li><strong>B</strong> — no. Every commit is "an update" by definition. The message should describe what kind of update.</li>
<li><strong>D</strong> — no. A single dot is the laziest possible message. Git allows it, but anyone reviewing your history will want to break something.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">5. True or false: Git is the same thing as GitHub.</div>
<ol class="quiz-options" type="A"><li>True — they're two names for the same tool</li><li>False — Git is a tool on your computer, GitHub is a website built around Git</li><li>True — but only on Windows</li><li>False — Git is for Python, GitHub is for everything else</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> Git (2005) is the tool that runs on your computer and tracks versions. GitHub (2008) is a website that stores copies of Git repositories so teams can share them. You can use Git without GitHub (everything stays local). You can't use GitHub without Git underneath.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. They're two separate things made by different companies. Git is open source; GitHub is a Microsoft-owned website.</li>
<li><strong>C</strong> — no. The distinction is the same on every operating system.</li>
<li><strong>D</strong> — no. Both work with any kind of file — code, documents, images, anything.</li>
</ul>
</div>
</div>
` }
      ]
    },

    // ========================================================
    // CLASS 0-3 — GitHub, Branches & PRs
    // ========================================================
    "0-3": {
      title: "GitHub, Branches & Pull Requests",
      subtitle: "Module 0, Class 3 — Remote hosting, teamwork, and your submission flow",
      sections: [
        { icon: "🌐", title: "What is GitHub?", content: `
<p><strong>GitHub</strong> (<a href="https://github.com" target="_blank">github.com</a>) is a website where teams upload their Git projects so everyone can see them, work on them together, and review each other's code.</p>

<div class="info-box"><strong>Git vs GitHub — the one thing to remember</strong><br>— <strong>Git</strong> = the tool on your computer that tracks versions.<br>— <strong>GitHub</strong> = the website that stores copies of Git projects so teams can share them.<br>They work together but they are different things.</div>

<p>In this course, every group has its own repository on GitHub: <code>bepro-aiml/boraq</code>, <code>bepro-aiml/semurq</code>, <code>bepro-aiml/lochin</code>, <code>bepro-aiml/burgut</code>. When you upload an assignment, it goes to GitHub. When the mentor reviews it, they see it on GitHub.</p>
` },

        { icon: "🔄", title: "The push / pull loop", content: `
<p>Once your local project has a remote on GitHub, the two commands that sync them are:</p>

<div class="example-box"><pre>git push
# Upload your local commits to GitHub.
# Run this when you're done committing and want
# others to see your work.

git pull
# Download the latest changes from GitHub.
# Run this when you sit down to work, to make sure
# you have everyone else's latest commits.</pre></div>

<div class="example-box"><pre>YOUR LAPTOP                     GITHUB (the internet)
  [Git]   ← — — git pull — —    [same project, shared by team]
  [Git]   — — git push — →      [your changes appear for others]</pre></div>

<p>That's it. Pull before you start, push when you're done.</p>

<div class="info-box"><strong>You can skip the terminal entirely if you want.</strong> GitHub's website has an <em>"Add file → Upload files"</em> button that does the equivalent of push, and every action you see in the website uses Git underneath. The terminal is faster once you learn it, but the website is always an option.</div>
` },

        { icon: "🔀", title: "What is a branch?", content: `
<p>A <strong>branch</strong> is a parallel version of the project. The <code>main</code> branch is the real one that everybody shares. When you want to try something new, you make a branch, work there, and only <strong>merge</strong> it back to <code>main</code> when it's ready.</p>

<div class="example-box"><pre>main      ●———●———●———●———●———●   ← the real project
              \\               /
your branch    ●—●—●—●—●—●——●     ← your experiment
               (your work)         lives here until it's
                                   reviewed and merged</pre></div>

<p>This is <em>why</em> you cannot push directly to <code>main</code> in our course. Every assignment goes into its own branch. The mentor reviews, says OK, then the branch merges into <code>main</code>. If something is wrong, your branch is thrown away — <code>main</code> stays clean.</p>

<h4>Making a branch — two ways</h4>

<div class="example-box"><pre># Terminal way — for when you want to feel like a pro
git checkout -b my-class2-assignment
# Creates a new branch called "my-class2-assignment"
# AND switches you to it in one command.

# ... edit files, git add, git commit ...

git push -u origin my-class2-assignment
# Uploads the new branch to GitHub.
# The -u flag tells Git "remember I want to push this
# branch to GitHub every time from now on."</pre></div>

<p><strong>Website way — no terminal needed:</strong> when you click <em>"Add file → Upload files"</em> on GitHub, scroll to the bottom of the upload page. GitHub offers a radio button labeled <em>"Create a new branch for this commit and start a pull request."</em> Click that, give the branch a name, and GitHub does all the Git commands for you.</p>
` },

        { icon: "📬", title: "What is a Pull Request?", content: `
<p>A <strong>Pull Request</strong> (PR) is the formal way to say: <em>"Please review my branch and merge it into main."</em></p>

<p>When you open a PR, three things happen automatically in this course:</p>
<ol>
<li>A <strong>robot (CI)</strong> runs in about 15 seconds. It checks your file path, format, and filename. It posts a ✅ or a list of ❌ problems as a comment on your PR.</li>
<li>The mentor gets a <strong>notification</strong> to review.</li>
<li>Your branch is <strong>frozen</strong> visible to everyone, but not merged.</li>
</ol>

<p>From there:</p>
<ul>
<li>If the CI flagged problems → fix them (push a new file to the same branch) → the CI re-runs automatically.</li>
<li>If everything is ✅ → the mentor reads your work, leaves comments if needed, and clicks <strong>Merge</strong>.</li>
<li>Your branch is now part of <code>main</code>. Your assignment is officially submitted.</li>
</ul>

<div class="warning-box"><strong>Why only the mentor can merge</strong>If every student could merge their own PR, one wrong file would pollute the group's repo for everyone. Branch protection in our course means only mentors can merge. You open the PR, the mentor merges it. This is the same pattern every professional team uses.</div>
` },

        { icon: "🍴", title: "Forking — your own copy of someone else's repo", content: `
<p>A <strong>fork</strong> is your personal copy of someone else's GitHub repository. You fork when you don't have permission to write directly to the original repo, but you still want to propose changes.</p>

<div class="example-box"><pre>ORIGINAL REPO          YOUR FORK
(someone else owns)  → (lives in YOUR account)
                              ↓
                        edit freely, branch, commit
                              ↓
                        open a PR back to the original</pre></div>

<h4>Do you need to fork in this course?</h4>
<p><strong>No.</strong> Your mentor added each of you as a <em>collaborator</em> on your group's repo, which means you can push branches directly. Fork is not needed here.</p>

<p>Fork is what you'll use after this course — when you want to contribute to open-source projects like scikit-learn, PyTorch, or pandas. You don't own those repos, so you fork them, make changes in your fork, then open a PR back to the original.</p>

<p>One click on the <em>Fork</em> button (top-right of any GitHub repo) creates the copy in your account. It's a branch, but living in a completely different repository.</p>
` },

        { icon: "🧭", title: "Your submission workflow for every assignment", content: `
<p>Here is exactly what to do for every assignment in this course. Follow these steps and nothing goes wrong.</p>

<ol>
<li>Go to your group's repo on GitHub (e.g. <code>bepro-aiml/burgut</code>).</li>
<li>Navigate to <code>module-N/class_X/submissions/</code> — that's where student files go.</li>
<li>Click <strong>"Add file → Upload files"</strong>. Drag in your <code>.pdf</code>, <code>.docx</code>, <code>.ipynb</code>, or <code>.md</code>.</li>
<li>Rename it like <code>YourName_ClassN.ext</code>. No <em>"Document1.docx"</em>, no <em>"file (1).pdf"</em>.</li>
<li>Scroll down. Choose <strong>"Create a new branch for this commit and start a pull request"</strong>. Give the branch a name like <code>yourname-m1-c3</code>.</li>
<li>Fill in the PR template checklist (module, class, path, format).</li>
<li>Click <strong>"Create pull request"</strong>.</li>
<li>Wait ~15 seconds. The CI robot runs and leaves a comment.</li>
<li>If ❌: the robot's comment tells you exactly what's wrong. Upload a corrected file to the same branch → CI re-runs automatically.</li>
<li>If ✅: the mentor reviews → merges → your assignment is officially on <code>main</code>.</li>
</ol>

<div class="info-box"><strong>You do not need the terminal to pass this course.</strong> The GitHub website alone works for every step. But learn a little Git + terminal over the next few weeks — it will make your whole ML career 10× easier, and every job interview will ask about it.</div>
` },

        { icon: "📋", title: "Quick Check — GitHub, Branches & PRs", content: `
<div class="quiz-item">
<div class="quiz-q">1. You committed your work to a branch on your laptop. Other team members still can't see it on GitHub. Why?</div>
<ol class="quiz-options" type="A"><li>GitHub is broken</li><li>You haven't run <code>git push</code> yet — commits stay local until pushed</li><li>Git is offline</li><li>You need to pay for GitHub</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> <code>git commit</code> saves the snapshot locally. <code>git push</code> is what uploads it to GitHub so others can see. Commit + push are two separate actions.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. GitHub is fine. Commits are always local until you explicitly push.</li>
<li><strong>C</strong> — no. Git doesn't have an "offline" state. It's designed to work entirely offline. The only thing that needs the internet is push/pull.</li>
<li><strong>D</strong> — no. GitHub is free for public repos. Branches and pushes are all free.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">2. What does a branch let you do?</div>
<ol class="quiz-options" type="A"><li>Delete the main branch safely</li><li>Work on changes in parallel without affecting the main version</li><li>Make your code run faster</li><li>Hide your code from the team</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> A branch is a safe playground. You can commit broken, experimental, or half-finished code to a branch and <code>main</code> stays untouched. Only when the branch is ready does it merge into <code>main</code>.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. Branches have nothing to do with deleting main. Deleting main is almost always a mistake.</li>
<li><strong>C</strong> — no. Branches are a version-control concept. They have zero effect on how fast your code runs.</li>
<li><strong>D</strong> — no. Pushed branches are visible to anyone with repo access. Branches aren't for hiding work; they're for isolating experiments.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">3. Why does our course use a Pull Request instead of letting you push directly to <code>main</code>?</div>
<ol class="quiz-options" type="A"><li>To make things slower on purpose</li><li>So the mentor reviews every submission before it enters the main repo, preventing pollution</li><li>Because the mentor doesn't trust you</li><li>GitHub requires it</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> Branch protection on <code>main</code> means only the mentor can merge. This guarantees that every file landing in <code>main</code> has been reviewed. Wrong files, wrong paths, and broken formats get caught before they pollute the repo.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. It does add a wait, but the point is safety, not slowness.</li>
<li><strong>C</strong> — no. It's the same pattern every professional team uses — including senior engineers reviewing each other's work. It's not about personal trust.</li>
<li><strong>D</strong> — no. GitHub supports both direct push AND PR-based workflows. The PR-only rule is a course setting, not a GitHub rule.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">4. You want to contribute to an open-source project you found on GitHub. You don't own the repo. The right first step is:</div>
<ol class="quiz-options" type="A"><li>Push directly to their main branch</li><li>Email the maintainers asking for write access</li><li>Fork the repo into your own GitHub account, work there, then open a PR back</li><li>Copy their code into a new repo of your own</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ C.</strong> Fork is the standard open-source workflow. You fork the repo, work in your fork, and open a PR from your fork back to the original. Maintainers review and merge on their terms.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. You don't have permission. Your push would be rejected.</li>
<li><strong>B</strong> — no. Open-source projects almost never hand out write access on request. Fork is the expected path — it requires zero approval from them.</li>
<li><strong>D</strong> — no. Copying their code into a separate repo loses the connection to the original — any fix you make can't easily flow back upstream. Forking keeps that connection.</li>
</ul>
</div>
</div>

<div class="quiz-item">
<div class="quiz-q">5. The CI robot posted ❌ on your PR. What should you do?</div>
<ol class="quiz-options" type="A"><li>Close the PR and start over</li><li>Read the comment, fix the specific problems it listed, push the fix to the same branch — the CI re-runs automatically</li><li>Open 5 more PRs with the same file</li><li>Email the mentor and ask them to merge anyway</li></ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer">
<p><strong>✅ B.</strong> The CI's comment lists the exact issues (wrong path, wrong format, placeholder filename, etc.). Fix each one, push a new commit to the SAME branch, and the CI re-runs. The PR stays alive through the fix cycle.</p>
<ul class="quiz-why">
<li><strong>A</strong> — no. Closing and reopening wastes time and breaks the review history. Just fix the branch you already have.</li>
<li><strong>C</strong> — no. Duplicate PRs create confusion and make the mentor's job harder. One PR per submission.</li>
<li><strong>D</strong> — no. The mentor will tell you to fix it. Branch protection blocks merge until the branch passes CI AND gets approval — there's no "merge anyway" escape hatch.</li>
</ul>
</div>
</div>
` }
      ]
    }
  };

  // Merge into the global COURSE_DATA.classContent + flag loaded
  Object.assign(COURSE_DATA.classContent, MODULE_0_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[0] = true;
})();
