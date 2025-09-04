# AniFinder

## Overview
AniFinder is an AI-powered web application that enables users to discover personalized anime show recommendations. By inputting a preferred **genre** and a **reference anime show**, users receive tailored suggestions displayed on a results web page. The application allows users to save recommended shows to a personalized list or initiate a new search. Built with a MySQL backend for secure user authentication and data management, AniFinder leverages the Google Gemini API and Google Custom Search API to deliver accurate and relevant anime recommendations, using a modern JavaScript, CSS, HTML, and Svelte stack.

## Features
- **Custom Anime Search**: Users select a genre and input a reference anime to generate personalized show recommendations.
- **Results Web Page**: Displays curated anime suggestions with options to save shows to a user-specific list or perform a new search.
- **Secure Authentication**: MySQL-based user authentication ensures secure access to personalized lists and search history.
- **AI-Powered Recommendations**: Integrates Google Gemini API for intelligent anime matching based on user inputs.
- **Custom Search Integration**: Utilizes Google Custom Search API to enhance recommendation accuracy.

## Parameters
- **Genre**: A predefined category (e.g., action, romance, fantasy) selected by the user to filter anime recommendations.
- **Reference Anime**: A user-specified anime show used as a reference to find similar titles.

## Environment Variables
To run AniFinder, configure the following environment variables:

- `API_KEY`: Your Google Gemini API key for AI-powered recommendations.
- `GOOGLE_API_KEY`: Your Google Custom Search API key for enhanced search functionality.
- `CX`: Your Google Custom Search Engine ID for targeted search results.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/peterN12g/AniFinder
   cd anifinder
   ```

2. **Install Dependencies**:
   Ensure you have Node.js and MySQL installed. Install required packages using:
   ```bash
   npm install
   ```

3. **Set Up MySQL Database**:
   - Create a MySQL database for user authentication and list storage.
   - Update the database configuration in `src/db.js`.

4. **Configure Environment Variables**:
   Create a `.env` file in the project root and add:
   ```plaintext
   API_KEY=your_google_gemini_api_key
   GOOGLE_API_KEY=your_google_custom_search_api_key
   CX=your_custom_search_engine_id
   ```

5. **Run the Application**:
   Start the development server:
   ```bash
   npm run dev
   ```
   Access AniFinder at `http://localhost:5173` in your browser.

## Usage
1. **Log In or Sign Up**: Create an account or log in using MySQL-backed authentication.
2. **Enter Search Parameters**: Select a genre and input a reference anime show.
3. **View Results**: Browse recommendations on the results page.
4. **Manage Lists**: Save desired shows to your personal list or start a new search.

## Technology Stack
- **Frontend**: Svelte for a reactive and component-driven user interface, HTML, and CSS for structure and styling.
- **Backend**: JavaScript (Node.js) for server-side logic and API integration.
- **Database**: MySQL for user authentication and list management.
- **APIs**: Google Gemini API for AI-driven recommendations, Google Custom Search API for enhanced search.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.