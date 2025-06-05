# Agent_LES

A fun & janky Node.js + Express project for teaching folks the concepts behind building (and breaking) LM-based AI systems (& agents).

We often use agent LES within one of our workshops.  If so, you should be able to fire up Github Codespaces from within our Classroom - we'll send you a link.  

# "This is our agent; we make the call"
In this workshop, you’ll:
- Learn what AI agents are and how they work
- Explore the structure of a simple Node.js agent backend
- Modify how the agent handles prompts and responses
- Test it all in a live web interface

---

Regardless of how you find **Agent LES**, pls use this as your personal copy of the project — you’ll build and test your own local AI agent in this repo - likely either locally or else using GitHub Codespaces.

---

## ✅ Setup Instructions

1. **Accept the assignment link** (we'll provide this, if it's applicable)
2. Once your repo is created, open it in a Codespace:
   - Click the green **Code** button
   - Select **“Codespaces” → “Create codespace on main”**

3. Wait ~1 min for your Codespace to boot

---

## 🧪 Run the Server

4. Inside your Codespace terminal:

```bash
npm install
npm run dev

The server will run on localhost:8000 — GitHub will provide a preview link.


5. Click the **“Ports”** tab in Codespaces (bottom panel) and open port **3000** in the browser
6. You’ll see a basic chat interface — try typing `Who are you?`

---

## 🔍 How It Works

* **Frontend** sends user prompt to `/api/ask`
* **Backend** sends prompt to LLM via Groq or mock LLM function
* **Middleware** logs, modifies, or filters requests/responses
* Response is shown in the UI

---

## 🛠️ Your Task

You’ll be modifying:

* The agent’s system prompt (to change its personality)
* The middleware (to add filters or memory)
* The frontend UI (to improve the experience)

By the end, you should have a working agent that:
* Responds clearly
* Reflects your personality/design tweaks
* Runs entirely in Codespaces

---

## ❓ Need Help?
Ask us (Jeremiah & Dona) if you get stuck.

If something breaks:
* Refresh the browser tab on port 8000
* Restart the server: `Ctrl+C` and then `npm start` again

<3 Jeremiah & Dona