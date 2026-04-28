# VoteWise AI — Interactive Election Process Assistant
**Built using AI-assisted development with iterative prompt engineering, debugging and product refinement.**

VoteWise AI is a modern, accessible, and interactive platform designed to educate users about the election process. Created as a submission for Google PromptWars, it leverages the Gemini AI API for multilingual voter assistance.

## 🎯 Problem Statement
Democracy relies on voter participation, yet many eligible citizens remain confused by the complex electoral process. First-time voters often struggle to find clear information regarding voter registration, document requirements, and polling locations. Furthermore, language barriers restrict access to crucial voting information in a diverse country like India.

## 💡 Solution Overview
VoteWise AI solves this by gamifying and simplifying voter education. It provides an intuitive, linear journey through the election process. Key modules include:
- **Election Timeline Stepper**: Track the election journey from announcement to results.
- **Eligibility Checker**: A smart AI tool to verify voting eligibility.
- **Interactive Voting Guide**: Step-by-step guidance on registration and casting a vote.
- **Demo Booth Locator**: A simulated tool showing how voters can find nearby polling stations using mock data mapped to PIN codes.
- **Multilingual AI Assistant**: A helpful chatbot powered by Google Gemini that answers election-related questions in English, Hindi, and Marathi.

## 🏗️ Architecture
- **Frontend Framework**: React 18 with TypeScript and Vite for lightning-fast performance.
- **Styling**: Tailwind CSS for responsive design and Framer Motion for premium micro-animations.
- **State Management**: React Context API (LanguageContext) for global multilingual state.
- **PWA Ready**: Built with Vite PWA plugin to support offline installation and mobile-native feel.

## 🤖 AI Usage (Google Gemini + Fallback)
VoteWise AI integrates Google Gemini with graceful fallback support `@google/generative-ai` (`gemini-pro` model):
1. **Eligibility Analyzer**: Takes user situations (e.g., "I am 17 turning 18 next month") and provides eligibility guidance based on user input.
2. **Chat Assistant**: Answers user questions interactively while adhering to a strict neutral, informative system prompt.
3. **Resilient Fallback Architecture**: If the Gemini API hits a rate limit, the network drops, or the API key is missing, the application safely degrades to **AI Fallback Mode**. This uses a hardcoded, multilingual dictionary to ensure users always receive critical FAQ answers without experiencing broken UI.

## ⚠️ Known Limitations
- The **Demo Booth Locator** currently generates mock data mathematically based on the entered PIN code. It does not connect to the real Election Commission backend.
- The AI Eligibility checker relies on the prompt accuracy and can occasionally be bypassed if the user inputs conflicting hypothetical scenarios.

## 🚀 Future Scope
- **Real Overpass API Integration**: Fetch real geographical data for actual polling booths based on live location.
- **Voter ID OCR**: Allow users to scan their Voter ID using their camera to automatically extract and verify their details.
- **Push Notifications**: Send reminders to users when election day is approaching using the PWA Service Worker.

## 💻 Setup and Run Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd VoteWise-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## 🏆 PromptWars Optimization
This project is optimized for judging criteria:
- **Code Quality**: Modular React components, TypeScript typing, and clean directory structure.
- **Accessibility**: ARIA labels, high contrast colors, and clear navigation.
- **Google Services**: Integration of the Gemini API for natural language understanding.
- **Mobile-first Design**: Fully responsive across devices.


🏆LIVE DEMO LINK : https://votewise-ai-trupti.netlify.app/
